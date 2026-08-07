"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

type Props = {
  latitude: number | null;
  longitude: number | null;
  onChange: (lat: number, lng: number) => void;
  locationName: string;
  onLocationNameChange: (name: string) => void;
};

// Costa Rica center as default
const DEFAULT_LAT = 9.93;
const DEFAULT_LNG = -84.08;

const MapComponent = dynamic(() => import("./location-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Loading map...</span>
    </div>
  ),
});

export function LocationPicker({
  latitude,
  longitude,
  onChange,
  locationName,
  onLocationNameChange,
}: Props) {
  const t = useTranslations("catches");
  const [gpsLoading, setGpsLoading] = useState(false);

  useEffect(() => {
    if (latitude !== null) return;
    if (!navigator.geolocation) {
      onChange(DEFAULT_LAT, DEFAULT_LNG);
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(pos.coords.latitude, pos.coords.longitude);
        setGpsLoading(false);
      },
      () => {
        onChange(DEFAULT_LAT, DEFAULT_LNG);
        setGpsLoading(false);
      },
      { timeout: 5000 }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {t("location")} *
      </label>
      {gpsLoading ? (
        <div className="w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">📍 Detecting GPS...</span>
        </div>
      ) : (
        <MapComponent
          latitude={latitude ?? DEFAULT_LAT}
          longitude={longitude ?? DEFAULT_LNG}
          onChange={onChange}
        />
      )}
      <input
        type="text"
        value={locationName}
        onChange={(e) => onLocationNameChange(e.target.value)}
        placeholder={t("pickLocation")}
        className="mt-2 w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm dark:bg-gray-900"
      />
    </div>
  );
}
