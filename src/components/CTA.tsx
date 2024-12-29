import { Button } from "@/components/ui/button";
import { SignUpDialog } from "./SignUpDialog";

export const CTA = () => {
  return (
    <div id="cta" className="bg-white">
      <div className="mx-auto max-w-7xl py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="relative isolate overflow-hidden bg-[#177E89] px-4 py-12 text-center shadow-2xl sm:rounded-3xl sm:px-8 max-w-3xl mx-auto">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to boost your hosting income?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/90">
            Join thousands of hosts who are already earning passive income through local partnerships.
          </p>
          <div className="mt-10 flex items-center justify-center">
            <SignUpDialog>
              <Button size="lg" className="text-lg bg-white text-[#177E89] hover:bg-white/90">
                Get Started Now
              </Button>
            </SignUpDialog>
          </div>
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