import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Save, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function CreatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
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
      cover_image: formData.coverImage || null,
      published: formData.published,
      author_id: user.id,
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
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {id ? "Edit Post" : "Create New Post"}
          </h1>
          <p className="text-muted-foreground">
            Share your knowledge with the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter an engaging title for your post"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverImage">Cover Image URL</Label>
              <Input
                id="coverImage"
                placeholder="https://example.com/image.jpg"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Input
              id="excerpt"
              placeholder="A brief summary of your post (optional)"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Content *</Label>
            <MarkdownEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
            />
          </div>

          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
            />
            <Label htmlFor="published" className="cursor-pointer">
              Publish post (visible to everyone)
            </Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="gap-2">
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
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}