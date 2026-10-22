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

function MapPlaceholder({ labelKey }: { labelKey: "loadingMap" | "detectingGps" }) {
  const t = useTranslations("catches");
  return (
    <div className="w-full h-64 bg-[var(--ground)] rounded-[var(--r-card)] flex items-center justify-center">
      <span className="text-sm text-[var(--muted)]">{t(labelKey)}</span>
    </div>
  );
}

const MapComponent = dynamic(() => import("./location-map"), {
  ssr: false,
  loading: () => (
    <MapPlaceholder labelKey="loadingMap" />
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
      {gpsLoading ? (
        <MapPlaceholder labelKey="detectingGps" />
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
        aria-label={t("placeName")}
        className="mt-3 h-[42px] w-full rounded-[var(--r-control)] bg-[var(--ground)] px-3.5 text-sm text-[var(--text)] outline-none placeholder:text-[var(--faint)] focus:shadow-[inset_0_0_0_1.5px_var(--accent)] transition-[box-shadow] duration-[var(--t-ui)] motion-reduce:transition-none"
      />
    </div>
  );
}
