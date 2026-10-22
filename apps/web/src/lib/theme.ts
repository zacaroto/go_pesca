export type ThemeChoice = "system" | "light" | "dark";

export const THEME_KEY = "gp-theme";

/** Reads the stored choice; anything missing or unknown means "follow the system". */
export function parseTheme(value: string | null | undefined): ThemeChoice {
  return value === "light" || value === "dark" ? value : "system";
}

/**
 * Runs in <head> before first paint so an explicit choice never flashes the other theme.
 * "system" leaves data-theme unset and the CSS follows prefers-color-scheme.
 */
export const themeInitScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  const swap = () => {
    if (choice === "system") delete root.dataset.theme;
    else root.dataset.theme = choice;
  };
  // Cross-fade the colors where the View Transitions API exists; elsewhere (or with reduced motion) swap at once.
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && typeof document.startViewTransition === "function") document.startViewTransition(swap);
  else swap();
  try {
    if (choice === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, choice);
  } catch {
    // Private mode or blocked storage: the choice still applies for this page view.
  }
}
