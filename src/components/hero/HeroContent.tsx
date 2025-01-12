import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { SignUpDialog } from "../SignUpDialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroContentProps {
  isAuthenticated: boolean;
  onScrollToSection: (id: string) => void;
}

export const HeroContent = ({ isAuthenticated, onScrollToSection }: HeroContentProps) => {
  const isMobile = useIsMobile();

  const handleScroll = () => {
    const howItWorksSection = document.getElementById('how-it-works');
    if (howItWorksSection) {
      // Calculate header height (16 = 4rem for h-16)
      const headerHeight = 64; // 4rem = 64px
      const elementPosition = howItWorksSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d"
          alt="Luxury vacation home with purple sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
        <div className="space-y-6 sm:space-y-8">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.4)]">
            Earn More as a Host
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl sm:text-2xl md:text-3xl text-white/90 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]">
            Share local deals with your guests while earning passive income
          </p>

          <div className="flex flex-col items-center gap-8 sm:gap-12">
            {!isAuthenticated && (
              <SignUpDialog>
                <Button 
                  size={isMobile ? "default" : "lg"}
                  className={`
                    px-8 sm:px-14 
                    py-6 sm:py-8 
                    text-lg sm:text-xl 
                    bg-[#FFD166] 
                    text-black 
                    hover:bg-[#FFD166]/90 
                    shadow-2xl 
                    hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)] 
                    transition-all 
                    duration-200 
                    transform 
                    hover:-translate-y-1
                  `}
                >
                  Click Here, it's Free!
                </Button>
              </SignUpDialog>
            )}

            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleScroll}
              className="bg-[#FFD166] shadow-lg mt-8 sm:mt-12"
            >
              <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};