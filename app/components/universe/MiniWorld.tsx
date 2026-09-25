import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { FerrisWheel } from "~/components/universe/FerrisWheel";
import { Cinema } from "~/components/universe/Cinema";
import { Cafe } from "~/components/universe/Cafe";
import { Beach } from "~/components/universe/Beach";
import { Rooftop } from "~/components/universe/Rooftop";
import { MusicRoom } from "~/components/universe/MusicRoom";
import { PhotoBooth } from "~/components/universe/PhotoBooth";
import { WishMachine } from "~/components/universe/WishMachine";
import { SecretLocation } from "~/components/universe/SecretLocation";
import { WorldEventLayer } from "~/components/universe/WorldEvent";
import { useWorld, visit } from "~/lib/worldState";
import { sfx } from "~/lib/sound";
import { SoundToggle } from "~/components/shared/SoundToggle";

const STOPS = [
  { id: "wheel", n: "the ferris wheel", sky: "radial-gradient(circle at 50% 30%,#2a2140,#0a0812 75%)", icon: (
      <svg viewBox="0 0 100 100" className="w-32 h-32"><circle cx="50" cy="50" r="30" fill="none" stroke="#e9e3d8" strokeWidth="1.5" opacity=".8" />
        {[0,60,120,180,240,300].map((d)=><circle key={d} cx={50+30*Math.cos(d*Math.PI/180)} cy={50+30*Math.sin(d*Math.PI/180)} r="2.2" fill="#d9a066" />)}
        <line x1="50" y1="80" x2="50" y2="92" stroke="#e9e3d8" strokeWidth="1" opacity=".5" /></svg>) },
  { id: "cinema", n: "the cinema", sky: "linear-gradient(#160e1e,#050308 70%)", icon: (
      <svg viewBox="0 0 100 100" className="w-32 h-32"><rect x="22" y="34" width="56" height="34" rx="2" fill="none" stroke="#e9e3d8" strokeWidth="1.5" />
        <rect x="27" y="39" width="46" height="24" fill="#d9a066" opacity=".18" /></svg>) },
  { id: "cafe", n: "the tiny café", sky: "linear-gradient(#1c150f,#050308 70%)", icon: (
      <svg viewBox="0 0 100 100" className="w-32 h-32"><path d="M35 40h30v20a15 15 0 0 1-30 0z" fill="none" stroke="#e9e3d8" strokeWidth="1.5" />
        <path d="M65 45h6a7 7 0 0 1 0 14h-6" fill="none" stroke="#e9e3d8" strokeWidth="1.5" /></svg>) },
  { id: "beach", n: "the beach", sky: "linear-gradient(#0c1420,#04121a 70%)", icon: (
      <svg viewBox="0 0 100 100" className="w-32 h-32"><circle cx="50" cy="38" r="12" fill="#e9e3d8" opacity=".85" />
        <path d="M20 66q10-8 20 0t20 0 20 0" fill="none" stroke="#e9e3d8" strokeWidth="1.3" opacity=".6" />
        <path d="M20 76q10-8 20 0t20 0 20 0" fill="none" stroke="#e9e3d8" strokeWidth="1.3" opacity=".4" /></svg>) },
  { id: "roof", n: "the rooftop", sky: "radial-gradient(circle at 50% 20%,#141428,#02020a 70%)", icon: (
      <svg viewBox="0 0 100 100" className="w-32 h-32"><path d="M50 30 75 68H25z" fill="none" stroke="#e9e3d8" strokeWidth="1.5" />
        {[[40,20],[60,26],[70,15],[30,14]].map((p,i)=><circle key={i} cx={p[0]} cy={p[1]} r="1" fill="#e9e3d8" opacity=".7" />)}</svg>) },
  { id: "music", n: "the music room", sky: "linear-gradient(#120e1c,#050308 70%)", icon: (
      <svg viewBox="0 0 100 100" className="w-32 h-32"><path d="M40 60V30l24-5v30" fill="none" stroke="#e9e3d8" strokeWidth="1.5" />
        <circle cx="36" cy="62" r="7" fill="none" stroke="#e9e3d8" strokeWidth="1.5" /><circle cx="60" cy="55" r="7" fill="none" stroke="#e9e3d8" strokeWidth="1.5" /></svg>) },
  { id: "booth", n: "the photobooth", sky: "linear-gradient(#160e14,#050308 70%)", icon: (
      <svg viewBox="0 0 100 100" className="w-32 h-32"><rect x="30" y="22" width="40" height="56" rx="2" fill="none" stroke="#e9e3d8" strokeWidth="1.5" />
        {[38,46,54,62].map((x)=><line key={x} x1={x} y1="30" x2={x} y2="70" stroke="#e9e3d8" strokeWidth="1" opacity=".5" />)}</svg>) },
];

