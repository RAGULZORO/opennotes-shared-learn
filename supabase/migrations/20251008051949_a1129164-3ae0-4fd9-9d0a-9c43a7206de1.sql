-- Create notifications table for admin alerts
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id uuid REFERENCES public.notes(id) ON DELETE CASCADE,
  message text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Admins can view all notifications
CREATE POLICY "Admins can view all notifications"
ON public.notifications
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update notifications (mark as read)
CREATE POLICY "Admins can update notifications"
ON public.notifications
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can insert notifications (for system-generated notifications)
CREATE POLICY "Users can create notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);