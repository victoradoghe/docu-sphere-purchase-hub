
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { checkSession } from "@/lib/auth";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

import HomePage from "@/pages/HomePage";
import ExplorePage from "@/pages/ExplorePage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import RequestProjectPage from "@/pages/RequestProjectPage";
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ProfilePage from "@/pages/ProfilePage";
import MyProjectsPage from "@/pages/MyProjectsPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Check for saved user session on app load
  useEffect(() => {
    checkSession();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/project/:id" element={<ProjectDetailPage />} />
                    <Route path="/request-project" element={<RequestProjectPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profile/projects" element={<MyProjectsPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
