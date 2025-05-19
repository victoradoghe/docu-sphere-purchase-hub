
import { User } from '@/types';
import { adminUser } from './data';
import { supabase } from '@/integrations/supabase/client';

// Mock user database
let users: User[] = [adminUser];
let currentUser: User | null = null;

export const getCurrentUser = () => {
  return currentUser;
};

export const signup = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string
): Promise<User | null> => {
  try {
    // Check if email already exists
    if (users.some(user => user.email === email)) {
      return null;
    }

    // Attempt to sign up using Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Signup error:", error.message);
      return null;
    }

    if (!data.user) return null;

    const newUser: User = {
      id: data.user.id,
      firstName,
      lastName,
      email,
      isAdmin: email === "Kyrain@admin.com", // Check if it's the admin email
      purchasedProjects: []
    };

    users.push(newUser);
    currentUser = newUser;
    
    // Store in localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    return newUser;
  } catch (error) {
    console.error("Signup error:", error);
    return null;
  }
};

export const login = async (email: string, password: string): Promise<User | null> => {
  try {
    // Check if it's the admin email (special case for demo)
    const isAdminEmail = email === "Kyrain@admin.com";
    
    // Attempt to sign in using Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      return null;
    }

    if (!data.user) return null;

    // For admin login in the demo
    if (isAdminEmail && password === "Kyrian@123") {
      currentUser = adminUser;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      return adminUser;
    }
    
    // For regular users in the mock system
    const user = users.find(user => user.email === email) || {
      id: data.user.id,
      firstName: email.split('@')[0],
      lastName: '',
      email,
      isAdmin: false,
      purchasedProjects: []
    };
    
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return user;
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

export const logout = async () => {
  try {
    await supabase.auth.signOut();
    currentUser = null;
    localStorage.removeItem('currentUser');
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const checkSession = async (): Promise<User | null> => {
  try {
    // First check localStorage for our mock session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      currentUser = JSON.parse(storedUser);
      return currentUser;
    }
    
    // Then check Supabase session
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      const email = data.session.user.email;
      
      // Check if it's admin
      if (email === "Kyrain@admin.com") {
        currentUser = adminUser;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return adminUser;
      }
      
      // For other users, create a basic user object
      const user = {
        id: data.session.user.id,
        firstName: email ? email.split('@')[0] : 'User',
        lastName: '',
        email: email || '',
        isAdmin: false,
        purchasedProjects: []
      };
      
      currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      return user;
    }
    
    return null;
  } catch (error) {
    console.error("Session check error:", error);
    return null;
  }
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
