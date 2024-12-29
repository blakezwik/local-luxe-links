import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("AuthCallback: Starting auth callback handling");
        
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("AuthCallback: Active session found, redirecting to dashboard");
          navigate("/dashboard");
          return;
        }

        // If no session, check for tokens in the URL
        const hashFragment = window.location.hash;
        if (hashFragment) {
          console.log("AuthCallback: Found hash fragment, processing tokens");
          const params = new URLSearchParams(hashFragment.substring(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");
          
          if (accessToken && refreshToken) {
            console.log("AuthCallback: Setting session with tokens");
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error("AuthCallback: Error setting session:", error);
              throw error;
            }

            console.log("AuthCallback: Session set successfully, redirecting to dashboard");
            navigate("/dashboard");
            return;
          }
        }

        console.log("AuthCallback: No valid session or tokens found, redirecting to home");
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