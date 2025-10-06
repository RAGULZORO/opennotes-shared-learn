-- Add rejection_reason field to notes table
ALTER TABLE public.notes 
ADD COLUMN rejection_reason text;