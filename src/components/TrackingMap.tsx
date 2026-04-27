"use client";

import dynamic from "next/dynamic";

const MapInner = dynamic(() => import("./TrackingMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-gray-500 dark:bg-gray-800">
      Loading map…
    </div>
  ),
});

export type LatLng = { lat: number; lng: number };

export function TrackingMap({
  current,
  destination,
  currentLabel,
  destinationLabel,
}: {
  current: LatLng | null;
  destination: LatLng | null;
  currentLabel?: string | null;
  destinationLabel?: string | null;
}) {
  return (
    <MapInner
      current={current}
      destination={destination}
      currentLabel={currentLabel ?? null}
      destinationLabel={destinationLabel ?? null}
    />
  );
}
