import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have a hash fragment
        const hashFragment = window.location.hash;
        if (hashFragment) {
          // Remove the # from the beginning
          const params = new URLSearchParams(hashFragment.substring(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");
          const type = params.get("type");

          if (accessToken && refreshToken) {
            console.log("Setting session with tokens from hash fragment");
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (error) {
              console.error("Error setting session:", error);
              throw error;
            }

            // If this is a signup, navigate to dashboard
            if (type === "signup") {
              console.log("Signup confirmed, redirecting to dashboard");
              navigate("/dashboard");
              return;
            }
          }
        }

        // If we don't have a hash fragment, check for query parameters
        const params = new URLSearchParams(window.location.search);
        const type = params.get("type");

        // For other auth events or if no hash/query params, navigate to home
        if (type === "signup") {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error in auth callback:", error);
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