import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useGame, SYMBOLS } from "~/lib/game-state";
import { sfx } from "~/lib/sound";
import { SoundToggle } from "~/components/shared/SoundToggle";
export function Screen({ title, how, hint, children }: { title: string; how?: string; hint?: string; children: React.ReactNode }) {
  const g = useGame(); const [h, setH] = useState(false);
  return <div className="pad min-h-dvh flex flex-col fade">
    <header className="flex items-center justify-between h-12">
      <Link to="/world" aria-label="Back" onClick={() => sfx.back()} className="size-12 -ml-3 grid place-items-center"><ArrowLeft size={20} /></Link>
      <span className="text-xs tracking-[.4em] uppercase opacity-60">{title}</span>
      <span className="flex items-center gap-1"><SoundToggle /><span className="text-xs opacity-50">{SYMBOLS.filter((x) => g.clues.includes(x)).join("")}</span>
        {hint && <button aria-label="Hint" onClick={() => setH(!h)} className="size-12 -mr-3 grid place-items-center text-sm opacity-60">?</button>}</span>
    </header>
    {how && <p className="text-[11px] tracking-wide opacity-50 pb-2">{how}</p>}
    {h && hint && <p className="text-xs border border-white/20 rounded-xl p-3 mb-2 fade">{hint}</p>}
    <main className="flex-1 flex flex-col">{children}</main>
  </div>;
}
