import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import NoteCard from '@/components/NoteCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Note {
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
}

export default function Browse() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      toast.error('Failed to load notes');
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterNotesByCategory = (category: string) => {
    if (category === 'all') return notes;
    return notes.filter(note => note.category === category);
  };

  const filteredNotes = filterNotesByCategory(activeCategory).filter((note) => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.description?.toLowerCase().includes(query) ||
      note.subject?.toLowerCase().includes(query) ||
      note.department?.toLowerCase().includes(query) ||
      note.unit?.toLowerCase().includes(query) ||
      note.question_paper_year?.toLowerCase().includes(query) ||
      note.tags?.some(tag => tag.toLowerCase().includes(query)) ||
      note.file_type.toLowerCase().includes(query)
    );
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'study_material': return 'Study Material';
      case 'question_paper': return 'Question Papers';
      case 'lab_manual': return 'Lab Manuals';
      default: return 'All Notes';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Browse Notes</h1>
          <p className="text-muted-foreground mb-8">
            Search through our collection of verified academic notes
          </p>

          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="all">All Notes</TabsTrigger>
              <TabsTrigger value="study_material">Study Material</TabsTrigger>
              <TabsTrigger value="question_paper">Question Papers</TabsTrigger>
              <TabsTrigger value="lab_manual">Lab Manuals</TabsTrigger>
            </TabsList>

            <TabsContent value={activeCategory} className="space-y-8">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder={`Search ${getCategoryLabel(activeCategory).toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 py-6 text-lg"
                />
              </div>

              {/* Notes Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading notes...</p>
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {searchQuery ? 'No notes found matching your search.' : `No ${getCategoryLabel(activeCategory).toLowerCase()} available yet.`}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-muted-foreground mb-4">
                    Found {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
                  </p>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNotes.map((note) => (
                      <NoteCard key={note.id} {...note} />
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
