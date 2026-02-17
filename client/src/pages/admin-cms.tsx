import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import { ArrowLeft, Plus, Trash2, Edit, RefreshCw, Send, Eye, EyeOff, Sparkles, ChevronDown, ChevronUp, X } from "lucide-react";

const LOCATION_TAGS = [
  "middletown-de", "townsend-de", "bear-de", "hockessin-de", "new-castle-de",
  "odessa-de", "smyrna-de", "delaware-city-de", "centreville-de", "north-star-de",
  "wilmington-de", "north-wilmington-de", "highlands-de", "forty-acres-de", "trolley-square-de",
  "chesapeake-city-md", "elkton-md", "north-east-md", "perryville-md"
];

export default function AdminCms() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"feeds" | "articles">("feeds");
  const [articleFilter, setArticleFilter] = useState("all");

  const [feedDialogOpen, setFeedDialogOpen] = useState(false);
  const [editingFeed, setEditingFeed] = useState<any>(null);
  const [feedForm, setFeedForm] = useState({ name: "", url: "", locationTags: "", isActive: true });

  const [articleDialogOpen, setArticleDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [articleForm, setArticleForm] = useState({ aiSummary: "", aiCommentary: "", faqs: [] as { question: string; answer: string }[] });

  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const { toast } = useToast();

  const handleLogin = async () => {
    if (!password) {
      toast({ title: "Error", description: "Please enter the admin password", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/cms/feeds", {
        headers: { "Authorization": `Bearer ${password}` }
      });
      if (response.status === 401) {
        toast({ title: "Error", description: "Invalid password", variant: "destructive" });
        return;
      }
      if (!response.ok) throw new Error("Authentication failed");
      setIsAuthenticated(true);
    } catch (error) {
      toast({ title: "Error", description: "Authentication failed", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const { data: feeds, isLoading: feedsLoading } = useQuery({
    queryKey: ["/api/admin/cms/feeds"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const response = await fetch("/api/admin/cms/feeds", {
        headers: { "Authorization": `Bearer ${password}` }
      });
      if (!response.ok) throw new Error("Failed to fetch feeds");
      return response.json();
    }
  });

  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ["/api/admin/cms/articles", articleFilter],
    enabled: isAuthenticated,
    queryFn: async () => {
      const url = articleFilter === "all"
        ? "/api/admin/cms/articles"
        : `/api/admin/cms/articles?status=${articleFilter}`;
      const response = await fetch(url, {
        headers: { "Authorization": `Bearer ${password}` }
      });
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json();
    }
  });

  const openAddFeed = () => {
    setEditingFeed(null);
    setFeedForm({ name: "", url: "", locationTags: "", isActive: true });
    setFeedDialogOpen(true);
  };

  const openEditFeed = (feed: any) => {
    setEditingFeed(feed);
    setFeedForm({
      name: feed.name,
      url: feed.url,
      locationTags: (feed.locationTags || []).join(", "),
      isActive: feed.isActive
    });
    setFeedDialogOpen(true);
  };

  const handleSaveFeed = async () => {
    const tags = feedForm.locationTags.split(",").map((t: string) => t.trim()).filter(Boolean);
    const body = { name: feedForm.name, url: feedForm.url, locationTags: tags, isActive: feedForm.isActive };

    try {
      const url = editingFeed ? `/api/admin/cms/feeds/${editingFeed.id}` : "/api/admin/cms/feeds";
      const method = editingFeed ? "PATCH" : "POST";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${password}` },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save feed");
      }
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/feeds"] });
      setFeedDialogOpen(false);
      toast({ title: "Success", description: editingFeed ? "Feed updated" : "Feed created" });
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to save feed", variant: "destructive" });
    }
  };

  const handleDeleteFeed = async (id: string) => {
    if (!confirm("Delete this feed?")) return;
    try {
      const response = await fetch(`/api/admin/cms/feeds/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${password}` }
      });
      if (!response.ok) throw new Error("Failed to delete feed");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/feeds"] });
      toast({ title: "Success", description: "Feed deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete feed", variant: "destructive" });
    }
  };

  const handleFetchFeed = async (id: string) => {
    try {
      toast({ title: "Fetching...", description: "Fetching articles from feed" });
      const response = await fetch(`/api/admin/cms/feeds/${id}/fetch`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${password}` }
      });
      if (!response.ok) throw new Error("Failed to fetch articles");
      const result = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/feeds"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/articles"] });
      toast({ title: "Success", description: `Fetched ${result.newArticles || 0} new articles` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch articles from feed", variant: "destructive" });
    }
  };

  const handleFetchAll = async () => {
    try {
      toast({ title: "Fetching...", description: "Fetching articles from all feeds" });
      const response = await fetch("/api/admin/cms/feeds/fetch-all", {
        method: "POST",
        headers: { "Authorization": `Bearer ${password}` }
      });
      if (!response.ok) throw new Error("Failed to fetch all");
      const result = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/feeds"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/articles"] });
      toast({ title: "Success", description: `Fetched from ${result.feedsProcessed || 0} feeds, ${result.totalNewArticles || 0} new articles` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch from all feeds", variant: "destructive" });
    }
  };

  const handleGenerateAI = async (id: string) => {
    try {
      toast({ title: "Generating...", description: "Generating AI content" });
      const response = await fetch(`/api/admin/cms/articles/${id}/generate`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${password}` }
      });
      if (!response.ok) throw new Error("Failed to generate content");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/articles"] });
      toast({ title: "Success", description: "AI content generated" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to generate AI content", variant: "destructive" });
    }
  };

  const openEditArticle = (article: any) => {
    setEditingArticle(article);
    const faqs = Array.isArray(article.faqs) ? article.faqs : [];
    setArticleForm({
      aiSummary: article.aiSummary || "",
      aiCommentary: article.aiCommentary || "",
      faqs: faqs.map((f: any) => ({ question: f.question || "", answer: f.answer || "" }))
    });
    setArticleDialogOpen(true);
  };

  const handleSaveArticle = async () => {
    if (!editingArticle) return;
    try {
      const response = await fetch(`/api/admin/cms/articles/${editingArticle.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${password}` },
        body: JSON.stringify({
          aiSummary: articleForm.aiSummary,
          aiCommentary: articleForm.aiCommentary,
          faqs: articleForm.faqs
        })
      });
      if (!response.ok) throw new Error("Failed to update article");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/articles"] });
      setArticleDialogOpen(false);
      toast({ title: "Success", description: "Article updated" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update article", variant: "destructive" });
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/cms/articles/${id}/publish`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${password}` }
      });
      if (!response.ok) throw new Error("Failed to publish");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/articles"] });
      toast({ title: "Success", description: "Article published" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to publish article", variant: "destructive" });
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/cms/articles/${id}/unpublish`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${password}` }
      });
      if (!response.ok) throw new Error("Failed to unpublish");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/articles"] });
      toast({ title: "Success", description: "Article unpublished" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to unpublish article", variant: "destructive" });
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    try {
      const response = await fetch(`/api/admin/cms/articles/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${password}` }
      });
      if (!response.ok) throw new Error("Failed to delete article");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/cms/articles"] });
      toast({ title: "Success", description: "Article deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete article", variant: "destructive" });
    }
  };

  const addFaqRow = () => {
    setArticleForm(prev => ({ ...prev, faqs: [...prev.faqs, { question: "", answer: "" }] }));
  };

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    setArticleForm(prev => {
      const faqs = [...prev.faqs];
      faqs[index] = { ...faqs[index], [field]: value };
      return { ...prev, faqs };
    });
  };

  const removeFaq = (index: number) => {
    setArticleForm(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Published</Badge>;
      case "ai_generated":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">AI Generated</Badge>;
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <h1 className="text-2xl font-bold mb-6">CMS Admin Login</h1>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                placeholder="Enter admin password"
              />
            </div>
            <Button onClick={handleLogin} className="w-full" disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Login"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">CMS Management</h1>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "feeds" ? "default" : "outline"}
            onClick={() => setActiveTab("feeds")}
          >
            RSS Feeds
          </Button>
          <Button
            variant={activeTab === "articles" ? "default" : "outline"}
            onClick={() => setActiveTab("articles")}
          >
            Articles
          </Button>
        </div>

        {activeTab === "feeds" && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={openAddFeed}>
                <Plus className="mr-2 h-4 w-4" />
                Add Feed
              </Button>
              <Button variant="secondary" onClick={handleFetchAll}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Fetch All
              </Button>
            </div>

            {feedsLoading ? (
              <Card className="p-8 text-center"><p>Loading feeds...</p></Card>
            ) : !feeds || feeds.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No RSS feeds configured yet</p>
              </Card>
            ) : (
              <Card className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">URL</th>
                        <th className="text-left p-3">Location Tags</th>
                        <th className="text-left p-3">Active</th>
                        <th className="text-left p-3">Last Fetched</th>
                        <th className="text-left p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeds.map((feed: any) => (
                        <tr key={feed.id} className="border-b">
                          <td className="p-3 font-medium">{feed.name}</td>
                          <td className="p-3">
                            <span className="text-sm text-muted-foreground truncate max-w-[200px] block">{feed.url}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {(feed.locationTags || []).map((tag: string) => (
                                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            {feed.isActive ? (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>
                            ) : (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {feed.lastFetched ? new Date(feed.lastFetched).toLocaleString() : "Never"}
                          </td>
                          <td className="p-3">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleFetchFeed(feed.id)} title="Fetch Articles">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => openEditFeed(feed)} title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteFeed(feed.id)} title="Delete">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        {activeTab === "articles" && (
          <div className="space-y-4">
            <div className="flex gap-2 items-center flex-wrap">
              <Label className="text-sm font-medium">Filter:</Label>
              <Select value={articleFilter} onValueChange={setArticleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="ai_generated">AI Generated</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {articlesLoading ? (
              <Card className="p-8 text-center"><p>Loading articles...</p></Card>
            ) : !articles || articles.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No articles found</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {articles.map((article: any) => {
                  const isExpanded = expandedArticle === article.id;
                  const faqs = Array.isArray(article.faqs) ? article.faqs : [];

                  return (
                    <Card key={article.id} className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-medium text-sm truncate max-w-[400px]">{article.title}</h3>
                            {getStatusBadge(article.status)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span>{article.sourceName}</span>
                            {article.publishedAt && (
                              <>
                                <span>·</span>
                                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                              </>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {(article.locationTags || []).map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0 flex-wrap">
                          <Button variant="ghost" size="sm" onClick={() => setExpandedArticle(isExpanded ? null : article.id)} title="Preview">
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleGenerateAI(article.id)} title="Generate AI Content">
                            <Sparkles className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => openEditArticle(article)} title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                          {article.status !== "published" ? (
                            <Button variant="outline" size="sm" onClick={() => handlePublish(article.id)} title="Publish" className="text-green-600">
                              <Eye className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => handleUnpublish(article.id)} title="Unpublish" className="text-orange-600">
                              <EyeOff className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteArticle(article.id)} title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t space-y-3">
                          {article.aiSummary && (
                            <div>
                              <Label className="text-xs font-semibold uppercase text-muted-foreground">AI Summary</Label>
                              <p className="text-sm mt-1">{article.aiSummary}</p>
                            </div>
                          )}
                          {article.aiCommentary && (
                            <div>
                              <Label className="text-xs font-semibold uppercase text-muted-foreground">AI Commentary</Label>
                              <p className="text-sm mt-1">{article.aiCommentary}</p>
                            </div>
                          )}
                          {faqs.length > 0 && (
                            <div>
                              <Label className="text-xs font-semibold uppercase text-muted-foreground">FAQs ({faqs.length})</Label>
                              <div className="space-y-2 mt-1">
                                {faqs.map((faq: any, i: number) => (
                                  <div key={i} className="text-sm">
                                    <p className="font-medium">Q: {faq.question}</p>
                                    <p className="text-muted-foreground">A: {faq.answer}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {!article.aiSummary && faqs.length === 0 && (
                            <p className="text-sm text-muted-foreground italic">No AI content generated yet. Click the sparkle icon to generate.</p>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <Dialog open={feedDialogOpen} onOpenChange={setFeedDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingFeed ? "Edit Feed" : "Add Feed"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="feedName">Name</Label>
                <Input
                  id="feedName"
                  value={feedForm.name}
                  onChange={(e) => setFeedForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Delaware News Journal"
                />
              </div>
              <div>
                <Label htmlFor="feedUrl">RSS URL</Label>
                <Input
                  id="feedUrl"
                  value={feedForm.url}
                  onChange={(e) => setFeedForm(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com/rss"
                />
              </div>
              <div>
                <Label htmlFor="feedTags">Location Tags (comma-separated)</Label>
                <Input
                  id="feedTags"
                  value={feedForm.locationTags}
                  onChange={(e) => setFeedForm(prev => ({ ...prev, locationTags: e.target.value }))}
                  placeholder="middletown-de, townsend-de, bear-de"
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {LOCATION_TAGS.map(tag => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-accent"
                      onClick={() => {
                        const current = feedForm.locationTags.split(",").map(t => t.trim()).filter(Boolean);
                        if (!current.includes(tag)) {
                          setFeedForm(prev => ({
                            ...prev,
                            locationTags: [...current, tag].join(", ")
                          }));
                        }
                      }}
                    >
                      + {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="feedActive">Active</Label>
                <Button
                  variant={feedForm.isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFeedForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                >
                  {feedForm.isActive ? "Active" : "Inactive"}
                </Button>
              </div>
              <Button onClick={handleSaveFeed} className="w-full">
                {editingFeed ? "Update Feed" : "Add Feed"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={articleDialogOpen} onOpenChange={setArticleDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Article Content</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="aiSummary">AI Summary</Label>
                <Textarea
                  id="aiSummary"
                  value={articleForm.aiSummary}
                  onChange={(e) => setArticleForm(prev => ({ ...prev, aiSummary: e.target.value }))}
                  placeholder="AI-generated summary..."
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="aiCommentary">AI Commentary</Label>
                <Textarea
                  id="aiCommentary"
                  value={articleForm.aiCommentary}
                  onChange={(e) => setArticleForm(prev => ({ ...prev, aiCommentary: e.target.value }))}
                  placeholder="AI-generated commentary..."
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>FAQs</Label>
                  <Button variant="outline" size="sm" onClick={addFaqRow}>
                    <Plus className="mr-1 h-3 w-3" />
                    Add FAQ
                  </Button>
                </div>
                <div className="space-y-3">
                  {articleForm.faqs.map((faq, index) => (
                    <div key={index} className="border rounded p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">FAQ #{index + 1}</Label>
                        <Button variant="ghost" size="sm" onClick={() => removeFaq(index)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <Input
                        value={faq.question}
                        onChange={(e) => updateFaq(index, "question", e.target.value)}
                        placeholder="Question"
                      />
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(index, "answer", e.target.value)}
                        placeholder="Answer"
                        className="min-h-[60px]"
                      />
                    </div>
                  ))}
                  {articleForm.faqs.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No FAQs. Click "Add FAQ" to add one.</p>
                  )}
                </div>
              </div>
              <Button onClick={handleSaveArticle} className="w-full">
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
