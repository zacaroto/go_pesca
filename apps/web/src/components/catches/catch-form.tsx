"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { PhotoUpload } from "./photo-upload";
import { SpeciesPicker, type PickedSpecies } from "./species-picker";
import { LocationPicker } from "./location-picker";
import { CatchPreview, CatchInsightBlock } from "./catch-preview";
import { StepBar } from "./step-bar";
import { Segmented } from "./segmented";
import { submitCatch } from "@/lib/catches";
import { checkAndAwardAchievements } from "@/lib/achievements";
import { useAchievements } from "@/components/achievements/achievement-provider";
import { getUserGroups } from "@/lib/groups";
import { getCatchInsight, type CatchInsight, type SpeciesBest } from "@/lib/catch-insight";
import { fetchSpeciesBests } from "@/lib/species-bests-client";
import { rankUpAfter } from "@/lib/rank";

type Props = {
  locale: string;
};

type Step = 1 | 2 | 3;

const INPUT_CLASS =
  "h-[42px] w-full rounded-[var(--r-control)] bg-[var(--ground)] px-3.5 text-sm text-[var(--text)] outline-none placeholder:text-[var(--faint)] focus:shadow-[inset_0_0_0_1.5px_var(--accent)] transition-[box-shadow] duration-[var(--t-ui)] motion-reduce:transition-none";
const LABEL_CLASS = "block text-[13px] font-medium text-[var(--text)] mb-1.5";
const BTN_BASE =
  "inline-flex items-center justify-center gap-2 h-11 px-6 rounded-[var(--r-control)] text-sm font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] transition-[background-color,transform,opacity] duration-[var(--t-ui)] ease-[var(--ease-out)] active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100";

