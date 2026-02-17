import { Link } from "wouter";
import { Upload, List, Newspaper, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const adminPages = [
  {
    title: "BrightMLS Import",
    description: "Parse and import property listings from BrightMLS PDF data",
    href: "/admin/listings",
    icon: Upload,
  },
  {
    title: "Property Management",
    description: "Edit property details, generate AI summaries, and manage active listings",
    href: "/admin/manage-listings",
    icon: List,
  },
  {
    title: "CMS & RSS Feeds",
    description: "Manage RSS feeds, review articles, generate AI content, and publish local news",
    href: "/admin/cms",
    icon: Newspaper,
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
        <p className="text-muted-foreground mb-10">Manage your listings, content, and site settings.</p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adminPages.map((page) => (
            <Link key={page.href} href={page.href}>
              <Card className="h-full cursor-pointer hover:shadow-lg hover:border-primary/40 transition-all">
                <CardContent className="p-6 flex flex-col items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <page.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">{page.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{page.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
