import { useEffect, useState } from "react";
export function Cinema() {
  const [playing, setPlaying] = useState(false); const [found, setFound] = useState(false); const [t, setT] = useState(0);
  useEffect(() => { if (!playing) return; const id = setInterval(() => setT((x) => x + 1), 200); return () => clearInterval(id); }, [playing]);
  return <div className="flex-1 flex flex-col items-center justify-center gap-4">
    <div className="relative w-full max-w-72 aspect-video rounded-lg border border-white/20 overflow-hidden bg-black">
      {playing && <div className="absolute inset-0" style={{ background: "radial-gradient(circle at " + ((t * 7) % 100) + "% 40%,#333,transparent 60%)" }} />}
      {playing && [...Array(12)].map((_, i) => <div key={i} className="absolute size-0.5 bg-white rounded-full" style={{ left: ((i * 37 + t * 3) % 100) + "%", top: ((i * 19) % 100) + "%", opacity: .6 }} />)}
      {playing && t > 20 && !found && <button onClick={() => setFound(true)} className="absolute size-6 right-6 bottom-6 rounded-full" aria-label="something on screen" />}
      {!playing && <p className="absolute inset-0 grid place-items-center text-xs opacity-40">a small screen, waiting</p>}
    </div>
    {found ? <p className="text-xs opacity-60">CLUE FOUND — there was a symbol on the screen.</p> : <button onClick={() => { setPlaying(true); setT(0); }} className="min-h-12 px-6 rounded-full border border-white/25 text-xs tracking-widest active:scale-95 transition">{playing ? "watching…" : "watch"}</button>}
  </div>;
}
