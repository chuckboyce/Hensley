export async function pingSearchEngines(sitemapUrl: string): Promise<{ google: boolean; bing: boolean }> {
  const results = {
    google: false,
    bing: false
  };

  // Ping Google
  try {
    const googlePingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const googleResponse = await fetch(googlePingUrl);
    results.google = googleResponse.ok;
    console.log(`Google ping: ${results.google ? 'SUCCESS' : 'FAILED'} (${googleResponse.status})`);
  } catch (error) {
    console.error("Error pinging Google:", error);
  }

  // Ping Bing
  try {
    const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const bingResponse = await fetch(bingPingUrl);
    results.bing = bingResponse.ok;
    console.log(`Bing ping: ${results.bing ? 'SUCCESS' : 'FAILED'} (${bingResponse.status})`);
  } catch (error) {
    console.error("Error pinging Bing:", error);
  }

  return results;
}
