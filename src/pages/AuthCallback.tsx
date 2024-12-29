import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hashFragment = window.location.hash;
        if (!hashFragment) {
          console.error("No hash fragment found in URL");
          return;
        }

        // Parse the hash fragment
        const params = new URLSearchParams(hashFragment.substring(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        if (!accessToken || !refreshToken) {
          console.error("Missing tokens in URL");
          return;
        }

        // Set the session
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("Error setting session:", error);
          return;
        }

        // If this is a signup, navigate to dashboard
        if (type === "signup") {
          navigate("/dashboard");
        } else {
          // For other auth events, navigate to the home page
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