import type { Metadata } from "next";
import { Suspense } from "react";
import KnowledgeCenterClient from "@/components/knowledge/KnowledgeCenterClient";
import { getPublishedArticles } from "@/lib/cms";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Knowledge Center",
  description:
    "In-depth guides, regulatory updates, and practical insights on SME IPOs, SEBI compliance, and capital markets, written by Be IPO Ready advisors.",
  path: "/knowledge-center",
  keywords: ["SME IPO guides", "SEBI compliance articles", "IPO knowledge center India"],
});

export default async function KnowledgeCenterPage() {
  const articles = await getPublishedArticles();

  return (
    <Suspense fallback={null}>
      <KnowledgeCenterClient articles={articles} />
    </Suspense>
  );
}
