
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { adminBankDetails } from '@/lib/data';
import { getCurrentUser } from '@/lib/auth';

const RequestProjectPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [projectTitle, setProjectTitle] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  
  const currentUser = getCurrentUser();
  
  // Pre-fill email if user is logged in
  React.useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectTitle.trim()) {
      toast({
        title: "Missing project title",
        description: "Please enter a title for the project you're requesting.",
        variant: "destructive"
      });
      return;
    }
    
    if (!email.trim()) {
      toast({
        title: "Missing email",
        description: "Please provide an email where we can contact you.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsConfirmingPayment(true);
    }, 1500);
  };
  
  const handlePaymentConfirmation = () => {
    toast({
      title: "Request Submitted",
      description: "Your project request has been submitted. We will notify you when it's available.",
    });
    
    // Redirect to home page
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Request a Project</h1>
        <p className="text-muted-foreground mb-8">
          Can't find what you're looking for? Request a specific project for a fee of ₦4,000.
        </p>
        
        {!isConfirmingPayment ? (
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Project Request Form</CardTitle>
                <CardDescription>
                  Fill in the details of the project you need. Our team will review your request and notify you when it's available.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectTitle">Project Title</Label>
                  <Input
                    id="projectTitle"
                    placeholder="e.g., Impact of Artificial Intelligence on Healthcare"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={!!currentUser}
                  />
                  {currentUser && (
                    <p className="text-xs text-muted-foreground">
                      Using email from your account.
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Project Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide any additional details about the project you're requesting..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>
                To submit your project request, please make a payment of ₦4,000 to the account below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm font-medium">Bank Name:</div>
                  <div className="text-sm">{adminBankDetails.bankName}</div>
                  
                  <div className="text-sm font-medium">Account Number:</div>
                  <div className="text-sm">{adminBankDetails.accountNumber}</div>
                  
                  <div className="text-sm font-medium">Account Name:</div>
                  <div className="text-sm">{adminBankDetails.accountName}</div>
                  
                  <div className="text-sm font-medium">Amount:</div>
                  <div className="text-sm font-bold">₦4,000</div>
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-semibold mb-2">Important Information:</h3>
                <ul className="text-sm space-y-1">
                  <li>• Make the payment using your bank app or USSD code.</li>
                  <li>• Use your name as reference when making the payment.</li>
                  <li>• After payment, click the button below to confirm.</li>
                  <li>• Our admin will verify and process your request within 24 hours.</li>
                  <li>• You will be notified via email when your project is ready.</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button 
                className="w-full mb-2"
                onClick={handlePaymentConfirmation}
              >
                I've Made the Payment
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setIsConfirmingPayment(false)}
              >
                Go Back
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RequestProjectPage;
