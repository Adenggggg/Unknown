import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  useHouse, setCurtains, setRecord, openFridge, openDrawer, pullBook, toggleLamp,
  openBox, openDoor,
} from "~/lib/house";
import { SoundToggle } from "~/components/shared/SoundToggle";
import { Box } from "~/components/universe/Box";
import { BeachScene } from "~/components/universe/BeachScene";

type Spot = { id: string; x: number; y: number; w: number; h: number; label: string };

const SPOTS: Spot[] = [
  { id: "window", x: 108, y: 48, w: 132, h: 172, label: "window" },
  { id: "lamp", x: 268, y: 68, w: 72, h: 145, label: "lamp" },
  { id: "record", x: 44, y: 236, w: 90, h: 50, label: "record player" },
  { id: "shelf", x: 272, y: 214, w: 92, h: 96, label: "bookshelf" },
  { id: "fridge", x: 18, y: 268, w: 58, h: 108, label: "kitchen" },
  { id: "table", x: 158, y: 298, w: 96, h: 52, label: "table" },
  { id: "drawer", x: 172, y: 384, w: 62, h: 26, label: "drawer" },
  { id: "box", x: 326, y: 398, w: 54, h: 42, label: "the box" },
];

let ambient: { stop: () => void } | null = null;
function startAmbient() {
  if (ambient) return;
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const master = ctx.createGain(); master.gain.value = 0.03; master.connect(ctx.destination);
  const crackle = ctx.createOscillator(); crackle.type = "triangle"; crackle.frequency.value = 220;
  const lfo = ctx.createOscillator(); lfo.frequency.value = 0.18;
  const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.012;
  lfo.connect(lfoGain).connect(master.gain);
  const pad = ctx.createOscillator(); pad.type = "sine"; pad.frequency.value = 146.8;
  crackle.connect(master); pad.connect(master);
  crackle.start(); pad.start(); lfo.start();
  ambient = { stop: () => { try { crackle.stop(); pad.stop(); lfo.stop(); master.disconnect(); } catch {} ambient = null; } };
}

