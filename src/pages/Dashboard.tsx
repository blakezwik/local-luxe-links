import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Construction, Store, Calendar, CreditCard } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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
    <div className="min-h-screen bg-gradient-to-b from-[#FEF7CD] to-white">
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

      <div className="pt-24 px-4 max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8 border-l-4 border-[#FFD166]">
          <h2 className="text-3xl font-bold text-[#177E89] mb-2">
            Welcome, {user?.full_name}!
          </h2>
          <div className="flex items-center gap-2 text-gray-600">
            <Construction className="h-5 w-5 text-[#FFD166] animate-bounce" />
            <p className="text-lg">
              Your Host Dashboard is currently under construction. We're working hard to bring you amazing features soon!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-xl p-8 relative overflow-hidden group hover:scale-105 transition-transform duration-300 border-t-4 border-[#FFD166]">
            <div className="flex items-center gap-3 mb-4">
              <Store className="h-6 w-6 text-[#177E89]" />
              <h3 className="text-xl font-semibold text-[#177E89]">Local Partnerships</h3>
            </div>
            <p className="text-gray-500">Connect with local businesses and earn from guest bookings.</p>
            <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <Construction className="h-5 w-5 text-[#FFD166]" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8 relative overflow-hidden group hover:scale-105 transition-transform duration-300 border-t-4 border-[#FFD166]">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-6 w-6 text-[#177E89]" />
              <h3 className="text-xl font-semibold text-[#177E89]">Booking Analytics</h3>
            </div>
            <p className="text-gray-500">Track your bookings and partnership performance.</p>
            <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <Construction className="h-5 w-5 text-[#FFD166]" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8 relative overflow-hidden group hover:scale-105 transition-transform duration-300 border-t-4 border-[#FFD166]">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-6 w-6 text-[#177E89]" />
              <h3 className="text-xl font-semibold text-[#177E89]">Earnings</h3>
            </div>
            <p className="text-gray-500">Monitor your earnings and payment history.</p>
            <div className="absolute top-4 right-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <Construction className="h-5 w-5 text-[#FFD166]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;