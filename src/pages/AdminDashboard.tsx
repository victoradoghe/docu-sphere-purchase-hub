
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Plus, FileText, BookOpen, User, Check, X, ArrowRight } from 'lucide-react';
import { isAdminUser } from '@/lib/auth';
import { projects, categories, projectRequests } from '@/lib/data';
import { Project, Category } from '@/types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is admin
  useEffect(() => {
    if (!isAdminUser()) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [navigate, toast]);
  
  // New project form state
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    price: 0,
    category: '',
    featured: false,
    chapters: [
      { id: 'chap-1', title: 'Chapter 1', content: '' }
    ]
  });
  
  // Add chapter to form
  const addChapter = () => {
    if (!newProject.chapters) return;
    
    setNewProject({
      ...newProject,
      chapters: [
        ...newProject.chapters,
        { 
          id: `chap-${newProject.chapters.length + 1}`, 
          title: `Chapter ${newProject.chapters.length + 1}`, 
          content: '' 
        }
      ]
    });
  };
  
  // Update chapter content
  const updateChapter = (index: number, field: 'title' | 'content', value: string) => {
    if (!newProject.chapters) return;
    
    const updatedChapters = [...newProject.chapters];
    updatedChapters[index] = {
      ...updatedChapters[index],
      [field]: value
    };
    
    setNewProject({
      ...newProject,
      chapters: updatedChapters
    });
  };
  
  // Submit new project
  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProject.title || !newProject.description || !newProject.category) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Project published",
      description: "The project has been successfully published.",
    });
    
    // Reset form
    setNewProject({
      title: '',
      description: '',
      price: 0,
      category: '',
      featured: false,
      chapters: [
        { id: 'chap-1', title: 'Chapter 1', content: '' }
      ]
    });
  };
  
  // Approve project request
  const handleApproveRequest = (requestId: string) => {
    toast({
      title: "Request approved",
      description: "The project request has been approved and the user has been notified.",
    });
  };
  
  if (!isAdminUser()) return null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage your projects, requests, and users</p>
        
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="requests">Project Requests</TabsTrigger>
            <TabsTrigger value="new-project">Publish New Project</TabsTrigger>
          </TabsList>
          
          {/* Projects Tab */}
          <TabsContent value="projects">
            <Card>
              <CardHeader>
                <CardTitle>All Projects</CardTitle>
                <CardDescription>
                  Manage and edit published projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projects.map(project => (
                    <div 
                      key={project.id} 
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-md"
                    >
                      <div className="space-y-1 mb-4 sm:mb-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{project.title}</h3>
                          {project.featured && <Badge>Featured</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ₦{project.price.toLocaleString()} • {project.chapters.length} chapters
                        </p>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full sm:w-auto"
                          onClick={() => navigate(`/project/${project.id}`)}
                        >
                          View
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Project Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Project Requests</CardTitle>
                <CardDescription>
                  Review and manage user project requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projectRequests.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-muted inline-flex p-4 rounded-full mb-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h2 className="text-xl font-medium mb-2">No pending requests</h2>
                      <p className="text-muted-foreground">
                        There are no project requests to review at this time.
                      </p>
                    </div>
                  ) : (
                    projectRequests.map(request => (
                      <div key={request.id} className="border rounded-md p-6">
                        <div className="flex flex-col sm:flex-row justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-lg mb-1">
                              {request.projectTitle}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Requested by: {request.userEmail}
                            </p>
                            <Badge variant={request.paid ? "default" : "outline"}>
                              {request.paid ? "Paid" : "Pending Payment"}
                            </Badge>
                          </div>
                          <div className="mt-4 sm:mt-0 text-sm text-muted-foreground">
                            Requested on: {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2 mt-6">
                          <Button
                            onClick={() => handleApproveRequest(request.id)}
                            disabled={!request.paid || request.completed}
                            className="w-full sm:w-auto"
                          >
                            {request.completed ? (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Completed
                              </>
                            ) : (
                              'Mark as Complete'
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full sm:w-auto"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* New Project Tab */}
          <TabsContent value="new-project">
            <Card>
              <form onSubmit={handleSubmitProject}>
                <CardHeader>
                  <CardTitle>Publish New Project</CardTitle>
                  <CardDescription>
                    Create and publish a new project document
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="title">Project Title</Label>
                      <Input 
                        id="title" 
                        placeholder="Enter project title"
                        value={newProject.title}
                        onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Enter project description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                        required
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (₦)</Label>
                        <Input 
                          id="price" 
                          type="number"
                          min="0"
                          placeholder="Enter price in Naira"
                          value={newProject.price || ''}
                          onChange={(e) => setNewProject({...newProject, price: Number(e.target.value)})}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newProject.category}
                          onValueChange={(value) => setNewProject({...newProject, category: value})}
                        >
                          <SelectTrigger id="category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category: Category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={newProject.featured}
                        onCheckedChange={(checked) => setNewProject({...newProject, featured: checked})}
                      />
                      <Label htmlFor="featured">Feature this project on homepage</Label>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Chapters */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Chapters</h3>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={addChapter}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Chapter
                      </Button>
                    </div>
                    
                    {newProject.chapters?.map((chapter, index) => (
                      <div key={chapter.id} className="space-y-4 border rounded-md p-4">
                        <h4 className="font-medium">Chapter {index + 1}</h4>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`chapter-title-${index}`}>Title</Label>
                          <Input 
                            id={`chapter-title-${index}`}
                            value={chapter.title}
                            onChange={(e) => updateChapter(index, 'title', e.target.value)}
                            placeholder="Chapter title"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`chapter-content-${index}`}>Content</Label>
                          <Textarea 
                            id={`chapter-content-${index}`}
                            value={chapter.content}
                            onChange={(e) => updateChapter(index, 'content', e.target.value)}
                            placeholder="Enter chapter content"
                            rows={6}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">
                    Publish Project
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
