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
    <div id="benefits" className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="sm:text-center">
          <h2 className="text-xl font-semibold leading-8 text-primary">
            Benefits
          </h2>
          <p className="mt-2 text-[42px] font-bold tracking-tight text-foreground sm:text-[42px]">
            Unlock a New Revenue Source Effortlessly
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-foreground">
            Our platform makes it easy to create additional revenue streams while enhancing your guests' experience.
          </p>
        </div>

        <div className="mt-20 max-w-lg sm:mx-auto md:max-w-none">
          <div className="grid grid-cols-1 gap-y-16 md:grid-cols-2 md:gap-x-12 md:gap-y-16">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative flex flex-col gap-6 sm:flex-row md:flex-col lg:flex-row"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-secondary text-white sm:shrink-0">
                  <feature.icon className="h-10 w-10" aria-hidden="true" />
                </div>
                <div className="sm:min-w-0 sm:flex-1">
                  <p className="text-xl font-semibold leading-8 text-foreground">
                    {feature.name}
                  </p>
                  <p className="mt-2 text-lg leading-7 text-foreground">
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
            className="animate-bounce"
          >
            <ChevronDown className="h-8 w-8 text-primary" />
          </Button>
        </div>
      </div>
    </div>
  );
};