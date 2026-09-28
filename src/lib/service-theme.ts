export type ServiceThemeKey =
  | "fund-raising"
  | "pre-ipo-advisory"
  | "sme-ipo-advisory"
  | "valuation-corporate-restructuring";

export type ServiceTheme = {
  key: ServiceThemeKey;
  /** Distinguishing concept used across copy micro-labels */
  concept: string;
  colors: {
    darker: string;
    dark: string;
    mid: string;
    accent: string;
    tint: string;
    ring: string;
    onDark: string;
  };
  /** Secondary photo (not the CMS cover image) used for in-page composition */
  photo: string;
  photoAlt: string;
  badges: string[];
  iconShape: "circle" | "soft" | "diamond" | "bracket";
};

const DEFAULT_THEME: ServiceTheme = {
  key: "fund-raising",
  concept: "capital",
  colors: {
    darker: "#070F1E", // brand-navy-dark
    dark: "#0F2D52", // brand-navy
    mid: "#17436E",
    accent: "#F59E0B", // brand-gold
    tint: "#FDF3E0",
    ring: "#FBD888",
    onDark: "#FCD34D", // brand-gold-light
  },
  photo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=1400&fit=crop&q=85",
  photoAlt: "",
  badges: ["Equity & Debt", "Curated Investors"],
  iconShape: "circle",
};

export const SERVICE_THEMES: Record<string, ServiceTheme> = {
  "fund-raising": DEFAULT_THEME,
  "pre-ipo-advisory": {
    key: "pre-ipo-advisory",
    concept: "countdown",
    colors: {
      darker: "#08283F",
      dark: "#0D4A6F",
      mid: "#1C6B99",
      accent: "#F59E0B", // brand-gold
      tint: "#EAF3FA",
      ring: "#BFE0F2",
      onDark: "#FCD34D", // brand-gold-light
    },
    photo: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&h=1400&fit=crop&q=85",
    photoAlt: "",
    badges: ["12–24 Months Out", "Governance & Positioning"],
    iconShape: "soft",
  },
  "sme-ipo-advisory": {
    key: "sme-ipo-advisory",
    concept: "listing",
    colors: {
      darker: "#0A213B",
      dark: "#123A5E",
      mid: "#1D5C8F",
      accent: "#F59E0B", // brand-gold
      tint: "#F2F8FD",
      ring: "#9FCBEA",
      onDark: "#FCD34D", // brand-gold-light
    },
    photo: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=1400&fit=crop&q=85",
    photoAlt: "",
    badges: ["NSE Emerge", "BSE SME", "Mainboard"],
    iconShape: "diamond",
  },
  "valuation-corporate-restructuring": {
    key: "valuation-corporate-restructuring",
    concept: "precision",
    colors: {
      darker: "#0F2D52", // brand-navy
      dark: "#173F66",
      mid: "#3E5C7D",
      accent: "#B45309", // brand-gold-ink
      tint: "#F0F6FF", // brand-cream
      ring: "#D7E3F3",
      onDark: "#FCD34D", // brand-gold-light
    },
    photo: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&h=1400&fit=crop&q=85",
    photoAlt: "",
    badges: ["Defensible Valuation", "Optimised Capital Stack"],
    iconShape: "bracket",
  },
};

export function getServiceTheme(slug: string): ServiceTheme {
  return SERVICE_THEMES[slug] ?? DEFAULT_THEME;
}
