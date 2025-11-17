import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PostCard } from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, PenSquare, User } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    fetchProfile();
    fetchUserPosts();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      toast.error("Failed to load profile");
    } else {
      setProfile(data);
    }
  };

  const fetchUserPosts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("posts")
      .select(`
        id,
        title,
        excerpt,
        views,
        created_at,
        cover_image,
        published,
        profiles!posts_author_id_fkey (username, full_name),
        categories!posts_category_id_fkey (name, slug)
      `)
      .eq("author_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load posts");
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">
                      {profile?.full_name || profile?.username}
                    </CardTitle>
                    <p className="text-muted-foreground">@{profile?.username}</p>
                  </div>
                </div>
                <Button onClick={() => navigate("/create")} className="gap-2">
                  <PenSquare className="h-4 w-4" />
                  New Post
                </Button>
              </div>
            </CardHeader>
            {profile?.bio && (
              <CardContent>
                <p className="text-muted-foreground">{profile.bio}</p>
              </CardContent>
            )}
          </Card>

          {/* User Posts */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Your Posts ({posts.length})</h2>
            {posts.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <PenSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center mb-4">
                    You haven't written any posts yet.
                  </p>
                  <Button onClick={() => navigate("/create")}>
                    Write Your First Post
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <div key={post.id} className="relative">
                    {!post.published && (
                      <div className="absolute top-4 right-4 z-10 bg-muted px-3 py-1 rounded-full text-xs font-medium">
                        Draft
                      </div>
                    )}
                    <PostCard
                      id={post.id}
                      title={post.title}
                      excerpt={post.excerpt}
                      author={post.profiles}
                      category={post.categories}
                      views={post.views}
                      createdAt={post.created_at}
                      coverImage={post.cover_image}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}