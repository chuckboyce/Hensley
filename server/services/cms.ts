import OpenAI from "openai";
import Parser from "rss-parser";
import { storage } from "../storage";
import type { RssFeed, CmsArticle } from "@shared/schema";

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY
});

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'HensleysHomes-CMS/1.0',
  },
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 120);
}

export async function fetchFeedArticles(feedId: string): Promise<{ added: number; skipped: number; errors: string[] }> {
  const feed = await storage.getRssFeed(feedId);
  if (!feed) throw new Error("Feed not found");

  let added = 0;
  let skipped = 0;
  const errors: string[] = [];

  try {
    const parsed = await parser.parseURL(feed.url);

    for (const item of parsed.items) {
      if (!item.link || !item.title) continue;

      try {
        const existing = await storage.getCmsArticleByUrl(item.link);
        if (existing) {
          skipped++;
          continue;
        }

        const slug = slugify(item.title) + '-' + Date.now().toString(36);

        await storage.createCmsArticle({
          feedId: feed.id,
          title: item.title,
          originalUrl: item.link,
          originalSummary: item.contentSnippet || item.content || item.summary || null,
          sourceName: feed.name,
          publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
          locationTags: feed.locationTags,
          slug,
        });
        added++;
      } catch (err: any) {
        errors.push(`Error adding "${item.title}": ${err.message}`);
      }
    }

    await storage.updateFeedLastFetched(feedId);
  } catch (err: any) {
    errors.push(`Error parsing feed: ${err.message}`);
  }

  return { added, skipped, errors };
}

export async function fetchAllFeeds(): Promise<{ totalAdded: number; totalSkipped: number; feedResults: Record<string, { added: number; skipped: number; errors: string[] }> }> {
  const feeds = await storage.listRssFeeds();
  const activeFeeds = feeds.filter(f => f.isActive);

  let totalAdded = 0;
  let totalSkipped = 0;
  const feedResults: Record<string, { added: number; skipped: number; errors: string[] }> = {};

  for (const feed of activeFeeds) {
    const result = await fetchFeedArticles(feed.id);
    totalAdded += result.added;
    totalSkipped += result.skipped;
    feedResults[feed.name] = result;
  }

  return { totalAdded, totalSkipped, feedResults };
}

export async function generateArticleContent(articleId: string): Promise<CmsArticle | undefined> {
  const article = await storage.getCmsArticle(articleId);
  if (!article) throw new Error("Article not found");

  const tags = article.locationTags || [];
  if (tags.length === 0) {
    throw new Error("Article has no location tags — cannot generate location-specific content");
  }

  const locationNames = tags.map(tag => {
    return tag.replace(/-/g, ' ').replace(/\b(de|md)\b/gi, m => m.toUpperCase()).replace(/\b\w/g, l => l.toUpperCase());
  }).join(', ');

  const summaryPrompt = `You are a real estate content strategist writing for Kevin Hensley's Homes, a trusted real estate agency serving Delaware and Maryland. 

Write a 2-3 paragraph summary of this news article that:
1. Explains why this news matters to homeowners, buyers, and renters in ${locationNames}
2. Naturally incorporates real estate keywords: "${locationNames} real estate", "homes for sale", "property values", "community", "neighborhood"
3. Maintains a knowledgeable but approachable tone — like a trusted local advisor sharing insights
4. Ends with a brief perspective on how this could affect the local housing market or community life

Article title: ${article.title}
Source: ${article.sourceName}
Original summary: ${article.originalSummary || 'No summary available'}

Write ONLY the summary paragraphs, no headings or labels:`;

  const faqPrompt = `Based on this news article, create 3 FAQ questions and answers that a homebuyer, seller, or renter in ${locationNames} might have.

Each FAQ should:
1. Be a natural question someone searching for real estate information would ask
2. Include location-specific keywords naturally
3. Provide helpful, informative answers (2-3 sentences each)
4. Connect the news topic to real estate or community life

Article title: ${article.title}
Source: ${article.sourceName}
Summary: ${article.originalSummary || 'No summary available'}

Respond in this exact JSON format (no markdown, no code blocks):
[{"question": "...", "answer": "..."}, {"question": "...", "answer": "..."}, {"question": "...", "answer": "..."}]`;

  try {
    const [summaryResponse, faqResponse] = await Promise.all([
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: summaryPrompt }],
        max_tokens: 800,
        temperature: 0.7,
      }),
      openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: faqPrompt }],
        max_tokens: 800,
        temperature: 0.7,
      }),
    ]);

    const aiSummary = summaryResponse.choices[0]?.message?.content?.trim() || "";
    const faqText = faqResponse.choices[0]?.message?.content?.trim() || "[]";

    let faqs: Array<{ question: string; answer: string }> = [];
    try {
      const cleaned = faqText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) {
        faqs = parsed.filter(item => 
          item && typeof item.question === 'string' && typeof item.answer === 'string' &&
          item.question.trim().length > 0 && item.answer.trim().length > 0
        );
      }
    } catch {
      console.error("[CMS AI] Failed to parse FAQ JSON:", faqText);
      faqs = [];
    }

    const updated = await storage.updateCmsArticle(articleId, {
      aiSummary,
      faqs,
      status: "ai_generated",
    });

    return updated;
  } catch (error: any) {
    console.error("[CMS AI] Error generating content:", error?.message || error);
    throw new Error(`AI generation failed: ${error?.message || 'Unknown error'}`);
  }
}
