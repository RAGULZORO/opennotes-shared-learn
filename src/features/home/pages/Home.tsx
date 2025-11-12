import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Upload, Search, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">OpenNotes</h1>
          </div>
          <nav className="flex gap-4">
            <Link to="/browse">
              <Button variant="ghost">Browse Notes</Button>
            </Link>
            <Link to="/auth">
              <Button>Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Free Academic Notes for Everyone
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Access thousands of verified academic notes and study materials.
          Free browsing and downloads, no signup required.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/browse">
            <Button size="lg" className="gap-2">
              <Search className="h-5 w-5" />
              Browse Notes
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline" className="gap-2">
              <Upload className="h-5 w-5" />
              Upload Notes
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center space-y-4">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Free Access</h3>
            <p className="text-muted-foreground">
              Browse and download notes without registration
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Verified Content</h3>
            <p className="text-muted-foreground">
              All uploads are reviewed by admin team
            </p>
          </div>
          <div className="text-center space-y-4">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Easy Upload</h3>
            <p className="text-muted-foreground">
              Simple upload process for staff members
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
