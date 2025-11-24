'use client';

import { memo, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

type Place = {
  id: number;
  ad: string;
  kategori: string;
  lat: number;
  lon: number;
  gorsel_url?: string | null;
  mesafe_m: number;
};

type Props = {
  userLocation: LatLngExpression | null;
  radius: number;
  places: Place[];
};

const defaultCenter: LatLngExpression = [36.8841, 30.7054];

const icon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const userIcon = L.divIcon({
  className: "user-location-marker",
  html: '<div class="h-4 w-4 rounded-full bg-emerald-400 border-2 border-white shadow-lg"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

function Map({ userLocation, radius, places }: Props) {
  const center = useMemo<LatLngExpression>(
    () => userLocation ?? defaultCenter,
    [userLocation]
  );

  if (typeof window === "undefined") {
    return (
      <div className="flex h-full items-center justify-center rounded-xl bg-slate-900 text-slate-400">
        Harita yükleniyor...
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={11}
      scrollWheelZoom
      className="h-full w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <>
          <Marker position={userLocation} icon={userIcon}>
            <Popup>Bulunduğun nokta</Popup>
          </Marker>
          <Circle center={userLocation} radius={radius} pathOptions={{ color: "#34d399", fillOpacity: 0.1 }} />
        </>
      )}

      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lon]}
          icon={icon}
        >
          <Popup>
            <div className="space-y-1">
              <p className="font-semibold">{place.ad}</p>
              <p className="text-sm text-slate-500">{place.kategori}</p>
              <p className="text-sm mt-1">
                {place.mesafe_m.toFixed(0)} m uzakta
              </p>
              {place.gorsel_url && (
                <img
                  src={place.gorsel_url}
                  alt={place.ad}
                  className="mt-1 max-h-32 w-full rounded-md object-cover"
                />
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default memo(Map);

