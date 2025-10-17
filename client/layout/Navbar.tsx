import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogOut, LogIn, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ThemeToggle } from './ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export default function Navbar() {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  const navLinks = (
    <>
      <Link to="/browse">
        <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-all duration-300 font-medium">
          Browse Notes
        </Button>
      </Link>
      
      {(userRole === 'staff' || userRole === 'admin') && (
        <>
          <Link to="/upload">
            <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-all duration-300 font-medium">
              Upload
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-all duration-300 font-medium">
              My Dashboard
            </Button>
          </Link>
        </>
      )}
      
      {userRole === 'admin' && (
        <Link to="/admin">
          <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-all duration-300 font-medium">
            Admin
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <nav className="border-b border-border/50 bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group">
            <div className="bg-gradient-accent p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold gradient-text">
              OpenNotes
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks}
            <ThemeToggle />
            {user ? (
              <Button onClick={handleSignOut} variant="outline" className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-300">
                <LogOut className="h-4 w-4" />
                <span className="hidden lg:inline">Sign Out</span>
              </Button>
            ) : (
              <Link to="/auth">
                <Button className="gap-2 bg-gradient-accent hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-elevated text-foreground">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden lg:inline">Sign In</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks}
                  {user ? (
                    <Button onClick={() => { handleSignOut(); setOpen(false); }} variant="outline" className="gap-2 w-full">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </Button>
                  ) : (
                    <Link to="/auth" onClick={() => setOpen(false)}>
                      <Button className="gap-2 w-full">
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
