import { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useHouse, setMoon, foundConstellation } from "~/lib/house";
import { SoundToggle } from "~/components/shared/SoundToggle";
import { sfx } from "~/lib/sound";
import { PhotoBooth } from "~/components/universe/PhotoBooth";

const STARS: { x: number; y: number }[] = [
  [12, 12], [28, 8], [45, 14], [60, 7], [78, 15], [88, 22], [20, 24], [66, 20],
].map(([x, y]) => ({ x, y }));
const SEQ = [1, 3, 5, 4]; // indices into STARS that form the constellation, in order

function skyFor(t: number) {
  if (t < 0.25) return "radial-gradient(circle at 50% 15%,#141428,#02020a 75%)";
  if (t < 0.55) return "linear-gradient(#1a1c3a,#3a2a4a 70%,#5a3a3a)";
  if (t < 0.8) return "linear-gradient(#2a3a5a,#7a5a4a 70%,#c98a5a)";
  return "linear-gradient(#4a7aa8,#bcd4e8)";
}

export function BeachScene({ onBack }: { onBack: () => void }) {
  const h = useHouse();
  const wrap = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [lit, setLit] = useState<number[]>([]);
  const [seqBuf, setSeqBuf] = useState<number[]>([]);
  const [booth, setBooth] = useState(false);
  const ridRef = useRef(0);

  function dragMoon(e: React.PointerEvent) {
    const r = wrap.current!.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
    setMoon(x, x / 100);
  }

  function tapOcean(e: React.PointerEvent) {
    const r = wrap.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    if (y < 60) return;
    const id = ridRef.current++;
    setRipples((rs) => [...rs, { id, x, y }]);
    sfx.tap();
    setTimeout(() => setRipples((rs) => rs.filter((r2) => r2.id !== id)), 1400);
  }

  function tapStar(i: number) {
    setLit((l) => (l.includes(i) ? l : [...l, i]));
    const buf = [...seqBuf, i].slice(-SEQ.length);
    setSeqBuf(buf);
    if (buf.join() === SEQ.join() && !h.constellationFound) {
      foundConstellation();
      sfx.unlock();
    }
  }

  if (booth) {
    return (
      <div className="pad min-h-dvh flex flex-col fade" style={{ background: "#02020a" }}>
        <div className="flex justify-between">
          <button aria-label="back" onClick={() => setBooth(false)} className="size-12 -ml-3 grid place-items-center opacity-50"><ArrowLeft size={18} /></button>
          <SoundToggle />
        </div>
        <PhotoBooth />
      </div>
    );
  }

  const t = h.timeOfDay;
  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <div className="absolute inset-0 transition-[background] duration-700" style={{ background: skyFor(t) }} />
      <div className="absolute top-[max(env(safe-area-inset-top),16px)] inset-x-5 flex justify-between z-20">
        <button aria-label="back" onClick={onBack} className="size-10 grid place-items-center opacity-50"><ArrowLeft size={18} /></button>
        <SoundToggle className="opacity-50" />
      </div>

      <div
        ref={wrap}
        onPointerMove={(e) => dragging && dragMoon(e)}
        onPointerDown={(e) => { setDragging(true); dragMoon(e); }}
        onPointerUp={() => setDragging(false)}
        onPointerLeave={() => setDragging(false)}
        className="absolute inset-0"
        style={{ touchAction: "none" }}
      >
        {/* stars, fade out as day approaches */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ opacity: Math.max(0, 1 - t * 1.6) }}>
          {lit.length > 1 && lit.slice(1).map((b, k) => (
            <line key={k} x1={STARS[lit[k]].x} y1={STARS[lit[k]].y} x2={STARS[b].x} y2={STARS[b].y} stroke="#e8e6e1" strokeWidth="0.3" opacity="0.5" />
          ))}
          {STARS.map((s, i) => (
            <circle key={i} onPointerDown={(e) => { e.stopPropagation(); tapStar(i); }} cx={s.x} cy={s.y} r={lit.includes(i) ? 1.4 : 0.8}
              fill="#e8e6e1" opacity={lit.includes(i) ? 0.95 : 0.5} />
          ))}
        </svg>

        {/* moon / sun, draggable */}
        <div className="absolute rounded-full pointer-events-none transition-[background,box-shadow] duration-700"
          style={{
            left: h.moonPos + "%", top: 15 + t * 8 + "%", width: 34, height: 34, transform: "translate(-50%,-50%)",
            background: t < 0.6 ? "#e8e6d8" : "#f6d9a0",
            boxShadow: t < 0.6 ? "0 0 26px 6px rgba(232,230,216,.35)" : "0 0 40px 14px rgba(246,217,160,.4)",
          }} />

        {/* ocean */}
        <div onPointerDown={tapOcean} className="absolute inset-x-0 bottom-0" style={{ height: "42%", touchAction: "none" }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(#0d2a33cc,#04141acc)" }} />
          <div className="absolute rounded-full blur-md pointer-events-none" style={{
            left: h.moonPos + "%", bottom: "70%", width: 60, height: 14, transform: "translateX(-50%)",
            background: t < 0.6 ? "rgba(232,230,216,.3)" : "rgba(246,217,160,.35)",
          }} />
          {ripples.map((r) => (
            <span key={r.id} className="absolute rounded-full border border-white/40" style={{
              left: r.x + "%", top: ((r.y - 58) / 0.42) + "%", width: 4, height: 4, transform: "translate(-50%,-50%)",
              animation: "ripple 1.4s ease-out forwards",
            }} />
          ))}
        </div>

        {/* sand */}
        <div className="absolute inset-x-0 bottom-0 h-[6%]" style={{ background: "#0a0806" }} />

        {/* photobooth, physically in the world */}
        <button
          onClick={() => setBooth(true)}
          aria-label="a small booth"
          className="absolute bottom-[10%] right-[8%] grid place-items-center active:scale-95 transition opacity-80"
        >
          <div className="w-8 h-14 rounded-sm border border-white/50" />
          <span className="text-[8px] tracking-widest opacity-60 mt-1">PHOTOBOOTH</span>
        </button>
      </div>

      <style>{`@keyframes ripple{from{opacity:.6;width:4px;height:4px}to{opacity:0;width:70px;height:22px}}`}</style>

      {h.constellationFound && lit.length === SEQ.length && (
        <p className="absolute inset-x-0 top-[20%] text-center text-[10px] tracking-[.4em] opacity-70 z-20 fade pointer-events-none">△</p>
      )}
      <p className="absolute bottom-4 inset-x-0 text-center text-[9px] tracking-widest opacity-25 z-20 pointer-events-none">drag the sky · tap the water · tap the stars</p>
    </div>
  );
}