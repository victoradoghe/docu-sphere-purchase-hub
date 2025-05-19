
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { login, getCurrentUser } from '@/lib/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Redirect if already logged in
    if (getCurrentUser()) {
      navigate('/');
    }
  }, [navigate]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Attempt login
    setTimeout(() => {
      const user = login(email, password);
      
      if (user) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.firstName}!`,
        });
        
        // Redirect to home or admin dashboard
        if (user.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Note: For demo use the email 'admin@docusphere.com' to login as admin.",
          variant: "destructive"
        });
        setIsSubmitting(false);
      }
    }, 1000);
  };
  
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>Demo Admin Login:</p>
              <p>Email: admin@docusphere.com</p>
              <p>Password: any password will work</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button 
              type="submit" 
              className="w-full mb-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </Button>
            
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link 
                to="/signup" 
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
