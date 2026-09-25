import { useState } from "react";
const P: [number, number][] = [[20, 20], [40, 15], [60, 25], [75, 18], [30, 45], [55, 50]];
export function Rooftop() {
  const [path, setPath] = useState<number[]>([]);
  const tap = (i: number) => setPath((p) => (p.includes(i) ? p : [...p, i]));
  const done = path.length >= 4;
  return <div className="flex-1 relative -mx-5 overflow-hidden">
    <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 20%,#141428,#02020a 70%)" }} />
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
      {path.slice(1).map((b, k) => <line key={k} x1={P[path[k]][0]} y1={P[path[k]][1]} x2={P[b][0]} y2={P[b][1]} stroke="#e8e6e1" strokeWidth=".3" opacity=".6" />)}
      {P.map(([x, y], i) => <circle key={i} onClick={() => tap(i)} cx={x} cy={y} r={path.includes(i) ? 1.6 : 1} fill="#e8e6e1" />)}
    </svg>
    <p className="absolute bottom-6 inset-x-0 text-center text-[10px] tracking-widest opacity-40">{done ? "a shape, quietly finished." : "connect the lights above the city"}</p>
  </div>;
}
