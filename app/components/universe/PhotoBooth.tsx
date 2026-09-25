import { useEffect, useRef, useState } from "react";
import { sfx } from "~/lib/sound";

type Stage = "intro" | "cam" | "count" | "between" | "strip" | "denied";

const PROMPTS = [
  "Show me your best smile.",
  "Serious this time.",
  "Look surprised.",
  "Whatever you want.",
];

const FRAME_W = 480, FRAME_H = 600, GAP = 18, PAD = 24;
const CAPTURE_RETRY_MS = 120;
const CAPTURE_MAX_RETRIES = 6; // ~700ms total grace period before giving up

export function PhotoBooth() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [stage, setStage] = useState<Stage>("intro");
  const [camReady, setCamReady] = useState(false);
  const [count, setCount] = useState(3);
  const [flash, setFlash] = useState(false);
  const [shots, setShots] = useState<string[]>([]);
  const [strip, setStrip] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const idx = shots.length;

  async function openCam() {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = s;
      setCamReady(false);
      setStage("cam");
    } catch {
      setStage("denied");
    }
  }

  // Wire the stream to the <video> element and wait for it to actually be
  // decoding frames before we consider the camera "ready". A fixed timeout
  // isn't reliable across devices — loadedmetadata (plus a play() kick) is.
  useEffect(() => {
    if (stage !== "cam" && stage !== "count") return;
    const v = videoRef.current;
    const s = streamRef.current;
    if (!v || !s) return;

    let cancelled = false;
    if (v.srcObject !== s) v.srcObject = s;

    function markReady() {
      if (cancelled) return;
      if (v && v.videoWidth > 0) setCamReady(true);
    }

    // Already has data (e.g. re-entering "cam" for shot 2+)
    if (v.readyState >= 2 && v.videoWidth > 0) {
      setCamReady(true);
    } else {
      v.addEventListener("loadedmetadata", markReady);
      v.addEventListener("loadeddata", markReady);
      v.play?.().catch(() => {});
    }

    return () => {
      cancelled = true;
      v.removeEventListener("loadedmetadata", markReady);
      v.removeEventListener("loadeddata", markReady);
    };
  }, [stage]);

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  useEffect(() => {
    if (stage !== "count") return;
    if (count <= 0) { capture(); return; }
    const t = setTimeout(() => setCount((c) => c - 1), 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, count]);

  function grabFrame(cx: CanvasRenderingContext2D, cv: HTMLCanvasElement) {
    const v = videoRef.current;
    if (v && v.videoWidth) {
      const s = Math.max(cv.width / v.videoWidth, cv.height / v.videoHeight);
      const w2 = v.videoWidth * s, h2 = v.videoHeight * s;
      cx.save();
      cx.translate(cv.width, 0); cx.scale(-1, 1);
      cx.drawImage(v, (cv.width - w2) / 2, (cv.height - h2) / 2, w2, h2);
      cx.restore();
      return true;
    }
    return false;
  }

  function capture(retries = CAPTURE_MAX_RETRIES) {
    const v = videoRef.current;
    // If the video genuinely isn't producing frames yet, give it a little
    // more time instead of immediately drawing the "no camera" placeholder.
    if ((!v || !v.videoWidth) && retries > 0) {
      setTimeout(() => capture(retries - 1), CAPTURE_RETRY_MS);
      return;
    }

    const cv = document.createElement("canvas");
    cv.width = FRAME_W; cv.height = FRAME_H;
    const cx = cv.getContext("2d")!;
    const ok = grabFrame(cx, cv);
    if (!ok) {
      cx.fillStyle = "#111"; cx.fillRect(0, 0, cv.width, cv.height);
      cx.fillStyle = "#666"; cx.font = "16px sans-serif"; cx.textAlign = "center";
      cx.fillText("no camera available", cv.width / 2, cv.height / 2);
    }
    sfx.shutter();
    setFlash(true);
    setTimeout(() => setFlash(false), 180);
    const next = [...shots, cv.toDataURL("image/jpeg", 0.92)];
    setShots(next);
    if (next.length >= 4) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      buildStrip(next);
    } else {
      setCamReady(false);
      setStage("between");
    }
  }

  function buildStrip(imgs: string[]) {
    const cv = document.createElement("canvas");
    cv.width = FRAME_W + PAD * 2;
    cv.height = PAD * 2 + FRAME_H * 4 + GAP * 3 + 60;
    const cx = cv.getContext("2d")!;
    cx.fillStyle = "#f2ede4"; cx.fillRect(0, 0, cv.width, cv.height);
    let loaded = 0;
    imgs.forEach((src, i) => {
      const im = new Image();
      im.onload = () => {
        cx.drawImage(im, PAD, PAD + i * (FRAME_H + GAP), FRAME_W, FRAME_H);
        loaded++;
        if (loaded === imgs.length) {
          cx.fillStyle = "#1a1a1a";
          cx.font = "24px ui-sans-serif, sans-serif";
          cx.textAlign = "center";
          cx.fillText("• • • •", cv.width / 2, cv.height - 20);
          setStrip(cv.toDataURL("image/jpeg", 0.92));
          setStage("strip");
        }
      };
      im.src = src;
    });
  }

  function download() {
    if (!strip) return;
    const a = document.createElement("a");
    a.href = strip;
    a.download = "photobooth-strip-" + Date.now() + ".jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setSaved(true);
    sfx.success();
  }

  function retakeAll() {
    setShots([]); setStrip(null); setSaved(false); setCamReady(false); setStage("intro");
  }

  // Once the camera reports ready, auto-start the countdown for this shot.
  function beginCountdown() {
    setStage("count");
    setCount(3);
  }

  if (stage === "intro") return (
    <div className="flex-1 grid place-content-center text-center gap-4 fade">
      <p className="tracking-[.3em] text-xs opacity-50">PHOTOBOOTH</p>
      <p className="opacity-80 text-lg">Four pictures?</p>
      <button onClick={openCam} className="mt-2 min-h-12 px-6 rounded-full border border-white/30 text-xs tracking-[.3em] active:scale-95 transition mx-auto">
        COME ON
      </button>
    </div>
  );

  if (stage === "denied") return (
    <div className="flex-1 grid place-content-center text-center gap-3 fade px-6">
      <p className="text-sm opacity-70">Couldn't reach the camera.</p>
      <p className="text-xs opacity-40">Check your browser's camera permission and try again.</p>
      <button onClick={openCam} className="mt-2 min-h-12 px-6 rounded-full border border-white/30 text-xs tracking-[.3em] mx-auto active:scale-95 transition">
        TRY AGAIN
      </button>
    </div>
  );

  if (stage === "cam") return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <p className="text-xs opacity-40 tracking-widest">{idx + 1} / 4</p>
      <p className="text-sm opacity-70">{PROMPTS[idx]}</p>
      <video ref={videoRef} autoPlay playsInline muted className="w-64 aspect-[4/5] object-cover rounded-xl border border-white/20 -scale-x-100" />
      <button
        onClick={beginCountdown}
        disabled={!camReady}
        className="min-h-12 px-6 rounded-full border border-white/30 text-xs tracking-[.3em] active:scale-95 transition disabled:opacity-30"
      >
        {camReady ? "READY" : "CONNECTING…"}
      </button>
    </div>
  );

  if (stage === "count") return (
    <div className="flex-1 grid place-content-center text-center relative">
      <p className="text-xs opacity-40 tracking-widest mb-2">{idx + 1} / 4</p>
      <video ref={videoRef} autoPlay playsInline muted className="w-64 aspect-[4/5] object-cover rounded-xl border border-white/20 mx-auto -scale-x-100" />
      <p className="mt-6 text-4xl font-light">{count > 0 ? count : ""}</p>
      {flash && <div className="fixed inset-0 bg-white z-50" />}
    </div>
  );

  if (stage === "between") return (
    <div className="flex-1 grid place-content-center text-center gap-4">
      <img src={shots[idx - 1]} className="rounded-xl border border-white/20 w-56 aspect-[4/5] object-cover mx-auto" />
      <p className="text-xs opacity-40 tracking-widest">{idx} / 4</p>
      <button onClick={() => setStage("cam")} className="min-h-12 px-6 rounded-full border border-white/30 text-xs tracking-[.3em] active:scale-95 transition mx-auto">
        NEXT
      </button>
    </div>
  );

  if (stage === "strip" && strip) return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-2">
      <img src={strip} className="rounded-lg border border-white/15 w-40 max-h-[60dvh] object-contain" />
      <div className="flex gap-2 justify-center">
        <button onClick={download} className="min-h-12 px-6 rounded-full border border-white/30 text-xs tracking-[.3em] active:scale-95 transition">
          {saved ? "SAVED" : "SAVE STRIP"}
        </button>
        <button onClick={retakeAll} className="min-h-12 px-6 rounded-full border border-white/15 text-xs tracking-[.3em] opacity-60 active:scale-95 transition">
          RETAKE
        </button>
      </div>
    </div>
  );

  return null;
}