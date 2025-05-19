
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, FileText, BookOpen, ArrowRight } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import CategoryFilter from '@/components/CategoryFilter';
import { projects, categories } from '@/lib/data';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  
  // Get featured projects
  const featuredProjects = projects.filter(project => project.featured);
  
  // Filter projects by category for the categories section
  const getProjectsByCategory = (categoryId: string) => {
    return projects.filter(project => project.category === categoryId).slice(0, 3);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-brand-blue to-brand-teal py-16 md:py-24">
        <div className="container mx-auto px-4 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Discover Academic Project Documents
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Find high-quality project documents or request custom projects for your academic needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/explore')}
                className="bg-white text-brand-blue hover:bg-gray-100"
              >
                <Search className="mr-2 h-5 w-5" />
                Explore Projects
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/request-project')}
              >
                <FileText className="mr-2 h-5 w-5" />
                Request a Project
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Projects Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Featured Projects</h2>
            <Button variant="ghost" onClick={() => navigate('/explore')}>
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Browse by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.slice(0, 6).map(category => (
              <div key={category.id} className="bg-card rounded-lg overflow-hidden shadow-sm border">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{category.name}</h3>
                  <ul className="space-y-2 mb-6">
                    {getProjectsByCategory(category.id).map(project => (
                      <li key={project.id} className="flex justify-between items-center">
                        <span className="text-sm truncate">{project.title}</span>
                        <span className="text-sm font-medium">₦{project.price.toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/explore?category=${category.id}`)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    View All in {category.name}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Request Project Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-brand-teal to-brand-blue rounded-xl overflow-hidden">
            <div className="p-8 md:p-12 text-white">
              <div className="max-w-3xl">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Need a Specific Project?</h2>
                <p className="text-lg opacity-90 mb-6">
                  Can't find what you're looking for? Request a custom project document for a small fee of ₦4,000.
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-brand-blue hover:bg-gray-100"
                  onClick={() => navigate('/request-project')}
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Request Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
