
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Lock, Unlock } from 'lucide-react';
import { projects, categories } from '@/lib/data';
import { Project } from '@/types';
import { useCart } from '@/context/CartContext';
import { getCurrentUser } from '@/lib/auth';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  
  useEffect(() => {
    // Find project by id
    const foundProject = projects.find(p => p.id === id);
    setProject(foundProject || null);
    setLoading(false);
    
    // Check if user has access to this project
    const currentUser = getCurrentUser();
    if (currentUser && foundProject) {
      setHasAccess(currentUser.purchasedProjects.includes(foundProject.id));
    }
  }, [id]);
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p>Loading project details...</p>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or may have been removed.</p>
          <Button onClick={() => navigate('/explore')}>
            Browse Projects
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">{getCategoryName(project.category)}</Badge>
            {project.featured && <Badge>Featured</Badge>}
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{project.description}</p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
            <div className="text-2xl font-bold">₦{project.price.toLocaleString()}</div>
            
            {!hasAccess && (
              <Button
                size="lg"
                variant={isInCart(project.id) ? "secondary" : "default"}
                onClick={() => {
                  if (!isInCart(project.id)) {
                    addToCart(project);
                  } else {
                    navigate('/checkout');
                  }
                }}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isInCart(project.id) ? "Go to Checkout" : "Add to Cart"}
              </Button>
            )}
          </div>
        </div>
        
        {/* Chapter Tabs */}
        <Tabs defaultValue="chapter-1">
          <TabsList className="grid grid-cols-4 mb-6">
            {project.chapters.slice(0, 4).map((chapter, index) => (
              <TabsTrigger 
                key={chapter.id} 
                value={`chapter-${index + 1}`}
                disabled={index > 0 && !hasAccess}
              >
                {`Chapter ${index + 1}`}
                {index > 0 && !hasAccess && <Lock className="ml-2 h-3 w-3" />}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {project.chapters.slice(0, 4).map((chapter, index) => (
            <TabsContent key={chapter.id} value={`chapter-${index + 1}`}>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">{chapter.title}</h3>
                  
                  {(index === 0 || hasAccess) ? (
                    <div className="prose prose-sm max-w-none">
                      {chapter.content.split('\n\n').map((paragraph, i) => (
                        <p key={i} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h4 className="text-lg font-medium mb-2">Chapter Locked</h4>
                      <p className="text-muted-foreground mb-6">
                        Purchase this project to unlock all chapters.
                      </p>
                      <Button 
                        variant={isInCart(project.id) ? "secondary" : "default"}
                        onClick={() => {
                          if (!isInCart(project.id)) {
                            addToCart(project);
                          } else {
                            navigate('/checkout');
                          }
                        }}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {isInCart(project.id) ? "Go to Checkout" : "Add to Cart"}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        
        {/* Access status */}
        <div className="mt-8 p-4 bg-muted rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            {hasAccess ? (
              <>
                <Unlock className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">You have full access to this project</span>
              </>
            ) : (
              <>
                <Lock className="h-5 w-5 text-muted-foreground mr-2" />
                <span className="text-sm font-medium">Only Chapter 1 is available as preview</span>
              </>
            )}
          </div>
          
          {!hasAccess && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                if (!isInCart(project.id)) {
                  addToCart(project);
                }
                navigate('/checkout');
              }}
            >
              Purchase Now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
