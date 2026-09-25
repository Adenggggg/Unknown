import { useSyncExternalStore } from "react";
const K = "unknown.world.v1";
export type Photo = { id: string; dataUrl: string; clueFound: boolean; prompt: string };
export type WorldState = { photos: Photo[]; secretUnlocked: boolean; wishUsed: boolean; cafeCreations: string[]; visited: string[] };
const init: WorldState = { photos: [], secretUnlocked: false, wishUsed: false, cafeCreations: [], visited: [] };
let s = init;
const subs = new Set<() => void>();
if (typeof window !== "undefined") try { s = { ...init, ...JSON.parse(localStorage.getItem(K) || "{}") }; } catch {}
function save() { try { localStorage.setItem(K, JSON.stringify(s)); } catch {} subs.forEach((f) => f()); }
export const visit = (id: string) => { if (s.visited.includes(id)) return; s = { ...s, visited: [...s.visited, id] }; save(); };
export const addPhoto = (p: Photo) => { s = { ...s, photos: [...s.photos, p] }; save(); };
export const markClue = (id: string) => { s = { ...s, photos: s.photos.map((p) => (p.id === id ? { ...p, clueFound: true } : p)) }; if (s.photos.filter((p) => p.clueFound).length >= 4) s.secretUnlocked = true; save(); };
export const addCafe = (n: string) => { s = { ...s, cafeCreations: [...s.cafeCreations, n] }; save(); };
export const useWishUsed = () => { s = { ...s, wishUsed: true }; save(); };
export const useWorld = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => s, () => init);
export type EventKind = "sunset" | "meteor" | "aurora" | "fireflies" | "rain" | "snow" | "midnight" | null;
let event: EventKind = null;
const esubs = new Set<() => void>();
export const setEvent = (e: EventKind) => { event = e; esubs.forEach((f) => f()); };
export const useEvent = () => useSyncExternalStore((f) => (esubs.add(f), () => esubs.delete(f)), () => event, () => null);
export const EVENT_BG: Record<Exclude<EventKind, null>, string> = {
  sunset: "linear-gradient(#3a2440,#a8552f 70%,#2a1220)", meteor: "radial-gradient(circle at 70% 20%,#1a1030,#04030a 70%)",
  aurora: "linear-gradient(#041018,#0a3a3a 40%,#04030a)", fireflies: "radial-gradient(circle,#12160c,#04030a 70%)",
  rain: "linear-gradient(#0a0f18,#04030a)", snow: "linear-gradient(#10141c,#04030a)", midnight: "radial-gradient(circle at 50% 10%,#141428,#02020a 70%)",
};
