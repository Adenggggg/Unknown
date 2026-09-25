import { useToast } from "~/lib/game-state";
export function Toast() {
  const t = useToast();
  return t ? <div className="fixed left-1/2 -translate-x-1/2 bottom-28 z-50 rounded-full border border-white/40 bg-black/80 px-6 py-3 text-xs tracking-[.4em] fade">{t}</div> : null;
}
