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
  const [showOptional, setShowOptional] = useState(false);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <PhotoUpload onSelect={setPhoto} />

      <SpeciesPicker
        locale={locale}
        value={speciesId}
        onChange={setSpeciesId}
      />

      <LocationPicker
        latitude={latitude}
        longitude={longitude}
        onChange={handleLocationChange}
        locationName={locationName}
        onLocationNameChange={setLocationName}
      />

      <div>
        <label className="block text-sm font-medium mb-1">{t("date")} *</label>
        <input
          type="date"
          value={catchDate}
          onChange={(e) => setCatchDate(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-900"
          required
        />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          type="button"
          onClick={() => setShowOptional(!showOptional)}
          className="flex items-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium transition-colors"
        >
          <svg className={`w-4 h-4 transition-transform duration-200 ${showOptional ? "rotate-90" : ""}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
          {t("optionalFields")}
        </button>
        {showOptional && (
          <div className="mt-3 space-y-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("weight")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("length")}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={lengthCm}
                  onChange={(e) => setLengthCm(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("bait")}
              </label>
              <input
                type="text"
                value={baitLure}
                onChange={(e) => setBaitLure(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("weather")}
                </label>
                <input
                  type="text"
                  value={weather}
                  onChange={(e) => setWeather(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {t("tide")}
                </label>
                <input
                  type="text"
                  value={tide}
                  onChange={(e) => setTide(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("time")}
              </label>
              <input
                type="time"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("notes")}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-900"
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-cyan-600 text-white py-3 rounded-lg font-medium hover:bg-cyan-700 active:scale-[0.98] disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        {submitting ? tCommon("loading") : tCommon("save")}
      </button>
    </form>
  );
}
