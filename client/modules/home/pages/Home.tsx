import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, Upload, Shield } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="text-6xl md:text-7xl font-bold mb-8 gradient-text leading-tight">
                Free Academic Notes for Everyone
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Access thousands of verified academic notes, study materials, and resources.
                <span className="block mt-2 font-semibold text-foreground">No signup required for browsing and downloading.</span>
              </p>
            </div>
            
            <div className="animate-slide-up flex gap-6 justify-center flex-wrap mb-16">
              <Link to="/browse">
                <Button size="lg" className="gap-3 px-8 py-6 text-lg hover-lift hover-glow bg-gradient-accent border-0 shadow-elevated text-foreground">
                  <Search className="h-6 w-6" />
                  Browse Notes
                </Button>
              </Link>
              <Link to="/upload">
                <Button size="lg" variant="outline" className="gap-3 px-8 py-6 text-lg hover-lift border-2 border-primary/20 hover:border-primary/40">
                  <Upload className="h-6 w-6" />
                  Contribute Notes
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text-accent mb-2">1000+</div>
                <div className="text-muted-foreground">Notes Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text-accent mb-2">500+</div>
                <div className="text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text-accent mb-2">50+</div>
                <div className="text-muted-foreground">Subjects Covered</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-secondary/20 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Why Choose OpenNotes?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're revolutionizing academic resource sharing with modern technology and user-friendly design.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="group bg-card p-8 rounded-2xl shadow-soft hover-lift border border-border/50">
              <div className="bg-gradient-accent w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text-accent">Free Access</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Browse and download all notes without creating an account. Education should be accessible to all, 
                and we believe in breaking down barriers to knowledge.
              </p>
            </div>

            <div className="group bg-card p-8 rounded-2xl shadow-soft hover-lift border border-border/50">
              <div className="bg-gradient-accent w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text-accent">Verified Content</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                All uploads are reviewed and approved by our expert admin team to ensure quality, accuracy, 
                and educational value for every student.
              </p>
            </div>

            <div className="group bg-card p-8 rounded-2xl shadow-soft hover-lift border border-border/50">
              <div className="bg-gradient-accent w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text-accent">Easy Upload</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Staff members can easily contribute notes with our intuitive upload system. 
                Simple process with automatic tracking and status updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students and educators sharing knowledge freely. 
              <span className="block mt-2 font-semibold text-foreground">Start exploring our vast collection today!</span>
            </p>
            <div className="flex gap-6 justify-center flex-wrap">
              <Link to="/browse">
                <Button size="lg" className="gap-3 px-8 py-6 text-lg hover-lift hover-glow bg-gradient-accent border-0 shadow-elevated text-foreground">
                  <Search className="h-6 w-6" />
                  Explore Notes Library
                </Button>
              </Link>
              <Link to="/upload">
                <Button size="lg" variant="outline" className="gap-3 px-8 py-6 text-lg hover-lift border-2 border-primary/20 hover:border-primary/40">
                  <Upload className="h-6 w-6" />
                  Start Contributing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
