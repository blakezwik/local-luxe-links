import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, Store, Calendar, CreditCard, MapPin, Building2 } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
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
                  Welcome back, {user?.full_name}!
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

        {/* Main Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden opacity-60">
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <Construction className="h-5 w-5 text-gray-400 animate-pulse" />
              <span className="text-sm text-gray-400">Under Construction</span>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl line-through text-gray-400">
                <Store className="h-6 w-6 text-[#FFD166] group-hover:scale-110 transition-transform" />
                Local Partnerships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Connect with local businesses and earn from guest bookings.</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden opacity-60">
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <Construction className="h-5 w-5 text-gray-400 animate-pulse" />
              <span className="text-sm text-gray-400">Under Construction</span>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl line-through text-gray-400">
                <Calendar className="h-6 w-6 text-[#FFD166] group-hover:scale-110 transition-transform" />
                Booking Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Track your bookings and partnership performance.</p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden opacity-60">
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <Construction className="h-5 w-5 text-gray-400 animate-pulse" />
              <span className="text-sm text-gray-400">Under Construction</span>
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl line-through text-gray-400">
                <CreditCard className="h-6 w-6 text-[#FFD166] group-hover:scale-110 transition-transform" />
                Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Monitor your earnings and payment history.</p>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Banner */}
        <Card className="bg-gradient-to-r from-[#177E89] to-[#1A9DAB] text-white mt-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Construction className="h-8 w-8 animate-bounce" />
                <div>
                  <h3 className="text-xl font-semibold">Exciting Features Coming Soon!</h3>
                  <p className="text-white/80">We're working on securing local partnerships and building tools to help you maximize your hosting revenue.</p>
                </div>
              </div>
              <span className="text-white/90 font-medium">Stay Tuned</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;