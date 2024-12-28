import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Sign up",
    description: "Join our platform in seconds",
  },
  {
    id: "02",
    title: "Share",
    description: "Share exclusive local offerings to guests",
  },
  {
    id: "03",
    title: "Earn",
    description: "Get paid when guests book through your referrals",
  },
];

export const HowItWorks = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="how-it-works" className="bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">
            How It Works
          </h2>
          <p className="mt-2 text-[52px] font-bold tracking-tight text-foreground sm:text-[52px]">
            Start earning in three simple steps
          </p>
          <p className="mt-6 text-lg leading-8 text-foreground">
            Our platform makes it easy to create additional revenue streams while enhancing your guests' experience.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center text-center">
                <dt className="flex flex-col items-center gap-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary">
                    <span className="text-white text-2xl font-bold">{step.id}</span>
                  </div>
                  <span className="text-2xl font-semibold leading-7 text-foreground">{step.title}</span>
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-foreground">
                  <p className="flex-auto">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex justify-center mt-12">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => scrollToSection('cta')}
            className="animate-bounce"
          >
            <ChevronDown className="h-8 w-8 text-primary" />
          </Button>
        </div>
      </div>
    </div>
  );
};