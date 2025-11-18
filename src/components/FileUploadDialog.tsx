import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Upload, Image, FileText, File } from "lucide-react";
import { toast } from "sonner";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUploaded: (url: string, type: "image" | "file") => void;
}

export const FileUploadDialog = ({
  open,
  onOpenChange,
  onFileUploaded,
}: FileUploadDialogProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast.error("You must be logged in to upload files");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size must be less than 20MB");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from("post-attachments")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("post-attachments").getPublicUrl(fileName);

      const fileType = file.type.startsWith("image/") ? "image" : "file";
      onFileUploaded(publicUrl, fileType);
      onOpenChange(false);
      toast.success("File uploaded successfully!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload file");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload File
          </DialogTitle>
          <DialogDescription>
            Upload images, PDFs, documents, or any file type (max 20MB)
          </DialogDescription>
        </DialogHeader>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive
              ? "border-primary bg-primary/5 scale-105"
              : "border-border bg-muted/20"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center gap-3 mb-4">
                <Image className="h-8 w-8 text-primary" />
                <FileText className="h-8 w-8 text-secondary" />
                <File className="h-8 w-8 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop a file here, or click to browse
              </p>
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                disabled={uploading}
                className="cursor-pointer"
                accept="image/*,.pdf,.doc,.docx,.txt,.md"
              />
            </>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-2 py-1 bg-primary/10 text-primary rounded">Images</span>
          <span className="px-2 py-1 bg-secondary/10 text-secondary rounded">PDFs</span>
          <span className="px-2 py-1 bg-accent/10 text-accent rounded">Documents</span>
          <span className="px-2 py-1 bg-success/10 text-success rounded">Any file</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};
