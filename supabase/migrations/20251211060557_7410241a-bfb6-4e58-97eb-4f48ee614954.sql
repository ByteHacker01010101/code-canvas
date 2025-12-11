-- Add media_attachments column to posts table for LinkedIn-style media attachments
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS media_attachments JSONB DEFAULT '[]'::jsonb;