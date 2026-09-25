import { useEffect, useRef, useState } from "react";
import { Screen } from "~/components/shared/Screen";
import { Button } from "~/components/ui/button";
import { add, useGame } from "~/lib/game-state";
import { sfx } from "~/lib/sound";
function StarCatcher() {
  const ref = useRef<HTMLCanvasElement>(null); const [score, setScore] = useState(0); const [run, setRun] = useState(false);
  useEffect(() => { if (!run) return; const cv = ref.current!, x = cv.getContext("2d")!; const W = (cv.width = cv.clientWidth), H = (cv.height = cv.clientHeight);
    let px = W / 2, sc = 0, t = 0, raf = 0; const st: { x: number; y: number; v: number }[] = [];
    const mv = (e: PointerEvent) => (px = e.clientX - cv.getBoundingClientRect().left); cv.addEventListener("pointermove", mv); cv.addEventListener("pointerdown", mv);
    const loop = () => { t++; if (t % Math.max(20, 60 - sc * 2) === 0) st.push({ x: 20 + Math.random() * (W - 40), y: -10, v: 1.5 + sc * 0.15 });
      x.clearRect(0, 0, W, H); x.fillStyle = "#e8e6e1"; x.font = "16px sans-serif"; x.fillRect(px - 24, H - 40, 48, 6);
      for (let i = st.length - 1; i >= 0; i--) { const s = st[i]; s.y += s.v; x.fillText("✦", s.x - 5, s.y);
        if (s.y > H - 44 && s.y < H - 30 && Math.abs(s.x - px) < 30) { st.splice(i, 1); setScore(++sc); sfx.tap(); navigator.vibrate?.(8); if (sc >= 10) { add("clues", "◇"); add("completedGames", "star-catcher"); add("collectedItems", "star-shard"); setRun(false); return; } } else if (s.y > H) st.splice(i, 1); }
      raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); cv.removeEventListener("pointermove", mv); }; }, [run]);
  return <div className="flex-1 flex flex-col"><p className="text-xs opacity-50 my-2">STAR CATCHER · {score}/10</p>
    <canvas ref={ref} style={{ touchAction: "none" }} className="flex-1 min-h-72 w-full rounded-2xl border border-white/10" />
    {!run && <Button className="mt-3" onClick={() => { setScore(0); setRun(true); }}>{score >= 10 ? "again" : "start"}</Button>}</div>;
}
const SYM = ["Ψ", "Ξ", "Ω", "Σ"];
function Memory() {
  const [deck] = useState(() => [...SYM, ...SYM].sort(() => Math.random() - 0.5)); const [open, setOpen] = useState<number[]>([]); const [done, setDone] = useState<number[]>([]);
  const tap = (i: number) => { if (open.length > 1 || open.includes(i) || done.includes(i)) return; const n = [...open, i]; setOpen(n);
    if (n.length === 2) setTimeout(() => { if (deck[n[0]] === deck[n[1]]) { const d = [...done, ...n]; setDone(d); if (d.length === 8) { add("clues", "○"); add("completedGames", "memory"); } } setOpen([]); }, 600); };
  return <div><p className="text-xs opacity-50 my-2">MEMORY</p><div className="grid grid-cols-4 gap-2">{deck.map((s, i) => <button key={i} onClick={() => tap(i)} className="aspect-square rounded-xl border border-white/20 text-2xl active:scale-95 transition">{open.includes(i) || done.includes(i) ? s : ""}</button>)}</div></div>;
}
export default function Arcade() {
  const g = useGame(); const [tab, setTab] = useState(0);
  return <Screen title="Arcade" how="Drag to steer. Catch 10 stars. Match all pairs." hint="Two games. Finish both."><div className="flex gap-2 my-2">{["Star Catcher", "Memory"].map((n, i) => <Button key={n} onClick={() => setTab(i)} className={"flex-1 px-2 " + (tab === i ? "bg-white/15" : "")}>{n}{g.completedGames.includes(i ? "memory" : "star-catcher") ? " ◆" : ""}</Button>)}</div>
    {tab ? <Memory /> : <StarCatcher />}</Screen>;
}
