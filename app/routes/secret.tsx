import { useState } from "react";
import { useNavigate } from "react-router";
import { Navigate } from "react-router";
import { useGame } from "~/lib/game-state";
export default function Secret() {
  const g = useGame(); const nav = useNavigate();
  const [converging, setConverging] = useState(false);
  if (!g.secretUnlocked) return <Navigate to="/world" replace />;
  const items = [...g.completedGames, ...g.gardenItems, ...g.collectedItems.slice(0, 6), ...g.discoveredStars.slice(0, 6)];
  return <div className="relative h-dvh overflow-hidden grid place-items-center pad" style={{ background: "radial-gradient(circle,#2a1a3a,#02030a 70%)" }}>
    <div className={"absolute rounded-full bg-white transition-all duration-[1800ms] ease-in " + (converging ? "size-[220vw]" : "size-3")} />
    {items.map((it, i) => { const r = 60 + (i % 4) * 34; return <div key={it + i} className={"absolute transition-opacity duration-700 " + (converging ? "opacity-0" : "opacity-100")} style={{ animation: converging ? undefined : `spin ${30 + i * 7}s linear infinite`, width: r * 2, height: r * 2, transitionDelay: (i * 80) + "ms" }}><span className="absolute left-1/2 -top-1 text-xs opacity-80">{["✦", "◇", "○", "△", "□"][i % 5]}</span></div>; })}
    <div className={"absolute bottom-24 text-center transition-opacity duration-700 " + (converging ? "opacity-0" : "opacity-100 fade")}><h1 className="text-5xl font-extralight tracking-tight">YOU FOUND IT.</h1><p className="mt-3 opacity-60">There was more here than you expected.</p></div>
    <button onClick={() => { setConverging(true); setTimeout(() => nav("/universe"), 2000); }} className={"absolute bottom-6 min-h-12 px-6 grid place-items-center text-xs tracking-[.3em] opacity-60 transition-opacity " + (converging ? "opacity-0" : "")}>keep exploring</button></div>;
}
