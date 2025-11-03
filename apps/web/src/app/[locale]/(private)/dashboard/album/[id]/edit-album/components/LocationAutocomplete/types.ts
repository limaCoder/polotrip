type LocationResult = {
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    name: string;
    city?: string;
    state?: string;
    country?: string;
  };
};

type LocationAutocompleteProps = {
  value: string;
  onChange: (
    value: string,
    latitude?: number | null,
    longitude?: number | null
  ) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  latitude?: number | null;
  longitude?: number | null;
};

type InputSuffixProps = {
  isLoadingSearch: boolean;
  isLoadingReverseGeocode: boolean;
  inputValue: string;
  onClear: () => void;
};

export type { LocationResult, LocationAutocompleteProps, InputSuffixProps };
