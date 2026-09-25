import { GLYPH, type UObj } from "~/lib/universe";
export function WhatYouBuilt({ objs, onDone }: { objs: UObj[]; onDone: () => void }) {
  return <div className="fixed inset-0 z-50 pad flex flex-col bg-black fade">
    <p className="text-[10px] tracking-[.4em] opacity-50 mt-2">WHAT YOU BUILT</p>
    <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-3 content-start py-6">
      {objs.map((o, i) => <div key={o.id} className="aspect-square rounded-xl border border-white/15 grid place-items-center text-2xl fade" style={{ animationDelay: i * 60 + "ms" }}>{GLYPH[o.kind]}</div>)}
      {objs.length === 0 && <p className="col-span-3 text-xs opacity-40">Nothing here yet.</p>}
    </div>
    <button onClick={onDone} className="min-h-12 mb-4 text-xs tracking-[.3em] opacity-60">close</button>
  </div>;
}
