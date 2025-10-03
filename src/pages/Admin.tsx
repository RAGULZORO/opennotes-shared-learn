import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, FileText, ExternalLink, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  approved_at?: string | null;
  profiles: {
    name: string;
    email: string;
  } | null;
}

export default function Admin() {
  const [pendingNotes, setPendingNotes] = useState<PendingNote[]>([]);
  const [approvedNotes, setApprovedNotes] = useState<PendingNote[]>([]);
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
        fetchApprovedNotes();
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

  const fetchApprovedNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('status', 'approved')
        .order('approved_at', { ascending: false });

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
        
        setApprovedNotes(notesWithProfiles as any);
      } else {
        setApprovedNotes([]);
      }
    } catch (error) {
      toast.error('Failed to load approved notes');
      console.error('Error fetching approved notes:', error);
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
      fetchApprovedNotes();
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

  const handleDelete = async (noteId: string, filePath: string) => {
    if (!confirm('Are you sure you want to permanently delete this note? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete file from storage
      const { error: deleteError } = await supabase.storage
        .from('notes')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      // Delete record from database
      const { error: dbError } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

      if (dbError) throw dbError;

      toast.success('Note deleted successfully');
      fetchApprovedNotes();
    } catch (error) {
      toast.error('Failed to delete note');
      console.error('Delete error:', error);
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
      
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground mb-8">
            Manage and review notes
          </p>

          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="pending">
                Pending ({pendingNotes.length})
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved ({approvedNotes.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
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

                        <div className="flex flex-wrap gap-2 pt-4">
                          <Button
                            onClick={() => viewFile(note.file_path)}
                            variant="outline"
                            size="sm"
                            className="gap-2 flex-1 sm:flex-none"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="hidden sm:inline">View File</span>
                            <span className="sm:hidden">View</span>
                          </Button>
                          <Button
                            onClick={() => handleApprove(note.id)}
                            size="sm"
                            className="gap-2 flex-1 sm:flex-none"
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(note.id, note.file_path)}
                            variant="destructive"
                            size="sm"
                            className="gap-2 flex-1 sm:flex-none"
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
            </TabsContent>

            <TabsContent value="approved">
              {approvedNotes.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No approved notes</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    {approvedNotes.length} approved {approvedNotes.length === 1 ? 'note' : 'notes'}
                  </p>
                  
                  {approvedNotes.map((note) => (
                    <Card key={note.id} className="shadow-soft">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{note.title}</CardTitle>
                            <CardDescription className="mt-2">
                              Uploaded by {note.profiles?.name} ({note.profiles?.email})
                            </CardDescription>
                          </div>
                          <Badge>Approved</Badge>
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

                        <div className="flex flex-wrap gap-2 pt-4">
                          <Button
                            onClick={() => viewFile(note.file_path)}
                            variant="outline"
                            size="sm"
                            className="gap-2 flex-1 sm:flex-none"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span className="hidden sm:inline">View File</span>
                            <span className="sm:hidden">View</span>
                          </Button>
                          <Button
                            onClick={() => handleDelete(note.id, note.file_path)}
                            variant="destructive"
                            size="sm"
                            className="gap-2 flex-1 sm:flex-none"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Approved {new Date(note.approved_at || note.created_at).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
