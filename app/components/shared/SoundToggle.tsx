import { Volume2, VolumeX } from "lucide-react";
import { setSound, sfx, useSound } from "~/lib/sound";
export function SoundToggle({ className = "" }: { className?: string }) {
  const on = useSound();
  return <button aria-label="toggle sound" onClick={() => { const n = !on; setSound(n); if (n) setTimeout(sfx.select, 60); }} className={"size-10 grid place-items-center opacity-50 " + className}>
    {on ? <Volume2 size={16} /> : <VolumeX size={16} />}
  </button>;
}
