import { useState } from "react";
import { addCafe, useWorld } from "~/lib/worldState";
const BASE = ["Midnight", "Very Serious", "Quiet", "Slightly Strange", "Definitely Not"];
const MID = ["Strawberry", "Chocolate", "Lavender", "Storm", "Paper Moon"];
const END = ["Cloud", "Soup", "Thing", "Tea", "Fog"];
export function Cafe() {
  const w = useWorld(); const [a, setA] = useState(0), [b, setB] = useState(0), [c, setC] = useState(0); const [made, setMade] = useState<string | null>(null);
  const row = (arr: string[], v: number, set: (n: number) => void) => <div className="flex gap-2 flex-wrap justify-center">{arr.map((x, i) => <button key={x} onClick={() => set(i)} className={"px-3 py-2 rounded-full border text-xs " + (v === i ? "border-white/70" : "border-white/15 opacity-50")}>{x}</button>)}</div>;
  return <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
    <p className="text-xs opacity-50 tracking-widest">TINY CAFÉ</p>
    {row(BASE, a, setA)}{row(MID, b, setB)}{row(END, c, setC)}
    <button onClick={() => { const n = `${BASE[a]} ${MID[b]} ${END[c]}`; setMade(n); addCafe(n); }} className="min-h-12 px-6 rounded-full border border-white/25 text-xs tracking-widest active:scale-95 transition">make it</button>
    {made && <p className="mt-2 text-lg font-light fade">{made}</p>}
    {w.cafeCreations.length > 0 && <p className="text-[10px] opacity-30">{w.cafeCreations.length} made so far</p>}
  </div>;
}
