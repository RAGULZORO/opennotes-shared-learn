import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, FileText, ExternalLink } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PendingNote {
  id: string;
  title: string;
  description: string | null;
  category: string;
  subject: string | null;
  unit: string | null;
  year: number | null;
  semester: number | null;
  department: string | null;
  question_paper_year: string | null;
  tags: string[] | null;
  file_path: string;
  file_type: string;
  created_at: string;
  profiles: {
    name: string;
    email: string;
  } | null;
}

export default function Admin() {
  const [pendingNotes, setPendingNotes] = useState<PendingNote[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userRole, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/');
        toast.error('Please sign in to access this page');
      } else if (userRole && userRole !== 'admin') {
        navigate('/');
        toast.error('Admin access required');
      } else if (userRole === 'admin') {
        fetchPendingNotes();
      }
    }
  }, [user, userRole, authLoading, navigate]);

  const fetchPendingNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      // Fetch uploader profiles separately
      if (data && data.length > 0) {
        const uploaderIds = data.map(note => note.uploaded_by).filter(Boolean);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, name, email')
          .in('id', uploaderIds);
        
        const profilesMap = new Map(profilesData?.map(p => [p.id, p]) || []);
        
        const notesWithProfiles = data.map(note => ({
          ...note,
          profiles: note.uploaded_by ? profilesMap.get(note.uploaded_by) || null : null,
        }));
        
        setPendingNotes(notesWithProfiles as any);
      } else {
        setPendingNotes([]);
      }
    } catch (error) {
      toast.error('Failed to load pending notes');
      console.error('Error fetching pending notes:', error);
    } finally {
      setLoading(false);
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
      console.error('Approval error:', error);
    }
  };

  const handleReject = async (noteId: string, filePath: string) => {
    try {
      const { error: deleteError } = await supabase.storage
        .from('notes')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      const { error: updateError } = await supabase
        .from('notes')
        .update({ status: 'rejected' })
        .eq('id', noteId);

      if (updateError) throw updateError;

      toast.success('Note rejected and removed');
      fetchPendingNotes();
    } catch (error) {
      toast.error('Failed to reject note');
      console.error('Rejection error:', error);
    }
  };

  const viewFile = async (filePath: string) => {
    try {
      const { data } = supabase.storage
        .from('notes')
        .getPublicUrl(filePath);

      window.open(data.publicUrl, '_blank');
    } catch (error) {
      toast.error('Failed to open file');
      console.error('View file error:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground mb-8">
            Review and approve pending note uploads
          </p>

          {pendingNotes.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No pending notes to review</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <p className="text-muted-foreground">
                {pendingNotes.length} {pendingNotes.length === 1 ? 'note' : 'notes'} pending review
              </p>
              
              {pendingNotes.map((note) => (
                <Card key={note.id} className="shadow-soft">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{note.title}</CardTitle>
                        <CardDescription className="mt-2">
                          Uploaded by {note.profiles?.name} ({note.profiles?.email})
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {note.description && (
                      <p className="text-sm text-muted-foreground">{note.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      {note.category && (
                        <Badge variant="secondary">
                          {note.category === 'study_material' ? 'Study Material' : 
                           note.category === 'question_paper' ? 'Question Paper' : 'Lab Manual'}
                        </Badge>
                      )}
                      {note.subject && (
                        <Badge variant="outline">Subject: {note.subject}</Badge>
                      )}
                      {note.department && (
                        <Badge variant="outline">Dept: {note.department}</Badge>
                      )}
                      {note.year && note.semester && (
                        <Badge variant="outline">Year {note.year} • Sem {note.semester}</Badge>
                      )}
                      {note.unit && (
                        <Badge variant="outline">{note.unit}</Badge>
                      )}
                      {note.question_paper_year && (
                        <Badge variant="outline">{note.question_paper_year} Paper</Badge>
                      )}
                      {note.tags?.map((tag, idx) => (
                        <Badge key={idx} variant="outline">{tag}</Badge>
                      ))}
                      <Badge variant="outline">{note.file_type}</Badge>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button
                        onClick={() => viewFile(note.file_path)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View File
                      </Button>
                      <Button
                        onClick={() => handleApprove(note.id)}
                        size="sm"
                        className="gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(note.id, note.file_path)}
                        variant="destructive"
                        size="sm"
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </Button>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Submitted {new Date(note.created_at).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
