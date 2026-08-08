import packageJson from "../../package.json";

export function VersionBadge() {
  return (
    <span className="text-[10px] text-gray-400 dark:text-gray-500">
      v{packageJson.version}
    </span>
  );
}
