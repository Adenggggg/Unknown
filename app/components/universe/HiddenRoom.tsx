import { useState } from "react";
export function HiddenRoom({ children, onOpenFile }: { children?: React.ReactNode; onOpenFile: () => void }) {
  const [opened, setOpened] = useState(false);
  return <div className="relative h-dvh w-full grid place-items-center pad" style={{ background: "radial-gradient(circle at 50% 60%,#171310,#020202 75%)" }}>
    <div className="fade text-center">
      <div className="mx-auto w-40 h-24 border-b-2 border-white/30 relative">
        <div className="absolute left-1/2 -translate-x-1/2 -top-10 w-16 h-16 rounded-t-full border border-white/20" />
      </div>
      <button onClick={() => { setOpened(true); onOpenFile(); }} className="mt-10 text-xs tracking-[.3em] border border-white/30 rounded-full px-6 py-3 active:scale-95 transition">
        {opened ? "OPENING…" : "WHAT YOU BUILT"}
      </button>
    </div>
    {children}
  </div>;
}
