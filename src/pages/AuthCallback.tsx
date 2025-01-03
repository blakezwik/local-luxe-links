import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/auth/LoadingState";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        console.log("AuthCallback: Starting auth callback processing");
        
        // Parse the hash parameters
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const token = hashParams.get('access_token');
        const type = hashParams.get('type');

        console.log("AuthCallback: Parsed parameters:", { type });

        if (!token) {
          console.error("AuthCallback: No token found in URL");
          toast({
            variant: "destructive",
            title: "Error",
            description: "No verification token found. Please try signing up again.",
          });
          navigate("/");
          return;
        }

        if (type === 'signup') {
          console.log("AuthCallback: Processing signup verification");
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup',
          });

          if (error) {
            console.error("AuthCallback: Error verifying email:", error);
            toast({
              variant: "destructive",
              title: "Verification Failed",
              description: error.message,
            });
            navigate("/");
            return;
          }

          if (data?.session) {
            console.log("AuthCallback: Email verified successfully");
            toast({
              title: "Email Verified",
              description: "Your email has been verified successfully. Welcome!",
            });
            navigate("/dashboard");
            return;
          }
        }

        // If we get here, something unexpected happened
        console.error("AuthCallback: Unexpected state");
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try signing in again.",
        });
        navigate("/");
      } catch (error: any) {
        console.error("AuthCallback: Error processing callback:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "An unexpected error occurred. Please try again.",
        });
        navigate("/");
      }
    };

    processAuthCallback();
  }, [navigate, location.hash, toast]);

  return <LoadingState />;
};

export default AuthCallback;