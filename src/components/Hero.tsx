import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SignUpDialog } from "@/components/SignUpDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function Hero() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      setLoading(true);
      console.log("Hero: Starting sign out process");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Hero: Sign out error:", error);
        // If the error is due to invalid session, just redirect
        if (error.status === 403) {
          console.log("Hero: Invalid session detected, redirecting");
          navigate("/");
          return;
        }
        // For other errors, show toast
        toast({
          variant: "destructive",
          title: "Error signing out",
          description: error.message,
        });
        return;
      }

      console.log("Hero: Sign out successful");
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Hero: Unexpected error during sign out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Share local deals with your guests while earning passive income
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Connect with local businesses and share exclusive deals with your guests. Earn commissions while providing value to your guests.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <SignUpDialog>
              <Button className="bg-[#177E89] hover:bg-[#177E89]/90">
                Get Started
              </Button>
            </SignUpDialog>
            <SignUpDialog showSignIn>
              <Button variant="outline">
                Sign In
              </Button>
            </SignUpDialog>
          </div>
        </div>
      </div>
    </div>
  );
}