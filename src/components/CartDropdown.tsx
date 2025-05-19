
import React from 'react';
import { useCart } from '@/context/CartContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ShoppingCart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartDropdown = () => {
  const { cart, removeFromCart, calculateTotal } = useCart();
  const navigate = useNavigate();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Your Cart</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {cart.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Your cart is empty
          </div>
        ) : (
          <>
            <div className="max-h-60 overflow-y-auto">
              {cart.map((item) => (
                <DropdownMenuItem key={item.projectId} className="flex justify-between items-center">
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium truncate">{item.project.title}</p>
                    <p className="text-xs text-muted-foreground">₦{item.project.price.toLocaleString()}</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.projectId);
                    }}
                    className="h-6 w-6"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DropdownMenuItem>
              ))}
            </div>
            
            <DropdownMenuSeparator />
            
            <div className="p-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Total:</span>
                <span className="text-sm font-bold">₦{calculateTotal().toLocaleString()}</span>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => {
                  navigate('/checkout');
                }}
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CartDropdown;