export function TinyHouse({ onExit }: { onExit: () => void }) {
  const h = useHouse();
  const [caption, setCaption] = useState<string | null>(null);
  const [scene, setScene] = useState<"house" | "beach">("house");
  const [boxOpen, setBoxOpen] = useState(false);
  const [hint, setHint] = useState(0);
  const capTimer = useRef<any>(null);

  useEffect(() => { const t = setTimeout(() => setHint(1), 3200); return () => clearTimeout(t); }, []);
  useEffect(() => { if (hint !== 1) return; const t = setTimeout(() => setHint(2), 2600); return () => clearTimeout(t); }, [hint]);
  useEffect(() => { if (hint !== 2) return; const t = setTimeout(() => setHint(3), 2600); return () => clearTimeout(t); }, [hint]);
  useEffect(() => { if (hint !== 3) return; const t = setTimeout(() => setHint(0), 3000); return () => clearTimeout(t); }, [hint]);

  useEffect(() => {
    if (h.recordOn) startAmbient(); else ambient?.stop();
    return () => { if (!h.recordOn) ambient?.stop(); };
  }, [h.recordOn]);

  function say(text: string) {
    setCaption(text);
    clearTimeout(capTimer.current);
    capTimer.current = setTimeout(() => setCaption(null), 2600);
  }

  function tap(id: string) {
    switch (id) {
      case "window": setCurtains(!h.curtainsOpen); say(h.curtainsOpen ? "the curtains fall closed." : "moonlight."); break;
      case "lamp": toggleLamp(); break;
      case "record": setRecord(!h.recordOn); say(h.recordOn ? "quiet again." : "something warm and a little crackly."); break;
      case "shelf": pullBook(); say("a book, held open to no page in particular."); break;
      case "fridge": openFridge(); say("nothing useful. sorry."); break;
      case "table": say("a mug. still slightly warm, somehow."); break;
      case "drawer": openDrawer(); say("a spare key to a door that doesn't exist yet."); break;
      case "box": openBox(); setBoxOpen(true); break;
    }
  }

  if (scene === "beach") return <BeachScene onBack={() => setScene("house")} />;

  return (
    <div className="relative h-dvh w-full overflow-hidden" style={{
      background: h.lampOn
        ? "radial-gradient(circle at 76% 24%,#2a2015,#050505 65%)"
        : "radial-gradient(circle at 50% 50%,#0d0c10,#020203 70%)",
      transition: "background 1.2s ease",
    }}>
      <div className="pad relative z-20 flex justify-between">
        <button aria-label="back" onClick={onExit} className="size-12 -ml-3 grid place-items-center opacity-50"><ArrowLeft size={18} /></button>
        <SoundToggle />
      </div>

      <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2a2018" /><stop offset="100%" stopColor="#120d0a" /></linearGradient>
          <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1c1712" /><stop offset="100%" stopColor="#241d16" /></linearGradient>
          <linearGradient id="woodV" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#4a2f1e" /><stop offset="50%" stopColor="#5c3c26" /><stop offset="100%" stopColor="#3e2717" /></linearGradient>
          <linearGradient id="skyDark" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0a1220" /><stop offset="55%" stopColor="#132a3c" /><stop offset="100%" stopColor="#0a1a22" /></linearGradient>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f4f0e0" stopOpacity=".9" /><stop offset="100%" stopColor="#f4f0e0" stopOpacity="0" /></radialGradient>
          <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#ffdb8a" stopOpacity=".85" /><stop offset="100%" stopColor="#ffdb8a" stopOpacity="0" /></radialGradient>
          <linearGradient id="shadeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e8c98a" /><stop offset="100%" stopColor="#b8934f" /></linearGradient>
          <linearGradient id="couchGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a4a3e" /><stop offset="100%" stopColor="#362a22" /></linearGradient>
          <linearGradient id="woodShelf" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#4a3222" /><stop offset="100%" stopColor="#2e1e13" /></linearGradient>
          <linearGradient id="metalGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a8f96" /><stop offset="100%" stopColor="#3a3d42" /></linearGradient>
        </defs>

        <rect x="0" y="0" width="400" height="400" fill="url(#wallGrad)" />
        <rect x="0" y="400" width="400" height="100" fill="url(#floorGrad)" />
        <line x1="0" y1="400" x2="400" y2="400" stroke="#000" strokeOpacity=".4" strokeWidth="2" />
        <g stroke="#000" strokeOpacity=".12">
          <line x1="0" y1="420" x2="400" y2="420" /><line x1="0" y1="445" x2="400" y2="445" /><line x1="0" y1="470" x2="400" y2="470" />
        </g>

        {/* window */}
        <g>
          <rect x="108" y="55" width="116" height="158" rx="3" fill="#050608" />
          <rect x="110" y="57" width="112" height="154" fill="url(#skyDark)" />
          <circle cx="188" cy="90" r="34" fill="url(#moonGlow)" opacity={h.curtainsOpen ? 0.7 : 0} style={{ transition: "opacity 1s" }} />
          <circle cx="188" cy="90" r="10" fill="#f4f0e0" opacity={h.curtainsOpen ? 1 : 0} style={{ transition: "opacity 1s" }} />
          <rect x="110" y="150" width="112" height="61" fill="#0a1e28" opacity={h.curtainsOpen ? 0.9 : 0} style={{ transition: "opacity 1s" }} />
          <path d="M188 150 L182 211 L194 211 Z" fill="#f4f0e0" opacity={h.curtainsOpen ? 0.25 : 0} style={{ transition: "opacity 1s" }} />
          <rect x="108" y="55" width="116" height="158" rx="3" fill="none" stroke="#0a0806" strokeWidth="4" />
          <line x1="166" y1="55" x2="166" y2="213" stroke="#0a0806" strokeWidth="3" />
          <line x1="108" y1="134" x2="224" y2="134" stroke="#0a0806" strokeWidth="3" />
          <g style={{ transform: h.curtainsOpen ? "translateX(-40px)" : "translateX(0)", transition: "transform .7s ease" }}>
            <rect x="92" y="48" width="46" height="172" fill="url(#woodV)" />
            <path d="M92 48 q6 20 0 40 t0 40 0 40 0 40" stroke="#2a1a10" strokeWidth="1" fill="none" opacity=".5" />
          </g>
          <g style={{ transform: h.curtainsOpen ? "translateX(40px)" : "translateX(0)", transition: "transform .7s ease" }}>
            <rect x="194" y="48" width="46" height="172" fill="url(#woodV)" />
            <path d="M214 48 q-6 20 0 40 t0 40 0 40 0 40" stroke="#2a1a10" strokeWidth="1" fill="none" opacity=".5" />
          </g>
          <rect x="86" y="44" width="160" height="6" rx="2" fill="#1a120c" />
        </g>

        {/* lamp */}
        <g>
          <circle cx="304" cy="112" r="40" fill="url(#lampGlow)" opacity={h.lampOn ? 0.85 : 0} style={{ transition: "opacity .6s" }} />
          <line x1="304" y1="150" x2="304" y2="205" stroke="#2a2a2e" strokeWidth="3" />
          <ellipse cx="304" cy="207" rx="18" ry="4" fill="#1c1c1e" />
          <path d="M282 148 Q304 110 326 148 Z" fill="url(#shadeGrad)" opacity=".92" />
          <path d="M282 148 Q304 110 326 148" fill="none" stroke="#8a6a30" strokeWidth="1" opacity=".6" />
        </g>

        {/* record player */}
        <g transform="translate(44,236)">
          <rect x="0" y="0" width="90" height="50" rx="4" fill="#3a2a1e" />
          <rect x="4" y="4" width="82" height="42" rx="3" fill="#2a1e15" />
          <circle cx="42" cy="25" r="19" fill="#0c0c0c" stroke="#444" strokeWidth="1" />
          <circle cx="42" cy="25" r="19" fill="none" stroke="#333" strokeWidth=".5"
            style={{ transformOrigin: "42px 25px", animation: h.recordOn ? "spin 2.2s linear infinite" : "none" }} />
          <circle cx="42" cy="25" r="3" fill="#c98a3a" />
          <line x1="42" y1="25" x2="60" y2="12" stroke="#999" strokeWidth="1.4" />
          <circle cx="60" cy="12" r="2" fill="#999" />
        </g>

        {/* bookshelf */}
        <g transform="translate(272,214)">
          <rect x="0" y="0" width="92" height="96" fill="url(#woodShelf)" stroke="#1a1108" strokeWidth="1.5" />
          <line x1="0" y1="32" x2="92" y2="32" stroke="#1a1108" strokeWidth="2" />
          <line x1="0" y1="64" x2="92" y2="64" stroke="#1a1108" strokeWidth="2" />
          <rect x="8" y="6" width="7" height="24" fill="#7a2f2f" /><rect x="16" y="4" width="6" height="26" fill="#2f5a4a" />
          <rect x="23" y="8" width="7" height="22" fill="#4a3a7a" /><rect x="31" y="5" width="6" height="25" fill="#8a6a2f" />
          <rect x="8" y="38" width="6" height="24" fill="#3a5a7a" /><rect x="15" y="40" width="7" height="22" fill="#6a2f4a" />
          <rect x="24" y="40" width="20" height="4" fill="#8a6a2f" opacity={h.bookPulled ? 1 : 0} style={{ transition: "opacity .6s" }} />
        </g>

        {/* kitchen */}
        <g transform="translate(18,268)">
          <rect x="0" y="0" width="58" height="108" rx="4" fill="url(#metalGrad)" stroke="#1a1a1c" strokeWidth="1.5" />
          <line x1="0" y1="42" x2="58" y2="42" stroke="#1a1a1c" strokeWidth="1.5" />
          <rect x="50" y="10" width="3" height="24" rx="1.5" fill="#1a1a1c" />
          <rect x="50" y="50" width="3" height="18" rx="1.5" fill="#1a1a1c" />
        </g>

        {/* table */}
        <g transform="translate(158,298)">
          <ellipse cx="46" cy="48" rx="52" ry="20" fill="#3a281a" />
          <ellipse cx="46" cy="44" rx="52" ry="18" fill="#4a3220" />
          <path d="M8 50 L8 82" stroke="#2a1c10" strokeWidth="4" />
          <path d="M84 50 L84 82" stroke="#2a1c10" strokeWidth="4" />
          <path d="M40 34 h13 v11 a6.5 6.5 0 0 1 -13 0 z" fill="#e8e3d8" />
          <path d="M53 37 q6 0 6 6 t-6 6" fill="none" stroke="#e8e3d8" strokeWidth="1.6" />
        </g>

        {/* drawer */}
        <g transform="translate(172,384)">
          <rect x="0" y="0" width="62" height="26" rx="2" fill="#3e2a1c" stroke="#1a0f08" strokeWidth="1" />
          <line x1="4" y1="13" x2="58" y2="13" stroke="#1a0f08" strokeWidth="1" />
          <circle cx="31" cy="13" r="2" fill="#c9a15a" />
        </g>

        {/* couch */}
        <g transform="translate(28,342)">
          <path d="M0 46 v-16 a10 10 0 0 1 10 -10 h84 a10 10 0 0 1 10 10 v16" fill="url(#couchGrad)" />
          <rect x="-4" y="42" width="112" height="20" rx="6" fill="#2e2118" />
          <ellipse cx="24" cy="24" rx="14" ry="10" fill="#4a3a2e" />
          <ellipse cx="76" cy="24" rx="14" ry="10" fill="#4a3a2e" />
        </g>

        {/* box */}
        <g transform="translate(326,398)">
          <rect x="0" y="0" width="54" height="42" rx="2" fill="#3a2a1c" stroke="#1a0f08" strokeWidth="1.2" />
          <path d="M0 12 L27 20 L54 12" stroke="#1a0f08" strokeWidth="1.2" fill="none" />
          <text x="27" y="30" fontSize="6" letterSpacing="2" fill="#c9b89a" textAnchor="middle">BOX</text>
        </g>
      </svg>

      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 40%,transparent 40%,rgba(0,0,0,.55) 100%)" }} />

      {SPOTS.map((sp) => (
        <button
          key={sp.id}
          aria-label={sp.label}
          onClick={() => tap(sp.id)}
          className="absolute active:scale-95 transition"
          style={{ left: (sp.x / 400) * 100 + "%", top: (sp.y / 500) * 100 + "%", width: (sp.w / 400) * 100 + "%", height: (sp.h / 500) * 100 + "%" }}
        />
      ))}

      <button
        onClick={() => { openDoor(); setScene("beach"); }}
        className="absolute bottom-[max(env(safe-area-inset-bottom),20px)] left-1/2 -translate-x-1/2 min-h-14 px-6 rounded-full border border-white/40 text-[10px] tracking-[.3em] active:scale-95 transition bob z-10"
      >
        A DOOR TO THE OCEAN
      </button>

      {caption && (
        <p className="absolute left-1/2 -translate-x-1/2 top-[8%] z-20 text-xs tracking-wide opacity-80 fade max-w-[70%] text-center">{caption}</p>
      )}

      {hint === 1 && <p className="absolute inset-x-0 bottom-24 text-center text-[10px] tracking-widest opacity-40 fade z-10">but if you feel like exploring…</p>}
      {hint === 2 && <p className="absolute inset-x-0 bottom-24 text-center text-[10px] tracking-widest opacity-40 fade z-10">I hid a few things for you.</p>}
      {hint === 3 && <p className="absolute inset-x-0 bottom-24 text-center text-[10px] tracking-widest opacity-40 fade z-10">go find them.</p>}

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      {boxOpen && <Box onClose={() => setBoxOpen(false)} />}
    </div>
  );
}