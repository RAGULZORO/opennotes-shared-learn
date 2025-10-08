import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload as UploadIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const uploadSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().trim().max(1000).optional(),
  category: z.enum(['study_material', 'question_paper', 'lab_manual'], {
    required_error: 'Please select a category',
  }),
  subject: z.string().trim().min(1, 'Subject is required').max(100),
  unit: z.string().trim().max(50).optional(),
  year: z.number().min(1).max(4, 'Year must be between 1 and 4'),
  semester: z.number().min(1).max(8, 'Semester must be between 1 and 8'),
  department: z.string().trim().min(1, 'Department is required').max(100),
  question_paper_year: z.string().trim().max(50).optional(),
  tags: z.string().trim().max(500).optional(),
});

export default function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'study_material' | 'question_paper' | 'lab_manual' | ''>('');
  const [subject, setSubject] = useState('');
  const [unit, setUnit] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [department, setDepartment] = useState('');
  const [questionPaperYear, setQuestionPaperYear] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
      ];
      
      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error('Only PDF, DOCX, DOC, and TXT files are allowed');
        return;
      }
      
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const validation = uploadSchema.safeParse({
      title,
      description,
      category,
      subject,
      unit: unit || undefined,
      year: parseInt(year),
      semester: parseInt(semester),
      department,
      question_paper_year: questionPaperYear || undefined,
      tags,
    });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('notes')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const { data: noteData, error: insertError } = await supabase.from('notes').insert({
        title,
        description: description || null,
        category,
        subject,
        unit: unit || null,
        year: parseInt(year),
        semester: parseInt(semester),
        department,
        question_paper_year: questionPaperYear || null,
        tags: tagsArray.length > 0 ? tagsArray : null,
        file_path: fileName,
        file_type: fileExt || 'unknown',
        file_size: file.size,
        uploaded_by: user?.id,
        status: 'pending',
      }).select().single();

      if (insertError) throw insertError;

      // Create notification for admins
      if (noteData) {
        await supabase.from('notifications').insert({
          user_id: user?.id,
          note_id: noteData.id,
          message: `New note uploaded: "${title}" by ${user?.email}`,
        });
      }

      toast.success('Note uploaded successfully! Waiting for admin approval.');
      
      setTitle('');
      setDescription('');
      setCategory('');
      setSubject('');
      setUnit('');
      setYear('');
      setSemester('');
      setDepartment('');
      setQuestionPaperYear('');
      setTags('');
      setFile(null);
      
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      toast.error('Failed to upload note: ' + error.message);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">Upload Notes</h1>
          <p className="text-muted-foreground mb-8">
            Share your notes with the community. All uploads require admin approval.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Note Details</CardTitle>
              <CardDescription>
                Fill in the information about your note
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., Introduction to Calculus"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the note content"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="study_material">Study Material</option>
                    <option value="question_paper">Question Paper</option>
                    <option value="lab_manual">Lab Manual</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject Name *</Label>
                  <Input
                    id="subject"
                    type="text"
                    placeholder="e.g., Mathematics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                {category === 'study_material' && (
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      type="text"
                      placeholder="e.g., Unit 1, Unit 2"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    />
                  </div>
                )}

                {category && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="year">Year *</Label>
                      <select
                        id="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      >
                        <option value="">Select year</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester *</Label>
                      <select
                        id="semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        required
                      >
                        <option value="">Select semester</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <option key={sem} value={sem}>{sem}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Input
                        id="department"
                        type="text"
                        placeholder="e.g., Computer Science, Mechanical"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                {category === 'question_paper' && (
                  <div className="space-y-2">
                    <Label htmlFor="question_paper_year">Question Paper Year</Label>
                    <Input
                      id="question_paper_year"
                      type="text"
                      placeholder="e.g., 2023, 2022"
                      value={questionPaperYear}
                      onChange={(e) => setQuestionPaperYear(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    type="text"
                    placeholder="e.g., calculus, derivatives, limits"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-upload">File * (PDF, DOCX, DOC, TXT - Max 10MB)</Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    required
                  />
                  {file && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full gap-2" disabled={uploading}>
                  <UploadIcon className="h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload Note'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
