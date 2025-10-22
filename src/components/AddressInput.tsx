import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Send, Key } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

interface AddressInputProps {
  onSubmit: (address: string) => void;
  disabled?: boolean;
}

export const AddressInput = ({ onSubmit, disabled = false }: AddressInputProps) => {
  const [address, setAddress] = useState("");
  const [aptUnit, setAptUnit] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const [mapboxToken, setMapboxToken] = useState(() => {
    return localStorage.getItem('mapbox_token') || '';
  });
  const [tokenError, setTokenError] = useState(false);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const geocoder = useRef<MapboxGeocoder | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current || !mapboxToken) return;

    try {
      // Initialize map
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [-98.5795, 39.8283], // Center of US
        zoom: 3,
      });

      // Initialize marker
      marker.current = new mapboxgl.Marker({
        color: '#2563eb',
      });

      map.current.on('error', () => {
        setTokenError(true);
      });

      setTokenError(false);

      return () => {
        map.current?.remove();
      };
    } catch (error) {
      setTokenError(true);
    }
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current || geocoder.current || !mapboxToken) return;

    try {
      // Add geocoder
      geocoder.current = new MapboxGeocoder({
        accessToken: mapboxToken,
        mapboxgl: mapboxgl as any,
        marker: false,
        placeholder: 'Street address, city, state',
      });

      geocoder.current.on('result', (e) => {
        const { result } = e;
        const coords: [number, number] = [result.center[0], result.center[1]];
        
        setAddress(result.place_name);
        setSelectedLocation(coords);

        // Update marker
        if (marker.current && map.current) {
          marker.current.setLngLat(coords).addTo(map.current);
          map.current.flyTo({ center: coords, zoom: 15 });
        }
      });

      geocoder.current.on('error', () => {
        setTokenError(true);
      });
    } catch (error) {
      setTokenError(true);
    }
  }, [mapboxToken]);

  const handleTokenSave = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken.trim());
      setTokenError(false);
      // Reset map to reinitialize with new token
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (geocoder.current) {
        geocoder.current = null;
      }
    }
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
      setSelectedLocation(null);
      if (marker.current) {
        marker.current.remove();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-4 space-y-4">
      {/* Mapbox Token Input */}
      {(!mapboxToken || tokenError) && (
        <div className="p-4 bg-muted/50 rounded-lg space-y-3">
          <div className="flex items-start gap-2">
            <Key className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-1">Mapbox API Token Required</p>
              <p className="text-xs text-muted-foreground mb-3">
                Get your free token at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>
              </p>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={mapboxToken}
                  onChange={(e) => setMapboxToken(e.target.value)}
                  placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIi..."
                  className="flex-1 text-sm"
                />
                <Button
                  type="button"
                  onClick={handleTokenSave}
                  size="sm"
                  disabled={!mapboxToken.trim()}
                >
                  Save
                </Button>
              </div>
              {tokenError && (
                <p className="text-xs text-destructive mt-2">Invalid token. Please check and try again.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="relative w-full h-[200px] rounded-lg overflow-hidden border border-border">
        <div ref={mapContainer} className="absolute inset-0" />
        {!selectedLocation && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {mapboxToken ? 'Search for an address to view location' : 'Enter your Mapbox token above to enable address search'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Address Search */}
      <div className="flex gap-3 items-start">
        <div className="flex-1 space-y-3">
          <div 
            ref={(el) => {
              if (el && geocoder.current && !el.querySelector('.mapboxgl-ctrl-geocoder')) {
                el.appendChild(geocoder.current.onAdd(map.current!));
              }
            }}
            className="geocoder-container"
          />
          <Input
            type="text"
            value={aptUnit}
            onChange={(e) => setAptUnit(e.target.value)}
            placeholder="Apt/Unit # (optional)"
            disabled={disabled || !mapboxToken}
            className="h-12 text-base"
          />
        </div>
        <Button
          type="submit"
          disabled={!address.trim() || disabled || !mapboxToken}
          size="icon"
          className="h-12 w-12 flex-shrink-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </form>
  );
};
