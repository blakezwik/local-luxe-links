import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Link, BarChart3, Library, Image } from "lucide-react";

export const FeatureCards = () => {
  const { toast } = useToast();

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
        className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden opacity-60 cursor-pointer"
        onClick={handleFeatureClick}
      >
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-400">
            <Library className="h-5 w-5 text-[#FFD166] group-hover:scale-110 transition-transform" />
            Browse/Select Local Experiences
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-gray-400 text-sm">Explore and choose local experiences</p>
          <p className="text-xs text-gray-400 mt-2">0/10 experiences selected</p>
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