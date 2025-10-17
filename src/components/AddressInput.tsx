import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Send } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

interface AddressInputProps {
  onSubmit: (address: string) => void;
  disabled?: boolean;
}

// TODO: Replace with actual Mapbox token - User should add this as a secret
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTJmdnFvZG0wMDFoMmpzY3F3NjZld3RtIn0.xxxxxxxxxxxxxxxxxxxxxxxxx';

export const AddressInput = ({ onSubmit, disabled = false }: AddressInputProps) => {
  const [address, setAddress] = useState("");
  const [aptUnit, setAptUnit] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const geocoder = useRef<MapboxGeocoder | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    mapboxgl.accessToken = MAPBOX_TOKEN;
    
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

    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current || geocoder.current) return;

    // Add geocoder
    geocoder.current = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
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
  }, []);

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
      {/* Map */}
      <div className="relative w-full h-[200px] rounded-lg overflow-hidden border border-border">
        <div ref={mapContainer} className="absolute inset-0" />
        {!selectedLocation && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Search for an address to view location</p>
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
    </form>
  );
};
