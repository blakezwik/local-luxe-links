import { CircleDollarSign, Share2, Smile, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SignUpDialog } from "./SignUpDialog";

const features = [
  {
    name: "Passive Income",
    icon: CircleDollarSign,
  },
  {
    name: "Easy Sharing",
    icon: Share2,
  },
  {
    name: "Happy Guests",
    icon: Smile,
  },
  {
    name: "Local Impact",
    icon: Trophy,
  },
];

export const Features = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="benefits" className="min-h-screen pt-4 sm:pt-12 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl sm:text-6xl font-bold leading-8 text-[#177E89]">
            Benefits
          </h2>
          <p className="mt-4 sm:mt-8 text-xl sm:text-2xl font-bold tracking-tight text-[#177E89] italic">
            Unlock a New Revenue Source Effortlessly
          </p>
        </div>

        <div className="mt-6 sm:mt-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative flex flex-col items-center text-center gap-1 sm:gap-2 p-2 sm:p-4"
              >
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 items-center justify-center rounded-full bg-[#FFD166] text-white hover:scale-110 transition-transform duration-300 p-4">
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10" aria-hidden="true" />
                </div>
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-foreground mt-1 sm:mt-2">
                  {feature.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 sm:mt-6">
          <div className="relative isolate overflow-hidden bg-[#177E89] px-4 py-4 sm:py-6 text-center shadow-lg sm:rounded-xl sm:px-6 max-w-lg mx-auto">
            <h2 className="mx-auto max-w-xl text-xl sm:text-2xl font-bold tracking-tight text-white">
              Boost your hosting income today
            </h2>
            <p className="mx-auto mt-2 sm:mt-3 max-w-xl text-sm sm:text-base leading-6 text-white/90">
              Join thousands of hosts who are already earning passive income
            </p>
            <div className="mt-3 sm:mt-5 flex items-center justify-center">
              <SignUpDialog>
                <Button size="default" className="bg-[#FFD166] text-black hover:bg-[#FFD166]/90 shadow-lg">
                  Get Started Now
                </Button>
              </SignUpDialog>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4 sm:mt-3">
          <Button 
            onClick={scrollToTop}
            className="bg-[#177E89] text-white hover:bg-[#177E89]/90 shadow-lg"
          >
            Back to Top
          </Button>
        </div>

        <div className="mt-4 sm:mt-3 text-center">
          <img 
            src="/lovable-uploads/9731e10d-fbda-4f16-8602-d938652f62e6.png" 
            alt="GuestVibes Logo" 
            className="h-40 w-40 sm:h-50 sm:w-50 mx-auto"
          />
          <p className="mt-2 text-sm">
            Made with <span className="text-[#177E89]">❤</span>
          </p>
        </div>
      </div>
    </div>
  );
};