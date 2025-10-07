import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, FileType, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PDFPreviewDialog from './PDFPreviewDialog';

interface NoteCardProps {
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
  download_count: number;
}

export default function NoteCard({
  id,
  title,
  description,
  category,
  subject,
  unit,
  year,
  semester,
  department,
  question_paper_year,
  tags,
  file_path,
  file_type,
  created_at,
  download_count,
}: NoteCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const isPDF = file_type.toLowerCase() === 'pdf' || file_type.toLowerCase() === 'application/pdf';

  const handlePreview = () => {
    const { data } = supabase.storage
      .from('notes')
      .getPublicUrl(file_path);
    
    setPreviewUrl(data.publicUrl);
    setPreviewOpen(true);
  };

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
      
      // Increment download count in background
      supabase
        .from('notes')
        .update({ download_count: download_count + 1 })
        .eq('id', id)
        .then(({ error: updateError }) => {
          if (updateError) console.error('Failed to update download count:', updateError);
        });
      
      toast.success('Download started!');
    } catch (error) {
      toast.error('Failed to download file');
      console.error('Download error:', error);
    }
  };

  return (
    <Card className="bg-gradient-card shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col h-full">
      <CardHeader className="flex-grow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base sm:text-xl">{title}</CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              {subject && (
                <Badge variant="secondary">
                  {subject}
                </Badge>
              )}
              {department && (
                <Badge variant="outline">
                  {department}
                </Badge>
              )}
            </div>
          </div>
          <FileText className="h-6 w-6 text-primary" />
        </div>
        {description && (
          <CardDescription className="mt-2">{description}</CardDescription>
        )}
        <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
          {year && semester && (
            <span>Year {year} • Sem {semester}</span>
          )}
          {unit && (
            <span>• {unit}</span>
          )}
          {question_paper_year && (
            <span>• {question_paper_year} Paper</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
          <div className="flex gap-2 w-full sm:w-auto">
            {isPDF && (
              <Button onClick={handlePreview} size="sm" variant="outline" className="gap-2 flex-1 sm:flex-initial">
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </Button>
            )}
            <Button onClick={handleDownload} size="sm" className="gap-2 flex-1 sm:flex-initial">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">
            Uploaded {new Date(created_at).toLocaleDateString()}
          </p>
          {download_count > 0 && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Download className="h-3 w-3" />
              {download_count}
            </Badge>
          )}
        </div>
      </CardContent>

      <PDFPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        fileUrl={previewUrl}
        fileName={file_path.split('/').pop() || title}
        onDownload={() => {
          setPreviewOpen(false);
          handleDownload();
        }}
      />
    </Card>
  );
}
