import { useState } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, ArrowLeft } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default function UploadNote() {
  const { user, loading, isStaff } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  if (!loading && !isStaff) {
    navigate('/auth');
    toast.error('Only staff members can upload notes');
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setUploading(true);

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('notes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Insert note record
      const { error: insertError } = await supabase.from('notes').insert({
        title,
        description,
        subject,
        file_path: filePath,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: user?.id,
        status: 'pending',
      });

      if (insertError) throw insertError;

      // Create notification for admins
      await supabase.from('notifications').insert({
        message: `New note uploaded: ${title}`,
        note_id: null,
      });

      toast.success('Note uploaded successfully! Awaiting admin approval.');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload note');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-6 w-6" />
              Upload Note
            </CardTitle>
            <CardDescription>
              Share your notes with the community. All uploads require admin approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Data Structures - Unit 1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the content..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">File *</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.txt"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Accepted formats: PDF, DOC, DOCX, TXT (Max 10MB)
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Note'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
