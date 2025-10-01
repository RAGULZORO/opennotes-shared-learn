import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BookOpen, Upload, Settings, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Navbar() {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  return (
    <nav className="border-b bg-card shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">OpenNotes</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/browse">
              <Button variant="ghost">Browse Notes</Button>
            </Link>

            {user && userRole === 'staff' && (
              <Link to="/upload">
                <Button variant="ghost">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </Link>
            )}

            {user && userRole === 'admin' && (
              <>
                <Link to="/upload">
                  <Button variant="ghost">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button variant="ghost">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              </>
            )}

            {user ? (
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="default">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
