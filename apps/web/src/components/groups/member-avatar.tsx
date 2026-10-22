import type { GroupMember } from "./group-member-list";

/** Round avatar: the member's photo, or their initial on the accent tint. */
export function MemberAvatar({ member, className = "h-8 w-8 text-label" }: { member: GroupMember; className?: string }) {
  if (member.avatar_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={member.avatar_url} alt="" className={`shrink-0 rounded-full object-cover ${className}`} />;
  }
  return (
    <span className={`grid shrink-0 place-items-center rounded-full bg-accent-soft font-semibold text-accent-ink ${className}`}>
      {member.display_name?.charAt(0)?.toUpperCase() || "?"}
    </span>
  );
}
