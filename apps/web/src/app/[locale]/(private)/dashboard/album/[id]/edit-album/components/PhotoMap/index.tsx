"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type * as LeafletTypes from "leaflet";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePostHog } from "@/hooks/usePostHog";
import type { PhotoMapProps } from "./types";

let L: typeof LeafletTypes;
if (typeof window !== "undefined") {
  L = require("leaflet");
}

export function PhotoMap({ photos, onMarkerClick }: PhotoMapProps) {
  const t = useTranslations("EditAlbum.PhotoMap");
  const { capture } = usePostHog();
  const { id: albumId } = useParams();
  const hasTrackedView = useRef(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || !L) return;

    const DefaultIcon = L.icon({
      iconUrl: "/img/marker-icon.png",
      shadowUrl: "/img/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;

    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([0, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      if (!hasTrackedView.current) {
        hasTrackedView.current = true;
        capture("map_viewed", {
          album_id: albumId,
          photos_with_coordinates: photos.filter(
            (p) => p?.latitude && p?.longitude
          ).length,
        });
      }
    }

    markersRef.current.forEach((marker) => {
      marker?.remove();
    });
    markersRef.current = [];

    const photosWithCoordinates = photos?.filter(
      (photo) => photo?.latitude !== null && photo?.longitude !== null
    );

    if (photosWithCoordinates?.length === 0) {
      mapInstanceRef.current?.setView([0, 0], 2);
      return;
    }

    const markers: L.Marker[] = [];
    const bounds = L.latLngBounds([]);

    photosWithCoordinates?.forEach((photo) => {
      if (photo?.latitude !== null && photo?.longitude !== null) {
        const marker = L.marker([photo?.latitude, photo?.longitude])
          .addTo(mapInstanceRef.current!)
          .bindPopup(photo?.locationName || t("unnamed_location"));

        if (onMarkerClick) {
          marker.on("click", () => {
            onMarkerClick(photo?.id);
          });
        }

        markers.push(marker);
        bounds.extend([photo?.latitude, photo?.longitude]);
      }
    });

    markersRef.current = markers;

    if (markers?.length > 0) {
      mapInstanceRef.current?.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [photos, onMarkerClick, t, capture, albumId]);

  return (
    <div
      className="relative z-1 h-full w-full overflow-hidden rounded-md"
      ref={mapRef}
      style={{ minHeight: "300px" }}
    />
  );
}
