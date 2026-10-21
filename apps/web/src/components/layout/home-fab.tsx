"use client";

import { Link } from "@/i18n/navigation";

export function HomeFAB() {
  return (
    <Link
      href="/catches/new"
      aria-label="Nueva captura"
      style={{
        position: "fixed",
        bottom: "80px",
        right: "18px",
        zIndex: 40,
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background: "var(--accent)",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(37,99,235,0.4)",
        textDecoration: "none",
        transition: `transform var(--t-press) var(--ease-spring), box-shadow var(--t-press)`,
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "scale(0.92)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(37,99,235,0.3)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.4)";
      }}
      className="sm:hidden"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 5v14M5 12h14" />
      </svg>
    </Link>
  );
}
