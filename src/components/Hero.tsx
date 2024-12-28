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
        <h1 className="text-3xl text-primary" style={{ fontFamily: 'Bukhari Script' }}>
          HostVibes
        </h1>
        <SignUpDialog>
          <Button variant="ghost" className="text-primary hover:text-primary/90">
            Sign Up
          </Button>
        </SignUpDialog>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/lovable-uploads/b72bf377-9f73-4f6c-9aa1-ab06d4f962b7.png"
            alt="Modern interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" /> {/* Lighter overlay */}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
              <span className="block mb-2">Earn more as a host</span>
              <span className="block text-primary">from local partnerships</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-xl text-white/90 sm:text-2xl">
              Connect your guests with exclusive local activities, dining, and events. Enhance their stay while earning passive income.
            </p>

            <div className="flex flex-col items-center gap-8">
              <SignUpDialog>
                <Button 
                  size="lg" 
                  className="px-14 py-7 text-xl bg-primary hover:bg-primary/90 shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1"
                >
                  Start Earning Today
                </Button>
              </SignUpDialog>

              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => scrollToSection('benefits')}
                className="text-white hover:text-primary animate-bounce"
              >
                <ChevronDown className="h-8 w-8" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};