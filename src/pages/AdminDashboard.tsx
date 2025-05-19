
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, FileText, BookOpen, User, Check, X, ArrowRight, Edit, Trash2, Eye } from 'lucide-react';
import { isAdminUser } from '@/lib/auth';
import { projects, categories, projectRequests, setProjects } from '@/lib/data';
import { Project, Category, ProjectRequest } from '@/types';

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

  // Project management states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [pendingPayments, setPendingPayments] = useState<ProjectRequest[]>(
    projectRequests.filter(request => request.paid && !request.completed)
  );
  
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

  // Add chapter to editing project
  const addChapterToEdit = () => {
    if (!editingProject?.chapters) return;
    
    setEditingProject({
      ...editingProject,
      chapters: [
        ...editingProject.chapters,
        { 
          id: `chap-${editingProject.chapters.length + 1}`, 
          title: `Chapter ${editingProject.chapters.length + 1}`, 
          content: '' 
        }
      ]
    });
  };
  
  // Update chapter content for new project
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

  // Update chapter content for editing project
  const updateEditChapter = (index: number, field: 'title' | 'content', value: string) => {
    if (!editingProject?.chapters) return;
    
    const updatedChapters = [...editingProject.chapters];
    updatedChapters[index] = {
      ...updatedChapters[index],
      [field]: value
    };
    
    setEditingProject({
      ...editingProject,
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

    const now = new Date().toISOString();
    const projectId = `project-${Math.random().toString(36).substring(2, 15)}`;
    
    const fullProject: Project = {
      id: projectId,
      title: newProject.title || '',
      description: newProject.description || '',
      price: newProject.price || 0,
      category: newProject.category || categories[0].id,
      featured: newProject.featured || false,
      chapters: newProject.chapters || [],
      createdAt: now
    };
    
    // Add the project to the projects array
    setProjects([...projects, fullProject]);
    
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

  // Handle edit project
  const handleEditProject = (project: Project) => {
    setEditingProject({...project});
    setShowEditDialog(true);
  };

  // Handle delete project
  const handleDeleteProject = (project: Project) => {
    setSelectedProject(project);
    setShowDeleteDialog(true);
  };

  // Confirm delete project
  const confirmDeleteProject = () => {
    if (selectedProject) {
      const updatedProjects = projects.filter(p => p.id !== selectedProject.id);
      setProjects(updatedProjects);
      
      toast({
        title: "Project deleted",
        description: "The project has been successfully deleted.",
      });
      
      setShowDeleteDialog(false);
      setSelectedProject(null);
    }
  };

  // Submit edited project
  const handleSubmitEditProject = () => {
    if (!editingProject) return;
    
    if (!editingProject.title || !editingProject.description || !editingProject.category) {
      toast({
        title: "Missing fields",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const updatedProjects = projects.map(p => 
      p.id === editingProject.id ? {...editingProject as Project} : p
    );
    
    setProjects(updatedProjects);
    
    toast({
      title: "Project updated",
      description: "The project has been successfully updated.",
    });
    
    setShowEditDialog(false);
    setEditingProject(null);
  };
  
  // Approve payment request
  const handleApproveRequest = (requestId: string) => {
    // Update the project request status
    const updatedRequests = projectRequests.map(req => 
      req.id === requestId ? {...req, completed: true} : req
    );
    
    // Update the pending payments list
    setPendingPayments(pendingPayments.filter(req => req.id !== requestId));
    
    toast({
      title: "Payment approved",
      description: "The payment has been approved and the user now has access to the project.",
    });
  };

  // Reject payment
  const handleRejectPayment = (requestId: string) => {
    // Update the project request status - mark as not paid
    const updatedRequests = projectRequests.map(req => 
      req.id === requestId ? {...req, paid: false} : req
    );
    
    // Update the pending payments list
    setPendingPayments(pendingPayments.filter(req => req.id !== requestId));
    
    toast({
      title: "Payment rejected",
      description: "The payment has been rejected.",
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
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="bg-muted inline-flex p-4 rounded-full mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-medium mb-2">No projects published yet</h2>
                    <p className="text-muted-foreground mb-6">
                      Create your first project by going to the "Publish New Project" tab.
                    </p>
                    <Button onClick={() => document.querySelector('[value="new-project"]')?.dispatchEvent(new Event('click'))}>
                      Create New Project
                    </Button>
                  </div>
                ) : (
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
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => handleEditProject(project)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() => handleDeleteProject(project)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                  {pendingPayments.length === 0 && projectRequests.filter(r => r.paid && !r.completed).length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-muted inline-flex p-4 rounded-full mb-4">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h2 className="text-xl font-medium mb-2">No pending payments</h2>
                      <p className="text-muted-foreground">
                        There are no project payments to review at this time.
                      </p>
                    </div>
                  ) : (
                    projectRequests.filter(r => r.paid && !r.completed).map(request => (
                      <div key={request.id} className="border rounded-md p-6">
                        <div className="flex flex-col sm:flex-row justify-between mb-4">
                          <div>
                            <h3 className="font-medium text-lg mb-1">
                              {request.projectTitle}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Requested by: {request.userEmail}
                            </p>
                            <Badge variant="default">
                              Payment Pending Approval
                            </Badge>
                          </div>
                          <div className="mt-4 sm:mt-0 text-sm text-muted-foreground">
                            Requested on: {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-2 mt-6">
                          <Button
                            onClick={() => handleApproveRequest(request.id)}
                            className="w-full sm:w-auto"
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Approve Payment
                          </Button>
                          <Button 
                            variant="destructive" 
                            className="w-full sm:w-auto"
                            onClick={() => handleRejectPayment(request.id)}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Reject Payment
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

      {/* Delete Project Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project
              "{selectedProject?.title}" and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProject}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Make changes to the project information below.
            </DialogDescription>
          </DialogHeader>

          {editingProject && (
            <div className="space-y-6 py-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Project Title</Label>
                  <Input 
                    id="edit-title" 
                    placeholder="Enter project title"
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({...editingProject, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea 
                    id="edit-description" 
                    placeholder="Enter project description"
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({...editingProject, description: e.target.value})}
                    required
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-price">Price (₦)</Label>
                    <Input 
                      id="edit-price" 
                      type="number"
                      min="0"
                      placeholder="Enter price in Naira"
                      value={editingProject.price || ''}
                      onChange={(e) => setEditingProject({...editingProject, price: Number(e.target.value)})}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select
                      value={editingProject.category}
                      onValueChange={(value) => setEditingProject({...editingProject, category: value})}
                    >
                      <SelectTrigger id="edit-category">
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
                    id="edit-featured"
                    checked={editingProject.featured}
                    onCheckedChange={(checked) => setEditingProject({...editingProject, featured: checked})}
                  />
                  <Label htmlFor="edit-featured">Feature this project on homepage</Label>
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
                    onClick={addChapterToEdit}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Chapter
                  </Button>
                </div>
                
                {editingProject.chapters?.map((chapter, index) => (
                  <div key={chapter.id} className="space-y-4 border rounded-md p-4">
                    <h4 className="font-medium">Chapter {index + 1}</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`edit-chapter-title-${index}`}>Title</Label>
                      <Input 
                        id={`edit-chapter-title-${index}`}
                        value={chapter.title}
                        onChange={(e) => updateEditChapter(index, 'title', e.target.value)}
                        placeholder="Chapter title"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`edit-chapter-content-${index}`}>Content</Label>
                      <Textarea 
                        id={`edit-chapter-content-${index}`}
                        value={chapter.content}
                        onChange={(e) => updateEditChapter(index, 'content', e.target.value)}
                        placeholder="Enter chapter content"
                        rows={6}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleSubmitEditProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
