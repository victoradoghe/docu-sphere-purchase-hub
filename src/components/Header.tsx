
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, LogIn, Menu, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import CartDropdown from './CartDropdown';
import { getCurrentUser, logout, isAdminUser } from '@/lib/auth';
import { User } from '@/types';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = getCurrentUser();
    setUser(loggedInUser);
  }, [location]);
  
  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/');
  };
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="font-bold text-xl flex items-center">
            <span className="text-brand-blue">Docu</span>
            <span className="text-brand-teal">Sphere</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Home
          </Link>
          <Link 
            to="/explore" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/explore') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Explore
          </Link>
          <Link 
            to="/request-project" 
            className={`text-sm font-medium transition-colors hover:text-primary ${isActive('/request-project') ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Request Project
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <CartDropdown />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.firstName} {user.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile/projects')}>
                    My Projects
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={toggleTheme}>
                    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                  </DropdownMenuItem>
                  {isAdminUser() && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
              <Button size="sm" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </>
          )}
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-3 flex flex-col space-y-3">
            <Link 
              to="/" 
              className={`text-sm font-medium py-2 ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className={`text-sm font-medium py-2 ${isActive('/explore') ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link 
              to="/request-project" 
              className={`text-sm font-medium py-2 ${isActive('/request-project') ? 'text-primary' : 'text-muted-foreground'}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Request Project
            </Link>
            {user && (
              <>
                <Link 
                  to="/profile" 
                  className={`text-sm font-medium py-2 ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link 
                  to="/profile/projects" 
                  className={`text-sm font-medium py-2 ${isActive('/profile/projects') ? 'text-primary' : 'text-muted-foreground'}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Projects
                </Link>
                <Button 
                  variant="ghost" 
                  className="justify-start px-2" 
                  onClick={() => {
                    toggleTheme();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </Button>
                {isAdminUser() && (
                  <Link 
                    to="/admin" 
                    className={`text-sm font-medium py-2 ${isActive('/admin') ? 'text-primary' : 'text-muted-foreground'}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
