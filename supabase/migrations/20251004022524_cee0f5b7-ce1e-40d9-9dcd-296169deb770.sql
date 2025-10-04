-- Add download_count column to notes table
ALTER TABLE public.notes
ADD COLUMN download_count integer NOT NULL DEFAULT 0;