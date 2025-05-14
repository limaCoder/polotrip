'use client';

import { useCallback, useEffect, useRef } from 'react';
import { use } from 'react';
import 'leaflet/dist/leaflet.css';
import { type PublicPhotoMapProps } from './types';
import type * as LeafletTypes from 'leaflet';
import { groupBy } from 'lodash';
import type { Location } from '@/http/get-public-album-locations/types';

let L: typeof LeafletTypes;
if (typeof window !== 'undefined') {
  L = require('leaflet');
}

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .leaflet-popup-content-wrapper {
      padding: 0 !important;
      overflow: hidden !important;
    }
    .leaflet-popup-content {
      margin: 0 !important;
      overflow: hidden !important;
      width: 280px !important;
    }
    .leaflet-popup-tip-container {
      margin-top: -1px !important;
    }
    .photos-scroll-container {
      max-height: 240px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
    }
    .photos-scroll-container::-webkit-scrollbar {
      width: 6px;
    }
    .photos-scroll-container::-webkit-scrollbar-track {
      background: transparent;
    }
    .photos-scroll-container::-webkit-scrollbar-thumb {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }
    .photos-grid {
      display: grid;
      gap: 16px;
      padding: 12px;
      padding-bottom: 0;
    }
  `;
  document.head.appendChild(style);
}

export function PublicPhotoMap({ locationsPromise }: PublicPhotoMapProps) {
  const { locations } = use(locationsPromise);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

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

    const groupedLocations = groupBy(
      locationsWithCoordinates,
      (location: Location) => `${location.latitude},${location.longitude}`,
    );

    const markers: L.Marker[] = [];
    const bounds = L.latLngBounds([]);

    Object.entries(groupedLocations).forEach(([coords, groupLocations]) => {
      const [lat, lng] = coords.split(',').map(Number);

      const popupContent = document.createElement('div');
      popupContent.className = 'w-[280px] overflow-hidden';

      const scrollContainer = document.createElement('div');
      scrollContainer.className = 'photos-scroll-container';

      const imagesContainer = document.createElement('div');
      imagesContainer.className = 'photos-grid';

      (groupLocations as Location[]).forEach(location => {
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'relative flex flex-col bg-white';

        const img = document.createElement('img');
        img.src = location.imageUrl;
        img.alt = location.locationName || 'Local';
        img.className = 'w-full aspect-[4/3] object-cover rounded-lg shadow-sm';
        imageWrapper.appendChild(img);

        if (location.locationName) {
          const locationName = document.createElement('p');
          locationName.textContent = location.locationName;
          locationName.className = 'font-medium text-sm mt-2 text-text/90';
          imageWrapper.appendChild(locationName);
        }

        imagesContainer.appendChild(imageWrapper);
      });

      scrollContainer.appendChild(imagesContainer);
      popupContent.appendChild(scrollContainer);

      const popup = L.popup({
        maxWidth: 280,
        maxHeight: undefined,
        autoPan: true,
        closeButton: true,
        className: 'custom-popup',
        autoPanPadding: [50, 50],
      }).setContent(popupContent);

      const markerIcon =
        (groupLocations as Location[]).length > 1
          ? L.divIcon({
              html: `<div class="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">${(groupLocations as Location[]).length}</div>`,
              className: 'custom-div-icon',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })
          : DefaultIcon;

      const marker = L.marker([lat, lng], { icon: markerIcon })
        .addTo(mapInstanceRef.current!)
        .bindPopup(popup);

      markers.push(marker);
      bounds.extend([lat, lng]);
    });

    markersRef.current = markers;

    if (markers?.length > 0) {
      mapInstanceRef.current?.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [locations]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-md overflow-hidden relative z-0"
      style={{ minHeight: '400px' }}
    />
  );
}
