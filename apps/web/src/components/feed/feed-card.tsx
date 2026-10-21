"use client";

import { Link } from "@/i18n/navigation";
import { ReactionBar } from "./reaction-bar";
import type { FeedCatch, FeedReactions } from "@/lib/feed";

type Props = {
  catch_entry: FeedCatch;
  reactions: FeedReactions;
  index?: number;
};

function habitatPill(habitat: string | null | undefined) {
  if (habitat === "saltwater")  return { cls: "pill-salt",  label: "Salada" };
  if (habitat === "freshwater") return { cls: "pill-fresh", label: "Dulce" };
  return { cls: "pill-brack", label: "Salobre" };
}

function relativeTime(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (diffDays === 0) return "hoy";
  if (diffDays === 1) return "ayer";
  if (diffDays < 7)  return `hace ${diffDays} días`;
  return date.toLocaleDateString("es", { day: "numeric", month: "short" });
}

export function FeedCard({ catch_entry, reactions, index = 0 }: Props) {
  const pill = habitatPill(catch_entry.habitat);
  const delay = `${index * 60}ms`;

  return (
    <article
      style={{
        background: "var(--surface)",
        borderRadius: "var(--r-card)",
        overflow: "hidden",
        marginBottom: "var(--gap)",
        opacity: 0,
        animation: `card-in var(--t-enter) var(--ease-out) ${delay} forwards`,
        animationFillMode: "forwards",
      }}
    >
      {/* Photo with overlaid content */}
      <div className="relative w-full" style={{ height: "200px", background: "var(--raised)" }}>
        <img
          src={catch_entry.photo_url}
          alt={catch_entry.species_name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient overlay — bottom 85% opacity → 0 at top */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.45) 40%, transparent 100%)",
          }}
        />

        {/* Species name + weight + pill */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontWeight: 900,
              fontSize: "22px",
              color: "#ffffff",
              margin: 0,
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {catch_entry.species_name}
          </h3>

          <div className="flex items-center gap-2 mt-1.5" style={{ minWidth: 0 }}>
            {catch_entry.weight_kg && (
              <span
                style={{
                  fontFamily: "var(--font-inter), system-ui, sans-serif",
                  fontWeight: 700,
                  fontSize: "28px",
                  color: "#ffffff",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  flexShrink: 0,
                }}
              >
                {catch_entry.weight_kg} kg
              </span>
            )}
            <span
              className={pill.cls}
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "3px 8px",
                borderRadius: "var(--r-pill)",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {pill.label}
            </span>
          </div>
        </div>
      </div>

      {/* Meta row — location + time */}
      <div
        className="flex items-center gap-2 px-4 pt-3"
        style={{ color: "var(--faint)", fontSize: "11px", fontWeight: 500 }}
      >
        {catch_entry.location_name && (
          <>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, overflowWrap: "anywhere" }}>
              {catch_entry.location_name}
            </span>
            <span style={{ flexShrink: 0 }}>·</span>
          </>
        )}
        <span style={{ flexShrink: 0 }}>{relativeTime(catch_entry.catch_date)}</span>
      </div>

      {/* User + Reactions footer */}
      <div className="flex items-center justify-between px-4 py-3" style={{ minWidth: 0 }}>
        <Link
          href={`/profile/${catch_entry.user_id}` as "/profile/[userId]"}
          className="flex items-center gap-2 active:opacity-70"
          style={{ textDecoration: "none", minWidth: 0 }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "var(--raised)",
              overflow: "hidden",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {catch_entry.avatar_url ? (
              <img src={catch_entry.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--accent-hi)" }}>
                {catch_entry.display_name?.charAt(0)?.toUpperCase() ?? "?"}
              </span>
            )}
          </div>
          <span
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
              overflowWrap: "anywhere",
            }}
          >
            {catch_entry.display_name}
          </span>
        </Link>

        <ReactionBar
          catchId={catch_entry.id}
          counts={reactions.counts}
          userReaction={reactions.userReaction}
        />
      </div>
    </article>
  );
}
