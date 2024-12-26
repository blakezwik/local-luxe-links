import { Button } from "@/components/ui/button";

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
  return (
    <div className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">
            How It Works
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Start earning in three simple steps
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our platform makes it easy to create additional revenue streams while enhancing your guests' experience.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                    <span className="text-white text-lg">{step.id}</span>
                  </div>
                  {step.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};