import { Button } from "@/components/ui/button";
import { SignUpDialog } from "../SignUpDialog";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface TopBannerProps {
  isAuthenticated: boolean;
  onSignOut: () => Promise<void>;
}

export const TopBanner = ({ isAuthenticated, onSignOut }: TopBannerProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="fixed top-0 left-0 right-0 bg-white h-16 flex justify-between items-center px-4 sm:px-6 z-50 shadow-sm">
      <h1 className="text-2xl sm:text-4xl text-[#177E89]" style={{ fontFamily: 'Bukhari Script' }}>
        GuestVibes
      </h1>
      <div className="flex gap-2 sm:gap-4">
        {isAuthenticated ? (
          <>
            <Button 
              className="bg-[#FFD166] text-black hover:bg-[#FFD166]/90 px-3 sm:px-6 text-sm sm:text-base shadow-lg"
              onClick={() => navigate("/dashboard")}
            >
              {isMobile ? 'Dashboard' : 'Host Dashboard'}
            </Button>
            <Button 
              className="bg-[#177E89] text-white hover:bg-[#177E89]/90 px-3 sm:px-6 text-sm sm:text-base shadow-lg"
              onClick={onSignOut}
            >
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <SignUpDialog>
              <Button className="bg-[#FFD166] text-black hover:bg-[#FFD166]/90 px-3 sm:px-6 text-sm sm:text-base shadow-lg">
                {isMobile ? 'Join' : 'Click to Join'}
              </Button>
            </SignUpDialog>
            <SignUpDialog showSignIn>
              <Button className="bg-[#177E89] text-white hover:bg-[#177E89]/90 px-3 sm:px-6 text-sm sm:text-base shadow-lg">
                Sign In
              </Button>
            </SignUpDialog>
          </>
        )}
      </div>
    </div>
  );
};