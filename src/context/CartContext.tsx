
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Project } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (project: Project) => void;
  removeFromCart: (projectId: string) => void;
  clearCart: () => void;
  calculateTotal: () => number;
  isInCart: (projectId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage on mount
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart data:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (project: Project) => {
    if (!isInCart(project.id)) {
      setCart(prevCart => [...prevCart, { projectId: project.id, project }]);
      toast({
        title: "Added to cart",
        description: `${project.title} has been added to your cart.`,
      });
    } else {
      toast({
        title: "Already in cart",
        description: `${project.title} is already in your cart.`,
        variant: "destructive"
      });
    }
  };

  const removeFromCart = (projectId: string) => {
    setCart(prevCart => prevCart.filter(item => item.projectId !== projectId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.project.price, 0);
  };

  const isInCart = (projectId: string) => {
    return cart.some(item => item.projectId === projectId);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      calculateTotal,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
