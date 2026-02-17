import { useQuery } from "@tanstack/react-query";
import { ExternalLink, Newspaper, HelpCircle } from "lucide-react";
import type { CmsArticle } from "@shared/schema";

interface LocalNewsProps {
  locationTag: string;
  locationName: string;
  limit?: number;
}

export default function LocalNews({ locationTag, locationName, limit = 5 }: LocalNewsProps) {
  const { data: articles, isLoading } = useQuery<CmsArticle[]>({
    queryKey: ['/api/cms/articles', locationTag],
    queryFn: async () => {
      const res = await fetch(`/api/cms/articles?location=${locationTag}&limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch articles');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-64"></div>
            <div className="h-4 bg-muted rounded w-96"></div>
            <div className="space-y-3 mt-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!articles || articles.length === 0) return null;

  const allFaqs = articles.flatMap(article => {
    const faqs = article.faqs as Array<{ question: string; answer: string }> | null;
    return faqs || [];
  });

  const faqSchema = allFaqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <section className="py-16 bg-secondary" id="local-news">
        <div className="container mx-auto px-4 lg:px-6 max-w-6xl">
          <div className="flex items-center gap-3 mb-3">
            <Newspaper className="h-7 w-7 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Local News & Updates</h2>
          </div>
          <p className="text-muted-foreground mb-10 text-lg">
            Stay informed about what's happening in {locationName} — news that matters for homeowners, buyers, and renters.
          </p>

          <div className="space-y-6">
            {articles.map((article) => {
              const faqs = article.faqs as Array<{ question: string; answer: string }> | null;
              return (
                <article key={article.id} className="bg-background border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground leading-tight mb-1">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">{article.sourceName}</span>
                        {article.publishedAt && (
                          <>
                            <span>•</span>
                            <time dateTime={new Date(article.publishedAt).toISOString()}>
                              {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </time>
                          </>
                        )}
                      </div>
                    </div>
                    <a
                      href={article.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-primary hover:text-primary/80 transition-colors"
                      aria-label={`Read full article: ${article.title}`}
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>

                  {article.aiSummary && (
                    <div className="text-muted-foreground leading-relaxed mb-4 whitespace-pre-line">
                      {article.aiSummary}
                    </div>
                  )}

                  {article.aiCommentary && (
                    <div className="bg-primary/5 border-l-4 border-primary rounded-r-lg p-4 mb-4">
                      <p className="text-sm font-medium text-primary mb-1">Kevin's Take</p>
                      <p className="text-muted-foreground text-sm leading-relaxed">{article.aiCommentary}</p>
                    </div>
                  )}

                  {faqs && faqs.length > 0 && (
                    <div className="mt-4 border-t border-border pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <HelpCircle className="h-4 w-4 text-primary" />
                        <h4 className="text-sm font-semibold text-foreground">Frequently Asked Questions</h4>
                      </div>
                      <div className="space-y-3">
                        {faqs.map((faq, i) => (
                          <div key={i}>
                            <p className="text-sm font-medium text-foreground">{faq.question}</p>
                            <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
