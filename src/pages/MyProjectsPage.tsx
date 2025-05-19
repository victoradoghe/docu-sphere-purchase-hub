
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, BookOpen } from 'lucide-react';
import { getCurrentUser } from '@/lib/auth';
import { projects } from '@/lib/data';
import { Project } from '@/types';

const MyProjectsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [purchasedProjects, setPurchasedProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      
      // Get purchased projects
      const userProjects = projects.filter(project => 
        currentUser.purchasedProjects.includes(project.id)
      );
      
      setPurchasedProjects(userProjects);
      setFilteredProjects(userProjects);
    }
  }, [navigate]);
  
  // Filter projects based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(purchasedProjects);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = purchasedProjects.filter(
        project => project.title.toLowerCase().includes(query)
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, purchasedProjects]);
  
  if (!user) return null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Projects</h1>
        
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search your projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="bg-muted inline-flex p-4 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-medium mb-2">No projects found</h2>
              
              {purchasedProjects.length === 0 ? (
                <>
                  <p className="text-muted-foreground mb-6">
                    You haven't purchased any projects yet. Explore our collection to find documents that match your needs.
                  </p>
                  <Button onClick={() => navigate('/explore')}>
                    Explore Projects
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground mb-6">
                    No projects match your search. Try with different keywords.
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredProjects.map(project => (
              <Card key={project.id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-grow p-6">
                    <h2 className="text-xl font-bold mb-2">{project.title}</h2>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <div className="text-sm bg-muted rounded px-2 py-1">
                        {project.chapters.length} chapters
                      </div>
                      <div className="text-sm bg-muted rounded px-2 py-1">
                        Purchased
                      </div>
                    </div>
                    <Button onClick={() => navigate(`/project/${project.id}`)}>
                      Read Project
                    </Button>
                  </div>
                  <div className="md:w-48 bg-muted p-6 flex flex-col justify-center items-center border-t md:border-t-0 md:border-l">
                    <div className="text-4xl font-bold mb-2">
                      {project.chapters.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Chapters
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjectsPage;
