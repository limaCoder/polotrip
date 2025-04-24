interface LocationResult {
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    name: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string, latitude?: number | null, longitude?: number | null) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  latitude?: number | null;
  longitude?: number | null;
}

export type { LocationResult, LocationAutocompleteProps };
