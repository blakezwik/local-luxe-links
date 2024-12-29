import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LocationSelect } from "./LocationSelect";
import { useNavigate } from "react-router-dom";

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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            state: state,
            city: city,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.session) {
        console.log("SignUpForm: Signup successful with immediate session");
        toast({
          title: "Welcome to HostVibes!",
          description: "Your account has been created successfully.",
        });
        onSuccess();
        navigate('/dashboard');
      } else {
        console.log("SignUpForm: Signup successful, confirmation email sent");
        toast({
          title: "Check your email",
          description: "We sent you a confirmation link to complete your registration.",
        });
        // Redirect to dashboard even before email confirmation
        onSuccess();
        navigate('/dashboard');
      }
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
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signupEmail">Email</Label>
        <Input
          id="signupEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signupPassword">Password</Label>
        <Input
          id="signupPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      
      <div className="mt-6 mb-4">
        <h3 className="text-lg font-semibold text-[#177E89]">Rental Property Details</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <LocationSelect
          locations={locations}
          state={state}
          city={city}
          setState={setState}
          setCity={setCity}
        />
      </div>

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