"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { PhotoUpload } from "./photo-upload";
import { SpeciesPicker } from "./species-picker";
import { LocationPicker } from "./location-picker";
import { submitCatch } from "@/lib/catches";

type Props = {
  locale: string;
};

const inputClass =
  "w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all";

export function CatchForm({ locale }: Props) {
  const t = useTranslations("catches");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [photo, setPhoto] = useState<File | null>(null);
  const [speciesId, setSpeciesId] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationName, setLocationName] = useState("");
  const [catchDate, setCatchDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Optional fields
  const [showOptional, setShowOptional] = useState(true);
  const [weightKg, setWeightKg] = useState("");
  const [lengthCm, setLengthCm] = useState("");
  const [baitLure, setBaitLure] = useState("");
  const [weather, setWeather] = useState("");
  const [tide, setTide] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleLocationChange(lat: number, lng: number) {
    setLatitude(lat);
    setLongitude(lng);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!photo || !speciesId || latitude === null || longitude === null) {
      setError("Please fill all required fields");
      return;
    }

    setSubmitting(true);
    try {
      await submitCatch(photo, {
        speciesId,
        latitude,
        longitude,
        locationName: locationName || undefined,
        catchDate,
        weightKg: weightKg ? parseFloat(weightKg) : undefined,
        lengthCm: lengthCm ? parseFloat(lengthCm) : undefined,
        baitLure: baitLure || undefined,
        weather: weather || undefined,
        tide: tide || undefined,
        timeOfDay: timeOfDay || undefined,
        notes: notes || undefined,
      });
      router.push(`/${locale}/catches`);
    } catch {
      setError("Error saving catch");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Photo */}
      <section className="rounded-2xl bg-white dark:bg-gray-800/50 ring-1 ring-gray-100 dark:ring-gray-700/50 p-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
          </svg>
          {t("photo")} *
        </h2>
        <PhotoUpload onSelect={setPhoto} />
      </section>

      {/* Species */}
      <section className="rounded-2xl bg-white dark:bg-gray-800/50 ring-1 ring-gray-100 dark:ring-gray-700/50 p-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          {t("species")} *
        </h2>
        <SpeciesPicker
          locale={locale}
          value={speciesId}
          onChange={setSpeciesId}
        />
      </section>

      {/* Location */}
      <section className="rounded-2xl bg-white dark:bg-gray-800/50 ring-1 ring-gray-100 dark:ring-gray-700/50 p-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          {t("location")} *
        </h2>
        <LocationPicker
          latitude={latitude}
          longitude={longitude}
          onChange={handleLocationChange}
          locationName={locationName}
          onLocationNameChange={setLocationName}
        />
      </section>

      {/* Date */}
      <section className="rounded-2xl bg-white dark:bg-gray-800/50 ring-1 ring-gray-100 dark:ring-gray-700/50 p-4">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-cyan-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          {t("date")} *
        </h2>
        <input
          type="date"
          value={catchDate}
          onChange={(e) => setCatchDate(e.target.value)}
          className={inputClass}
          required
        />
      </section>

      {/* Optional Fields */}
      <section className="rounded-2xl bg-white dark:bg-gray-800/50 ring-1 ring-gray-100 dark:ring-gray-700/50 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowOptional(!showOptional)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <svg className="w-4 h-4 text-cyan-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
            {t("optionalFields")}
          </span>
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${showOptional ? "rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        {showOptional && (
          <div className="px-4 pb-4 space-y-4 border-t border-gray-100 dark:border-gray-700/50 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  {t("weight")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  {t("length")}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={lengthCm}
                  onChange={(e) => setLengthCm(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                {t("bait")}
              </label>
              <input
                type="text"
                value={baitLure}
                onChange={(e) => setBaitLure(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  {t("weather")}
                </label>
                <input
                  type="text"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  {t("tide")}
                </label>
                <input
                  type="text"
                  value={tide}
                  onChange={(e) => setTide(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                {t("time")}
              </label>
              <input
                type="time"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                {t("notes")}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className={inputClass + " resize-none"}
              />
            </div>
          </div>
        )}
      </section>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-900/20 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-cyan-600 text-white py-3.5 rounded-2xl font-semibold hover:bg-cyan-700 active:scale-[0.98] disabled:opacity-50 transition-all duration-200 shadow-lg shadow-cyan-600/25 hover:shadow-xl hover:shadow-cyan-600/30"
      >
        {submitting ? tCommon("loading") : tCommon("save")}
      </button>
    </form>
  );
}
