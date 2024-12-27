import { Button } from "@/components/ui/button";

export const CTA = () => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="relative isolate overflow-hidden bg-primary px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to boost your hosting income?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
            Join thousands of hosts who are already earning passive income through local partnerships.
          </p>
          <div className="mt-10 flex items-center justify-center">
            <Button size="lg" className="text-lg bg-secondary hover:bg-secondary/90">
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};