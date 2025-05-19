
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  purchasedProjects: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  featured: boolean;
  chapters: Chapter[];
  createdAt: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface ProjectRequest {
  id: string;
  userId: string;
  userEmail: string;
  projectTitle: string;
  paid: boolean;
  completed: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface CartItem {
  projectId: string;
  project: Project;
}
