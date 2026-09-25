import { useState } from "react";
import { Screen } from "~/components/shared/Screen";
import { Button } from "~/components/ui/button";
import { add, useGame } from "~/lib/game-state";
export default function Garden() {
  const g = useGame(); const [w, setW] = useState(0); const planted = g.gardenItems.includes("seed"); const grown = w >= 3 || g.gardenItems.includes("bloom");
  return <Screen title="Garden" how="Plant something, then water it." hint="Some things need watering more than once."><div className="flex-1 grid place-content-center text-center">
    <div className="text-7xl bob">{!planted ? "·" : grown ? "❦" : "⌇"}</div>
    <p className="mt-4 text-xs opacity-50 tracking-widest">{!planted ? "Nothing here yet." : grown ? "It remembers." : `water ${w}/3`}</p>
    {g.completedGames.length > 0 && <p className="mt-6 opacity-60">{g.completedGames.map(() => "✿").join(" ")}</p>}</div>
    {!planted ? <Button onClick={() => add("gardenItems", "seed")}>plant</Button> : <Button disabled={grown} onClick={() => { const n = w + 1; setW(n); navigator.vibrate?.(8); if (n >= 3) { add("clues", "□"); add("gardenItems", "bloom"); } }}>water</Button>}</Screen>;
}
