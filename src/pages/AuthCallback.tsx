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
        
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session) {
          console.error("AuthCallback: No session found");
          navigate("/");
          return;
        }

        // Send welcome email after successful verification
        console.log("AuthCallback: Sending welcome email");
        const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
          body: {
            email: session.user.email,
            name: session.user.user_metadata.full_name,
          },
        });

        if (emailError) {
          console.error("Error sending welcome email:", emailError);
          // Don't throw, we still want to redirect the user
        }

        // Get the next URL from search params
        const searchParams = new URLSearchParams(location.search);
        const next = searchParams.get('next') || '/dashboard';

        console.log("AuthCallback: Redirecting to", next);
        toast({
          title: "Email Verified",
          description: "Your email has been verified successfully. Welcome!",
        });
        navigate(next);
        
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
  }, [navigate, location.search, toast]);

  return <LoadingState />;
};

export default AuthCallback;