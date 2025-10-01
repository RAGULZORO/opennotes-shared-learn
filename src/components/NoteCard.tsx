import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, FileType } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NoteCardProps {
  id: string;
  title: string;
  description: string | null;
  subject: string | null;
  tags: string[] | null;
  file_path: string;
  file_type: string;
  created_at: string;
}

export default function NoteCard({
  title,
  description,
  subject,
  tags,
  file_path,
  file_type,
  created_at,
}: NoteCardProps) {
  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('notes')
        .download(file_path);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file_path.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Download started!');
    } catch (error) {
      toast.error('Failed to download file');
      console.error('Download error:', error);
    }
  };

  return (
    <Card className="bg-gradient-card shadow-soft hover:shadow-elevated transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{title}</CardTitle>
            {subject && (
              <Badge variant="secondary" className="mt-2">
                {subject}
              </Badge>
            )}
          </div>
          <FileText className="h-6 w-6 text-primary" />
        </div>
        {description && (
          <CardDescription className="mt-2">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {tags && tags.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <FileType className="h-3 w-3" />
              {file_type}
            </Badge>
          </div>
          <Button onClick={handleDownload} size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          Uploaded {new Date(created_at).toLocaleDateString()}
        </p>
      </CardContent>
    </Card>
  );
}
