import { useState } from "react";
import { useHouse, storeItem, readNote, type BoxItemId } from "~/lib/house";
import { sfx } from "~/lib/sound";

const ITEMS: { id: BoxItemId; glyph: string; label: string }[] = [
  { id: "questions", glyph: "?", label: "unanswered questions" },
  { id: "control", glyph: "◐", label: "things you can't control" },
  { id: "replaying", glyph: "⟲", label: "things you keep replaying" },
  { id: "tomorrow", glyph: "▦", label: "tomorrow" },
  { id: "expectations", glyph: "≡", label: "expectations" },
  { id: "notyours", glyph: "◇", label: "things that weren't yours to fix" },
];

export function Box({ onClose }: { onClose: () => void }) {
  const h = useHouse();
  const [stage, setStage] = useState<"note" | "items">(h.noteRead ? "items" : "note");
  const [placing, setPlacing] = useState<BoxItemId | null>(null);

  function place(id: BoxItemId) {
    setPlacing(id);
    sfx.tap();
    setTimeout(() => { storeItem(id); setPlacing(null); }, 700);
  }

  return (
    <div className="fixed inset-0 z-50 pad flex flex-col bg-black/95 fade" style={{ background: "radial-gradient(circle at 50% 40%,#100c14,#020203 75%)" }}>
      <div className="flex justify-end">
        <button onClick={onClose} className="min-h-12 px-4 text-xs tracking-widest opacity-50">close</button>
      </div>

      {stage === "note" ? (
        <div className="flex-1 grid place-items-center text-center px-6">
          <div className="max-w-xs">
            <p className="text-[10px] tracking-[.4em] opacity-40 mb-8">THINGS YOU DON'T NEED TO CARRY INSIDE</p>
            <p className="text-base font-light opacity-90">You don't have to leave anything here.</p>
            <p className="text-base font-light opacity-90 mt-3">I just thought you might want somewhere to put it.</p>
            <button onClick={() => { readNote(); setStage("items"); }} className="mt-10 min-h-12 px-6 rounded-full border border-white/25 text-[10px] tracking-[.3em] active:scale-95 transition">
              open
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-[10px] tracking-[.4em] opacity-30 text-center mb-8">THINGS YOU DON'T NEED TO CARRY INSIDE</p>
          <div className="grid grid-cols-3 gap-4 px-2">
            {ITEMS.map((it) => {
              const stored = h.storedItems.includes(it.id);
              const anim = placing === it.id;
              return (
                <button
                  key={it.id}
                  disabled={stored}
                  onClick={() => place(it.id)}
                  className={
                    "aspect-square rounded-2xl border grid place-items-center gap-1 transition-all duration-700 " +
                    (stored ? "opacity-0 scale-75 pointer-events-none" : anim ? "opacity-0 scale-50 border-white/10" : "border-white/20 active:scale-95")
                  }
                >
                  <span className="text-2xl opacity-80">{it.glyph}</span>
                  <span className="text-[8px] tracking-widest opacity-40 text-center leading-tight px-1">{it.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-center text-[10px] tracking-widest opacity-25 mt-10">
            {h.storedItems.length > 0 ? "set down whenever you want." : "tap something, if you want to set it down."}
          </p>
        </div>
      )}
    </div>
  );
}