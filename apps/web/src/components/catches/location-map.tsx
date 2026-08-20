"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon for Leaflet in webpack/Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Props = {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number) => void;
};

function DraggableMarker({ latitude, longitude, onChange }: Props) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      position={[latitude, longitude]}
      icon={icon}
      draggable
      eventHandlers={{
        dragend(e) {
          const latlng = e.target.getLatLng();
          onChange(latlng.lat, latlng.lng);
        },
      }}
    />
  );
}

export default function LocationMap({ latitude, longitude, onChange }: Props) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={12}
      className="w-full h-64 rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker
        latitude={latitude}
        longitude={longitude}
        onChange={onChange}
      />
    </MapContainer>
  );
}
