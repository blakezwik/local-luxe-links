import { LocationSelect } from "../LocationSelect";

interface PropertyDetailsFormProps {
  locations: Location[];
  state: string;
  city: string;
  setState: (value: string) => void;
  setCity: (value: string) => void;
}

interface Location {
  state: string;
  state_code: string;
  city: string;
}

export function PropertyDetailsForm({ locations, state, city, setState, setCity }: PropertyDetailsFormProps) {
  return (
    <>
      <div className="mt-6 mb-4">
        <h3 className="text-lg font-semibold text-[#177E89]">Rental Property Details</h3>
      </div>
      <div className="space-y-4">
        <LocationSelect
          locations={locations}
          state={state}
          city={city}
          setState={setState}
          setCity={setCity}
        />
      </div>
    </>
  );
}