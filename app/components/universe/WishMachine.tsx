import { useState } from "react";
import { setEvent, type EventKind } from "~/lib/worldState";
import { sfx } from "~/lib/sound";
const OPTS: { k: EventKind; n: string }[] = [{ k: "meteor", n: "Meteor Shower" }, { k: "aurora", n: "Aurora" }, { k: "fireflies", n: "Fireflies" }, { k: "sunset", n: "Sunset" }, { k: "rain", n: "Rain" }, { k: "snow", n: "Snow" }, { k: "midnight", n: "Midnight City" }];
export function WishMachine({ onWished }: { onWished: () => void }) {
  const [mode, setMode] = useState<"idle" | "choose">("idle");
  const trigger = (k: EventKind) => { sfx.success(); setEvent(k); onWished(); };
  return <div className="flex-1 grid place-content-center text-center gap-3">
    <p className="text-xs opacity-50 tracking-widest">MAKE A WISH</p>
    {mode === "idle" ? <div className="flex flex-col gap-2 items-center">
      <button onClick={() => trigger("aurora")} className="min-h-12 px-6 rounded-full border border-white/25 text-xs tracking-widest active:scale-95 transition">SHOW ME SOMETHING BEAUTIFUL</button>
      <button onClick={() => trigger(OPTS[Math.floor(Math.random() * OPTS.length)].k)} className="min-h-12 px-6 rounded-full border border-white/25 text-xs tracking-widest active:scale-95 transition">SURPRISE ME</button>
      <button onClick={() => setMode("choose")} className="min-h-12 px-6 rounded-full border border-white/25 text-xs tracking-widest active:scale-95 transition">LET ME CHOOSE</button>
    </div> : <div className="grid grid-cols-2 gap-2">{OPTS.map((o) => <button key={o.n} onClick={() => trigger(o.k)} className="px-3 py-3 rounded-xl border border-white/15 text-xs">{o.n}</button>)}</div>}
  </div>;
}
