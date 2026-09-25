import { Link } from "react-router";
import { useGame, total, reset, SYMBOLS } from "~/lib/game-state";
import { sfx } from "~/lib/sound";
import { SoundToggle } from "~/components/shared/SoundToggle";
const OBJ = [
  { to: "/arcade", n: "Arcade", g: "◈", x: 12, y: 16, need: 0, h: "" }, { to: "/observatory", n: "Observatory", h: "Play a game first", g: "✦", x: 54, y: 10, need: 1 },
  { to: "/garden", n: "Garden", h: "Play a game first", g: "❦", x: 8, y: 62, need: 1 }, { to: "/radio", n: "Radio", h: "Play a game first", g: "≋", x: 58, y: 64, need: 1 },
  { to: "/camera", n: "Camera", h: "Play a game first", g: "◉", x: 60, y: 36, need: 1 }, { to: "/archive", n: "Archive", h: "Find two symbols", g: "▤", x: 8, y: 38, need: 2 },
];
export default function World() {
  const g = useGame(); const c = g.clues.length;
  const sec = g.secretUnlocked ? "ACCESS AVAILABLE" : c >= 3 ? "◌" : "???";
  return <div className="relative h-dvh overflow-hidden pad">
    <div className="absolute inset-0 opacity-70" style={{ background: "radial-gradient(circle at 50% 50%, #1a1a2e 0, transparent 45%)" }} />
    <div className="relative flex justify-between items-center"><p className="text-[10px] tracking-[.4em] opacity-50">{total(g)} / 24 discovered</p><SoundToggle /></div>
    <div className="relative flex gap-3 mt-2 text-lg">{SYMBOLS.map((s) => <span key={s} className={g.clues.includes(s) ? "" : "opacity-20"}>{g.clues.includes(s) ? s : "·"}</span>)}</div>
    <div className="absolute left-1/2 top-1/2 size-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 bob grid place-items-center">
      <div className="size-16 rounded-full border border-white/40" style={{ animation: "spin 30s linear infinite" }}><div className="size-2 rounded-full bg-white ml-7 -mt-1" /></div></div>
    {OBJ.map((o) => { const open = c >= o.need; const inner = <><span className="text-3xl">{open ? o.g : "·"}</span><span className="text-[10px] tracking-[.3em] uppercase mt-1">{open ? o.n : o.h}</span></>;
      const cls = "absolute w-[34%] min-h-20 grid place-content-center text-center rounded-2xl border border-white/15 active:scale-95 transition " + (open ? "bob" : "opacity-30");
      return open ? <Link key={o.n} to={o.to} onClick={() => sfx.select()} style={{ left: o.x + "%", top: o.y + "%" }} className={cls}>{inner}</Link> : <button key={o.n} onClick={() => sfx.tap()} style={{ left: o.x + "%", top: o.y + "%" }} className={cls}>{inner}</button>; })}
    <div className="absolute bottom-[max(env(safe-area-inset-bottom),20px)] left-5 right-5 flex justify-between items-end">
      <button onClick={() => confirm("Reset all progress?") && reset()} className="text-[10px] opacity-30 h-12">reset</button>
      {g.secretUnlocked ? <Link to="/secret" className="min-h-14 px-6 grid place-items-center rounded-full border border-white/60 text-xs tracking-[.3em] animate-pulse">{sec}</Link> : <span className="min-h-14 px-6 grid place-items-center text-xs tracking-[.3em] opacity-40">{sec}</span>}
    </div></div>;
}
