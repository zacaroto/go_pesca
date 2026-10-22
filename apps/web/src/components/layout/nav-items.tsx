/** Every app section once, with its icon. Shared by the desktop sidebar and the phone "Más" sheet. */
export type NavItem = { href: string; key: string; icon: React.ReactNode };
export type NavSection = { key: "myFishing" | "explore" | "community" | null; items: NavItem[] };

const icon = (paths: React.ReactNode) => (
  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {paths}
  </svg>
);

export const NAV_ICONS = {
  home: icon(
    <>
      <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <path d="M9 21v-9h6v9" />
    </>,
  ),
  pokedex: icon(
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>,
  ),
  catches: icon(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="11" r="2" />
      <path d="m21 17-5-5-8 7" />
    </>,
  ),
  achievements: icon(
    <>
      <circle cx="12" cy="9" r="6" />
      <path d="M8.5 14 7 22l5-3 5 3-1.5-8" />
    </>,
  ),
  species: icon(<path d="M2 12c3-5 9-7 14-4l5-3v14l-5-3c-5 3-11 1-14-4z" />),
  learn: icon(
    <>
      <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" />
      <path d="M4 19V5M8 7h6M8 11h6" />
    </>,
  ),
  community: icon(
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>,
  ),
  groups: icon(
    <>
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <path d="M2 20c0-3 3-5 6-5s6 2 6 5M14 15c3 0 8 1 8 5" />
    </>,
  ),
  profile: icon(
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </>,
  ),
  more: icon(
    <>
      <circle cx="5" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </>,
  ),
  plus: icon(<path d="M12 5v14M5 12h14" />),
};

export const NAV_SECTIONS: NavSection[] = [
  { key: null, items: [{ href: "/", key: "home", icon: NAV_ICONS.home }] },
  {
    key: "myFishing",
    items: [
      { href: "/pokedex", key: "pokedex", icon: NAV_ICONS.pokedex },
      { href: "/catches", key: "myCatches", icon: NAV_ICONS.catches },
      { href: "/achievements", key: "achievements", icon: NAV_ICONS.achievements },
    ],
  },
  {
    key: "explore",
    items: [
      { href: "/species", key: "species", icon: NAV_ICONS.species },
      { href: "/learn", key: "learn", icon: NAV_ICONS.learn },
    ],
  },
  {
    key: "community",
    items: [
      { href: "/community", key: "community", icon: NAV_ICONS.community },
      { href: "/groups", key: "groups", icon: NAV_ICONS.groups },
    ],
  },
];

/** "/catches/new" belongs to the + button, not to "Mis capturas". */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/catches" && pathname.startsWith("/catches/new")) return false;
  return pathname === href || pathname.startsWith(href + "/");
}
