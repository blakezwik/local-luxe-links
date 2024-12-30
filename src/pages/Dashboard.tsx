import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, BarChart3, UserCog, MapPin, Building2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      console.log("Dashboard: Checking session");
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

      console.log("Dashboard: User profile loaded:", profile);
      setUser(profile);
      setLoading(false);
    };

    checkSession();
  }, [navigate]);

  const handleFeatureClick = () => {
    toast({
      title: "Coming Soon",
      description: "This feature is currently under development.",
      duration: 3000,
    });
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

  // Extract first name from full name
  const firstName = user?.full_name?.split(' ')[0] || '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header Banner */}
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

      <div className="pt-24 px-4 max-w-7xl mx-auto">
        {/* Host Info Card */}
        <Card className="mb-8 bg-gradient-to-r from-[#FFD166]/10 to-white border-none shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#FFD166] rounded-full">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#177E89]">
                  Welcome back, {firstName}!
                </h2>
                {user?.city && user?.state && (
                  <p className="text-gray-600 flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {user.city}, {user.state}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Banner */}
        <Card className="bg-gradient-to-r from-[#177E89] to-[#1A9DAB] text-white mb-8 group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-between gap-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Sparkles className="h-8 w-8 text-[#FFD166] animate-pulse" />
                  <h3 className="text-2xl font-semibold">Stay Tuned!</h3>
                  <Sparkles className="h-8 w-8 text-[#FFD166] animate-pulse" />
                </div>
                <p className="text-white/90 text-lg leading-relaxed max-w-2xl mx-auto group-hover:text-white transition-colors duration-300">
                  We're working on securing local partnerships in your area.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden opacity-60 cursor-pointer"
            onClick={handleFeatureClick}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl text-gray-400">
                <Link className="h-6 w-6 text-[#FFD166] group-hover:scale-110 transition-transform" />
                Generate Host Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Share this with your guests</p>
            </CardContent>
          </Card>

          <Card 
            className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden opacity-60 cursor-pointer"
            onClick={handleFeatureClick}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl text-gray-400">
                <BarChart3 className="h-6 w-6 text-[#FFD166] group-hover:scale-110 transition-transform" />
                Account Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">View booking analytics and earnings</p>
            </CardContent>
          </Card>

          <Card 
            className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden opacity-60 cursor-pointer"
            onClick={handleFeatureClick}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl text-gray-400">
                <UserCog className="h-6 w-6 text-[#FFD166] group-hover:scale-110 transition-transform" />
                Manage Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">View/update your account details</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;