'use client';

import { useEffect, useRef } from 'react';
import { use } from 'react';
import 'leaflet/dist/leaflet.css';
import { type PublicPhotoMapProps } from './types';
import type * as LeafletTypes from 'leaflet';

let L: typeof LeafletTypes;
if (typeof window !== 'undefined') {
  L = require('leaflet');
}

export function PublicPhotoMap({ locationsPromise }: PublicPhotoMapProps) {
  const { locations } = use(locationsPromise);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const handleMarkerClick = (photoId: string) => {
    console.log('Clicou na foto:', photoId);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !L) return;

    const DefaultIcon = L.icon({
      iconUrl: '/img/marker-icon.png',
      shadowUrl: '/img/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([0, 0], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    markersRef.current.forEach(marker => marker?.remove());
    markersRef.current = [];

    const locationsWithCoordinates = locations?.filter(
      location => location?.latitude !== null && location?.longitude !== null,
    );

    if (locationsWithCoordinates?.length === 0) {
      mapInstanceRef.current?.setView([0, 0], 2);
      return;
    }

    const markers: L.Marker[] = [];
    const bounds = L.latLngBounds([]);

    locationsWithCoordinates?.forEach(location => {
      if (location?.latitude !== null && location?.longitude !== null) {
        const popupContent = document.createElement('div');
        popupContent.className = 'custom-popup w-full h-full';

        const img = document.createElement('img');
        img.src = location.imageUrl;
        img.alt = location.locationName || 'Local';
        img.className = 'w-full h-full object-cover rounded-md mb-2';
        popupContent.appendChild(img);

        if (location.locationName) {
          const locationName = document.createElement('p');
          locationName.textContent = location.locationName;
          locationName.className = 'font-medium text-sm';
          popupContent.appendChild(locationName);
        }

        const popup = L.popup().setContent(popupContent);

        const marker = L.marker([location?.latitude, location?.longitude])
          .addTo(mapInstanceRef.current!)
          .bindPopup(popup);

        marker.on('click', () => {
          handleMarkerClick(location?.id);
        });

        markers.push(marker);
        bounds.extend([location?.latitude, location?.longitude]);
      }
    });

    markersRef.current = markers;

    if (markers?.length > 0) {
      mapInstanceRef.current?.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [locations, handleMarkerClick]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-md overflow-hidden relative z-10"
      style={{ minHeight: '400px' }}
    />
  );
}
