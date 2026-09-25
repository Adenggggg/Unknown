import { Screen } from "~/components/shared/Screen";
import { useGame } from "~/lib/game-state";
const F = [["FILE_001", 1, "Four symbols. Catch. Match. Connect. Grow."], ["FILE_002", 2, "Station 3 repeats a pattern. Stay with it."], ["FILE_003", 3, "Three of four. The last is grown, not found."], ["UNKNOWN", 4, "◇ ○ △ □"]] as const;
export default function Archive() {
  const c = useGame().clues.length;
  return <Screen title="Archive" how="Files open as you find symbols." hint="Each file points somewhere."><div className="space-y-2 mt-2">{F.map(([n, need, t]) => c >= need ? <div key={n} className="rounded-xl border border-white/15 p-4 fade"><p className="text-[10px] tracking-[.4em] opacity-50">{n}</p><p className="mt-2">{t}</p></div> : <div key={n} className="rounded-xl border border-white/5 p-4 opacity-30 text-[10px] tracking-[.4em]">{n} · LOCKED</div>)}</div></Screen>;
}
