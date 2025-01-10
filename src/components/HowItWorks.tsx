import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const steps = [
  {
    id: "1",
    title: "Sign up",
    description: "Join our platform in seconds",
  },
  {
    id: "2",
    title: "Share",
    description: "Share local deals to guests",
  },
  {
    id: "3",
    title: "Earn",
    description: "Earn when guests book",
  },
];

export const HowItWorks = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div id="how-it-works" className="min-h-screen pt-24 bg-background px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-4xl sm:text-6xl font-bold leading-tight sm:leading-8 tracking-tight text-[#177E89] mb-6">
            How It Works
          </h2>
          <p className="mt-4 sm:mt-8 text-xl sm:text-2xl font-bold tracking-tight text-[#177E89] italic">
            Start Earning in 3 Simple Steps
          </p>
        </div>
        <div className="mx-auto mt-12 sm:mt-16 max-w-2xl lg:mt-20 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-y-12 sm:gap-y-16 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center text-center">
                <dt className="flex flex-col items-center gap-y-4 sm:gap-y-6">
                  <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-lg bg-primary shadow-lg">
                    <span className="text-white text-2xl sm:text-3xl font-bold">{step.id}</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-semibold leading-7 text-foreground">{step.title}</span>
                </dt>
                <dd className="mt-3 sm:mt-4 flex flex-auto flex-col text-base sm:text-lg leading-6 text-foreground">
                  <p className="flex-auto">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex justify-center mt-12 sm:mt-16">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => scrollToSection('cta')}
            className="animate-bounce bg-[#FFD166] shadow-lg"
          >
            <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};