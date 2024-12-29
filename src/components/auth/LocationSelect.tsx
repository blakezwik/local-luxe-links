import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Location {
  state: string;
  state_code: string;
  city: string;
}

interface LocationSelectProps {
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  state: string;
  city: string;
}

export function LocationSelect({ onStateChange, onCityChange, state, city }: LocationSelectProps) {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('state, state_code, city');
      
      if (error) {
        console.error('Error fetching locations:', error);
        return;
      }
      
      setLocations(data || []);
    };

    fetchLocations();
  }, []);

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
        <Select value={state} onValueChange={onStateChange}>
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
        <Select value={city} onValueChange={onCityChange} disabled={!state}>
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