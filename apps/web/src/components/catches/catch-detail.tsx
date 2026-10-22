"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { PhotoUpload } from "./photo-upload";
import { SpeciesPicker } from "./species-picker";
import { deleteCatch, updateCatch } from "@/lib/catches";
import { TrashIcon, WarningIcon } from "@/components/icons";

const MapComponent = dynamic(() => import("./location-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-raised rounded-[var(--r-card)]" />
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setShowDeleteConfirm(false);
    setDeleting(true);
    try {
      await deleteCatch(catch_data.id, catch_data.photo_url);
      router.push(`/${locale}/catches`);
    } catch (err) {
      console.error("Failed to delete catch:", err);
      setError(t("deleteError"));
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
    setError(null);
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
    } catch (err) {
      console.error("Failed to update catch:", err);
      setError(tCommon("errorSaving"));
    } finally {
      setSaving(false);
    }
  }

  const inputClass = "field";

  if (editing) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-label text-muted mb-1">{t("photo")}</p>
          <PhotoUpload onSelect={setNewPhoto} />
          {!newPhoto && (
            <img
              src={catch_data.photo_url}
              alt={catch_data.species_name}
              className="w-full h-48 object-cover rounded-[var(--r-card)] mt-2 opacity-60"
            />
          )}
        </div>

        <SpeciesPicker locale={locale} value={speciesId} onChange={setSpeciesId} />

        <div>
          <label className="block text-small font-medium mb-1">{t("date")} *</label>
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
            <label className="block text-small font-medium mb-1">{t("weight")}</label>
            <input
              type="number"
              step="0.01"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-small font-medium mb-1">{t("length")}</label>
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
          <label className="block text-small font-medium mb-1">{t("bait")}</label>
          <input
            type="text"
            value={baitLure}
            onChange={(e) => setBaitLure(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-small font-medium mb-1">{t("weather")}</label>
            <input
              type="text"
              value={weather}
              onChange={(e) => setWeather(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-small font-medium mb-1">{t("tide")}</label>
            <input
              type="text"
              value={tide}
              onChange={(e) => setTide(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="block text-small font-medium mb-1">{t("time")}</label>
          <input
            type="time"
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-small font-medium mb-1">{t("notes")}</label>
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
              <span className="block text-small font-medium">{t("isPublic")}</span>
              <span className="text-label text-muted">{t("isPublicHelp")}</span>
            </div>
            <div
              role="switch"
              aria-checked={isPublic}
              onClick={() => setIsPublic(!isPublic)}
              onKeyDown={(e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); setIsPublic(!isPublic); } }}
              tabIndex={0}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none cursor-pointer ${
                isPublic ? "bg-accent" : "bg-silhouette"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface ring-0 transition-transform duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none ${
                  isPublic ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </label>
        </div>

        {error && (
          <p role="alert" className="text-small text-negative border border-negative px-3 py-2 rounded-[var(--r-control)]">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex-1"
          >
            {saving ? t("saving") : tCommon("save")}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="btn-secondary flex-1"
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

  const dateLabel = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${catch_data.catch_date}T00:00:00Z`));

  return (
    <div className="space-y-6">
      {error && (
        <p role="alert" className="text-small text-negative border border-negative px-3 py-2 rounded-[var(--r-control)]">
          {error}
        </p>
      )}
      <img
        src={catch_data.photo_url}
        alt={catch_data.species_name}
        className="w-full h-64 object-cover rounded-[var(--r-card)]"
      />

      <div>
        <h1 className="font-serif-display text-subhead font-bold">{catch_data.species_name}</h1>
        <p className="text-muted">
          {t("date")}: {dateLabel}
        </p>
        {catch_data.location_name && (
          <p className="text-muted">
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
                  <p className="text-label text-muted">{f.label}</p>
                  <p className="text-small font-medium">{f.value}</p>
                </div>
              )
          )}
        </div>
      )}

      {catch_data.notes && (
        <div>
          <p className="text-label text-muted">{t("notes")}</p>
          <p className="text-small">{catch_data.notes}</p>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="btn-primary flex-1"
        >
          {t("edit")}
        </button>
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          disabled={deleting}
          className="btn-danger flex-1"
        >
          <TrashIcon className="h-5 w-5" />
          {deleting ? t("deleting") : t("delete")}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-text/40"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-surface border border-border rounded-[var(--r-card)] shadow-xl p-6 max-w-sm w-full space-y-4">
            <div className="flex flex-col items-center text-center space-y-3">
              <WarningIcon className="h-10 w-10 text-negative" />
              <h3 className="font-serif-display text-subhead font-bold text-text">
                {t("confirmDelete")}
              </h3>
              <p className="text-body text-muted">
                {t("confirmDeleteDescription")}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-secondary flex-1"
              >
                {tCommon("cancel")}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="btn-danger flex-1"
              >
                <TrashIcon className="h-5 w-5" />
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
