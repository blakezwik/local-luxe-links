import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link, BarChart3, Library, Image } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const FeatureCards = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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
        title: "Connecting to Viator API",
        description: "Fetching available experiences...",
        duration: null,
      });
      
      // Make request to Viator API via Edge Function
      const { data, error } = await supabase.functions.invoke('fetch-experiences', {
        body: {}
      });

      if (error) throw error;

      console.log('Viator API Response:', data);
      
      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
          duration: 5000,
        });
      } else {
        throw new Error(data.message || "Failed to fetch experiences");
      }

    } catch (error: any) {
      console.error('Error testing Viator API:', error);
      toast({
        variant: "destructive",
        title: "API Connection Failed",
        description: error.message || "Failed to connect to Viator API",
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
          <p className="text-sm">Connect to Viator API</p>
          <p className="text-xs text-gray-400 mt-2">
            {loading ? 'Connecting...' : 'Click to browse available experiences'}
          </p>
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
  );
};
