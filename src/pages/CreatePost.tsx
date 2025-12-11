import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/RichTextEditor";
import { MediaAttachments } from "@/components/MediaAttachments";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Save, Eye, ImageIcon, Sparkles } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video" | "document";
  name: string;
}

export default function CreatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [mediaAttachments, setMediaAttachments] = useState<MediaItem[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    categoryId: "",
    coverImage: "",
    published: false,
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchCategories();

    if (id) {
      fetchPost();
    }
  }, [user, id]);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCategories(data || []);
  };

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      toast.error("Post not found");
      navigate("/");
      return;
    }

    if (data.author_id !== user?.id) {
      toast.error("You don't have permission to edit this post");
      navigate("/");
      return;
    }

    setFormData({
      title: data.title,
      content: data.content,
      excerpt: data.excerpt || "",
      categoryId: data.category_id || "",
      coverImage: data.cover_image || "",
      published: data.published,
    });

    // Parse media attachments from content if stored
    if (data.media_attachments) {
      setMediaAttachments(data.media_attachments);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const slug = generateSlug(formData.title);
    const postData = {
      title: formData.title,
      slug,
      content: formData.content,
      excerpt: formData.excerpt || formData.content.substring(0, 200) + "...",
      category_id: formData.categoryId || null,
      cover_image: formData.coverImage || (mediaAttachments.find(m => m.type === 'image')?.url || null),
      published: formData.published,
      author_id: user.id,
      media_attachments: mediaAttachments,
    };

    let error;

    if (id) {
      ({ error } = await supabase.from("posts").update(postData).eq("id", id));
    } else {
      ({ error } = await supabase.from("posts").insert([postData]));
    }

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(id ? "Post updated successfully!" : "Post created successfully!");
      navigate("/profile");
    }

    setLoading(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            <span>{id ? "Edit Your Story" : "Create Something Amazing"}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent mb-3">
            {id ? "Edit Post" : "New Post"}
          </h1>
          <p className="text-muted-foreground text-lg">
            Share your knowledge and inspire the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title Card */}
          <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-border/50 shadow-xl">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-semibold">Title *</Label>
              <Input
                id="title"
                placeholder="Enter an engaging title for your post..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="text-lg h-12 bg-background/50 border-border/50 focus:border-primary"
              />
            </div>
          </Card>

          {/* Meta Info */}
          <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-border/50 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-semibold">Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                >
                  <SelectTrigger className="h-11 bg-background/50 border-border/50">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-xl">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-base font-semibold">Excerpt</Label>
                <Input
                  id="excerpt"
                  placeholder="A brief summary of your post"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="h-11 bg-background/50 border-border/50"
                />
              </div>
            </div>
          </Card>

          {/* Content Tabs */}
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="content" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                ✍️ Write Content
              </TabsTrigger>
              <TabsTrigger value="media" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <ImageIcon className="h-4 w-4 mr-2" />
                Media Attachments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="mt-0">
              <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-border/50 shadow-xl">
                <Label className="text-base font-semibold mb-4 block">Content *</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                />
              </Card>
            </TabsContent>

            <TabsContent value="media" className="mt-0">
              <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-border/50 shadow-xl">
                <div className="mb-4">
                  <Label className="text-base font-semibold">Media Attachments</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Attach images, videos, or documents that viewers can see alongside your content (like LinkedIn posts)
                  </p>
                </div>
                <MediaAttachments
                  attachments={mediaAttachments}
                  onChange={setMediaAttachments}
                />
              </Card>
            </TabsContent>
          </Tabs>

          {/* Publish Settings */}
          <Card className="p-6 bg-gradient-to-br from-card to-muted/20 border-border/50 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-success/20 to-success/5">
                  <Eye className="h-5 w-5 text-success" />
                </div>
                <div>
                  <Label htmlFor="published" className="text-base font-semibold cursor-pointer">
                    Publish post
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Make your post visible to everyone
                  </p>
                </div>
              </div>
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                className="data-[state=checked]:bg-success"
              />
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/profile")}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading} 
              className="gap-2 px-8 bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 shadow-lg shadow-primary/25"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {id ? "Update Post" : "Create Post"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
