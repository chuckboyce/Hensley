import { useState, useEffect } from "react";
import newarkHeroImg from "@assets/139SMainExterior-700x526_1772895296116.jpg";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  CheckCircle,
  LayoutDashboard,
  Banknote,
  Wrench,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Phone,
  ArrowRight,
  Star,
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const FAQ_ITEMS = [
  {
    q: "Do I need a rental permit to rent my Newark, DE property?",
    a: "Yes. The City of Newark requires an annual rental permit for all non-owner-occupied single-family and two-family homes. Applications go through the Code Enforcement Division at (302) 366-7000. A mandatory exterior inspection must pass before the permit is approved each year. Interior inspections are conducted annually but are voluntary — your tenant must grant permission in writing.",
  },
  {
    q: "What are the 'student home' rules in Newark?",
    a: "Newark has a specific Student Home Ordinance. A student home is any single-family detached dwelling occupied by three or more unrelated post-secondary students. The maximum occupancy is 3 unrelated persons. In RS (residential single-family) zoning districts, student homes must be at least 750 feet apart. Violating these rules can cost you your rental permit. We track compliance for every property we manage.",
  },
  {
    q: "Does New Castle County require separate registration from the City of Newark?",
    a: "Yes — they are separate requirements. New Castle County requires all rental properties to be registered with the Department of Land Use, updated by May 1st of every odd-numbered year (2025, 2027, etc.). Registration is free and can be done online at newcastlede.gov. If you live outside New Castle County, you are required by county code to retain a licensed property manager with a valid Delaware business license.",
  },
  {
    q: "What must be posted inside my Newark rental unit?",
    a: "Newark's Code Enforcement Division requires landlords to prominently display: the maximum occupancy and number of unrelated persons allowed, the property owner or agent name and phone number, the Code Enforcement Division contact (302) 366-7000, parking space locations, and penalty information for non-compliance. We handle all required postings for properties we manage.",
  },
  {
    q: "How does Delaware's security deposit law work?",
    a: "Delaware law limits security deposits to one month's rent for leases of one year or more. Deposits must be held in a separate escrow account and returned within 20 days of lease termination (or 20 days after the tenant provides a forwarding address, whichever is later), with an itemized statement of any deductions. Failing to comply can result in the tenant being awarded double the deposit amount.",
  },
  {
    q: "What is the eviction process timeline in Delaware?",
    a: "Delaware has a landlord-friendly eviction process by mid-Atlantic standards. For non-payment of rent, you can issue a 5-day notice to vacate. After the notice period, you file a Summary Possession complaint in the Justice of the Peace Court. Hearings are typically scheduled within 10–15 days. A writ of possession follows if you prevail. Total timeline from notice to possession is typically 3–6 weeks for uncontested cases. We manage the entire process.",
  },
  {
    q: "Are short-term rentals (Airbnb/VRBO) allowed in Newark?",
    a: "Short-term rentals in the City of Newark are subject to zoning restrictions and still require a rental permit. New Castle County also requires registration of short-term rental properties. Given Newark's student housing ordinance and density rules, many neighborhoods have strict limits. We recommend a compliance review before listing any property short-term.",
  },
  {
    q: "How do Newark's inspection standards affect my property?",
    a: "Newark inspectors follow the International Property Maintenance Code. Common violations include inadequate heating systems, deteriorating exterior paint or siding, improper egress windows, non-functioning smoke/CO detectors, and drainage issues. Our pre-inspection walkthroughs catch issues before city inspectors do, keeping your permit status clean and your tenants safe.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left bg-card hover:bg-muted/50 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-semibold text-foreground pr-4">{q}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-2 bg-card text-muted-foreground leading-relaxed text-sm">
          {a}
        </div>
      )}
    </div>
  );
}

