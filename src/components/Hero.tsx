import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { SignUpDialog } from "./SignUpDialog";

export const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen">
      {/* White Top Banner */}
      <div className="fixed top-0 left-0 right-0 bg-white h-16 flex justify-between items-center px-6 z-50 shadow-sm">
        <h1 className="text-4xl text-[#177E89]" style={{ fontFamily: 'Bukhari Script' }}>
          HostVibes
        </h1>
        <SignUpDialog>
          <Button className="bg-[#FFD166] text-black hover:bg-[#FFD166]/90 px-6 shadow-lg">
            Sign Up
          </Button>
        </SignUpDialog>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d"
            alt="Luxury vacation home with purple sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
          <div className="space-y-8">
            <h1 className="text-6xl font-bold tracking-tight text-white sm:text-7xl md:text-8xl drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">
              Earn More as a Host
            </h1>
            
            <p className="mx-auto max-w-2xl text-2xl text-white/90 sm:text-3xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
              Connect your guests with exclusive local activities, dining, and events. Enhance their stay while earning passive income.
            </p>

            <div className="flex flex-col items-center gap-8">
              <SignUpDialog>
                <Button 
                  size="lg" 
                  className="px-14 py-7 text-xl bg-[#FFD166] text-black hover:bg-[#FFD166]/90 shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
                >
                  Start Earning Today
                </Button>
              </SignUpDialog>

              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => scrollToSection('benefits')}
                className="animate-bounce bg-[#FFD166] shadow-lg"
              >
                <ChevronDown className="h-8 w-8 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};