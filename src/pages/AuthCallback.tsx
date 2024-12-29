import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("AuthCallback: Starting auth callback handling");
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("AuthCallback: Active session found, redirecting to dashboard");
          window.location.href = "/dashboard";
          return;
        }

        console.log("AuthCallback: No valid session found, redirecting to home");
        navigate("/");
      } catch (error) {
        console.error("AuthCallback: Error in auth callback:", error);
        navigate("/");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Setting up your account...</h2>
        <p className="mt-2 text-muted-foreground">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default AuthCallback;