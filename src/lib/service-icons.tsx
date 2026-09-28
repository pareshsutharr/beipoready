import {
  Banknote,
  TrendingUp,
  LineChart,
  Scale,
  Building2,
  Landmark,
  Briefcase,
  PieChart,
  HandCoins,
  ShieldCheck,
  Handshake,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

export const SERVICE_ICON_MAP: Record<string, LucideIcon> = {
  Banknote,
  TrendingUp,
  LineChart,
  Scale,
  Building2,
  Landmark,
  Briefcase,
  PieChart,
  HandCoins,
  ShieldCheck,
  Handshake,
  BarChart3,
};

export const SERVICE_ICON_OPTIONS = Object.keys(SERVICE_ICON_MAP).map((value) => ({
  value,
  label: value.replace(/([a-z])([A-Z])/g, "$1 $2"),
}));
