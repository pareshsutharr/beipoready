/**
 * Category-based fallback thumbnails for articles without an uploaded cover
 * image. Keys must match the Title Case label `getPublishedArticles()`
 * derives from the BlogCategory enum (e.g. "pre-ipo-fundraising" -> "Pre Ipo
 * Fundraising"), not the raw enum value.
 */
const CATEGORY_IMAGES: Record<string, string> = {
  "Sme Ipo":              "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=320&fit=crop&q=80",
  "Pre Ipo Fundraising":  "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&h=320&fit=crop&q=80",
  "Ipo Readiness":        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=320&fit=crop&q=80",
  Valuation:              "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=320&fit=crop&q=80",
  Compliance:             "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=320&fit=crop&q=80",
  "Capital Markets":      "https://images.unsplash.com/photo-1560221328-12fe60f83ab8?w=600&h=320&fit=crop&q=80",
};

const DEFAULT_ARTICLE_IMAGE =
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=320&fit=crop&q=80";

export function articleImageUrl(article: {
  coverImageUrl?: string | null;
  category: string;
}): string {
  return (
    article.coverImageUrl ?? CATEGORY_IMAGES[article.category] ?? DEFAULT_ARTICLE_IMAGE
  );
}
