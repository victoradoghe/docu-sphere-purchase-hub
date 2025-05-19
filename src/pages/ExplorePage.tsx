
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/ProjectCard';
import CategoryFilter from '@/components/CategoryFilter';
import { Search } from 'lucide-react';
import { projects } from '@/lib/data';
import { Project } from '@/types';

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);
  
  useEffect(() => {
    // Update URL when category changes
    if (selectedCategory !== 'all') {
      searchParams.set('category', selectedCategory);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
    
    // Filter projects based on category and search query
    let filtered = [...projects];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(query) || 
        project.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredProjects(filtered);
  }, [selectedCategory, searchQuery, searchParams, setSearchParams]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Explore Projects</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No projects found</h2>
          <p className="text-muted-foreground mb-6">Try changing your search criteria or browse another category.</p>
          <Button onClick={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExplorePage;
