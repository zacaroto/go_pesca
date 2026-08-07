"use client";

import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./location-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg" />
  ),
});

type CatchData = {
  id: string;
  photo_url: string;
  catch_date: string;
  latitude: number;
  longitude: number;
  location_name: string | null;
  weight_kg: number | null;
  length_cm: number | null;
  bait_lure: string | null;
  weather: string | null;
  tide: string | null;
  time_of_day: string | null;
  notes: string | null;
  species_name: string;
};

type Props = {
  catch_data: CatchData;
};

function noop() {}

export function CatchDetail({ catch_data }: Props) {
  const t = useTranslations("catches");

  const fields = [
    { label: t("weight"), value: catch_data.weight_kg ? `${catch_data.weight_kg} kg` : null },
    { label: t("length"), value: catch_data.length_cm ? `${catch_data.length_cm} cm` : null },
    { label: t("bait"), value: catch_data.bait_lure },
    { label: t("weather"), value: catch_data.weather },
    { label: t("tide"), value: catch_data.tide },
    { label: t("time"), value: catch_data.time_of_day },
  ];

  return (
    <div className="space-y-6">
      <img
        src={catch_data.photo_url}
        alt={catch_data.species_name}
        className="w-full h-64 object-cover rounded-lg"
      />

      <div>
        <h1 className="text-2xl font-bold">{catch_data.species_name}</h1>
        <p className="text-gray-500">
          {t("date")}: {catch_data.catch_date}
        </p>
        {catch_data.location_name && (
          <p className="text-gray-500">
            {t("location")}: {catch_data.location_name}
          </p>
        )}
      </div>

      <div>
        <MapComponent
          latitude={catch_data.latitude}
          longitude={catch_data.longitude}
          onChange={noop}
        />
      </div>

      {fields.some((f) => f.value) && (
        <div className="grid grid-cols-2 gap-3">
          {fields.map(
            (f) =>
              f.value && (
                <div key={f.label}>
                  <p className="text-xs text-gray-500">{f.label}</p>
                  <p className="text-sm font-medium">{f.value}</p>
                </div>
              )
          )}
        </div>
      )}

      {catch_data.notes && (
        <div>
          <p className="text-xs text-gray-500">{t("notes")}</p>
          <p className="text-sm">{catch_data.notes}</p>
        </div>
      )}
    </div>
  );
}
