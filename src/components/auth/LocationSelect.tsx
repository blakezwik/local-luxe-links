import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const getCitiesForState = (selectedState: string) => {
    return locations
      .filter(loc => loc.state === selectedState)
      .map(loc => loc.city)
      .sort();
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
        <Label htmlFor="city">City</Label>
        <Select value={city} onValueChange={setCity} disabled={!state}>
          <SelectTrigger>
            <SelectValue placeholder={state ? "Select a city" : "Select a state first"} />
          </SelectTrigger>
          <SelectContent>
            {state && getCitiesForState(state).map((cityName) => (
              <SelectItem key={cityName} value={cityName}>
                {cityName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}