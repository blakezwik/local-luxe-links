import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Location {
  state: string;
  state_code: string;
  city: string;
}

interface LocationSelectProps {
  locations: Location[];
  state: string;
  city: string;
  setState: (value: string) => void;
  setCity: (value: string) => void;
}

export function LocationSelect({ locations, state, city, setState, setCity }: LocationSelectProps) {
  const getUniqueStates = () => {
    const states = [...new Set(locations.map(loc => loc.state))];
    return states.sort();
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Select value={state} onValueChange={setState}>
          <SelectTrigger>
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            {getUniqueStates().map((stateName) => (
              <SelectItem key={stateName} value={stateName}>
                {stateName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City (Optional)</Label>
        <Input
          id="city"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter your city"
        />
      </div>
    </>
  );
}