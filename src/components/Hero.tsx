import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { TopBanner } from "./hero/TopBanner";
import { HeroContent } from "./hero/HeroContent";

export const Hero = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Hero: Checking authentication status");
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Hero: Auth state changed:", event);
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      console.log("Hero: Starting sign out process");
      setIsAuthenticated(false);
      
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error("Hero: Sign out error:", error);
        if (error.status === 403) {
          console.log("Hero: User not found, treating as successful sign out");
          toast({
            title: "Signed out",
            description: "You have been logged out successfully.",
          });
          return;
        }
      }
      
      console.log("Hero: Sign out successful");
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      
    } catch (error: any) {
      console.error("Hero: Sign out error:", error);
      setIsAuthenticated(false);
      toast({
        title: "Signed out",
        description: "You have been logged out successfully.",
      });
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen">
      <TopBanner 
        isAuthenticated={isAuthenticated} 
        onSignOut={handleSignOut}
      />
      <HeroContent 
        isAuthenticated={isAuthenticated}
        onScrollToSection={scrollToSection}
      />
    </div>
  );
};