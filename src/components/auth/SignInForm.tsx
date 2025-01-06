import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function SignInForm({ onSuccess }: { onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("SignInForm: Starting signin process");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("SignInForm: Signin error:", error.message);
        
        if (error.message.includes("Email not confirmed")) {
          toast({
            variant: "destructive",
            title: "Email Not Verified",
            description: "Please check your email and click the verification link before signing in.",
          });
          return;
        }

        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
        return;
      }

      console.log("SignInForm: Signin successful");
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      onSuccess();
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error("SignInForm: Signin error:", error);
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
    <form onSubmit={handleSignIn} className="space-y-4">
      <div className="flex justify-center mb-6">
        <span className="text-4xl text-[#177E89]" style={{ fontFamily: 'Bukhari Script' }}>
          GuestVibes
        </span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signinEmail">Email</Label>
        <Input
          id="signinEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signinPassword">Password</Label>
        <Input
          id="signinPassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-[#177E89] hover:bg-[#177E89]/90 text-white py-2 rounded-md"
        disabled={loading}
      >
        {loading ? "Processing..." : "Sign In"}
      </Button>
    </form>
  );
}