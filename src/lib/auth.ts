
import { User } from '@/types';
import { adminUser } from './data';

// Mock user database
let users: User[] = [adminUser];
let currentUser: User | null = null;

export const getCurrentUser = () => {
  return currentUser;
};

export const signup = (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): User | null => {
  // Check if email already exists
  if (users.some(user => user.email === email)) {
    return null;
  }

  const newUser: User = {
    id: `user-${users.length + 1}`,
    firstName,
    lastName,
    email,
    isAdmin: false,
    purchasedProjects: []
  };

  users.push(newUser);
  currentUser = newUser;
  
  // Store in localStorage
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  
  return newUser;
};

export const login = (email: string, password: string): User | null => {
  const user = users.find(user => user.email === email);
  
  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return user;
  }
  
  return null;
};

export const logout = () => {
  currentUser = null;
  localStorage.removeItem('currentUser');
};

export const checkSession = (): User | null => {
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
    return currentUser;
  }
  return null;
};

export const addPurchasedProject = (userId: string, projectId: string): boolean => {
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return false;
  
  if (!users[userIndex].purchasedProjects.includes(projectId)) {
    users[userIndex].purchasedProjects.push(projectId);
    
    // If this is the current user, update currentUser and localStorage
    if (currentUser && currentUser.id === userId) {
      currentUser = users[userIndex];
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    return true;
  }
  
  return false;
};

// Admin check
export const isAdminUser = (): boolean => {
  return Boolean(currentUser?.isAdmin);
};
