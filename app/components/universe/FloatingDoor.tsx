export function FloatingDoor({ onOpen }: { onOpen: () => void }) {
  return <button onClick={onOpen} aria-label="A door" className="absolute left-1/2 top-[20%] -translate-x-1/2 size-16 grid place-items-center active:scale-95 transition bob">
    <div className="h-12 w-8 rounded-t-full border border-white/50" />
  </button>;
}
