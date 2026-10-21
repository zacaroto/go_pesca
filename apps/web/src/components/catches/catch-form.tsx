"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { PhotoUpload } from "./photo-upload";
import { SpeciesPicker } from "./species-picker";
import { LocationPicker } from "./location-picker";
import { submitCatch } from "@/lib/catches";
import { checkAndAwardAchievements } from "@/lib/achievements";
import { useAchievements } from "@/components/achievements/achievement-provider";
import { getUserGroups } from "@/lib/groups";

type Props = {
  locale: string;
};

export function CatchForm({ locale }: Props) {
  const t = useTranslations("catches");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { showAchievements } = useAchievements();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [photo, setPhoto] = useState<File | null>(null);
  const [speciesId, setSpeciesId] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationName, setLocationName] = useState("");
  const [catchDate, setCatchDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Optional fields
  const [weightKg, setWeightKg] = useState("");
  const [lengthCm, setLengthCm] = useState("");
  const [baitLure, setBaitLure] = useState("");
  const [weather, setWeather] = useState("Soleado");
  const [tide, setTide] = useState("Marea Alta");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [notes, setNotes] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [shareToGroups, setShareToGroups] = useState(true);
  const [hasGroups, setHasGroups] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUserGroups()
      .then((groups) => setHasGroups(groups.length > 0))
      .catch(() => {});
  }, []);

  function handleLocationChange(lat: number, lng: number) {
    setLatitude(lat);
    setLongitude(lng);
  }

  function validateStep1() {
    if (!photo) {
      setError("Por favor añade una foto de tu captura");
      return false;
    }
    if (!speciesId) {
      setError("Por favor selecciona una especie");
      return false;
    }
    setError(null);
    return true;
  }

  function validateStep2() {
    if (latitude === null || longitude === null) {
      setError("Por favor marca la ubicación en el mapa");
      return false;
    }
    setError(null);
    return true;
  }

  async function handleSubmit() {
    setError(null);

    if (!photo || !speciesId || latitude === null || longitude === null) {
      setError("Por favor completa los campos requeridos");
      return;
    }

    setSubmitting(true);
    try {
      const catchRecord = (await submitCatch(photo, {
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
        isPublic,
        shareToGroups,
      })) as { id: string; user_id: string };

      // Check for new achievements
      try {
        const newAchievements = await checkAndAwardAchievements(
          catchRecord.user_id,
          catchRecord.id
        );
        if (newAchievements.length > 0) {
          showAchievements(newAchievements);
        }
      } catch {
        // Don't block navigation if achievement check fails
      }

      router.push(`/${locale}/catches`);
    } catch {
      setError("Error al guardar la captura");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 pb-24">
      {/* Progress Indicator */}
      <div className="flex justify-between items-center mb-6 px-2">
        <div className="flex gap-2 items-center">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold chunky-border text-sm transition-all ${
              step >= 1 ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant"
            }`}
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            1
          </div>
          <div
            className={`w-10 sm:w-16 h-2 rounded-full border-2 border-on-surface transition-all ${
              step >= 2 ? "bg-primary" : "bg-surface-container-highest opacity-50"
            }`}
          />
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold chunky-border text-sm transition-all ${
              step >= 2 ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant opacity-60"
            }`}
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            2
          </div>
          <div
            className={`w-10 sm:w-16 h-2 rounded-full border-2 border-on-surface transition-all ${
              step >= 3 ? "bg-primary" : "bg-surface-container-highest opacity-50"
            }`}
          />
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold chunky-border text-sm transition-all ${
              step >= 3 ? "bg-primary text-on-primary" : "bg-surface-container-highest text-on-surface-variant opacity-60"
            }`}
            style={{ fontFamily: "var(--font-fredoka)" }}
          >
            3
          </div>
        </div>
        <span className="font-bold text-sm text-primary font-heading">
          Paso {step} de 3
        </span>
      </div>

      <h2
        className="font-display-lg text-2xl sm:text-3xl font-bold mb-6 text-on-surface"
        style={{ fontFamily: "var(--font-fredoka)" }}
      >
        ¡Nueva Captura! 🎣
      </h2>

      {/* Main Card Container */}
      <div className="bg-card-bg rounded-3xl chunky-border chunky-shadow p-5 sm:p-7 flex flex-col gap-6">
        {/* STEP 1: Foto & Especie */}
        {step === 1 && (
          <div className="space-y-6">
            <section>
              <label className="font-headline-md text-lg font-bold text-on-surface mb-3 block font-heading">
                1. Foto del Trofeo *
              </label>
              <div className="relative">
                <PhotoUpload onSelect={setPhoto} />
                <div className="absolute -bottom-3 -right-2 w-10 h-10 bg-sunny-yellow rounded-full chunky-border flex items-center justify-center rotate-12 shadow-sm pointer-events-none">
                  <span className="material-symbols-outlined text-on-surface text-xl">star</span>
                </div>
              </div>
            </section>

            <section>
              <label className="font-headline-md text-lg font-bold text-on-surface mb-3 block font-heading">
                2. ¿Qué especie picó? *
              </label>
              <SpeciesPicker
                locale={locale}
                value={speciesId}
                onChange={setSpeciesId}
              />
            </section>
          </div>
        )}

        {/* STEP 2: Ubicación & Fecha */}
        {step === 2 && (
          <div className="space-y-6">
            <section>
              <label className="font-headline-md text-lg font-bold text-on-surface mb-3 block font-heading">
                3. ¿Dónde ocurrió la captura? *
              </label>
              <LocationPicker
                latitude={latitude}
                longitude={longitude}
                onChange={handleLocationChange}
                locationName={locationName}
                onLocationNameChange={setLocationName}
              />
            </section>

            <section>
              <label className="font-headline-md text-lg font-bold text-on-surface mb-3 block font-heading">
                4. Fecha de la captura *
              </label>
              <input
                type="date"
                value={catchDate}
                onChange={(e) => setCatchDate(e.target.value)}
                className="w-full bg-surface-container-lowest font-body-md text-on-surface rounded-2xl chunky-border p-3.5 focus:outline-none focus:ring-4 focus:ring-secondary-container font-semibold"
                required
              />
            </section>
          </div>
        )}

        {/* STEP 3: Condiciones, Medidas & Privacidad */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Clima & Marea (Power-ups) */}
            <section>
              <label className="font-headline-md text-lg font-bold text-on-surface mb-3 block font-heading">
                5. Condiciones del Mar y Clima
              </label>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {[
                  { name: "Soleado", icon: "light_mode", bg: "bg-sunny-yellow/25 text-tertiary" },
                  { name: "Nublado", icon: "cloud", bg: "bg-outline-variant/30 text-on-surface" },
                  { name: "Lluvia", icon: "rainy", bg: "bg-primary-fixed/50 text-primary" },
                ].map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setWeather(item.name)}
                    className={`flex flex-col items-center justify-center rounded-2xl p-3 chunky-border btn-press transition-all cursor-pointer ${
                      weather === item.name ? "ring-4 ring-primary bg-sunny-yellow/50" : item.bg
                    }`}
                  >
                    <span className="material-symbols-outlined text-3xl mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {item.icon}
                    </span>
                    <span className="font-bold text-xs font-heading">{item.name}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {["Marea Alta", "Marea Baja"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTide(item)}
                    className={`flex items-center justify-center gap-2 rounded-2xl p-3 chunky-border btn-press transition-all cursor-pointer font-bold text-sm ${
                      tide === item
                        ? "bg-secondary-container text-on-secondary-container ring-2 ring-secondary"
                        : "bg-surface-container-high text-on-surface"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">waves</span>
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Medidas (Peso / Longitud) */}
            <section className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-sm text-on-surface-variant mb-1.5 block font-heading">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.0"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full bg-surface-container-lowest font-body-lg text-lg text-on-surface rounded-2xl chunky-border p-3 text-center focus:outline-none focus:ring-4 focus:ring-secondary-container font-bold"
                />
              </div>
              <div>
                <label className="font-bold text-sm text-on-surface-variant mb-1.5 block font-heading">
                  Longitud (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="0"
                  value={lengthCm}
                  onChange={(e) => setLengthCm(e.target.value)}
                  className="w-full bg-surface-container-lowest font-body-lg text-lg text-on-surface rounded-2xl chunky-border p-3 text-center focus:outline-none focus:ring-4 focus:ring-secondary-container font-bold"
                />
              </div>
            </section>

            {/* Carnada & Notas */}
            <section className="space-y-4">
              <div>
                <label className="font-bold text-sm text-on-surface-variant mb-1.5 block font-heading">
                  Carnada / Señuelo
                </label>
                <input
                  type="text"
                  placeholder="Ej. Rapala, Calamar, Camarón vivo..."
                  value={baitLure}
                  onChange={(e) => setBaitLure(e.target.value)}
                  className="w-full bg-surface-container-lowest font-body-md text-on-surface rounded-2xl chunky-border p-3 focus:outline-none focus:ring-4 focus:ring-secondary-container"
                />
              </div>

              <div>
                <label className="font-bold text-sm text-on-surface-variant mb-1.5 block font-heading">
                  Notas de la jornada
                </label>
                <textarea
                  rows={2}
                  placeholder="Comentarios, técnicas o detalles especiales..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-surface-container-lowest font-body-md text-on-surface rounded-2xl chunky-border p-3 focus:outline-none focus:ring-4 focus:ring-secondary-container resize-none"
                />
              </div>
            </section>

            {/* Switches de Privacidad */}
            <section className="space-y-3 pt-2 border-t border-outline-variant">
              <label className="flex items-center justify-between cursor-pointer p-2 bg-surface-container-low rounded-2xl chunky-border">
                <div>
                  <span className="text-sm font-bold text-on-surface flex items-center gap-2 font-heading">
                    <span className="material-symbols-outlined text-primary text-xl">public</span>
                    {t("isPublic")}
                  </span>
                  <span className="text-xs text-outline block ml-7">
                    {t("isPublicHelp")}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-6 h-6 rounded-lg accent-primary cursor-pointer"
                />
              </label>

              {hasGroups && (
                <label className="flex items-center justify-between cursor-pointer p-2 bg-surface-container-low rounded-2xl chunky-border">
                  <div>
                    <span className="text-sm font-bold text-on-surface flex items-center gap-2 font-heading">
                      <span className="material-symbols-outlined text-secondary text-xl">groups</span>
                      {t("shareToGroups")}
                    </span>
                    <span className="text-xs text-outline block ml-7">
                      {t("shareToGroupsHelp")}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={shareToGroups}
                    onChange={(e) => setShareToGroups(e.target.checked)}
                    className="w-6 h-6 rounded-lg accent-secondary cursor-pointer"
                  />
                </label>
              )}
            </section>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-neon-coral text-sm bg-error-container p-3.5 rounded-2xl chunky-border font-bold">
            <span className="material-symbols-outlined text-xl">error</span>
            {error}
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-2">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep((s) => (s - 1) as 1 | 2);
              }}
              className="bg-surface-container font-headline-md text-sm sm:text-base font-bold py-3 px-6 rounded-2xl chunky-border bouncy-shadow bouncy-hover bouncy-active transition-all"
            >
              Atrás
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && validateStep1()) setStep(2);
                else if (step === 2 && validateStep2()) setStep(3);
              }}
              className="gradient-sunset text-white font-headline-md text-sm sm:text-base font-bold py-3 px-7 rounded-2xl chunky-border chunky-shadow btn-press transition-all flex items-center gap-2"
            >
              Siguiente
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                arrow_forward
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="gradient-sunset text-white font-headline-md text-base sm:text-lg font-bold py-3.5 px-8 rounded-2xl chunky-border chunky-shadow btn-press transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-xl">check_circle</span>
              {submitting ? tCommon("loading") : "¡Guardar Captura!"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
