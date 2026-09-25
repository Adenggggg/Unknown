import { useState } from "react";
export function FerrisWheel() {
  const [night, setNight] = useState(false); const [riding, setRiding] = useState(false);
  return <div className="flex-1 flex flex-col items-center justify-center gap-4">
    <div className="relative size-48 rounded-full border" style={{ borderColor: night ? "#e8c97a" : "#e8e6e1", animation: riding ? "spin 6s linear infinite" : "spin 40s linear infinite" }}>
      {[0, 60, 120, 180, 240, 300].map((d) => <div key={d} className="absolute left-1/2 top-1/2 size-3 rounded-full" style={{ background: night ? "#e8c97a" : "#e8e6e1", transform: `rotate(${d}deg) translate(90px) rotate(-${d}deg)` }} />)}
    </div>
    <p className="text-xs opacity-50">{riding ? (night ? "the city glitters below." : "you can see the rooftop from here.") : "a small wheel, quietly turning."}</p>
    <div className="flex gap-2"><button onClick={() => setRiding((r) => !r)} className="min-h-12 px-5 rounded-full border border-white/25 text-xs tracking-widest active:scale-95 transition">{riding ? "get off" : "ride"}</button>
      <button onClick={() => setNight((n) => !n)} className="min-h-12 px-5 rounded-full border border-white/25 text-xs tracking-widest active:scale-95 transition">{night ? "day" : "night"}</button></div>
  </div>;
}
