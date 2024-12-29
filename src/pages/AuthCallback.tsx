import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("AuthCallback: Starting auth callback handling");
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthCallback: Error getting session:", error);
          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: "There was a problem verifying your email. Please try again.",
          });
          navigate("/");
          return;
        }

        if (session) {
          console.log("AuthCallback: Active session found, redirecting to dashboard");
          toast({
            title: "Email Verified",
            description: "Your email has been verified successfully. Welcome!",
          });
          navigate("/dashboard");
          return;
        }

        console.log("AuthCallback: No valid session found, redirecting to home");
        toast({
          variant: "destructive",
          title: "Session Error",
          description: "No valid session found. Please try signing in again.",
        });
        navigate("/");
      } catch (error) {
        console.error("AuthCallback: Error in auth callback:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
        });
        navigate("/");
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-[#177E89]">Verifying your email...</h2>
        <p className="mt-2 text-gray-600">Please wait while we complete the process.</p>
      </div>
    </div>
  );
};

export default AuthCallback;