import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("AuthCallback: Starting auth callback handling");
        
        // Check for error parameters in the URL hash
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const error = hashParams.get('error');
        const errorDescription = hashParams.get('error_description');

        if (error) {
          console.error("AuthCallback: Error in URL params:", error, errorDescription);
          
          if (error === 'access_denied' && hashParams.get('error_code') === 'otp_expired') {
            toast({
              variant: "destructive",
              title: "Link Expired",
              description: "Your verification link has expired. Please request a new one by signing in again.",
            });
            navigate("/");
            return;
          }

          toast({
            variant: "destructive",
            title: "Authentication Error",
            description: errorDescription || "There was a problem verifying your email. Please try again.",
          });
          navigate("/");
          return;
        }

        // Check for active session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("AuthCallback: Error getting session:", sessionError);
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
  }, [navigate, toast, location.hash]);

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