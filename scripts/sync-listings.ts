import { spawn } from 'child_process';
import { storage, ScrapedListing } from '../server/storage';

interface SyncResult {
  success: boolean;
  newListings: number;
  updatedListings: number;
  expiredListings: number;
  errors: string[];
  timestamp: Date;
}

async function runPythonScraper(): Promise<ScrapedListing[]> {
  return new Promise((resolve, reject) => {
    console.log('[Sync] Starting Python scraper...');
    
    const pythonProcess = spawn('python3', ['scripts/scrape-listings.py'], {
      env: {
        ...process.env,
        LD_LIBRARY_PATH: '/lib/x86_64-linux-gnu:' + (process.env.LD_LIBRARY_PATH || ''),
        NIX_LD: '/nix/store/k7zgvzp2r31zkg9xqgjim7mbknryv6bs-glibc-2.39-52/lib/ld-linux-x86-64.so.2',
      }
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
      console.log('[Scraper stderr]', data.toString());
    });

    pythonProcess.on('close', (code) => {
      console.log(`[Sync] Python scraper exited with code ${code}`);
      
      if (code !== 0) {
        reject(new Error(`Scraper failed with code ${code}: ${stderr}`));
        return;
      }

      // Extract JSON data between markers
      const startMarker = '__DATA_START__';
      const endMarker = '__DATA_END__';
      const startIdx = stdout.indexOf(startMarker);
      const endIdx = stdout.indexOf(endMarker);

      if (startIdx === -1 || endIdx === -1) {
        reject(new Error('Could not find data markers in scraper output'));
        return;
      }

      const jsonStr = stdout.substring(startIdx + startMarker.length, endIdx).trim();
      
      try {
        const data = JSON.parse(jsonStr);
        
        if (data.error) {
          reject(new Error(`Scraper error: ${data.error}`));
          return;
        }
        
        resolve(data as ScrapedListing[]);
      } catch (parseError) {
        reject(new Error(`Failed to parse scraper output: ${parseError}`));
      }
    });

    pythonProcess.on('error', (err) => {
      reject(new Error(`Failed to spawn scraper: ${err.message}`));
    });
  });
}

export async function syncListings(): Promise<SyncResult> {
  const result: SyncResult = {
    success: false,
    newListings: 0,
    updatedListings: 0,
    expiredListings: 0,
    errors: [],
    timestamp: new Date(),
  };

  try {
    console.log('[Sync] Starting listing sync...');
    
    // Run the Python scraper
    const scrapedListings = await runPythonScraper();
    console.log(`[Sync] Scraped ${scrapedListings.length} listings`);

    if (scrapedListings.length === 0) {
      result.errors.push('No listings found - skipping database update');
      return result;
    }

    // Process each scraped listing
    const activeMlsIds: string[] = [];
    
    for (const scraped of scrapedListings) {
      try {
        activeMlsIds.push(scraped.mlsid);
        
        const { property, isNew } = await storage.upsertPropertyFromScraper(scraped);
        
        if (isNew) {
          result.newListings++;
          console.log(`[Sync] New listing: ${scraped.mlsid} - ${scraped.address}`);
        } else {
          result.updatedListings++;
          console.log(`[Sync] Updated listing: ${scraped.mlsid} - ${scraped.address}`);
        }
      } catch (err: any) {
        console.error(`[Sync] Error processing listing ${scraped.mlsid}:`, err);
        result.errors.push(`${scraped.mlsid}: ${err.message}`);
      }
    }

    // Mark listings not seen in this sync as inactive
    const expiredCount = await storage.markInactiveExcept(activeMlsIds);
    result.expiredListings = expiredCount;
    
    if (expiredCount > 0) {
      console.log(`[Sync] Marked ${expiredCount} listings as inactive`);
    }

    result.success = true;
    console.log('[Sync] Sync completed successfully');
    console.log(`[Sync] Summary: ${result.newListings} new, ${result.updatedListings} updated, ${result.expiredListings} expired`);

  } catch (err: any) {
    console.error('[Sync] Sync failed:', err);
    result.errors.push(err.message);
  }

  return result;
}

