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
    if (loading) return; // Prevent multiple clicks
    
    try {
      setLoading(true);
      console.log("Dashboard: Starting sign out process");
      
      // Navigate first to ensure UI is responsive
      navigate("/");
      
      // Then attempt to sign out
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Dashboard: Sign out error:", error);
        // Only show error toast if it's not a session_not_found error
        if (error.message !== "Session from session_id claim in JWT does not exist") {
          toast({
            variant: "destructive",
            title: "Error signing out",
            description: "Please try again.",
          });
          return;
        }
      }
      
      console.log("Dashboard: Sign out successful");
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      
    } catch (error: any) {
      console.error("Dashboard: Sign out error:", error);
      toast({
        title: "Signed out",
        description: "You have been logged out successfully.",
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