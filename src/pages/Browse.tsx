import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  download_count: number;
}

export default function Browse() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [departments, setDepartments] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12;
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
      
      // Extract unique departments
      const uniqueDepts = Array.from(new Set(data?.map(note => note.department).filter(Boolean))) as string[];
      setDepartments(uniqueDepts.sort());
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
    const matchesSearch = (
      note.title.toLowerCase().includes(query) ||
      note.description?.toLowerCase().includes(query) ||
      note.subject?.toLowerCase().includes(query) ||
      note.department?.toLowerCase().includes(query) ||
      note.unit?.toLowerCase().includes(query) ||
      note.question_paper_year?.toLowerCase().includes(query) ||
      note.tags?.some(tag => tag.toLowerCase().includes(query)) ||
      note.file_type.toLowerCase().includes(query)
    );

    const matchesDepartment = selectedDepartment === 'all' || note.department === selectedDepartment;
    const matchesYear = selectedYear === 'all' || note.year?.toString() === selectedYear;
    const matchesSemester = selectedSemester === 'all' || note.semester?.toString() === selectedSemester;

    return matchesSearch && matchesDepartment && matchesYear && matchesSemester;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSelectedDepartment('all');
    setSelectedYear('all');
    setSelectedSemester('all');
    setCurrentPage(1);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredNotes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedNotes = filteredNotes.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeCategory, selectedDepartment, selectedYear, selectedSemester]);

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
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8">
              <TabsTrigger value="all" className="text-xs sm:text-sm">All Notes</TabsTrigger>
              <TabsTrigger value="study_material" className="text-xs sm:text-sm">Study Material</TabsTrigger>
              <TabsTrigger value="question_paper" className="text-xs sm:text-sm">Question Papers</TabsTrigger>
              <TabsTrigger value="lab_manual" className="text-xs sm:text-sm">Lab Manuals</TabsTrigger>
            </TabsList>

            <TabsContent value={activeCategory} className="space-y-6">
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

              {/* Advanced Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                      <SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {paginatedNotes.map((note) => (
                      <NoteCard key={note.id} {...note} />
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="w-10"
                              >
                                {page}
                              </Button>
                            );
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-2">...</span>;
                          }
                          return null;
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
