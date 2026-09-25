import { Screen } from "~/components/shared/Screen";
import { Button } from "~/components/ui/button";
import { add, useGame } from "~/lib/game-state";
export default function Camera() {
  const g = useGame(); const snaps = g.collectedItems.filter((c) => c.startsWith("snap"));
  return <Screen title="Camera" how="Capture to save snapshots." hint="Collect objects in other places first."><div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2 content-start">
    {snaps.map((c, i) => <div key={c} className="aspect-[3/4] rounded-xl border border-white/15 p-3 text-[10px] tracking-widest grid content-end fade">OBJECT 0{i + 1}<br /><span className="opacity-50">UNKNOWN LOCATION</span></div>)}</div>
    <Button className="mt-3" onClick={() => add("collectedItems", "snap-" + (snaps.length + 1))}>capture</Button></Screen>;
}
