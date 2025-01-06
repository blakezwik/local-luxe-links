import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/DashboardHeader";
import { HostInfoCard } from "@/components/HostInfoCard";
import { ComingSoonBanner } from "@/components/ComingSoonBanner";
import { FeatureCards } from "@/components/FeatureCards";
import { ContactDialog } from "@/components/ContactDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Dashboard: Checking session");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Dashboard: Session error:", sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log("Dashboard: No session found, redirecting to home");
          navigate("/");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("Dashboard: Profile fetch error:", profileError);
          throw profileError;
        }

        console.log("Dashboard: User profile loaded:", profile);
        setUser(profile);
        
      } catch (err: any) {
        console.error("Dashboard: Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#177E89]">Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#FFD166] text-black px-6 py-2 rounded-md hover:bg-[#FFD166]/90 transition-colors"
          >
            Try Again
          </button>
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
        <ContactDialog />
      </div>
    </div>
  );
};

export default Dashboard;