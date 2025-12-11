import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  ImageIcon,
  FileText,
  X,
  Upload,
  Loader2,
  Play,
  File,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video" | "document";
  name: string;
  size?: { width: number; height: number };
}

interface MediaAttachmentsProps {
  attachments: MediaItem[];
  onChange: (attachments: MediaItem[]) => void;
  readOnly?: boolean;
}

export function MediaAttachments({
  attachments,
  onChange,
  readOnly = false,
}: MediaAttachmentsProps) {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [imageSize, setImageSize] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newAttachments: MediaItem[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `attachments/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("post-attachments")
        .upload(filePath, file);

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}`);
        continue;
      }

      const { data: urlData } = supabase.storage
        .from("post-attachments")
        .getPublicUrl(filePath);

      const type = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : "document";

      newAttachments.push({
        id: fileName,
        url: urlData.publicUrl,
        type,
        name: file.name,
      });
    }

    onChange([...attachments, ...newAttachments]);
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (id: string) => {
    onChange(attachments.filter((a) => a.id !== id));
  };

  const handleSizeChange = (id: string, value: number[]) => {
    setImageSize((prev) => ({ ...prev, [id]: value[0] }));
  };

  const getImageStyle = (id: string) => {
    const size = imageSize[id] || 100;
    return { width: `${size}%`, maxWidth: "100%" };
  };

  if (readOnly && attachments.length === 0) return null;

  return (
    <div className="space-y-4">
      {!readOnly && (
        <div className="flex items-center gap-3 p-4 border-2 border-dashed border-border rounded-xl bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 hover:border-primary/50 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="gap-2 bg-background hover:bg-primary hover:text-primary-foreground transition-all"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Add Media
          </Button>
          <span className="text-sm text-muted-foreground">
            Images, videos, PDFs, documents
          </span>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {attachments.map((item) => (
            <Card
              key={item.id}
              className="relative group overflow-hidden bg-gradient-to-br from-card to-muted/30 border-border/50 hover:shadow-xl transition-all duration-300"
            >
              {!readOnly && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 z-10 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeAttachment(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}

              {item.type === "image" && (
                <div className="space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div
                        className="aspect-video flex items-center justify-center overflow-hidden cursor-pointer relative"
                        onClick={() => setSelectedImage(item)}
                      >
                        <img
                          src={item.url}
                          alt={item.name}
                          style={getImageStyle(item.id)}
                          className="object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                          <Maximize2 className="h-5 w-5 text-foreground" />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl p-0 overflow-hidden bg-background/95 backdrop-blur-xl">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-auto max-h-[80vh] object-contain"
                      />
                    </DialogContent>
                  </Dialog>
                  {!readOnly && (
                    <div className="px-3 pb-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <Minimize2 className="h-3 w-3" />
                        <span>Resize</span>
                        <Maximize2 className="h-3 w-3 ml-auto" />
                      </div>
                      <Slider
                        value={[imageSize[item.id] || 100]}
                        onValueChange={(value) => handleSizeChange(item.id, value)}
                        min={25}
                        max={100}
                        step={5}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              )}

              {item.type === "video" && (
                <div className="aspect-video bg-muted flex items-center justify-center relative overflow-hidden">
                  <video
                    src={item.url}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {item.type === "document" && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-video flex flex-col items-center justify-center gap-3 p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-center line-clamp-2 text-foreground">
                    {item.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Click to view
                  </span>
                </a>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
