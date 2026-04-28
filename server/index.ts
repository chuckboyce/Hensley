import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { generateFullPageSchema } from "./utils/schemaGenerator";
import { buildSchemaHtml } from "./utils/pageSchemas";
import { storage } from "./storage";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Performance: Cache headers for static assets
app.use((req, res, next) => {
  // Check if request is for a static asset with hash/version (Vite adds content hashes)
  const isVersionedAsset = /\.(js|css|woff2?|ttf|eot|svg|png|jpe?g|gif|webp|avif|ico)(\?.*)?$/.test(req.url) && 
                          req.url.includes('-') && 
                          req.url.match(/[a-f0-9]{8,}/);
  
  // Check if it's any static asset
  const isStaticAsset = /\.(js|css|woff2?|ttf|eot|svg|png|jpe?g|gif|webp|avif|ico)(\?.*)?$/.test(req.url);
  
  if (isVersionedAsset) {
    // Long-term cache for versioned assets (1 year, immutable)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  } else if (isStaticAsset) {
    // Medium-term cache for non-versioned assets (1 day)
    res.setHeader('Cache-Control', 'public, max-age=86400');
  } else if (req.url.endsWith('.html') || req.url === '/') {
    // No cache for HTML to ensure fresh content
    res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  }
  
  next();
});

// Security headers middleware
app.use((req, res, next) => {
  // Content-Security-Policy: Protect against XSS attacks
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://replit.com https://app.smallbiz.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "img-src 'self' https: data: blob:; " +
    "media-src 'self' https: blob:; " +
    "connect-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://static.cloudflareinsights.com; " +
    "frame-src https://74458621.app.doorloop.com; " +
    "frame-ancestors 'self'; " +
    "base-uri 'self'; " +
    "form-action 'self'"
  );
  
  // X-Frame-Options: Prevent clickjacking attacks
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Referrer-Policy: Control how much referrer information is shared
  res.setHeader('Referrer-Policy', 'no-referrer');
  
  // Permissions-Policy: Restrict access to browser features and APIs
  res.setHeader('Permissions-Policy', 
    'accelerometer=(), ' +
    'autoplay=(), ' +
    'camera=(), ' +
    'display-capture=(), ' +
    'encrypted-media=(), ' +
    'fullscreen=(self), ' +
    'geolocation=(), ' +
    'gyroscope=(), ' +
    'magnetometer=(), ' +
    'microphone=(), ' +
    'midi=(), ' +
    'payment=(), ' +
    'picture-in-picture=(), ' +
    'publickey-credentials-get=(), ' +
    'usb=(), ' +
    'xr-spatial-tracking=()'
  );
  
  next();
});

// Serve uploaded images
app.use('/uploads', express.static('public/uploads'));

// Serve static files from public directory (hero images, logos, etc.)
app.use(express.static('public'));

