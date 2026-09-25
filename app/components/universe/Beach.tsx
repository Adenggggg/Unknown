import { useRef, useState } from "react";
export function Beach() {
  const ref = useRef<HTMLDivElement>(null); const [mx, setMx] = useState(50); const [meteor, setMeteor] = useState(false);
  const move = (e: React.PointerEvent) => { const r = ref.current!.getBoundingClientRect(); const x = ((e.clientX - r.left) / r.width) * 100; setMx(x); if (x > 68 && x < 76 && !meteor) { setMeteor(true); setTimeout(() => setMeteor(false), 2500); } };
  return <div ref={ref} onPointerMove={move} style={{ touchAction: "none" }} className="relative flex-1 -mx-5 overflow-hidden" >
    <div className="absolute inset-0" style={{ background: "linear-gradient(#0a1020,#132030 60%,#0d1a22)" }} />
    <div className="absolute size-8 rounded-full bg-[#e8e6d8]" style={{ left: mx + "%", top: "18%", transition: "left .3s" }} />
    <div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: "linear-gradient(#0d2a33,#04141a)" }} />
    <div className="absolute rounded-full bg-[#e8e6d8]/30 blur-md" style={{ left: mx + "%", bottom: "18%", width: 40, height: 10, transition: "left .3s" }} />
    {meteor && <div className="absolute w-16 h-0.5 bg-white/80 fade" style={{ left: "65%", top: "20%", transform: "rotate(30deg)" }} />}
    <p className="absolute bottom-4 inset-x-0 text-center text-[10px] tracking-widest opacity-40">drag the moon</p>
  </div>;
}
