import { useRef, useState } from "react";
import { GLYPH, MISSING, type UObj } from "~/lib/universe";
import { FloatingDoor } from "~/components/universe/FloatingDoor";
export function UniverseScene({ objs, placed, expanded, onPlace, doorVisible, onDoorOpen }: {
  objs: UObj[]; placed: string[]; expanded: boolean; onPlace: (id: string) => void; doorVisible: boolean; onDoorOpen: () => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const move = (e: React.PointerEvent) => { const r = wrap.current!.getBoundingClientRect(); setDrag({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 }); };
  const remaining = MISSING.filter((m) => !placed.includes(m.id));
  return <div ref={wrap} onPointerMove={move} onPointerLeave={() => setDrag(null)} style={{ touchAction: "none" }}
    className={"relative h-dvh w-full overflow-hidden transition-all duration-[2000ms] " + (expanded ? "scale-100" : "scale-110")}>
    <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 55%,#1c1430,#020103 70%)" }} />
    <div className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 blur-[1px]"
      style={{ transform: drag ? `translate(${(drag.x - 50) * 0.06}vw,${(drag.y - 50) * 0.06}vh) translate(-50%,-50%)` : "translate(-50%,-50%)", transition: "transform .4s ease" }} />
    {objs.map((o, i) => {
      const dx = drag ? (o.x - drag.x) * 0.02 : 0, dy = drag ? (o.y - drag.y) * 0.02 : 0;
      return <div key={o.id} className="absolute text-xl bob" style={{ left: `${o.x + dx}%`, top: `${o.y + dy}%`, animationDelay: i * 300 + "ms", transition: "left .5s,top .5s" }} title={o.label}>{GLYPH[o.kind]}</div>;
    })}
    {remaining.slice(0, 1).map((m) => <button key={m.id} onClick={() => onPlace(m.id)} className="absolute left-1/2 top-[70%] -translate-x-1/2 flex flex-col items-center active:scale-95 transition">
      <span className="text-xl opacity-30 border border-white/20 rounded-full size-10 grid place-items-center">?</span>
      <span className="mt-2 text-[10px] tracking-widest opacity-40 max-w-40 text-center">{m.hint}</span>
    </button>)}
    {doorVisible && <FloatingDoor onOpen={onDoorOpen} />}
  </div>;
}
