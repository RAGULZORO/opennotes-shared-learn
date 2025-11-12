import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, Upload, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface Note {
  id: string;
  title: string;
  status: string;
  created_at: string;
  file_type: string;
}

export default function Dashboard() {
  const { user, signOut, loading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserNotes();
    }
  }, [user]);

  const fetchUserNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('id, title, status, created_at, file_type')
        .eq('uploaded_by', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      toast.error('Failed to fetch your notes');
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">OpenNotes</h1>
          </Link>
          <div className="flex gap-2">
            <Link to="/upload">
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Note
              </Button>
            </Link>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">My Dashboard</h2>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Uploads</CardTitle>
            <CardDescription>
              Track the status of your uploaded notes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingNotes ? (
              <p>Loading...</p>
            ) : notes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="mb-4">You haven't uploaded any notes yet</p>
                <Link to="/upload">
                  <Button>Upload Your First Note</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="flex justify-between items-center p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{note.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(note.created_at).toLocaleDateString()} • {note.file_type}
                      </p>
                    </div>
                    <Badge
                      variant={
                        note.status === 'approved'
                          ? 'default'
                          : note.status === 'rejected'
                          ? 'destructive'
                          : 'secondary'
                      }
                    >
                      {note.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
