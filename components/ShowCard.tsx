import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatShortDate, withPt } from "@/lib/format";
import { KIND_SHORT, type IntentSignalKind, type RankedShow } from "@/lib/types";

export function ShowCard({
  row,
  rank,
  featured = false,
  going = false,
  skipped = false,
}: {
  row: RankedShow;
  rank: number;
  featured?: boolean;
  going?: boolean;
  skipped?: boolean;
}) {
  const { show } = row;
  const kinds = uniqueKinds(row).slice(0, featured ? 4 : 3);
  const conflict = show.conflict;

  return (
    <article className={cn(skipped && "opacity-55")}>
      <Link
        href={`/show/${show.id}`}
        className="block overflow-hidden rounded-2xl border border-white/10"
        style={{
          background: featured
            ? `linear-gradient(165deg, ${show.accent}33, transparent 46%), #161311`
            : "#161311",
        }}
      >
        <div className="flex">
          <div className="w-1.5 shrink-0" style={{ background: show.accent }} aria-hidden />
          <div className="relative min-w-0 flex-1 px-4 py-4">
            <span
              className="pointer-events-none absolute -right-1 top-2 font-display text-7xl uppercase leading-none text-paper/[0.04]"
              aria-hidden
            >
              {show.artist.slice(0, 1)}
            </span>
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-mist">
                #{rank}
                <span className="px-1.5 text-white/20">/</span>
                {formatShortDate(show.date)}
              </p>
              <div className="text-right">
                <p className="font-display text-3xl leading-none text-gold">{row.score}</p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-mist">Fit</p>
              </div>
            </div>
            <h2
              className={cn(
                "mt-2 font-display uppercase leading-[0.88] text-paper",
                featured && show.artist.length > 16 && "text-[2.45rem]",
                featured && show.artist.length <= 16 && "text-[3.15rem]",
                !featured && "text-[1.85rem]",
              )}
            >
              {show.artist}
            </h2>
            <p className="mt-2 text-sm text-paper/85">{show.venue}</p>
            <p className="text-sm text-mist">
              {withPt(show.showtime)} · {show.drive.minutes} min · {show.neighborhood}
            </p>
            {row.reasons[0] ? (
              <p className={cn("mt-3 font-serif italic leading-snug text-paper", featured ? "text-[1.15rem]" : "text-base")}>
                {row.reasons[0]}
              </p>
            ) : null}
            {featured && row.reasons[1] ? (
              <p className="mt-1 text-sm leading-snug text-mist">{row.reasons[1]}</p>
            ) : null}
            {conflict ? (
              <p className={cn("mt-3 text-sm leading-snug", conflict.severity === "hard" ? "text-ember" : "text-gold")}>
                {conflict.severity === "hard" ? "Conflict" : "Tight"} · {conflict.title}. {conflict.detail}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {going ? (
                <span className="rounded-full bg-moss px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ink">
                  Going
                </span>
              ) : null}
              {kinds.map((kind) => (
                <span key={kind} className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-mist">
                  {KIND_SHORT[kind]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function uniqueKinds(row: RankedShow): IntentSignalKind[] {
  return row.contributions
    .filter((contribution) => contribution.polarity === "positive")
    .sort((a, b) => b.points - a.points)
    .map((contribution) => contribution.kind)
    .filter((kind, index, list) => list.indexOf(kind) === index);
}
