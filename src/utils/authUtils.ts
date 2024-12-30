import { NavigateFunction } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast as Toast } from "@/hooks/use-toast";

export const handleAuthCallback = async (
  hash: string,
  navigate: NavigateFunction,
  toast: typeof Toast
) => {
  try {
    console.log("AuthCallback: Starting auth callback handling");
    
    // Check for error parameters in the URL hash
    const hashParams = new URLSearchParams(hash.substring(1));
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
      throw sessionError;
    }

    return session;
  } catch (error) {
    console.error("AuthCallback: Error in auth callback:", error);
    throw error;
  }
};