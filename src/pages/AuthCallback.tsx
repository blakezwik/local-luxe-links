import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { handleAuthCallback } from "@/utils/authUtils";
import { LoadingState } from "@/components/auth/LoadingState";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        console.log("AuthCallback: Starting auth callback processing");
        const session = await handleAuthCallback(location.hash, navigate, toast);
        
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
        console.error("AuthCallback: Error processing callback:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
        });
        navigate("/");
      }
    };

    processAuthCallback();
  }, [navigate, toast, location.hash]);

  return <LoadingState />;
};

export default AuthCallback;