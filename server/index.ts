import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve uploaded images
app.use('/uploads', express.static('public/uploads'));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Robots.txt route - must be before Vite middleware
  app.get("/robots.txt", (req, res) => {
    // Use request host or fallback to production domain
    const protocol = req.protocol;
    const host = req.get('host') || 'hensleys-homes.com';
    const baseUrl = `${protocol}://${host}`;
    
    const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /admin

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml`;

    res.header('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  // Sitemap.xml route - must be before Vite middleware
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = "https://hensleys-homes.com";
      const currentDate = new Date().toISOString().split('T')[0];

      const pages = [
        { url: baseUrl, lastmod: currentDate, changefreq: 'weekly', priority: '1.0' },
        { url: `${baseUrl}/buy`, lastmod: currentDate, changefreq: 'monthly', priority: '0.9' },
        { url: `${baseUrl}/sell`, lastmod: currentDate, changefreq: 'monthly', priority: '0.9' },
        { url: `${baseUrl}/property-management`, lastmod: currentDate, changefreq: 'monthly', priority: '0.9' },
        { url: `${baseUrl}/properties`, lastmod: currentDate, changefreq: 'daily', priority: '0.8' },
        { url: `${baseUrl}/areas/middletown-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
        { url: `${baseUrl}/contact`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' }
      ];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
