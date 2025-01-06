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
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card 
        className="group hover:shadow-xl transition-all duration-300 relative overflow-hidden opacity-60 cursor-pointer"
        onClick={handleFeatureClick}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-gray-400">
            <Library className="h-6 w-6 text-[#FFD166] group-hover:scale-110 transition-transform" />
            Browse/Select Local Experiences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Explore and choose local experiences</p>
          <p className="text-sm text-gray-400 mt-2">0/10 experiences selected</p>
        </CardContent>
      </Card>

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
            <Image className="h-6 w-6 text-[#FFD166] group-hover:scale-110 transition-transform" />
            My GuestVibes Page
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Customize your guest experience page with selected activities</p>
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
    </div>
  );
};