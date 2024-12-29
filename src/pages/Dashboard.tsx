import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      setUser(profile);
      setShowPasswordForm(!profile?.password_hash);
      setLoading(false);
    };

    checkSession();
  }, [navigate]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
      });
      return;
    }

    setLoading(true);
    try {
      const { error: updateAuthError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateAuthError) throw updateAuthError;

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({
          password_hash: 'set',
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateProfileError) throw updateProfileError;

      setShowPasswordForm(false);
      toast({
        title: "Password set successfully",
        description: "You can now use your email and password to sign in.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* White Top Banner */}
      <div className="fixed top-0 left-0 right-0 bg-white h-16 flex justify-between items-center px-6 z-50 shadow-sm">
        <h1 className="text-4xl text-[#177E89]" style={{ fontFamily: 'Bukhari Script' }}>
          HostVibes
        </h1>
        <Button 
          onClick={async () => {
            await supabase.auth.signOut();
            navigate("/");
          }}
          className="bg-[#FFD166] text-black hover:bg-[#FFD166]/90 px-6 shadow-lg"
        >
          Sign Out
        </Button>
      </div>

      <div className="pt-24 px-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#177E89] mb-4">
            Welcome, {user?.full_name}!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for joining HostVibes! We're excited to have you on board and will contact you soon with more information about local partnership opportunities in your area.
          </p>

          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 mb-6">
              <div className="bg-[#177E89]/5 p-6 rounded-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="text-[#177E89]" />
                  <h3 className="text-lg font-semibold text-[#177E89]">Create Your Password</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#177E89] hover:bg-[#177E89]/90"
                    disabled={loading}
                  >
                    Set Password
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-[#177E89] mb-4">Coming Soon</h3>
            <p className="text-gray-600 mb-6">
              We're building something exciting! Soon you'll be able to:
            </p>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center gap-2">
                • Browse local partnership opportunities
              </li>
              <li className="flex items-center gap-2">
                • Connect with local businesses
              </li>
              <li className="flex items-center gap-2">
                • Manage your partnerships
              </li>
              <li className="flex items-center gap-2">
                • Track your earnings
              </li>
            </ul>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD166]/20 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#177E89]/10 rounded-full -ml-12 -mb-12" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;