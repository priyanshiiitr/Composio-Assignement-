import { SiteHeader } from "@/components/SiteHeader";
import { GeneratedGuideClient } from "@/components/GeneratedGuideClient";
import { getGeneratedGuide } from "@/lib/generated-store";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guide = await getGeneratedGuide(id);
  if (!guide) return { title: "Generated guide · OAuth Pathfinder" };
  return {
    title: `${guide.name} OAuth setup · OAuth Pathfinder`,
    description: guide.summary,
  };
}

export default async function GeneratedGuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guide = await getGeneratedGuide(id);

  return (
    <>
      <SiteHeader />
      <main className="guide-main">
        <GeneratedGuideClient id={id} initial={guide} />
      </main>
    </>
  );
}
