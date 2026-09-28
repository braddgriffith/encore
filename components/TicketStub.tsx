import { formatMoney, formatShortDate, withPt } from "@/lib/format";
import type { PriorStub, Show } from "@/lib/types";

export function TicketStub({ show }: { show: Show }) {
  const { stub } = show;
  return (
    <div className="relative rounded-xl bg-[#f3ecdf] px-4 py-4 text-[#1a140e] shadow-[0_16px_40px_rgba(0,0,0,0.35)]">
      <span className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-ink" aria-hidden />
      <span className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-ink" aria-hidden />
      <div className="flex items-start justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">Encore</p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a5a28]">Demo stub · not a ticket</p>
      </div>
      <h3 className="mt-3 font-display text-4xl uppercase leading-[0.9]">{show.artist}</h3>
      <p className="mt-2 text-sm">{show.venue}</p>
      <p className="text-sm">
        {formatShortDate(show.date)} · {withPt(show.showtime)}
      </p>
      <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
        <div>
          <dt className="uppercase tracking-wider text-[#1a140e]/55">Section</dt>
          <dd className="mt-0.5 font-medium">{stub.section}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-[#1a140e]/55">Seat</dt>
          <dd className="mt-0.5 font-medium">{stub.seat}</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider text-[#1a140e]/55">Face</dt>
          <dd className="mt-0.5 font-medium">{formatMoney(stub.faceValue)}</dd>
        </div>
      </dl>
      <div className="my-4 border-t border-dashed border-[#1a140e]/30" />
      <div className="barcode" aria-hidden />
      <p className="mt-2 text-center font-mono text-[11px] tracking-[0.18em]">{stub.confirmation}</p>
      <p className="mt-1 text-center text-[10px] uppercase tracking-[0.16em] text-[#1a140e]/55">{stub.seller}</p>
    </div>
  );
}

export function PriorReceipt({ stub }: { stub: PriorStub }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-gold">From receipts · demo</p>
      <p className="mt-2 font-display text-2xl uppercase leading-none text-paper">{stub.artist}</p>
      <p className="mt-2 text-sm text-mist">
        {stub.when} · {stub.venue}
      </p>
      <p className="mt-1 font-mono text-[11px] tracking-widest text-paper/80">{stub.confirmation}</p>
      <p className="mt-2 text-sm text-mist">{stub.note}</p>
    </div>
  );
}
