import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LocationSelect } from "./LocationSelect";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { PartyPopper } from "lucide-react";
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
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("SignUpForm: Starting signup process");

    try {
      // Sign up the user with Supabase auth
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

      if (error) throw error;
      
      if (!session) {
        throw new Error("No session created after signup");
      }

      console.log("SignUpForm: User account created successfully:", session);

      // Send welcome email
      console.log("SignUpForm: Sending welcome email");
      const { error: emailError } = await supabase.functions.invoke('send-welcome-email', {
        body: { email, name: fullName }
      });

      if (emailError) {
        console.error("Error sending welcome email:", emailError);
      } else {
        console.log("SignUpForm: Welcome email sent successfully");
      }

      // Since email verification is disabled, we can show success immediately
      console.log("SignUpForm: Signup successful, showing success message");
      setShowSuccess(true);
      
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

  const handleSuccessClose = () => {
    console.log("SignUpForm: Starting success close handler");
    setShowSuccess(false);
    onSuccess();
    console.log("SignUpForm: Navigating to dashboard");
    navigate('/dashboard', { replace: true });
  };

  return (
    <>
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

        <div className="space-y-4">
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

      <AlertDialog open={showSuccess} onOpenChange={handleSuccessClose}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center flex flex-col items-center gap-4">
              <PartyPopper className="h-12 w-12 text-[#FFD166] animate-bounce" />
              <span className="text-2xl">Welcome to GuestVibes!</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Your account has been created successfully. Click continue to access your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction 
              className="bg-[#177E89] hover:bg-[#177E89]/90"
              onClick={handleSuccessClose}
            >
              Continue to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}