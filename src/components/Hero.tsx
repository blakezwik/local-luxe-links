import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { SignUpDialog } from "./SignUpDialog";

export const Hero = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/lovable-uploads/b72bf377-9f73-4f6c-9aa1-ab06d4f962b7.png"
          alt="Modern interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Logo */}
      <div className="absolute top-0 left-0 p-4 z-10">
        <h1 className="text-3xl text-white" style={{ fontFamily: 'Bukhari Script' }}>
          HostVibes
        </h1>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
            <span className="block mb-2">Unlock Local Experiences</span>
            <span className="block text-primary">For Your Guests</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl text-white/90 sm:text-2xl">
            Connect your guests with exclusive local activities, dining, and events. Enhance their stay while earning passive income.
          </p>

          <div className="mt-8 flex justify-center">
            <SignUpDialog>
              <Button 
                size="lg" 
                className="px-14 py-7 text-xl bg-primary hover:bg-primary/90 shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
              >
                Start Earning Today
              </Button>
            </SignUpDialog>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => scrollToSection('benefits')}
            className="animate-bounce text-white hover:text-primary"
          >
            <ChevronDown className="h-8 w-8" />
          </Button>
        </div>
      </div>
    </div>
  );
};