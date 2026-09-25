import { useRef, useState } from "react";
const LAYERS = [["piano", 440], ["rain", 220], ["wind", 300], ["vinyl", 110]] as const;
export function MusicRoom() {
  const ctxRef = useRef<AudioContext | null>(null); const nodes = useRef<Record<string, { o: OscillatorNode; g: GainNode }>>({});
  const [on, setOn] = useState<Record<string, boolean>>({});
  function toggle(name: string, freq: number) {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = ctxRef.current;
    if (on[name]) { nodes.current[name]?.o.stop(); delete nodes.current[name]; setOn((s) => ({ ...s, [name]: false })); return; }
    const o = ctx.createOscillator(); const g = ctx.createGain(); g.gain.value = 0.03; o.frequency.value = freq; o.type = "sine"; o.connect(g).connect(ctx.destination); o.start();
    nodes.current[name] = { o, g }; setOn((s) => ({ ...s, [name]: true }));
  }
  return <div className="flex-1 grid place-content-center gap-3">
    <p className="text-xs opacity-50 tracking-widest text-center">MUSIC ROOM</p>
    <div className="grid grid-cols-2 gap-3">{LAYERS.map(([n, f]) => <button key={n} onClick={() => toggle(n, f)} className={"aspect-square rounded-2xl border text-xs tracking-widest grid place-items-center " + (on[n] ? "border-white/70 bg-white/10" : "border-white/15 opacity-50")}>{n}</button>)}</div>
    <p className="text-[10px] opacity-30 text-center">tap to layer sounds</p>
  </div>;
}
