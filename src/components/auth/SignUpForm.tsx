import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LocationSelect } from "./LocationSelect";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from "@/components/ui/alert-dialog";
import { PartyPopper } from "lucide-react";

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
            city: city || null,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard`,
        },
      });

      if (error) throw error;

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

      <AlertDialog open={showSuccess} onOpenChange={(open) => {
        if (!open) {
          setShowSuccess(false);
          onSuccess();
        }
      }}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center flex flex-col items-center gap-4">
              <PartyPopper className="h-12 w-12 text-[#FFD166] animate-bounce" />
              <span className="text-2xl">Welcome to HostVibes!</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center pt-4">
              We've sent a confirmation link to your email address. Please check your inbox and click the link to verify your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center">
            <AlertDialogAction 
              className="bg-[#177E89] hover:bg-[#177E89]/90"
              onClick={() => {
                setShowSuccess(false);
                onSuccess();
              }}
            >
              Back to Home
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}