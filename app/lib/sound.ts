import { useSyncExternalStore } from "react";
const K = "unknown.sound.v1";
const BG_MUSIC_SRC = "/canon.mp3";

let enabled = false; let ctx: AudioContext | null = null;
let bgAudio: HTMLAudioElement | null = null;
const subs = new Set<() => void>();
if (typeof window !== "undefined") try { enabled = JSON.parse(localStorage.getItem(K) || "false"); } catch {}

function getCtx() { if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); if (ctx.state === "suspended") ctx.resume(); return ctx; }

function blip(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.05, glideTo?: number) {
  if (!enabled) return;
  const c = getCtx(); const o = c.createOscillator(); const g = c.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, c.currentTime);
  if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, c.currentTime + dur);
  g.gain.setValueAtTime(vol, c.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
  o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + dur);
}

export const sfx = {
  tap: () => blip(320, 0.06, "sine", 0.035),
  select: () => blip(440, 0.09, "triangle", 0.04),
  unlock: () => { blip(523, 0.18, "sine", 0.05, 784); setTimeout(() => blip(659, 0.22, "sine", 0.04), 90); },
  success: () => { blip(392, 0.12, "triangle", 0.045); setTimeout(() => blip(587, 0.16, "triangle", 0.045), 100); },
  shutter: () => { blip(180, 0.03, "square", 0.06); setTimeout(() => blip(90, 0.05, "square", 0.04), 30); },
  swipe: () => blip(220, 0.08, "sine", 0.02, 260),
  back: () => blip(260, 0.07, "sine", 0.03, 180),
};

function getBgAudio() {
  if (!bgAudio && typeof window !== "undefined") {
    bgAudio = new Audio(BG_MUSIC_SRC);
    bgAudio.loop = true;
    bgAudio.volume = BG_MUSIC_VOLUME;
    bgAudio.preload = "auto";
  }
  return bgAudio;
}

function startBgMusic() {
  const a = getBgAudio();
  if (!a) return;
  a.volume = BG_MUSIC_VOLUME;
  // play() can reject if not inside a user gesture on some browsers;
  // setSound(true) is always called from a tap/click, so this normally resolves.
  a.play().catch(() => {});
}

function stopBgMusic() {
  bgAudio?.pause();
  if (bgAudio) bgAudio.currentTime = 0;
}

export function setSound(v: boolean) {
  enabled = v; try { localStorage.setItem(K, JSON.stringify(v)); } catch {}
  if (v) { getCtx(); startBgMusic(); } else { stopBgMusic(); }
  subs.forEach((f) => f());
}
export const useSound = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => enabled, () => false);