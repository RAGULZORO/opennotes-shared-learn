import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Clock, CheckCircle, XCircle, AlertCircle, Home } from 'lucide-react';
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
          <div className="flex items-center gap-4 mb-6">
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Track your uploaded notes and their status</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="hover-lift border-border/50 shadow-soft">
            <CardHeader className="pb-4">
              <CardDescription className="text-sm font-medium text-muted-foreground">Total Notes</CardDescription>
              <CardTitle className="text-4xl font-bold gradient-text">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card className="hover-lift border-border/50 shadow-soft">
            <CardHeader className="pb-4">
              <CardDescription className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Approved
              </CardDescription>
              <CardTitle className="text-4xl font-bold text-green-600">{stats.approved}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="hover-lift border-border/50 shadow-soft">
            <CardHeader className="pb-4">
              <CardDescription className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-yellow-500" />
                Pending
              </CardDescription>
              <CardTitle className="text-4xl font-bold text-yellow-600">{stats.pending}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="hover-lift border-border/50 shadow-soft">
            <CardHeader className="pb-4">
              <CardDescription className="flex items-center gap-2 text-sm font-medium">
                <XCircle className="h-4 w-4 text-red-500" />
                Rejected
              </CardDescription>
              <CardTitle className="text-4xl font-bold text-red-600">{stats.rejected}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="hover-lift border-border/50 shadow-soft">
            <CardHeader className="pb-4">
              <CardDescription className="text-sm font-medium text-muted-foreground">Total Downloads</CardDescription>
              <CardTitle className="text-4xl font-bold gradient-text-accent">{stats.totalDownloads}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Notes List */}
        {notes.length === 0 ? (
          <Card className="hover-lift border-border/50 shadow-soft">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="bg-gradient-accent p-4 rounded-2xl mb-6">
                <FileText className="h-12 w-12 text-white" />
              </div>
              <p className="text-xl font-semibold text-foreground mb-2">No notes uploaded yet</p>
              <p className="text-muted-foreground text-center max-w-md">Upload your first note to get started and share knowledge with the community!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold gradient-text">Your Notes</h2>
            {notes.map((note) => (
              <Card key={note.id} className="hover-lift border-border/50 shadow-soft group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-3 group-hover:text-primary transition-colors duration-300">{note.title}</CardTitle>
                      <CardDescription className="mb-4 text-base leading-relaxed">{note.description}</CardDescription>
                      <div className="flex flex-wrap gap-3">
                        <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">{note.category}</span>
                        <span className="bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-medium">{note.subject}</span>
                        <span className="bg-muted px-3 py-1.5 rounded-full text-sm font-medium">{note.department}</span>
                        <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">{note.download_count || 0} downloads</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      {getStatusBadge(note.status)}
                      <span className="text-sm text-muted-foreground font-medium">
                        {new Date(note.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                
                {note.status === 'rejected' && note.rejection_reason && (
                  <CardContent>
                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="h-6 w-6 text-destructive mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-destructive mb-2 text-lg">Rejection Reason:</p>
                          <p className="text-sm leading-relaxed">{note.rejection_reason}</p>
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
