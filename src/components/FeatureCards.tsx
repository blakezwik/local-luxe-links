import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link, BarChart3, Library, Image } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ExperienceGrid } from "./ExperienceGrid";

export const FeatureCards = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [activeCount, setActiveCount] = useState(0);
  const [showGrid, setShowGrid] = useState(false);

  const handleBrowseExperiences = async () => {
    try {
      setLoading(true);
      
      // Check if user is signed in
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Please sign in",
          description: "You need to be signed in to browse experiences.",
          duration: 3000,
        });
        return;
      }

      // Show loading toast
      toast({
        title: "Fetching Experiences",
        description: "Looking for popular experiences...",
        duration: null, // This makes it persist until we dismiss it
      });
      
      // Fetch experiences from Viator API via Edge Function
      const { data, error } = await supabase.functions.invoke('fetch-experiences', {
        body: {}  // No need to send state anymore
      });

      if (error) throw error;

      // Get existing active experiences for this host
      const { data: activeExperiences } = await supabase
        .from('host_experiences')
        .select('experience_id')
        .eq('host_id', session.user.id)
        .eq('is_active', true);

      const count = activeExperiences?.length || 0;
      setActiveCount(count);

      toast({
        title: data.experiences.length > 0 ? "Experiences Found" : "No Experiences Found",
        description: data.message,
        duration: 5000,
      });

      if (data.experiences.length > 0) {
        setExperiences(data.experiences);
        setShowGrid(true);

        toast({
          title: "Current Selection",
          description: `You have ${count}/10 experiences selected`,
          duration: 5000,
        });
      }

    } catch (error: any) {
      console.error('Error fetching experiences:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to fetch experiences. Please try again.",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureClick = () => {
    toast({
      title: "Coming Soon",
      description: "This feature is currently under development.",
      duration: 3000,
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card 
          className={`group hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer ${loading ? 'opacity-60' : ''}`}
          onClick={handleBrowseExperiences}
        >
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Library className="h-5 w-5 text-[#FFD166] group-hover:scale-110 transition-transform" />
              Browse Experiences
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm">Find popular experiences</p>
            <p className="text-xs text-gray-400 mt-2">Click to update your selection</p>
          </CardContent>
        </Card>

        <Card 
          className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden opacity-60 cursor-pointer"
          onClick={handleFeatureClick}
        >
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-400">
              <Link className="h-5 w-5 text-[#FFD166] group-hover:scale-110 transition-transform" />
              Generate Host Link
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-gray-400 text-sm">Share this with your guests</p>
          </CardContent>
        </Card>

        <Card 
          className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden opacity-60 cursor-pointer"
          onClick={handleFeatureClick}
        >
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-400">
              <Image className="h-5 w-5 text-[#FFD166] group-hover:scale-110 transition-transform" />
              My GV Page
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-gray-400 text-sm">Customize your guest experience page</p>
          </CardContent>
        </Card>

        <Card 
          className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden opacity-60 cursor-pointer"
          onClick={handleFeatureClick}
        >
          <CardHeader className="p-4">
            <CardTitle className="flex items-center gap-2 text-lg text-gray-400">
              <BarChart3 className="h-5 w-5 text-[#FFD166] group-hover:scale-110 transition-transform" />
              Account Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-gray-400 text-sm">View booking analytics and earnings</p>
          </CardContent>
        </Card>
      </div>

      {showGrid && experiences.length > 0 && (
        <ExperienceGrid 
          experiences={experiences} 
          activeCount={activeCount}
        />
      )}
    </>
  );
};
