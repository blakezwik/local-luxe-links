import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export const DashboardHeader = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      setLoading(true);
      console.log("Dashboard: Starting sign out process");
      
      // Immediately navigate to force a fresh state
      navigate("/");
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Dashboard: Sign out error:", error);
        if (error.status === 403) {
          console.log("Dashboard: Session already expired");
          toast({
            title: "Signed out",
            description: "Your session has expired. Please sign in again if needed.",
          });
          return;
        }
        throw error;
      }
      
      console.log("Dashboard: Sign out successful");
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      
    } catch (error: any) {
      console.error("Dashboard: Sign out error:", error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again or refresh the page.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white h-16 flex justify-between items-center px-6 z-50 shadow-sm">
      <Link to="/" className="hover:opacity-80 transition-opacity">
        <h1 className="text-4xl text-[#177E89]" style={{ fontFamily: 'Bukhari Script' }}>
          GuestVibes
        </h1>
      </Link>
      <Button 
        onClick={handleSignOut}
        disabled={loading}
        className="bg-[#FFD166] text-black hover:bg-[#FFD166]/90 px-6 shadow-lg"
      >
        {loading ? "Signing out..." : "Sign Out"}
      </Button>
    </div>
  );
};