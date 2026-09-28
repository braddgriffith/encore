import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-5 pb-28 pt-16">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold">Encore</p>
      <h1 className="mt-3 font-display text-6xl uppercase leading-none text-paper">Missing</h1>
      <p className="mt-3 font-serif text-lg text-paper">That show is not in the September seed.</p>
      <Link href="/" className="mt-6 inline-block text-sm text-gold">
        Back to Discover
      </Link>
    </div>
  );
}