// Health check endpoint — must respond instantly for deployment health checks
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

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

  // 301 Redirect for /contact-us to /contact
  app.get("/contact-us", (req, res) => {
    res.redirect(301, "https://hensleyshomes.com/contact");
  });

  // Robots.txt route - must be before Vite middleware
  app.get("/robots.txt", (req, res) => {
    // Use request host or fallback to production domain
    const protocol = req.protocol;
    const host = req.get('host') || 'hensleyshomes.com';
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
      const baseUrl = "https://hensleyshomes.com";
      const currentDate = new Date().toISOString().split('T')[0];

      const pages = [
        // Home
        { url: baseUrl, lastmod: currentDate, changefreq: 'weekly', priority: '1.0' },

        // Core service pages
        { url: `${baseUrl}/buy`, lastmod: currentDate, changefreq: 'monthly', priority: '0.9' },
        { url: `${baseUrl}/sell`, lastmod: currentDate, changefreq: 'monthly', priority: '0.9' },
        { url: `${baseUrl}/property-management`, lastmod: currentDate, changefreq: 'monthly', priority: '0.9' },
        { url: `${baseUrl}/property-management/newark-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },

        // Properties and contact
        { url: `${baseUrl}/properties`, lastmod: currentDate, changefreq: 'daily', priority: '0.8' },
        { url: `${baseUrl}/contact`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },

        // Areas index
        { url: `${baseUrl}/areas`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },

        // Middletown, DE — hub + 5 neighborhoods
        { url: `${baseUrl}/areas/middletown-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.9' },
        { url: `${baseUrl}/areas/middletown-de/parkside`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
        { url: `${baseUrl}/areas/middletown-de/bayberry`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
        { url: `${baseUrl}/areas/middletown-de/st-annes`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
        { url: `${baseUrl}/areas/middletown-de/whitehall`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
        { url: `${baseUrl}/areas/middletown-de/hyetts-corner`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },

        // Other Delaware area pages
        { url: `${baseUrl}/areas/newark-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
        { url: `${baseUrl}/areas/pike-creek-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.8' },
        { url: `${baseUrl}/areas/bear-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
        { url: `${baseUrl}/areas/townsend-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
        { url: `${baseUrl}/areas/hockessin-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
        { url: `${baseUrl}/areas/new-castle-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
        { url: `${baseUrl}/areas/odessa-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
        { url: `${baseUrl}/areas/smyrna-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
        { url: `${baseUrl}/areas/delaware-city-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
        { url: `${baseUrl}/areas/centreville-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
        { url: `${baseUrl}/areas/north-star-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
        { url: `${baseUrl}/areas/glasgow-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
        { url: `${baseUrl}/areas/clayton-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },

        // Wilmington, DE + sub-neighborhoods
        { url: `${baseUrl}/areas/wilmington-de`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
        { url: `${baseUrl}/areas/wilmington-de/north-wilmington`, lastmod: currentDate, changefreq: 'monthly', priority: '0.6' },
        { url: `${baseUrl}/areas/wilmington-de/highlands`, lastmod: currentDate, changefreq: 'monthly', priority: '0.6' },
        { url: `${baseUrl}/areas/wilmington-de/forty-acres`, lastmod: currentDate, changefreq: 'monthly', priority: '0.6' },
        { url: `${baseUrl}/areas/wilmington-de/trolley-square`, lastmod: currentDate, changefreq: 'monthly', priority: '0.6' },

        // Maryland area pages
        { url: `${baseUrl}/areas/chesapeake-city-md`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
        { url: `${baseUrl}/areas/elkton-md`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
        { url: `${baseUrl}/areas/north-east-md`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },
        { url: `${baseUrl}/areas/perryville-md`, lastmod: currentDate, changefreq: 'monthly', priority: '0.7' },

        // Legal / policy pages
        { url: `${baseUrl}/fair-housing`, lastmod: currentDate, changefreq: 'yearly', priority: '0.4' },
        { url: `${baseUrl}/privacy-policy`, lastmod: currentDate, changefreq: 'yearly', priority: '0.4' },
        { url: `${baseUrl}/terms-of-use`, lastmod: currentDate, changefreq: 'yearly', priority: '0.4' },
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

  // Server-side schema injection for SEO.
  // Injects JSON-LD into the HTML before serving so search engines see schema
  // in the raw page source without requiring JavaScript execution.
  if (app.get("env") !== "development") {
    const htmlPath = path.resolve(import.meta.dirname, "public", "index.html");
    let cachedHtml: string | null = null;
    let cacheTime = 0;
    const CACHE_TTL = 60 * 1000; // 1 minute

    const getHtmlTemplate = (): string | null => {
      const now = Date.now();
      if (!cachedHtml || now - cacheTime > CACHE_TTL) {
        if (!fs.existsSync(htmlPath)) return null;
        cachedHtml = fs.readFileSync(htmlPath, "utf-8");
        cacheTime = now;
      }
      return cachedHtml;
    };

    // /properties uses a dynamic schema built from the database
    app.get("/properties", async (req, res, next) => {
      try {
        const baseUrl = "https://hensleyshomes.com";
        const properties = await storage.listActiveProperties();
        const schemaJson = generateFullPageSchema(properties, baseUrl);
        const template = getHtmlTemplate();
        if (!template) return next();

        let html = template;
        html = html.replace(
          "</head>",
          `<script type="application/ld+json">${schemaJson}</script>\n</head>`
        );
        html = html.replace(
          /<title>.*?<\/title>/,
          `<title>Available Properties | Kevin Hensley's Homes</title>`
        );
        res.header("Content-Type", "text/html");
        res.header("Cache-Control", "public, max-age=300");
        res.send(html);
      } catch (error) {
        console.error("[SSR Properties] Error:", error);
        next();
      }
    });

    // All other pages: inject static JSON-LD schemas defined in pageSchemas.ts
    app.use((req, res, next) => {
      // Only handle GET requests for HTML pages (not API calls or static assets)
      if (req.method !== "GET") return next();
      if (req.path.startsWith("/api/")) return next();
      if (/\.(js|css|png|jpg|jpeg|webp|avif|svg|ico|woff2?|ttf|eot|json|xml|txt|mp3|mp4)(\?|$)/.test(req.path)) return next();

      const schemaHtml = buildSchemaHtml(req.path);
      if (!schemaHtml) return next();

      const template = getHtmlTemplate();
      if (!template) return next();

      const html = template.replace("</head>", `${schemaHtml}\n</head>`);
      res.header("Content-Type", "text/html");
      res.header("Cache-Control", "no-cache, must-revalidate");
      res.send(html);
    });
  }

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
