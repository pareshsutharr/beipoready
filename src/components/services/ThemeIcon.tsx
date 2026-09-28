import type { LucideIcon } from "lucide-react";
import type { ServiceTheme } from "@/lib/service-theme";

export default function ThemeIcon({
  icon: Icon,
  theme,
  size = "md",
}: {
  icon: LucideIcon;
  theme: ServiceTheme;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "w-9 h-9" : "w-12 h-12";
  const iconSize = size === "sm" ? "w-4 h-4" : "w-6 h-6";

  if (theme.iconShape === "diamond") {
    return (
      <div className={`${box} shrink-0 rotate-45 rounded-lg flex items-center justify-center`} style={{ background: theme.colors.accent }}>
        <Icon className={`${iconSize} -rotate-45`} style={{ color: theme.colors.darker }} aria-hidden="true" />
      </div>
    );
  }

  if (theme.iconShape === "bracket") {
    return (
      <div className={`relative ${box} shrink-0 flex items-center justify-center`}>
        <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: theme.colors.accent }} aria-hidden="true" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: theme.colors.accent }} aria-hidden="true" />
        <Icon className={iconSize} style={{ color: theme.colors.dark }} aria-hidden="true" />
      </div>
    );
  }

  if (theme.iconShape === "circle") {
    return (
      <div className={`${box} shrink-0 rounded-full flex items-center justify-center`} style={{ background: `${theme.colors.accent}26` }}>
        <Icon className={iconSize} style={{ color: theme.colors.dark }} aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={`${box} shrink-0 rounded-2xl flex items-center justify-center`} style={{ background: `${theme.colors.accent}26` }}>
      <Icon className={iconSize} style={{ color: theme.colors.dark }} aria-hidden="true" />
    </div>
  );
}