function LeadForm({ compact = false }: { compact?: boolean }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    propertyAddress: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const parts = formData.fullName.trim().split(" ");
      const firstName = parts[0] || "Unknown";
      const lastName = parts.slice(1).join(" ") || "Unknown";
      return await apiRequest("POST", "/api/contacts", {
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        service: "property-management",
        message: `Property Address: ${formData.propertyAddress}\n\nRequested via Newark DE Property Management landing page.`,
        method: "webform",
        pageUrl: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        timestamp: new Date(),
      });
    },
    onSuccess: () => {
      toast({
        title: "Request received!",
        description: "We'll prepare your complimentary ROI & Market Value Report within one business day.",
      });
      setFormData({ fullName: "", phone: "", email: "", propertyAddress: "" });
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please call us at (302) 218-0130 or try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.propertyAddress) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    mutation.mutate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl shadow-2xl border border-border p-6 space-y-4 ${compact ? "" : "lg:sticky lg:top-24"}`}
    >
      <div className="text-center mb-2">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Free — No Obligation</p>
        <h3 className="text-xl font-bold text-foreground">Get Your Complimentary ROI &amp; Market Value Report</h3>
        <p className="text-sm text-muted-foreground mt-1">Find out what your Newark rental is really worth.</p>
      </div>

      <div>
        <Label htmlFor={compact ? "fn2" : "fn"} className="text-sm font-medium">Full Name *</Label>
        <Input
          id={compact ? "fn2" : "fn"}
          placeholder="Jane Smith"
          value={formData.fullName}
          onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor={compact ? "ph2" : "ph"} className="text-sm font-medium">Best Cell Phone</Label>
        <Input
          id={compact ? "ph2" : "ph"}
          type="tel"
          placeholder="(302) 555-0100"
          value={formData.phone}
          onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor={compact ? "em2" : "em"} className="text-sm font-medium">Best Email *</Label>
        <Input
          id={compact ? "em2" : "em"}
          type="email"
          placeholder="jane@example.com"
          value={formData.email}
          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
          required
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor={compact ? "pa2" : "pa"} className="text-sm font-medium">Property Address *</Label>
        <Input
          id={compact ? "pa2" : "pa"}
          placeholder="123 East Cleveland Ave, Newark, DE"
          value={formData.propertyAddress}
          onChange={(e) => setFormData((p) => ({ ...p, propertyAddress: e.target.value }))}
          required
          className="mt-1"
        />
      </div>

      <Button type="submit" className="w-full text-base py-5" disabled={mutation.isPending}>
        {mutation.isPending ? "Sending…" : "Get My Free Rental Analysis"}
        {!mutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        By submitting you agree to be contacted by Hensley&apos;s Homes. No spam, ever.
      </p>
    </form>
  );
}

export default function PropertyManagementNewarkDE() {
  useEffect(() => {
    const BASE = "https://hensleyshomes.com";
    const PAGE = `${BASE}/property-management/newark-de`;

    document.title = "Newark DE Property Management | Hensley's Homes – RE/MAX Eagle Realty";

    const setMeta = (sel: string, attr: string, val: string) => {
      let el = document.querySelector(sel) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta") as HTMLMetaElement;
        el.setAttribute(attr === "content" ? "name" : "property", sel.match(/\[(.*?)=/)?.[1] ?? "");
        document.head.appendChild(el);
      }
      el.setAttribute("content", val);
    };

    const desc = "Hensley's Homes provides professional property management in Newark, DE and New Castle County. We handle Newark rental permits, student home compliance, DoorLoop owner portal, and 24/7 maintenance so you can scale your portfolio stress-free.";

    const descEl = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (descEl) descEl.content = desc;
    const ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
    if (ogDesc) ogDesc.content = desc;
    const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
    if (ogTitle) ogTitle.content = "Newark DE Property Management | Hensley's Homes";
    const ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement;
    if (ogUrl) ogUrl.content = PAGE;

    const canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) canonical.href = PAGE;

    // LocalBusiness schema
    const lbId = "sd-newark-pm-localbusiness";
    const existLb = document.getElementById(lbId);
    if (existLb) existLb.remove();
    const lbScript = document.createElement("script");
    lbScript.type = "application/ld+json";
    lbScript.id = lbId;
    lbScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: "Hensley's Homes Property Management – Newark, DE",
      description: "Professional property management for Newark DE and New Castle County rental property owners. Newark rental permits, student home compliance, DoorLoop technology.",
      url: PAGE,
      telephone: "(302) 218-0130",
      address: {
        "@type": "PostalAddress",
        streetAddress: "5609 DuPont Pkwy Ste 11",
        addressLocality: "Smyrna",
        addressRegion: "DE",
        postalCode: "19977",
        addressCountry: "US",
      },
      areaServed: [
        { "@type": "City", name: "Newark", containedIn: { "@type": "AdministrativeArea", name: "New Castle County, Delaware" } },
        { "@type": "AdministrativeArea", name: "New Castle County, Delaware" },
      ],
      sameAs: ["https://www.facebook.com/HensleysHomes", "https://www.facebook.com/kevin.hensley.5"],
    }, null, 2);
    document.head.appendChild(lbScript);

    // FAQ schema
    const faqId = "sd-newark-pm-faq";
    const existFaq = document.getElementById(faqId);
    if (existFaq) existFaq.remove();
    const faqScript = document.createElement("script");
    faqScript.type = "application/ld+json";
    faqScript.id = faqId;
    faqScript.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    }, null, 2);
    document.head.appendChild(faqScript);

    return () => {
      document.getElementById(lbId)?.remove();
      document.getElementById(faqId)?.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="relative bg-[#0f2044] text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25"
            style={{ backgroundImage: `url(${newarkHeroImg})` }}
            aria-hidden="true"
          />
          <div className="relative container mx-auto px-4 lg:px-6 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium">
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  Serving Newark &amp; New Castle County
                </div>
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Stop Managing Your Newark Rental. Start Owning an Asset.
                </h1>
                <p className="text-xl text-white/80 leading-relaxed">
                  Professional property management for New Castle County investors. We handle the tenants, toilets, and taxes so you can focus on scaling your portfolio.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="#lead-form">
                    <Button size="lg" className="bg-white text-[#0f2044] hover:bg-gray-100 font-bold text-base w-full sm:w-auto">
                      Get a Free Rental Analysis
                    </Button>
                  </a>
                  <a href="tel:(302)218-0130">
                    <Button size="lg" className="bg-transparent border border-white text-white hover:bg-white/10 w-full sm:w-auto">
                      <Phone className="mr-2 h-4 w-4" />
                      (302) 218-0130
                    </Button>
                  </a>
                </div>
                <div className="flex flex-wrap gap-6 pt-2 text-sm text-white/70">
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-400" /> Newark Permit Compliance</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-400" /> Student Home Specialists</span>
                  <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-green-400" /> DoorLoop Technology</span>
                </div>
              </div>
              <div className="lg:block">
                <LeadForm />
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <section className="bg-muted/40 border-y border-border py-8">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { stat: "20+", label: "Years Local Experience" },
                { stat: "100%", label: "Newark Permit Compliance" },
                { stat: "24/7", label: "Owner Portal Access" },
                { stat: "DE", label: "Licensed & Insured" },
              ].map(({ stat, label }) => (
                <div key={label}>
                  <p className="text-3xl font-bold text-primary">{stat}</p>
                  <p className="text-sm text-muted-foreground mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DOORLOOP ADVANTAGE ── */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="text-center mb-14">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Powered by DoorLoop</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Complete Transparency. Zero Guesswork.</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We use DoorLoop — one of the leading property management platforms — so you always know exactly what's happening with your investment.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
                  title: "Owner Portal",
                  desc: "24/7 access to your financial statements, invoices, lease documents, and performance reports — all in one dashboard.",
                },
                {
                  icon: <Banknote className="h-8 w-8 text-primary" />,
                  title: "Fast ACH Payments",
                  desc: "Secure ACH distributions sent directly to your bank account as soon as rent clears. No waiting, no chasing.",
                },
                {
                  icon: <Wrench className="h-8 w-8 text-primary" />,
                  title: "Maintenance Tracking",
                  desc: "Real-time tracking of every work order with photos, vendor invoices, and a complete digital paper trail.",
                },
                {
                  icon: <ShieldCheck className="h-8 w-8 text-primary" />,
                  title: "Tenant Screening",
                  desc: "Rigorous background and credit checks powered by DoorLoop's integrated screening tools — protecting your asset from day one.",
                },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    {icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOCAL EXPERTISE ── */}
        <section className="py-20 bg-[#0f2044] text-white">
          <div className="container mx-auto px-4 lg:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <p className="text-blue-300 font-semibold text-sm uppercase tracking-wider">Newark &amp; New Castle County Experts</p>
                <h2 className="text-3xl md:text-4xl font-bold">We Know These Streets. Literally.</h2>
                <p className="text-white/80 text-lg leading-relaxed">
                  Whether you own on East Cleveland Ave, Prospect Ave, or a unit in Delaware Circle, we ensure 100% compliance with City of Newark rental licensing and inspection standards — including the city's strict Student Home Ordinance for properties near the University of Delaware.
                </p>
                <ul className="space-y-3 text-white/80">
                  {[
                    "Annual Newark rental permit applications & renewals",
                    "Student Home Ordinance compliance (max 3 unrelated occupants)",
                    "New Castle County rental registration (updated every odd year)",
                    "City inspection prep and violation resolution",
                    "Delaware landlord-tenant law compliance",
                    "UD campus-area tenant placement expertise",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/10 rounded-2xl p-8 space-y-4">
                <h3 className="text-xl font-bold text-white">Neighborhoods We Serve</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-white/80">
                  {[
                    "Downtown Newark",
                    "UD Campus Area",
                    "Elkton Road Corridor",
                    "Delaware Circle",
                    "Brookside",
                    "Harmony Hills",
                    "Pike Creek Valley",
                    "Glasgow / Bear",
                    "Ogletown",
                    "Stanton",
                    "Christiana",
                    "All of New Castle County",
                  ].map((n) => (
                    <div key={n} className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
            <div className="text-center mb-12">
              <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-2">Newark-Specific Questions</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground">
                Newark's rental regulations are among the most detailed in Delaware. Here's what every New Castle County landlord needs to know.
              </p>
            </div>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM LEAD CAPTURE ── */}
        <section id="lead-form" className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-6 max-w-2xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-foreground mb-3">Ready to Stop Self-Managing?</h2>
              <p className="text-lg text-muted-foreground">
                Get your complimentary ROI &amp; Market Value Report — no commitment required.
              </p>
            </div>
            <LeadForm compact />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
