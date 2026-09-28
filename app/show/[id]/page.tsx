import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShowDetail } from "@/components/ShowDetail";
import { SHOWS, getShow } from "@/lib/mock-data";

export function generateStaticParams() {
  return SHOWS.map((show) => ({ id: show.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const show = getShow(id);
  if (!show) return { title: "Show" };
  return {
    title: show.artist,
    description: `${show.artist} at ${show.venue}. Demo listing, not a live ticket.`,
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const show = getShow(id);
  if (!show) notFound();
  return <ShowDetail show={show} />;
}
