import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export const ComingSoonBanner = () => {
  return (
    <Card className="bg-gradient-to-r from-[#177E89] to-[#1A9DAB] text-white mb-6 group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1">
      <CardContent className="p-4 sm:p-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:gap-6">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-4">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-[#FFD166] animate-pulse" />
              <h3 className="text-xl sm:text-2xl font-semibold">Stay Tuned!</h3>
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-[#FFD166] animate-pulse" />
            </div>
            <p className="text-white/90 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto group-hover:text-white transition-colors duration-300">
              We're working on securing local partnerships in your area.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};