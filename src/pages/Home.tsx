import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, Upload, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Free Academic Notes for Everyone
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Access thousands of verified academic notes, study materials, and resources.
              No signup required for browsing and downloading.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/browse">
                <Button size="lg" className="gap-2">
                  <Search className="h-5 w-5" />
                  Browse Notes
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="gap-2">
                  <Upload className="h-5 w-5" />
                  Contribute Notes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose OpenNotes?</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-card p-6 rounded-lg shadow-soft">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Free Access</h3>
              <p className="text-muted-foreground">
                Browse and download all notes without creating an account. Education should be accessible to all.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-soft">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Content</h3>
              <p className="text-muted-foreground">
                All uploads are reviewed and approved by our admin team to ensure quality and accuracy.
              </p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-soft">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Upload</h3>
              <p className="text-muted-foreground">
                Staff members can easily contribute notes. Simple upload process with automatic tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students and educators sharing knowledge freely.
          </p>
          <Link to="/browse">
            <Button size="lg">Explore Notes Library</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
