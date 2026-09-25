import { useState } from "react";
import { Screen } from "~/components/shared/Screen";
import { add } from "~/lib/game-state";
const P: [number, number][] = [[50, 20], [25, 35], [70, 40], [35, 60], [80, 70], [55, 80], [15, 85], [88, 15]]; const SEQ = [1, 3, 5, 2, 4];
export default function Observatory() {
  const [path, setPath] = useState<number[]>([]); const [found, setFound] = useState(false);
  const tap = (i: number) => { const n = [...path, i].slice(-8); setPath(n); add("discoveredStars", "s" + i); if (n.slice(-5).join() === SEQ.join()) { setFound(true); add("clues", "△"); add("collectedItems", "constellation"); } };
  return <Screen title="Observatory" how="Tap the numbered stars to link them into a chain." hint="A signal knows the order. Try Radio, station 3."><p className="text-xs opacity-50">Something is listening on 03.</p>
    <svg viewBox="0 0 100 100" className="flex-1 w-full max-h-[70dvh] touch-none">
      {path.slice(1).map((b, k) => <line key={k} x1={P[path[k]][0]} y1={P[path[k]][1]} x2={P[b][0]} y2={P[b][1]} stroke="#e8e6e1" strokeWidth=".3" opacity=".7" />)}
      {P.map(([x, y], i) => <g key={i} onClick={() => tap(i)}><circle cx={x} cy={y} r="7" fill="transparent" /><circle cx={x} cy={y} r={path.includes(i) ? 1.6 : 1} fill="#e8e6e1" /><text x={x + 3} y={y - 2} fontSize="3.5" fill="#e8e6e1" opacity=".6">{i + 1}</text></g>)}</svg>
    <p className="text-center h-10 tracking-[.3em] text-sm">{found ? "△ — SOMETHING OPENED" : ""}</p></Screen>;
}
