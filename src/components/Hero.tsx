import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-background">
      <div className="absolute top-0 left-0 p-4">
        <h1 className="text-3xl text-primary" style={{ fontFamily: 'Bukhari Script' }}>
          HostVibes
        </h1>
      </div>
      <div className="mx-auto max-w-7xl">
        <div className="relative z-10 bg-background pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
          <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left space-y-8">
              <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl space-y-4">
                <span className="block mb-6">Earn More</span>
                <span className="block mb-6">as a</span>
                <span className="block text-primary">Host</span>
              </h1>
              <p className="text-xl text-foreground sm:mx-auto sm:mt-8 sm:max-w-xl sm:text-2xl md:mt-8 lg:mx-0">
                Get paid by simply referring your guests to premium local experiences!
              </p>
              <div className="mt-10 sm:mt-12 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button className="w-full px-10 py-4 text-xl bg-secondary hover:bg-secondary/90" size="lg">
                    Start Earning Today
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
          src="/lovable-uploads/b72bf377-9f73-4f6c-9aa1-ab06d4f962b7.png"
          alt="Modern minimalist interior with white walls, wooden furniture and plants"
        />
      </div>
    </div>
  );
};