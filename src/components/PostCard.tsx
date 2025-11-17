import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, User } from "lucide-react";
import { format } from "date-fns";

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: {
    username: string;
    full_name?: string;
  };
  category: {
    name: string;
    slug: string;
  };
  views: number;
  createdAt: string;
  coverImage?: string;
}

export const PostCard = ({
  id,
  title,
  excerpt,
  author,
  category,
  views,
  createdAt,
  coverImage,
}: PostCardProps) => {
  return (
    <Link to={`/post/${id}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group bg-gradient-to-b from-card to-background">
        {coverImage && (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {category.name}
            </Badge>
          </div>
          <h3 className="font-bold text-xl line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
            {excerpt}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{author.full_name || author.username}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{views}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};