"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { PhotoUpload } from "./photo-upload";
import { SpeciesPicker } from "./species-picker";
import { deleteCatch, updateCatch } from "@/lib/catches";

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
  species_id: number;
  is_public: boolean;
};

type Props = {
  catch_data: CatchData;
  locale: string;
};

function noop() {}

export function CatchDetail({ catch_data, locale }: Props) {
  const t = useTranslations("catches");
  const tCommon = useTranslations("common");
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Edit state
  const [speciesId, setSpeciesId] = useState(catch_data.species_id);
  const [catchDate, setCatchDate] = useState(catch_data.catch_date);
  const [weightKg, setWeightKg] = useState(catch_data.weight_kg?.toString() ?? "");
  const [lengthCm, setLengthCm] = useState(catch_data.length_cm?.toString() ?? "");
  const [baitLure, setBaitLure] = useState(catch_data.bait_lure ?? "");
  const [weather, setWeather] = useState(catch_data.weather ?? "");
  const [tide, setTide] = useState(catch_data.tide ?? "");
  const [timeOfDay, setTimeOfDay] = useState(catch_data.time_of_day ?? "");
  const [notes, setNotes] = useState(catch_data.notes ?? "");
  const [isPublic, setIsPublic] = useState(catch_data.is_public);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);

  async function handleDelete() {
    if (!confirm(t("confirmDelete"))) return;
    setDeleting(true);
    try {
      await deleteCatch(catch_data.id, catch_data.photo_url);
      router.push(`/${locale}/catches`);
    } catch {
      setDeleting(false);
    }
  }

  function handleCancel() {
    setEditing(false);
    setSpeciesId(catch_data.species_id);
    setCatchDate(catch_data.catch_date);
    setWeightKg(catch_data.weight_kg?.toString() ?? "");
    setLengthCm(catch_data.length_cm?.toString() ?? "");
    setBaitLure(catch_data.bait_lure ?? "");
    setWeather(catch_data.weather ?? "");
    setTide(catch_data.tide ?? "");
    setTimeOfDay(catch_data.time_of_day ?? "");
    setNotes(catch_data.notes ?? "");
    setIsPublic(catch_data.is_public);
    setNewPhoto(null);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateCatch(
        catch_data.id,
        {
          speciesId,
          catchDate,
          latitude: catch_data.latitude,
          longitude: catch_data.longitude,
          weightKg: weightKg ? parseFloat(weightKg) : undefined,
          lengthCm: lengthCm ? parseFloat(lengthCm) : undefined,
          baitLure: baitLure || undefined,
          weather: weather || undefined,
          tide: tide || undefined,
          timeOfDay: timeOfDay || undefined,
          notes: notes || undefined,
          isPublic,
        },
        catch_data.photo_url,
        newPhoto ?? undefined
      );
      router.refresh();
      setEditing(false);
    } catch {
      // stay in edit mode on error
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm dark:bg-gray-900";

  if (editing) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-xs text-gray-500 mb-1">{t("photo")}</p>
          <PhotoUpload onSelect={setNewPhoto} />
          {!newPhoto && (
            <img
              src={catch_data.photo_url}
              alt={catch_data.species_name}
              className="w-full h-48 object-cover rounded-lg mt-2 opacity-60"
            />
          )}
        </div>

        <SpeciesPicker locale={locale} value={speciesId} onChange={setSpeciesId} />

        <div>
          <label className="block text-sm font-medium mb-1">{t("date")} *</label>
          <input
            type="date"
            value={catchDate}
            onChange={(e) => setCatchDate(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("weight")}</label>
            <input
              type="number"
              step="0.01"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("length")}</label>
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
          <label className="block text-sm font-medium mb-1">{t("bait")}</label>
          <input
            type="text"
            value={baitLure}
            onChange={(e) => setBaitLure(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("weather")}</label>
            <input
              type="text"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("tide")}</label>
            <input
              type="text"
              value={tide}
              onChange={(e) => setTide(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t("time")}</label>
          <input
            type="time"
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t("notes")}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>

        <div>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="block text-sm font-medium">{t("isPublic")}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t("isPublicHelp")}</span>
            </div>
            <div
              role="switch"
              aria-checked={isPublic}
              onClick={() => setIsPublic(!isPublic)}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); setIsPublic(!isPublic); } }}
              tabIndex={0}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out cursor-pointer ${
                isPublic ? "bg-cyan-600" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isPublic ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </label>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-cyan-600 text-white py-2.5 rounded-lg font-medium hover:bg-cyan-700 disabled:opacity-50 transition-colors"
          >
            {saving ? t("saving") : tCommon("save")}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="flex-1 border border-gray-300 dark:border-gray-600 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {tCommon("cancel")}
          </button>
        </div>
      </div>
    );
  }

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

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex-1 bg-cyan-600 text-white py-2.5 rounded-lg font-medium hover:bg-cyan-700 transition-colors"
        >
          {t("edit")}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {deleting ? t("deleting") : t("delete")}
        </button>
      </div>
    </div>
  );
}
