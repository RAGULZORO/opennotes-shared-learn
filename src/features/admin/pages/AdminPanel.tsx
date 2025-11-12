import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CheckCircle, XCircle, FileText, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Note {
  id: string;
  title: string;
  description: string | null;
  file_path: string;
  file_type: string;
  status: string;
  created_at: string;
  category: string | null;
  subject: string | null;
}

export default function AdminPanel() {
  const { user, isAdmin, loading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
      toast.error('Access denied. Admin privileges required.');
    }
  }, [loading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchPendingNotes();
      fetchUnreadNotifications();
    }
  }, [isAdmin]);

  const fetchUnreadNotifications = async () => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);

    if (!error && data) {
      setUnreadCount(data.length);
    }
  };

  const fetchPendingNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      toast.error('Failed to fetch pending notes');
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleApprove = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          status: 'approved',
          approved_by: user?.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', noteId);

      if (error) throw error;
      toast.success('Note approved successfully');
      fetchPendingNotes();
    } catch (error) {
      toast.error('Failed to approve note');
    }
  };

  const handleReject = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          status: 'rejected',
          rejection_reason: 'Does not meet quality standards',
        })
        .eq('id', noteId);

      if (error) throw error;
      toast.success('Note rejected');
      fetchPendingNotes();
    } catch (error) {
      toast.error('Failed to reject note');
    }
  };

  if (loading || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <Button variant="outline" className="gap-2" onClick={() => navigate('/')}>
            <Bell className="h-4 w-4" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>

        {loadingNotes ? (
          <p>Loading...</p>
        ) : notes.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No pending notes to review
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {note.title}
                      </CardTitle>
                      <div className="flex gap-2">
                        {note.subject && <Badge variant="secondary">{note.subject}</Badge>}
                        {note.category && <Badge variant="outline">{note.category}</Badge>}
                      </div>
                    </div>
                    <Badge>{note.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {note.description && (
                    <p className="text-muted-foreground mb-4">{note.description}</p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(note.id)}
                      className="gap-2"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(note.id)}
                      variant="destructive"
                      className="gap-2"
                      size="sm"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
