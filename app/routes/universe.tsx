import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TinyHouse } from "~/components/universe/TinyHouse";

const LINES = [
  "I built you a little universe.",
  "You don't have to figure anything out here.",
  "You don't have to be okay.",
  "You don't have to be happy.",
  "You don't even have to do anything.",
  "Just stay for a bit.",
];

export default function Universe() {
  const nav = useNavigate();
  const [phase, setPhase] = useState<"message" | "forming" | "house">("message");
  const [line, setLine] = useState(0);
  const [lights, setLights] = useState(0);

  // message sequence
  useEffect(() => {
    if (phase !== "message") return;
    if (line >= LINES.length - 1) {
      const t = setTimeout(() => setPhase("forming"), 2200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLine((l) => l + 1), line === 0 ? 1200 : 2000);
    return () => clearTimeout(t);
  }, [phase, line]);

  // lights forming
  useEffect(() => {
    if (phase !== "forming") return;
    if (lights >= 5) {
      const t = setTimeout(() => setPhase("house"), 1400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setLights((l) => l + 1), 700);
    return () => clearTimeout(t);
  }, [phase, lights]);

  if (phase === "message") {
    return (
      <div className="h-dvh w-full bg-black grid place-items-center pad">
        <div className="text-center max-w-xs">
          {LINES.slice(Math.max(0, line - 1), line + 1).map((l, i, arr) => (
            <p
              key={l}
              className={
                "transition-opacity duration-[1100ms] text-lg font-light mt-3 " +
                (i === arr.length - 1 ? "opacity-100" : "opacity-20")
              }
            >
              {l}
            </p>
          ))}
        </div>
      </div>
    );
  }

  if (phase === "forming") {
    const WIN = [
      { x: 42, y: 58 }, { x: 47, y: 55 }, { x: 52, y: 57 }, { x: 58, y: 54 }, { x: 63, y: 58 },
    ];
    return (
      <div className="h-dvh w-full grid place-items-center pad" style={{ background: "radial-gradient(circle at 50% 40%,#0a0a14,#020203 75%)" }}>
        <svg viewBox="0 0 100 100" className="w-full max-w-sm">
          {WIN.slice(0, lights).map((w, i) => (
            <rect key={i} x={w.x} y={w.y} width="3" height="3.6" rx="0.4" fill="#e8c97a"
              opacity={0.85} style={{ animation: "fade .8s both" }} />
          ))}
          {lights >= 5 && (
            <path d="M38 60 L50 46 L66 60 Z" fill="none" stroke="#e8e6e1" strokeWidth="0.6" opacity="0.5" style={{ animation: "fade 1s both" }} />
          )}
        </svg>
      </div>
    );
  }

  return <TinyHouse onExit={() => nav("/world")} />;
}