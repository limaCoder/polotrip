'use client';

import { useState, useEffect, useRef, forwardRef, useCallback } from 'react';
import { MapPin, Loader2, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/cn';
import { LocationAutocompleteProps, LocationResult } from './types';

export const LocationAutocomplete = forwardRef<HTMLInputElement, LocationAutocompleteProps>(
  (
    {
      value,
      onChange,
      disabled = false,
      placeholder = 'Digite o nome da localização',
      className,
      latitude,
      longitude,
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState(value || '');
    const [results, setResults] = useState<LocationResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [preventDropdown, setPreventDropdown] = useState(false);
    const [isUserTyping, setIsUserTyping] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const formatAddress = (location: LocationResult) => {
      const { name, city, state, country } = location.properties;
      const parts = [name, city, state, country].filter(Boolean);
      return parts.join(', ');
    };

    const fetchLocations = useCallback(
      async (query: string) => {
        if (!query || query.length < 3) return;

        setIsLoading(true);
        try {
          const response = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=en`,
          );

          if (!response.ok) {
            throw new Error('Falha ao buscar localizações');
          }

          const data = await response.json();
          setResults(data.features || []);

          if (isUserTyping && !preventDropdown) {
            setShowResults(true);
          }
        } catch (error) {
          console.error('Erro ao buscar localizações:', error);
        } finally {
          setIsLoading(false);
        }
      },
      [preventDropdown, isUserTyping],
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsUserTyping(true);
      setInputValue(e.target.value);

      if (e.target.value === '') {
        onChange('', null, null);
      }

      if (preventDropdown) {
        setPreventDropdown(false);
      }
    };

    const handleInputFocus = () => {
      setIsUserTyping(true);

      if (inputValue.length >= 3 && isUserTyping && !preventDropdown && results.length > 0) {
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

      const longitude = location.geometry.coordinates[0];
      const latitude = location.geometry.coordinates[1];

      setIsUserTyping(false);

      onChange(displayName, latitude, longitude);
      setShowResults(false);

      setPreventDropdown(true);
      setTimeout(() => {
        setPreventDropdown(false);
      }, 300);
    };

    const handleClearInput = () => {
      setInputValue('');
      onChange('', null, null);
      setIsUserTyping(false);

      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

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

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    useEffect(() => {
      if (value !== inputValue && !isUserTyping) {
        setInputValue(value || '');
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

    useEffect(() => {
      if (latitude && longitude && !inputValue && !disabled) {
        const fetchReverseGeocoding = async () => {
          setIsLoading(true);
          try {
            const response = await fetch(
              `https://photon.komoot.io/reverse?lon=${longitude}&lat=${latitude}`,
            );

            if (!response.ok) {
              throw new Error('Failed to fetch location');
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
            console.error('Error fetching reverse geocoding:', error);
          } finally {
            setIsLoading(false);
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
        <div className="border border-text/25 rounded px-3 flex items-center gap-2">
          <MapPin size={20} className="text-text/50 shrink-0" />
          <Input
            ref={ref || inputRef}
            type="text"
            disabled={disabled}
            className={cn(
              'font-body_two text-text/75 bg-transparent w-full outline-none border-0 p-0 focus-visible:ring-0 shadow-none',
              className,
            )}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-text/50 shrink-0" />
          ) : inputValue ? (
            <X
              size={16}
              className="text-text/50 cursor-pointer shrink-0 hover:text-text/75"
              onClick={handleClearInput}
            />
          ) : null}
        </div>

        {showResults && results.length > 0 && (
          <div
            ref={resultsRef}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-text/10 max-h-60 overflow-y-auto"
          >
            {results.map((result, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-secondary/5 cursor-pointer"
                onClick={() => handleLocationSelect(result)}
              >
                <div className="font-body_two text-text/90">{formatAddress(result)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);

LocationAutocomplete.displayName = 'LocationAutocomplete';
