
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Eye } from 'lucide-react';
import { categories } from '@/lib/data';

interface ProjectCardProps {
  project: Project;
  showAddToCart?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, showAddToCart = true }) => {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-2">{project.title}</CardTitle>
          {project.featured && (
            <Badge variant="secondary" className="ml-2 shrink-0">Featured</Badge>
          )}
        </div>
        <div className="mt-1">
          <Badge variant="outline">{getCategoryName(project.category)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="py-3 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description}
        </p>
      </CardContent>
      <CardFooter className="pt-3 flex justify-between items-center">
        <div className="text-lg font-bold">₦{project.price.toLocaleString()}</div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="preview-button"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          
          {showAddToCart && (
            <Button
              variant={isInCart(project.id) ? "secondary" : "default"}
              onClick={(e) => {
                e.stopPropagation();
                if (!isInCart(project.id)) {
                  addToCart(project);
                } else {
                  navigate('/checkout');
                }
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {isInCart(project.id) ? "In Cart" : "Add to Cart"}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
