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
    <div id="benefits" className="min-h-screen pt-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="text-center">
          <h2 className="text-6xl font-bold leading-8 text-[#177E89]">
            Benefits
          </h2>
          <p className="mt-8 text-2xl font-bold tracking-tight text-[#177E89] italic">
            Unlock a New Revenue Source Effortlessly
          </p>
        </div>

        <div className="mt-8 max-w-lg sm:mx-auto md:max-w-none">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative flex flex-col items-center text-center gap-2 rounded-2xl bg-white p-3 sm:p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-[#FFD166] text-white shadow-lg">
                  <feature.icon className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
                </div>
                <p className="text-base sm:text-lg font-semibold leading-7 text-foreground">
                  {feature.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <div className="relative isolate overflow-hidden bg-[#177E89] px-4 py-12 text-center shadow-2xl sm:rounded-3xl sm:px-8 max-w-2xl mx-auto">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to boost your hosting income?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/90">
              Join thousands of hosts who are already earning passive income through local partnerships.
            </p>
            <div className="mt-10 flex items-center justify-center">
              <SignUpDialog>
                <Button size="lg" className="text-lg bg-[#FFD166] text-black hover:bg-[#FFD166]/90 shadow-lg">
                  Get Started Now
                </Button>
              </SignUpDialog>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-16">
          <Button 
            onClick={scrollToTop}
            className="bg-[#FFD166] text-black hover:bg-[#FFD166]/90 shadow-lg"
          >
            Back to Top
          </Button>
        </div>

        <div className="mt-12 text-center">
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