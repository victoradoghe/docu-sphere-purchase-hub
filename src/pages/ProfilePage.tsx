
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { getCurrentUser, isAdminUser } from '@/lib/auth';
import { useTheme } from '@/context/ThemeContext';
import { User, Settings } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  
  const [user, setUser] = useState(getCurrentUser());
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);
  
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };
  
  const handleSaveChanges = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };
  
  if (!user) return null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Manage your account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center">
                    <h2 className="text-xl font-medium">{user.firstName} {user.lastName}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  
                  <div className="w-full space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => navigate('/profile/projects')}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      My Projects
                    </Button>
                    
                    {isAdminUser() && (
                      <Button 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => navigate('/admin')}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue={user.firstName} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue={user.lastName} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
                
                <Button onClick={handleSaveChanges}>
                  Save Changes
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Customize your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch 
                    id="dark-mode" 
                    checked={theme === 'dark'}
                    onCheckedChange={toggleTheme}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about your account and purchases
                    </p>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
