
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-muted py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">
              <span className="text-brand-blue">Docu</span>
              <span className="text-brand-teal">Sphere</span>
            </h3>
            <p className="text-muted-foreground text-sm">
              Your marketplace for academic project documents. Find, request, and purchase high-quality academic resources.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link to="/request-project" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Request a Project
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/explore?category=Computer%20Science" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Computer Science
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Business%20Administration" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Business Administration
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Engineering" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Engineering
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Medicine" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Medicine
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-base mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                Email: contact@docusphere.com
              </li>
              <li className="text-sm text-muted-foreground">
                Phone: +234 123 456 7890
              </li>
              <li className="text-sm text-muted-foreground">
                Address: Lagos, Nigeria
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} DocuSphere. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
