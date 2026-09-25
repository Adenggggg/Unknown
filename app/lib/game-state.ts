import { useSyncExternalStore } from "react";
export type GameState = { discoveredApps: string[]; completedGames: string[]; collectedItems: string[]; discoveredStars: string[]; gardenItems: string[]; archiveFiles: string[]; clues: string[]; secretUnlocked: boolean };
const K = "unknown.v1";
const init: GameState = { discoveredApps: [], completedGames: [], collectedItems: [], discoveredStars: [], gardenItems: [], archiveFiles: [], clues: [], secretUnlocked: false };
let s = init; const subs = new Set<() => void>();
if (typeof window !== "undefined") try { s = { ...init, ...JSON.parse(localStorage.getItem(K) || "{}") }; } catch {}
let toast = ""; let tt: any;
export const useToast = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => toast, () => "");
export const SYMBOLS = ["◇", "○", "△", "□"];
import { sfx } from "~/lib/sound";
export function add(k: Exclude<keyof GameState, "secretUnlocked">, v: string) {
  if (s[k].includes(v)) return;
  s = { ...s, [k]: [...s[k], v] }; s.secretUnlocked = s.clues.length >= SYMBOLS.length;
  try { localStorage.setItem(K, JSON.stringify(s)); } catch {}
  if (k === "clues") { sfx.unlock(); toast = v + " ACQUIRED"; clearTimeout(tt); tt = setTimeout(() => { toast = ""; subs.forEach((f) => f()); }, 2500); }
  else sfx.success();
  subs.forEach((f) => f());
}
export const reset = () => { s = init; localStorage.removeItem(K); subs.forEach((f) => f()); };
export const useGame = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => s, () => init);
export const total = (g: GameState) => g.clues.length + g.completedGames.length + g.discoveredStars.length + g.gardenItems.length + g.collectedItems.length;
