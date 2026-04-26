"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// Fix default icon paths (Leaflet quirk when bundled).
// Use CDN icons so no extra assets are required.
const truckIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type LatLng = { lat: number; lng: number };

export default function TrackingMapInner({
  current,
  destination,
}: {
  current: LatLng | null;
  destination: LatLng | null;
}) {
  useEffect(() => {
    // Remove any stale default icon image paths once on mount.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  // Default center: world overview if nothing known.
  const points = [current, destination].filter(Boolean) as LatLng[];
  const center: [number, number] =
    points.length > 0
      ? [
          points.reduce((s, p) => s + p.lat, 0) / points.length,
          points.reduce((s, p) => s + p.lng, 0) / points.length,
        ]
      : [0, 0];
  const zoom = points.length > 0 ? 4 : 2;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {current && (
        <Marker position={[current.lat, current.lng]} icon={truckIcon}>
          <Popup>Current location</Popup>
        </Marker>
      )}
      {destination && (
        <Marker position={[destination.lat, destination.lng]}>
          <Popup>Destination</Popup>
        </Marker>
      )}
      {current && destination && (
        <Polyline
          positions={[
            [current.lat, current.lng],
            [destination.lat, destination.lng],
          ]}
          pathOptions={{ color: "#f59e0b", weight: 3, dashArray: "6 6" }}
        />
      )}
    </MapContainer>
  );
}
