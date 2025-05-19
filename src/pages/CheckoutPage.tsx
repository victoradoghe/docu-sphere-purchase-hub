
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Trash2, ShoppingCart, CheckCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getCurrentUser, addPurchasedProject } from '@/lib/auth';
import { adminBankDetails } from '@/lib/data';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cart, removeFromCart, calculateTotal, clearCart } = useCart();
  
  const [isConfirming, setIsConfirming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const currentUser = getCurrentUser();
  
  const handleCheckout = () => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to complete your purchase.",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    setIsConfirming(true);
    
    setTimeout(() => {
      setIsConfirming(false);
      setIsComplete(true);
      
      // Add projects to user's purchased projects
      cart.forEach(item => {
        addPurchasedProject(currentUser.id, item.projectId);
      });
      
      toast({
        title: "Payment confirmed",
        description: "Thank you for your purchase. You now have access to the full documents.",
      });
      
      clearCart();
    }, 2000);
  };
  
  const totalAmount = calculateTotal();
  
  if (cart.length === 0 && !isComplete) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-muted inline-flex p-4 rounded-full mb-4">
            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">
            Browse our collection of academic projects to find documents that match your needs.
          </p>
          <Button onClick={() => navigate('/explore')}>
            Explore Projects
          </Button>
        </div>
      </div>
    );
  }
  
  if (isComplete) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-100 dark:bg-green-900/20 inline-flex p-4 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. You now have access to the full project documents.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/profile/projects')}>
              View My Projects
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Cart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div 
                      key={item.projectId} 
                      className="flex items-center justify-between py-4 border-b last:border-0"
                    >
                      <div>
                        <h3 className="font-medium">{item.project.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.project.chapters.length} chapters
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">
                          ₦{item.project.price.toLocaleString()}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeFromCart(item.projectId)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-border pt-4">
                    <span>Total</span>
                    <span>₦{totalAmount.toLocaleString()}</span>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Payment Information</h3>
                    <div className="bg-muted p-3 rounded-md text-sm space-y-1">
                      <div className="grid grid-cols-2 gap-1">
                        <span className="font-medium">Bank Name:</span>
                        <span>{adminBankDetails.bankName}</span>
                        <span className="font-medium">Account Number:</span>
                        <span>{adminBankDetails.accountNumber}</span>
                        <span className="font-medium">Account Name:</span>
                        <span>{adminBankDetails.accountName}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Make payment to the account above and click "Confirm Payment"
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  disabled={isConfirming}
                  onClick={handleCheckout}
                >
                  {isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Payment'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
