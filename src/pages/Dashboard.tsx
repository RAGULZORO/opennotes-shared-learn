import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Note {
  id: string;
  title: string;
  description: string;
  category: string;
  subject: string;
  department: string;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  download_count: number;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchUserNotes();
    }
  }, [user, authLoading, navigate]);

  const fetchUserNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('uploaded_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load your notes');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="gap-1"><CheckCircle className="h-3 w-3" />Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const stats = {
    total: notes.length,
    approved: notes.filter(n => n.status === 'approved').length,
    pending: notes.filter(n => n.status === 'pending').length,
    rejected: notes.filter(n => n.status === 'rejected').length,
    totalDownloads: notes.reduce((sum, n) => sum + (n.download_count || 0), 0),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Track your uploaded notes and their status</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Notes</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Approved
              </CardDescription>
              <CardTitle className="text-3xl">{stats.approved}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-yellow-500" />
                Pending
              </CardDescription>
              <CardTitle className="text-3xl">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription className="flex items-center gap-1">
                <XCircle className="h-4 w-4 text-red-500" />
                Rejected
              </CardDescription>
              <CardTitle className="text-3xl">{stats.rejected}</CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Downloads</CardDescription>
              <CardTitle className="text-3xl">{stats.totalDownloads}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Notes List */}
        {notes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-2">No notes uploaded yet</p>
              <p className="text-sm text-muted-foreground">Upload your first note to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Your Notes</h2>
            {notes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{note.title}</CardTitle>
                      <CardDescription className="mb-3">{note.description}</CardDescription>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span className="bg-muted px-2 py-1 rounded">{note.category}</span>
                        <span className="bg-muted px-2 py-1 rounded">{note.subject}</span>
                        <span className="bg-muted px-2 py-1 rounded">{note.department}</span>
                        <span className="bg-muted px-2 py-1 rounded">{note.download_count || 0} downloads</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(note.status)}
                      <span className="text-xs text-muted-foreground">
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                {note.status === 'rejected' && note.rejection_reason && (
                  <CardContent>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-destructive mb-1">Rejection Reason:</p>
                          <p className="text-sm">{note.rejection_reason}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
