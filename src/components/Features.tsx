import { CircleDollarSign, Share2, Smile, Trophy, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    name: "Passive Income",
    description: "Earn commissions from guest purchases at local businesses",
    icon: CircleDollarSign,
  },
  {
    name: "Easy Sharing",
    description: "Simply share deals via links and promo codes, and we'll handle the rest",
    icon: Share2,
  },
  {
    name: "Happy Guests",
    description: "Provide exclusive deals and memorable local experiences",
    icon: Smile,
  },
  {
    name: "Local Impact",
    description: "Support and grow your local business community",
    icon: Trophy,
  },
];

export const Features = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="benefits" className="min-h-screen pt-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-6xl font-bold leading-8 text-[#177E89]">
            Benefits
          </h2>
          <p className="mt-8 text-2xl font-bold tracking-tight text-[#177E89] italic">
            Unlock a New Revenue Source Effortlessly
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-6 text-foreground">
            Our platform makes it easy to create additional revenue streams while enhancing your guests' experience.
          </p>
        </div>

        <div className="mt-8 max-w-lg sm:mx-auto md:max-w-none">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative flex flex-col items-center text-center gap-3 rounded-2xl bg-white p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#FFD166] text-white shadow-lg">
                  <feature.icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-lg font-semibold leading-7 text-foreground">
                    {feature.name}
                  </p>
                  <p className="mt-1 text-base leading-6 text-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-12">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => scrollToSection('how-it-works')}
            className="animate-bounce bg-[#FFD166] shadow-lg"
          >
            <ChevronDown className="h-8 w-8 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};