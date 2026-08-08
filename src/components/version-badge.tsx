import packageJson from "../../package.json";

export function VersionBadge() {
  return (
    <span className="text-[10px] text-muted">
      v{packageJson.version}
    </span>
  );
}
