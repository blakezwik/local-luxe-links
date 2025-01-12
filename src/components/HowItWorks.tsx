import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const steps = [
  {
    id: "1",
    title: "Sign up",
    description: "Join for free in seconds",
  },
  {
    id: "2",
    title: "Share",
    description: "Share your link with guests",
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
    if (element) {
      const offset = element.offsetTop - 50;
      window.scrollTo({
        top: offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div id="how-it-works" className="min-h-screen pt-12 bg-background px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl sm:text-6xl font-bold leading-tight sm:leading-8 tracking-tight text-[#177E89] mb-4">
            How It Works
          </h2>
          <p className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold tracking-tight text-[#177E89] italic">
            Start Earning in 3 Simple Steps
          </p>
        </div>
        <div className="mx-auto mt-4 sm:mt-8 max-w-2xl lg:mt-12 lg:max-w-none">
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center text-center">
                <dt className="flex flex-col items-center gap-y-2">
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary hover:scale-110 transition-transform duration-300 animate-float p-4">
                    <span className="text-black text-xl sm:text-3xl font-bold">{step.id}</span>
                  </div>
                  <span className="text-base sm:text-2xl font-semibold leading-7 text-foreground mt-2">{step.title}</span>
                </dt>
                <dd className="mt-1 flex flex-auto flex-col text-sm sm:text-lg leading-6 text-foreground">
                  <p className="flex-auto">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="flex justify-center mt-6 sm:mt-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => scrollToSection('benefits')}
            className="animate-bounce bg-[#FFD166] shadow-lg"
          >
            <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};