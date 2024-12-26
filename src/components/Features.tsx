import { CircleDollarSign, Share2, Smile, Trophy } from "lucide-react";

const features = [
  {
    name: "Passive Income",
    description: "Earn commissions from guest purchases at local businesses",
    icon: CircleDollarSign,
  },
  {
    name: "Easy Sharing",
    description: "Share deals via custom links, QR codes, or promo codes",
    icon: Share2,
  },
  {
    name: "Happy Guests",
    description: "Provide exclusive deals and memorable local experiences",
    icon: Smile,
  },
  {
    name: "Local Impact",
    description: "Support and grow your local business community",
    icon: Trophy,
  },
];

export const Features = () => {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="sm:text-center">
          <h2 className="text-lg font-semibold leading-8 text-primary">
            Benefits
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to boost your hosting income
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Our platform makes it easy to create additional revenue streams while enhancing your guests' experience.
          </p>
        </div>

        <div className="mt-20 max-w-lg sm:mx-auto md:max-w-none">
          <div className="grid grid-cols-1 gap-y-16 md:grid-cols-2 md:gap-x-12 md:gap-y-16">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative flex flex-col gap-6 sm:flex-row md:flex-col lg:flex-row"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white sm:shrink-0">
                  <feature.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <div className="sm:min-w-0 sm:flex-1">
                  <p className="text-lg font-semibold leading-8 text-gray-900">
                    {feature.name}
                  </p>
                  <p className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};