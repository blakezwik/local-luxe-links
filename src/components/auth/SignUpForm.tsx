import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { PersonalInfoForm } from "./forms/PersonalInfoForm";
import { PasswordForm } from "./forms/PasswordForm";
import { PropertyDetailsForm } from "./forms/PropertyDetailsForm";
import { handleSignUp } from "@/utils/signupUtils";

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await handleSignUp(email, password, fullName, state, city, navigate);
      onSuccess();
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
    <form onSubmit={onSubmit} className="space-y-4">
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