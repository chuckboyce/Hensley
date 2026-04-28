const INDEXNOW_KEY = "173cda2db76855f260023f095f3d8249";
const BASE_URL = "https://hensleyshomes.com";

export interface IndexNowResult {
  submitted: string[];
  statusCode: number | null;
  message: string;
}

/**
 * Submits a list of URLs to IndexNow (Bing, Yandex, DuckDuckGo).
 * The key file must be hosted at https://hensleyshomes.com/{key}.txt
 */
export async function submitToIndexNow(urls: string[]): Promise<IndexNowResult> {
  const endpoint = "https://api.indexnow.org/indexnow";

  const body = {
    host: "hensleyshomes.com",
    key: INDEXNOW_KEY,
    keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });

    const statusCode = response.status;

    if (statusCode === 200 || statusCode === 202) {
      console.log(`[IndexNow] Submitted ${urls.length} URL(s) — HTTP ${statusCode}`);
      return {
        submitted: urls,
        statusCode,
        message: `Successfully submitted ${urls.length} URL(s) to IndexNow.`,
      };
    }

    const text = await response.text().catch(() => "");
    console.warn(`[IndexNow] Unexpected response ${statusCode}: ${text}`);
    return {
      submitted: [],
      statusCode,
      message: `IndexNow returned HTTP ${statusCode}: ${text}`,
    };
  } catch (err: any) {
    console.error("[IndexNow] Fetch error:", err?.message);
    return {
      submitted: [],
      statusCode: null,
      message: `IndexNow request failed: ${err?.message}`,
    };
  }
}

/** All public content URLs that should be indexed. */
export const ALL_SITE_URLS = [
  `${BASE_URL}`,
  `${BASE_URL}/buy`,
  `${BASE_URL}/sell`,
  `${BASE_URL}/property-management`,
  `${BASE_URL}/property-management/newark-de`,
  `${BASE_URL}/properties`,
  `${BASE_URL}/contact`,
  `${BASE_URL}/areas`,
  `${BASE_URL}/areas/middletown-de`,
  `${BASE_URL}/areas/middletown-de/parkside`,
  `${BASE_URL}/areas/middletown-de/bayberry`,
  `${BASE_URL}/areas/middletown-de/st-annes`,
  `${BASE_URL}/areas/middletown-de/whitehall`,
  `${BASE_URL}/areas/middletown-de/hyetts-corner`,
  `${BASE_URL}/areas/newark-de`,
  `${BASE_URL}/areas/pike-creek-de`,
  `${BASE_URL}/areas/bear-de`,
  `${BASE_URL}/areas/townsend-de`,
  `${BASE_URL}/areas/hockessin-de`,
  `${BASE_URL}/areas/new-castle-de`,
  `${BASE_URL}/areas/odessa-de`,
  `${BASE_URL}/areas/smyrna-de`,
  `${BASE_URL}/areas/delaware-city-de`,
  `${BASE_URL}/areas/centreville-de`,
  `${BASE_URL}/areas/north-star-de`,
  `${BASE_URL}/areas/glasgow-de`,
  `${BASE_URL}/areas/clayton-de`,
  `${BASE_URL}/areas/wilmington-de`,
  `${BASE_URL}/areas/wilmington-de/north-wilmington`,
  `${BASE_URL}/areas/wilmington-de/highlands`,
  `${BASE_URL}/areas/wilmington-de/forty-acres`,
  `${BASE_URL}/areas/wilmington-de/trolley-square`,
  `${BASE_URL}/areas/chesapeake-city-md`,
  `${BASE_URL}/areas/elkton-md`,
  `${BASE_URL}/areas/north-east-md`,
  `${BASE_URL}/areas/perryville-md`,
];

/** Only the newly added pages — submit these when launching new content. */
export const NEW_PAGE_URLS = [
  `${BASE_URL}/areas/middletown-de/parkside`,
  `${BASE_URL}/areas/middletown-de/bayberry`,
  `${BASE_URL}/areas/middletown-de/st-annes`,
  `${BASE_URL}/areas/middletown-de/whitehall`,
  `${BASE_URL}/areas/middletown-de/hyetts-corner`,
];
