/** biome-ignore-all lint/nursery/noReactForwardRef: biome does not support forwardRef */
/** biome-ignore-all lint/suspicious/noConsole: console.error is used for debugging */
"use client";

import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { InputSuffix } from "./input-suffix";
import type { LocationAutocompleteProps, LocationResult } from "./types";

export const LocationAutocomplete = forwardRef<
  HTMLInputElement,
  LocationAutocompleteProps
>(
  (
    {
      value,
      onChange,
      disabled = false,
      placeholder: initialPlaceholder,
      className,
      latitude,
      longitude,
    },
    ref
  ) => {
    const t = useTranslations("LocationAutocomplete");
    const placeholder = initialPlaceholder || t("placeholder");

    const [inputValue, setInputValue] = useState(value || "");
    const [results, setResults] = useState<LocationResult[]>([]);
    const [isLoadingReverseGeocode, setIsLoadingReverseGeocode] =
      useState(false);
    const [isLoadingSearch, setIsLoadingSearch] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [preventDropdown, setPreventDropdown] = useState(false);
    const [isUserTyping, setIsUserTyping] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const formatAddress = (location: LocationResult) => {
      const { name, city, state, country } = location.properties;
      const parts = [name, city, state, country].filter(Boolean);
      return parts.join(", ");
    };

    const fetchLocations = useCallback(
      async (query: string) => {
        if (!query || query.length < 3) return;

        setIsLoadingSearch(true);
        try {
          const response = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=en`
          );

          if (!response.ok) {
            throw new Error("Falha ao buscar localizações");
          }

          const data = await response.json();
          setResults(data.features || []);

          if (isUserTyping && !preventDropdown) {
            setShowResults(true);
          }
        } catch (error) {
          console.error("Erro ao buscar localizações:", error);
        } finally {
          setIsLoadingSearch(false);
        }
      },
      [preventDropdown, isUserTyping]
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsUserTyping(true);
      setInputValue(e.target.value);

      if (e.target.value === "") {
        onChange("", null, null);
      }

      if (preventDropdown) {
        setPreventDropdown(false);
      }
    };

    const handleInputFocus = () => {
      setIsUserTyping(true);

      if (
        inputValue.length >= 3 &&
        isUserTyping &&
        !preventDropdown &&
        results.length > 0
      ) {
        setShowResults(true);
      }
    };

    const handleInputBlur = () => {
      setTimeout(() => {
        if (!showResults) {
          setIsUserTyping(false);
        }
      }, 200);
    };

    const handleLocationSelect = (location: LocationResult) => {
      const displayName = formatAddress(location);
      setInputValue(displayName);

      const selectedLongitude = location.geometry.coordinates[0];
      const selectedLatitude = location.geometry.coordinates[1];

      setIsUserTyping(false);

      onChange(displayName, selectedLatitude, selectedLongitude);
      setShowResults(false);

      setPreventDropdown(true);
      setTimeout(() => {
        setPreventDropdown(false);
      }, 300);
    };

    const handleClearInput = () => {
      setInputValue("");
      onChange("", null, null);
      setIsUserTyping(false);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const inputValueMessage = isLoadingReverseGeocode
      ? t("loading_reverse_geocode")
      : inputValue;

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (
          resultsRef.current &&
          !resultsRef.current.contains(event.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setShowResults(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    useEffect(() => {
      if (value !== inputValue && !isUserTyping) {
        setInputValue(value || "");
      }
    }, [value, inputValue, isUserTyping]);

    useEffect(() => {
      if (!inputValue || inputValue.length < 3) {
        setResults([]);
        return;
      }

      if (!isUserTyping) {
        return;
      }

      const timer = setTimeout(() => {
        fetchLocations(inputValue);
      }, 300);

      return () => clearTimeout(timer);
    }, [inputValue, fetchLocations, isUserTyping]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: we need to fetch the reverse geocoding when the latitude and longitude are provided
    useEffect(() => {
      if (latitude && longitude && !inputValue && !disabled) {
        const fetchReverseGeocoding = async () => {
          setIsLoadingReverseGeocode(true);
          try {
            const response = await fetch(
              `https://photon.komoot.io/reverse?lon=${longitude}&lat=${latitude}`
            );

            if (!response.ok) {
              throw new Error("Failed to fetch location");
            }

            const data = await response.json();

            if (data.features && data.features.length > 0) {
              const location = data.features[0];
              const displayName = formatAddress(location);

              setInputValue(displayName);
              setIsUserTyping(false);
              onChange(displayName, latitude, longitude);
            }
          } catch (error) {
            console.error("Error fetching reverse geocoding:", error);
          } finally {
            setIsLoadingReverseGeocode(false);
          }
        };

        fetchReverseGeocoding();
      }
    }, [latitude, longitude, inputValue, disabled, onChange]);

    useEffect(() => {
      if (disabled) {
        setIsUserTyping(false);
        setShowResults(false);
      }
    }, [disabled]);

    return (
      <div className="relative">
        <div className="flex items-center gap-2 rounded border border-text/25 px-3">
          <MapPin className="shrink-0 text-text/50" size={20} />
          <Input
            className={cn(
              "w-full border-0 bg-transparent p-0 font-body_two text-text/75 shadow-none outline-none focus-visible:ring-0",
              className
            )}
            disabled={disabled}
            onBlur={handleInputBlur}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={placeholder}
            ref={ref || inputRef}
            type="text"
            value={inputValueMessage}
          />
          <InputSuffix
            inputValue={inputValue}
            isLoadingReverseGeocode={isLoadingReverseGeocode}
            isLoadingSearch={isLoadingSearch}
            onClear={handleClearInput}
          />
        </div>

        {showResults && results.length > 0 && (
          <div
            className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border border-text/10 bg-white shadow-lg"
            ref={resultsRef}
          >
            {results.map((result) => (
              <div
                className="cursor-pointer px-3 py-2 hover:bg-secondary/5"
                key={result.properties.name}
                onClick={() => handleLocationSelect(result)}
              >
                <div className="font-body_two text-text/90">
                  {formatAddress(result)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

LocationAutocomplete.displayName = "LocationAutocomplete";
