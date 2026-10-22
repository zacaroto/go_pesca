import type { ReactNode } from "react";

type IconProps = { className?: string };

function Icon({ className = "h-5 w-5", children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export const ArrowLeftIcon = (p: IconProps) => (
  <Icon {...p}><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></Icon>
);
export const ScaleIcon = (p: IconProps) => (
  <Icon {...p}><path d="M12 3v18" /><path d="M5 7h14" /><path d="m5 7-3 7a3 3 0 0 0 6 0z" /><path d="m19 7-3 7a3 3 0 0 0 6 0z" /><path d="M8 21h8" /></Icon>
);
export const RulerIcon = (p: IconProps) => (
  <Icon {...p}><path d="M3 17 17 3l4 4L7 21z" /><path d="m8 12 2 2" /><path d="m11 9 2 2" /><path d="m14 6 2 2" /></Icon>
);
export const WaterIcon = (p: IconProps) => (
  <Icon {...p}><path d="M2 8c2.5-2 4.5-2 7 0s4.5 2 7 0 3-1.5 6 0" /><path d="M2 14c2.5-2 4.5-2 7 0s4.5 2 7 0 3-1.5 6 0" /></Icon>
);
export const PinIcon = (p: IconProps) => (
  <Icon {...p}><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></Icon>
);
export const HookIcon = (p: IconProps) => (
  <Icon {...p}><path d="M12 2v10" /><path d="M12 12v4a4 4 0 1 1-8 0" /><path d="m1.5 13.5 2.5 2.5 2.5-2.5" /><circle cx="12" cy="4" r="0.5" /></Icon>
);
export const PlusIcon = (p: IconProps) => (
  <Icon {...p}><path d="M12 5v14" /><path d="M5 12h14" /></Icon>
);
export const TrophyIcon = (p: IconProps) => (
  <Icon {...p}><path d="M8 4h8v6a4 4 0 0 1-8 0z" /><path d="M8 6H4v1a4 4 0 0 0 4 4" /><path d="M16 6h4v1a4 4 0 0 1-4 4" /><path d="M12 14v4" /><path d="M8 21h8" /><path d="M9 18h6" /></Icon>
);
export const CheckCircleIcon = (p: IconProps) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="m8 12.5 3 3 5-6" /></Icon>
);
export const TrashIcon = (p: IconProps) => (
  <Icon {...p}><path d="M4 7h16" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M6 7l1 13h10l1-13" /><path d="M9 7V4h6v3" /></Icon>
);
export const WarningIcon = (p: IconProps) => (
  <Icon {...p}><path d="M12 3 2 20h20z" /><path d="M12 10v4" /><path d="M12 17.5v.01" /></Icon>
);
export const CameraIcon = (p: IconProps) => (
  <Icon {...p}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></Icon>
);
export const EditIcon = (p: IconProps) => (
  <Icon {...p}><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></Icon>
);
export const CalendarIcon = (p: IconProps) => (
  <Icon {...p}><rect x="3.5" y="5" width="17" height="15" rx="1.5" /><path d="M3.5 10h17" /><path d="M8 3v4" /><path d="M16 3v4" /></Icon>
);
export const LinkIcon = (p: IconProps) => (
  <Icon {...p}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></Icon>
);
export const CloseIcon = (p: IconProps) => (
  <Icon {...p}><path d="M6 6l12 12" /><path d="M18 6 6 18" /></Icon>
);
export const LockIcon = (p: IconProps) => (
  <Icon {...p}><rect x="5" y="11" width="14" height="9" rx="1.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></Icon>
);
export const UsersIcon = (p: IconProps) => (
  <Icon {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6" /><path d="M16 4.5a3.5 3.5 0 0 1 0 7" /><path d="M18 14.5c2 .8 3.5 2.8 3.5 5.5" /></Icon>
);