export function MiniWorld() {
  const w = useWorld(); const [open, setOpen] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const onScroll = () => { const el = scrollRef.current; if (!el) return; const n = Math.round(el.scrollLeft / el.clientWidth); if (n !== idx) sfx.swipe(); setIdx(n); };

  if (open) {
    const M: Record<string, React.ReactNode> = { wheel: <FerrisWheel />, cinema: <Cinema />, cafe: <Cafe />, beach: <Beach />, roof: <Rooftop />, music: <MusicRoom />, booth: <PhotoBooth />, secret: <SecretLocation />, wish: <WishMachine onWished={() => {}} /> };
    return <div className="pad min-h-dvh flex flex-col fade">
      <div className="flex justify-between"><button onClick={() => { sfx.back(); setOpen(null); }} className="size-12 -ml-3 grid place-items-center"><ArrowLeft size={20} /></button><SoundToggle /></div>
      {M[open]}
    </div>;
  }

  const extra = [...(w.secretUnlocked ? [{ id: "secret", n: "somewhere new", sky: "radial-gradient(circle at 50% 60%,#1a1030,#02020a 70%)", icon: <span className="text-6xl opacity-80">✦</span> }] : []),
    ...(w.secretUnlocked ? [{ id: "wish", n: "a quiet machine", sky: "radial-gradient(circle at 50% 40%,#241a33,#04030a 70%)", icon: <span className="text-6xl opacity-80">◇</span> }] : [])];
  const all = [...STOPS, ...extra];
  const cur = all[idx];

  return <div className="relative h-dvh w-full overflow-hidden">
    <WorldEventLayer />
    <div className="absolute inset-0 transition-[background] duration-700" style={{ background: cur.sky }} />
    <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(1px 1px at 20% 15%,#e9e3d8 60%,transparent),radial-gradient(1px 1px at 70% 10%,#e9e3d8 60%,transparent),radial-gradient(1px 1px at 40% 25%,#e9e3d8 50%,transparent),radial-gradient(1px 1px at 85% 30%,#e9e3d8 50%,transparent)", opacity: .5 }} />
    <div className="absolute top-[max(env(safe-area-inset-top),16px)] inset-x-5 flex justify-between text-[10px] tracking-[.3em] opacity-30 z-20">
      <span>a little world</span><SoundToggle className="opacity-40" /><span>{idx + 1} / {all.length}</span>
    </div>
    <div ref={scrollRef} onScroll={onScroll} className="relative z-10 h-full flex overflow-x-auto snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
      {all.map((s) => <button key={s.id} onClick={() => { sfx.select(); setOpen(s.id); visit(s.id); }} className="snap-center shrink-0 w-full h-full flex flex-col items-center justify-center gap-5 active:scale-[.97] transition">
        <div className="bob">{s.icon}</div>
        <span className="text-xs tracking-[.25em] opacity-60 lowercase">{s.n}</span>
      </button>)}
    </div>
    <div className="absolute bottom-[max(env(safe-area-inset-bottom),20px)] inset-x-0 flex justify-center gap-1.5 z-20">
      {all.map((s, i) => <span key={s.id} className={"size-1.5 rounded-full transition-opacity " + (i === idx ? "bg-white/70" : "bg-white/20")} />)}
    </div>
    <p className="absolute bottom-16 inset-x-0 text-center text-[10px] tracking-widest opacity-25 z-20">swipe · tap to step inside</p>
  </div>;
}
