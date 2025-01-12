import { FeatureCards } from "./FeatureCards";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";

export const Features = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerHeight = 64;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div id="benefits" className="min-h-screen bg-background pt-8 lg:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-8 lg:mb-12">
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#177E89] mb-4">
            Benefits
          </h2>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-[#177E89] italic">
            Why Choose GuestVibes?
          </p>
        </div>
        
        <FeatureCards />
        
        <div className="flex justify-center mt-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollToSection('cta')}
            className="bg-[#FFD166] shadow-lg"
          >
            <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};