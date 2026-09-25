import { useEffect, useState } from "react";
import { Screen } from "~/components/shared/Screen";
import { Button } from "~/components/ui/button";
import { add } from "~/lib/game-state";
const ST = [["NIGHT", "#0b1020"], ["RAIN", "#0d1a1f"], ["SPACE", "#150d20"], ["CITY", "#1f150d"], ["OCEAN", "#0a1f26"]];
export default function Radio() {
  const [i, setI] = useState(0); const [t, setT] = useState(0);
  useEffect(() => { setT(0); const id = setInterval(() => setT((x) => x + 1), 1000); return () => clearInterval(id); }, [i]);
  useEffect(() => { if (i === 2 && t >= 3) add("collectedItems", "signal-03"); }, [i, t]);
  const mm = String(Math.floor(t / 60)).padStart(2, "0") + ":" + String(t % 60).padStart(2, "0");
  return <Screen title="Radio" how="Tap 1–5 to change station. Stay a while." hint="Some stations say more if you stay."><div className="flex-1 -mx-5 px-5 grid place-content-center text-center transition-colors duration-1000" style={{ background: ST[i][1] }}>
    <p className="text-[10px] tracking-[.5em] opacity-50">NOW PLAYING</p><h2 className="text-4xl font-light my-4">SIGNAL 0{i + 1}</h2><p className="tabular-nums opacity-60">{mm}</p>
    <p className="mt-6 text-sm tracking-[.4em] h-6">{i === 2 && t >= 3 ? "2 · 4 · 6 · 3 · 5" : ""}</p></div>
    <div className="flex gap-2 mt-3">{ST.map(([n], k) => <Button key={n} onClick={() => setI(k)} className={"flex-1 px-0 " + (k === i ? "bg-white/15" : "")}>{k + 1}</Button>)}</div></Screen>;
}
