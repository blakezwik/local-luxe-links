import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { PersonalInfoForm } from "./forms/PersonalInfoForm";
import { PasswordForm } from "./forms/PasswordForm";
import { PropertyDetailsForm } from "./forms/PropertyDetailsForm";

interface Location {
  state: string;
  state_code: string;
  city: string;
}

export function SignUpForm({ locations, onSuccess }: { locations: Location[], onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("SignUpForm: Starting signup process");

    try {
      console.log("SignUpForm: Creating user account with email:", email);
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
        // Handle user already exists error
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

      // Show success toast and redirect to dashboard
      toast({
        title: "Welcome to GuestVibes!",
        description: "Your account has been created successfully.",
      });
      
      console.log("SignUpForm: Redirecting to dashboard");
      navigate('/dashboard');
      
    } catch (error: any) {
      console.error("SignUpForm: Signup error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <PersonalInfoForm
        fullName={fullName}
        email={email}
        setFullName={setFullName}
        setEmail={setEmail}
      />
      
      <PasswordForm
        password={password}
        setPassword={setPassword}
      />
      
      <PropertyDetailsForm
        locations={locations}
        state={state}
        city={city}
        setState={setState}
        setCity={setCity}
      />

      <Button
        type="submit"
        className="w-full bg-[#177E89] hover:bg-[#177E89]/90"
        disabled={loading}
      >
        {loading ? "Processing..." : "Sign Up"}
      </Button>
    </form>
  );
}