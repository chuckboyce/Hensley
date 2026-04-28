import { google } from "googleapis";

/**
 * Submits URLs to the Google Indexing API using the service account credentials
 * stored in the GOOGLE_SERVICE_ACCOUNT_KEY environment variable.
 *
 * The service account (replit-google-search@foundrywave-tech.iam.gserviceaccount.com)
 * must be added as an owner in Google Search Console for hensleyshomes.com.
 *
 * API quota: 200 requests/day by default.
 */

const INDEXING_SCOPE = "https://www.googleapis.com/auth/indexing";

interface UrlResult {
  url: string;
  success: boolean;
  status?: number;
  error?: string;
}

interface IndexingResult {
  submitted: UrlResult[];
  totalSuccess: number;
  totalFailed: number;
}

function getAuth() {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY is not set");

  const credentials = JSON.parse(keyJson);
  return new google.auth.GoogleAuth({
    credentials,
    scopes: [INDEXING_SCOPE],
  });
}

/**
 * Submits a single URL to the Google Indexing API as URL_UPDATED.
 */
async function submitUrl(
  auth: ReturnType<typeof getAuth>,
  url: string
): Promise<UrlResult> {
  try {
    const client = await auth.getClient();
    const response = await (client as any).request({
      url: "https://indexing.googleapis.com/v3/urlNotifications:publish",
      method: "POST",
      data: { url, type: "URL_UPDATED" },
    });
    return { url, success: true, status: response.status };
  } catch (err: any) {
    const status = err?.response?.status;
    const message = err?.response?.data?.error?.message ?? err?.message;
    console.error(`[Google Indexing] Failed for ${url}: ${status} ${message}`);
    return { url, success: false, status, error: message };
  }
}

/**
 * Submits an array of URLs to the Google Indexing API.
 * Processes sequentially to respect rate limits.
 */
export async function submitToGoogleIndexing(
  urls: string[]
): Promise<IndexingResult> {
  const auth = getAuth();
  const results: UrlResult[] = [];

  for (const url of urls) {
    const result = await submitUrl(auth, url);
    results.push(result);
    // Small delay to avoid quota bursts
    await new Promise((r) => setTimeout(r, 200));
  }

  const totalSuccess = results.filter((r) => r.success).length;
  const totalFailed = results.filter((r) => !r.success).length;

  console.log(
    `[Google Indexing] Done: ${totalSuccess} succeeded, ${totalFailed} failed`
  );
  return { submitted: results, totalSuccess, totalFailed };
}
