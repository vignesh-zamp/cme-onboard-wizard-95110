import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddressInputProps {
  onSubmit: (address: string) => void;
  disabled?: boolean;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export const AddressInput = ({ onSubmit, disabled = false }: AddressInputProps) => {
  const [address, setAddress] = useState("");
  const [aptUnit, setAptUnit] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const debounceTimer = useRef<NodeJS.Timeout>();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch address suggestions from Nominatim
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (address.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);

    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `format=json&` +
          `q=${encodeURIComponent(address)}&` +
          `countrycodes=us&` +
          `addressdetails=1&` +
          `limit=5`,
          {
            headers: {
              'User-Agent': 'PaceOnboarding/1.0'
            }
          }
        );

        if (response.ok) {
          const data: NominatimResult[] = await response.json();
          setSuggestions(data);
          setShowSuggestions(data.length > 0);
        }
      } catch (error) {
        console.error('Error fetching address suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [address]);

  const handleSelectAddress = (suggestion: NominatimResult) => {
    setAddress(suggestion.display_name);
    setSelectedAddress(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim() && !disabled) {
      const fullAddress = aptUnit.trim() 
        ? `${address.trim()}, ${aptUnit.trim()}`
        : address.trim();
      onSubmit(fullAddress);
      setAddress("");
      setAptUnit("");
      setSelectedAddress("");
      setSuggestions([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-4 space-y-4">
      {/* Address Search with Autocomplete */}
      <div className="flex gap-3 items-start">
        <div className="flex-1 space-y-3">
          <div className="relative" ref={suggestionsRef}>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, city, state"
                disabled={disabled}
                className="h-12 pl-10 pr-10 text-base"
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
              )}
            </div>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    onClick={() => handleSelectAddress(suggestion)}
                    className={cn(
                      "w-full text-left px-4 py-3 hover:bg-accent transition-colors",
                      "border-b border-border last:border-b-0",
                      "focus:bg-accent focus:outline-none"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <span className="text-sm">{suggestion.display_name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Input
            type="text"
            value={aptUnit}
            onChange={(e) => setAptUnit(e.target.value)}
            placeholder="Apt/Unit # (optional)"
            disabled={disabled}
            className="h-12 text-base"
          />
        </div>
        <Button
          type="submit"
          disabled={!address.trim() || disabled}
          size="icon"
          className="h-12 w-12 flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {/* Info about validation */}
      {selectedAddress && (
        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
          <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-xs text-muted-foreground">
            Address validated using OpenStreetMap
          </p>
        </div>
      )}
    </form>
  );
};
