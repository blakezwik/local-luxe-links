import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/DashboardHeader";
import { HostInfoCard } from "@/components/HostInfoCard";
import { ComingSoonBanner } from "@/components/ComingSoonBanner";
import { FeatureCards } from "@/components/FeatureCards";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkSession = async () => {
      console.log("Dashboard: Checking session");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("Dashboard: No session found, redirecting to home");
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Dashboard: Auth state changed:", event);
      if (event === 'SIGNED_OUT') {
        console.log("Dashboard: User signed out, redirecting to home");
        setUser(null);
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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

  const firstName = user?.full_name?.split(' ')[0] || '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <DashboardHeader />
      <div className="pt-24 px-4 max-w-7xl mx-auto">
        <HostInfoCard 
          firstName={firstName}
          city={user?.city}
          state={user?.state}
        />
        <ComingSoonBanner />
        <FeatureCards />
      </div>
    </div>
  );
};

export default Dashboard;