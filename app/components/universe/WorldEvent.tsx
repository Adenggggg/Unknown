import { useEffect, useState } from "react";
import { EVENT_BG, useEvent } from "~/lib/worldState";
export function WorldEventLayer() {
  const e = useEvent(); const [msg, setMsg] = useState(false);
  useEffect(() => { if (!e) return; const t = setTimeout(() => setMsg(true), 1800); const t2 = setTimeout(() => setMsg(false), 5000); return () => { clearTimeout(t); clearTimeout(t2); }; }, [e]);
  if (!e) return null;
  return <div className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-[1500ms]" style={{ background: EVENT_BG[e], opacity: 0.9 }}>
    {msg && <div className="absolute inset-x-0 bottom-24 text-center fade"><p className="text-sm opacity-80">That was for you.</p><p className="text-xs opacity-40 mt-1">Keep exploring.</p></div>}
  </div>;
}
