import { cn } from "~/lib/utils";
import { sfx } from "~/lib/sound";
export function Button({ className, onClick, ...p }: React.ComponentProps<"button">) {
  return <button className={cn("min-h-12 rounded-full border border-white/20 px-6 text-sm tracking-widest uppercase active:scale-95 active:bg-white/10 transition disabled:opacity-30", className)} onClick={(e) => { sfx.tap(); onClick?.(e); }} {...p} />;
}