/** Today's calendar date in Costa Rica (YYYY-MM-DD), so evenings don't roll over to tomorrow. */
function todayInCostaRica(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Costa_Rica",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function Toggle({ checked, onChange, title, help }: { checked: boolean; onChange: (v: boolean) => void; title: string; help: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-t border-[var(--rule)]">
      <div className="min-w-0">
        <b className="block text-sm font-semibold text-[var(--text)]">{title}</b>
        <span className="block text-xs text-[var(--muted)]">{help}</span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        data-checked={checked}
        onClick={() => onChange(!checked)}
        className="relative shrink-0 w-11 h-6 rounded-full cursor-pointer bg-[var(--raised)] hover:bg-[var(--border)] data-[checked=true]:bg-[var(--accent)] data-[checked=true]:hover:bg-[var(--accent-hi)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] transition-[background-color] duration-[var(--t-ui)] motion-reduce:transition-none"
      >
        <span
          aria-hidden="true"
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[var(--on-primary)] transition-[transform] duration-[var(--t-ui)] ease-[var(--ease-out)] motion-reduce:transition-none ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export function CatchForm({ locale }: Props) {
  const t = useTranslations("catches");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { showAchievements } = useAchievements();

  const [step, setStep] = useState<Step>(1);

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [speciesId, setSpeciesId] = useState<number | null>(null);
  const [speciesMeta, setSpeciesMeta] = useState<PickedSpecies | null>(null);
  const [bests, setBests] = useState<SpeciesBest[] | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationName, setLocationName] = useState("");
  const [catchDate, setCatchDate] = useState(todayInCostaRica);

  // Optional fields. Stored values stay as they are in existing rows; labels go through t().
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
      .catch((err) => console.error("CatchForm: failed to load groups", err));
    fetchSpeciesBests().then(setBests);
  }, []);

  useEffect(() => {
    // Object URLs are an external resource: create per file, revoke on change/unmount.
    if (!photo) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhotoUrl(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);

  const insight: CatchInsight = bests
    ? getCatchInsight(speciesId, weightKg ? Number(weightKg) : null, bests)
    : { kind: "none" };
  // A new species may push the angler to the next rank step; bests.length is the species caught so far.
  const rankUp = insight.kind === "new" && bests ? rankUpAfter(bests.length) : null;

  function handleLocationChange(lat: number, lng: number) {
    setLatitude(lat);
    setLongitude(lng);
  }

  function validate(s: Step): boolean {
    if (s === 1) {
      if (!photo) return fail(t("errorPhoto"));
      if (!speciesId) return fail(t("errorSpecies"));
    }
    if (s === 2 && (latitude === null || longitude === null)) return fail(t("errorLocation"));
    setError(null);
    return true;
  }

  function fail(message: string): false {
    setError(message);
    return false;
  }

  /** Going back is free; going forward validates every step on the way, like Next. */
  function goToStep(target: number) {
    if (target <= step) {
      setError(null);
      setStep(target as Step);
      return;
    }
    for (let s = step; s < target; s++) {
      if (!validate(s as Step)) {
        setStep(s as Step);
        return;
      }
    }
    setStep(target as Step);
  }

  async function handleSubmit() {
    setError(null);

    if (!photo || !speciesId || latitude === null || longitude === null) {
      setError(t("errorRequired"));
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
      } catch (err) {
        // Don't block navigation if achievement check fails
        console.error("CatchForm: achievement check failed", err);
      }

      router.push(`/${locale}/catches`);
    } catch (err) {
      console.error("CatchForm: submit failed", err);
      setError(t("errorSave"));
    } finally {
      setSubmitting(false);
    }
  }

  const stepNames = [t("stepPhotoSpecies"), t("stepPlaceDate"), t("stepDetails")];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24">
      <div className="grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] gap-12 items-start">
        <div>
          <header className="mb-6">
            <h1 className="font-serif-display font-black text-4xl sm:text-5xl leading-tight text-[var(--text)]">
              {t("newCatch")}
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">{t("requiredHint")}</p>
          </header>

          <StepBar steps={stepNames} current={step} label={t("stepsLabel")} onSelect={goToStep} />

          <div className="bg-[var(--surface)] rounded-[var(--r-card)] p-5 sm:p-6 flex flex-col gap-6">
            {step === 1 && (
              <div className="space-y-6">
                <section>
                  <span className={LABEL_CLASS}>{t("photo")} *</span>
                  <PhotoUpload value={photo} onSelect={setPhoto} />
                </section>
                <section>
                  <span className={LABEL_CLASS}>{t("species")} *</span>
                  <SpeciesPicker
                    locale={locale}
                    value={speciesId}
                    onChange={setSpeciesId}
                    onSpeciesMeta={setSpeciesMeta}
                  />
                </section>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <section>
                  <span className={LABEL_CLASS}>{t("location")} *</span>
                  <LocationPicker
                    latitude={latitude}
                    longitude={longitude}
                    onChange={handleLocationChange}
                    locationName={locationName}
                    onLocationNameChange={setLocationName}
                  />
                </section>
                <section>
                  <label htmlFor="catch-date" className={LABEL_CLASS}>{t("date")} *</label>
                  <input
                    id="catch-date"
                    type="date"
                    value={catchDate}
                    onChange={(e) => setCatchDate(e.target.value)}
                    className={INPUT_CLASS}
                    required
                  />
                </section>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="catch-weight" className={LABEL_CLASS}>{t("weight")}</label>
                    <input
                      id="catch-weight"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min="0"
                      placeholder="0.0"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      className={`${INPUT_CLASS} tabular-nums`}
                    />
                  </div>
                  <div>
                    <label htmlFor="catch-length" className={LABEL_CLASS}>{t("length")}</label>
                    <input
                      id="catch-length"
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min="0"
                      placeholder="0"
                      value={lengthCm}
                      onChange={(e) => setLengthCm(e.target.value)}
                      className={`${INPUT_CLASS} tabular-nums`}
                    />
                  </div>
                  <div>
                    <label htmlFor="catch-bait" className={LABEL_CLASS}>{t("bait")}</label>
                    <input
                      id="catch-bait"
                      type="text"
                      placeholder={t("baitPlaceholder")}
                      value={baitLure}
                      onChange={(e) => setBaitLure(e.target.value)}
                      className={INPUT_CLASS}
                    />
                  </div>
                </section>

                <section>
                  <span className={LABEL_CLASS}>{t("weather")}</span>
                  <Segmented
                    label={t("weather")}
                    value={weather}
                    onChange={setWeather}
                    options={[
                      { value: "Soleado", label: t("weatherSunny") },
                      { value: "Nublado", label: t("weatherCloudy") },
                      { value: "Lluvia", label: t("weatherRain") },
                    ]}
                  />
                </section>

                <section>
                  <span className={LABEL_CLASS}>{t("tide")}</span>
                  <Segmented
                    label={t("tide")}
                    value={tide}
                    onChange={setTide}
                    options={[
                      { value: "Marea Alta", label: t("tideHigh") },
                      { value: "Marea Baja", label: t("tideLow") },
                    ]}
                  />
                </section>

                <section>
                  <label htmlFor="timeOfDay" className={LABEL_CLASS}>{t("time")}</label>
                  <input
                    id="timeOfDay"
                    type="time"
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    className={`${INPUT_CLASS} tabular-nums`}
                  />
                </section>

                <section>
                  <label htmlFor="catch-notes" className={LABEL_CLASS}>{t("notesLabel")}</label>
                  <textarea
                    id="catch-notes"
                    rows={2}
                    placeholder={t("notesPlaceholder")}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-[var(--r-control)] bg-[var(--ground)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none resize-none placeholder:text-[var(--faint)] focus:shadow-[inset_0_0_0_1.5px_var(--accent)] transition-[box-shadow] duration-[var(--t-ui)] motion-reduce:transition-none"
                  />
                </section>

                <section>
                  <Toggle checked={isPublic} onChange={setIsPublic} title={t("isPublic")} help={t("isPublicHelp")} />
                  {hasGroups && (
                    <Toggle checked={shareToGroups} onChange={setShareToGroups} title={t("shareToGroups")} help={t("shareToGroupsHelp")} />
                  )}
                </section>
              </div>
            )}

            {/* Phone: no preview card, only the insight above the actions */}
            <div className="lg:hidden empty:hidden">
              <CatchInsightBlock insight={insight} rankUp={rankUp} />
            </div>

            {error && (
              <p role="alert" className="text-sm font-medium text-[var(--negative)]">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep(step - 1)}
                  className={`${BTN_BASE} text-[var(--text)] hover:bg-[var(--raised)] active:bg-[var(--raised)]`}
                >
                  {t("back")}
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={() => goToStep(step + 1)}
                  className={`${BTN_BASE} bg-[var(--accent)] text-[var(--on-primary)] hover:bg-[var(--accent-hi)] active:bg-[var(--accent-hi)]`}
                >
                  {t("next")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`${BTN_BASE} bg-[var(--accent)] text-[var(--on-primary)] hover:bg-[var(--accent-hi)] active:bg-[var(--accent-hi)] disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {submitting ? tCommon("loading") : t("saveCatch")}
                </button>
              )}
            </div>
          </div>
        </div>

        <CatchPreview
          photoUrl={photoUrl}
          species={speciesMeta}
          weightKg={weightKg}
          lengthCm={lengthCm}
          locationName={locationName}
          catchDate={catchDate}
          bait={baitLure}
          insight={insight}
          rankUp={rankUp}
          locale={locale}
        />
      </div>
    </div>
  );
}
