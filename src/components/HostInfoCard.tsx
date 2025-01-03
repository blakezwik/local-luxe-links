import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin } from "lucide-react";

interface HostInfoCardProps {
  firstName: string;
  city?: string;
  state?: string;
}

export const HostInfoCard = ({ firstName, city, state }: HostInfoCardProps) => {
  return (
    <Card className="mb-8 bg-gradient-to-r from-[#FFD166]/10 to-white border-none shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#FFD166] rounded-full">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#177E89]">
              Welcome back, {firstName}!
            </h2>
            {city && state && (
              <p className="text-gray-600 flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {city}, {state}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};