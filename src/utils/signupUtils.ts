import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { NavigateFunction } from "react-router-dom";

export const handleSignUp = async (
  email: string,
  password: string,
  fullName: string,
  state: string,
  city: string,
  navigate: NavigateFunction
) => {
  console.log("SignUpForm: Starting signup process");

  const { data: { session }, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        state: state,
        city: city || null,
      },
    }
  });

  if (error) {
    if (error.message.includes("User already registered")) {
      console.log("SignUpForm: User already exists, redirecting to sign in");
      toast({
        title: "Account Already Exists",
        description: "Please sign in with your existing account.",
        variant: "default",
      });
      navigate('/signin');
      return;
    }
    throw error;
  }
  
  if (!session) {
    throw new Error("No session created after signup");
  }

  console.log("SignUpForm: User account created successfully:", session);

  console.log("SignUpForm: Sending welcome email");
  const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
    body: { email, name: fullName }
  });

  if (emailError) {
    console.error("Error sending welcome email:", emailError);
  } else {
    console.log("SignUpForm: Welcome email sent successfully");
  }

  toast({
    title: "Welcome to GuestVibes!",
    description: "Your account has been created successfully.",
  });
  
  console.log("SignUpForm: Redirecting to dashboard");
  navigate('/dashboard');
};