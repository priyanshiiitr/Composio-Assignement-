import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { GuideView } from "@/components/GuideView";
import { getCuratedGuides, getGuideBySlug } from "@/lib/guides";

export async function generateStaticParams() {
  const guides = await getCuratedGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return { title: "Guide not found" };
  return {
    title: `${guide.name} OAuth setup · OAuth Pathfinder`,
    description: guide.summary,
  };
}

export default async function CuratedGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <>
      <SiteHeader />
      <main className="guide-main">
        <GuideView guide={guide} />
      </main>
    </>
  );
}
