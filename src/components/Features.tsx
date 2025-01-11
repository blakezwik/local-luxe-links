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
    <div id="benefits" className="min-h-screen pt-16 sm:pt-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl sm:text-6xl font-bold leading-8 text-[#177E89]">
            Benefits
          </h2>
          <p className="mt-6 sm:mt-8 text-xl sm:text-2xl font-bold tracking-tight text-[#177E89] italic">
            Unlock a New Revenue Source Effortlessly
          </p>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-3xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative flex flex-col items-center text-center gap-2 rounded-lg bg-white p-4 sm:p-6 lg:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 items-center justify-center rounded-lg bg-[#FFD166] text-white">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8" aria-hidden="true" />
                </div>
                <p className="text-sm sm:text-base lg:text-lg font-semibold text-foreground">
                  {feature.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 sm:mt-12">
          <div className="relative isolate overflow-hidden bg-[#177E89] px-4 py-4 sm:py-6 text-center shadow-lg sm:rounded-xl sm:px-6 max-w-lg mx-auto">
            <h2 className="mx-auto max-w-xl text-xl sm:text-2xl font-bold tracking-tight text-white">
              Ready to boost your hosting income?
            </h2>
            <p className="mx-auto mt-2 sm:mt-3 max-w-xl text-sm sm:text-base leading-6 text-white/90">
              Join thousands of hosts who are already earning passive income through local partnerships.
            </p>
            <div className="mt-4 sm:mt-5 flex items-center justify-center">
              <SignUpDialog>
                <Button size="default" className="bg-[#FFD166] text-black hover:bg-[#FFD166]/90 shadow-lg">
                  Get Started Now
                </Button>
              </SignUpDialog>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Button 
            onClick={scrollToTop}
            className="bg-[#FFD166] text-black hover:bg-[#FFD166]/90 shadow-lg"
          >
            Back to Top
          </Button>
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-3xl text-[#177E89]" style={{ fontFamily: 'Bukhari Script' }}>
            HostVibes
          </h1>
          <p className="mt-2 text-sm">
            Made with <span className="text-[#177E89]">❤</span>
          </p>
        </div>
      </div>
    </div>
  );
};