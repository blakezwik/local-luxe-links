import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log("SignIn: Starting signin process");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("SignIn: Signin error:", error.message);
        toast({
          variant: "destructive",
          title: "Error signing in",
          description: error.message,
        });
        return;
      }

      console.log("SignIn: Signin successful");
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error("SignIn: Signin error:", error);
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
    <div className="min-h-screen bg-gradient-to-b from-[#177E89]/10 to-white/5 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl text-[#177E89] mb-2" style={{ fontFamily: 'Bukhari Script' }}>
            GuestVibes
          </h1>
          <p className="text-gray-600">Welcome back! Please sign in to continue.</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-lg shadow-xl border border-white/20">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#177E89]">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border-[#177E89]/20 focus:border-[#177E89] text-[#177E89]"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#177E89]">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border-[#177E89]/20 focus:border-[#177E89] text-[#177E89]"
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#177E89] hover:bg-[#177E89]/90 text-white font-medium py-3"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;