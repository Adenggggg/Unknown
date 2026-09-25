import { useSyncExternalStore } from "react";
import type { GameState } from "~/lib/game-state";

const K = "unknown.ch2.v1";
export type UniverseState = { piecesPlaced: string[]; roomVisited: boolean; sandbox: boolean };
const init: UniverseState = { piecesPlaced: [], roomVisited: false, sandbox: false };
let s = init;
const subs = new Set<() => void>();
if (typeof window !== "undefined") try { s = { ...init, ...JSON.parse(localStorage.getItem(K) || "{}") }; } catch {}
function save() { try { localStorage.setItem(K, JSON.stringify(s)); } catch {} subs.forEach((f) => f()); }
export const placePiece = (id: string) => { if (s.piecesPlaced.includes(id)) return; s = { ...s, piecesPlaced: [...s.piecesPlaced, id] }; save(); };
export const visitRoom = () => { if (s.roomVisited) return; s = { ...s, roomVisited: true }; save(); };
export const enterSandbox = () => { if (s.sandbox) return; s = { ...s, sandbox: true }; save(); };
export const useUniverse = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => s, () => init);

export type UObj = { id: string; kind: "star" | "planet" | "island" | "structure" | "shard"; label: string; x: number; y: number };

export function buildUniverse(g: GameState): UObj[] {
  const out: UObj[] = [];
  let a = 0;
  const ring = (n: number, r: number) => { a += 0.6 + Math.random() * 0.4; return { x: 50 + Math.cos(a) * r, y: 50 + Math.sin(a) * r * 0.6 }; };
  g.discoveredStars.forEach((id, i) => out.push({ id: "star-" + id, kind: "star", label: "star", ...ring(i, 30 + (i % 3) * 6) }));
  g.completedGames.forEach((id) => out.push({ id: "planet-" + id, kind: "planet", label: id.replace("-", " "), ...ring(0, 24) }));
  g.gardenItems.forEach((id) => out.push({ id: "island-" + id, kind: "island", label: id, ...ring(0, 34) }));
  g.archiveFiles.forEach((id) => out.push({ id: "structure-" + id, kind: "structure", label: id, ...ring(0, 38) }));
  g.collectedItems.forEach((id) => out.push({ id: "shard-" + id, kind: "shard", label: id, ...ring(0, 28) }));
  return out;
}

export const GLYPH: Record<UObj["kind"], string> = { star: "✦", planet: "◉", island: "❦", structure: "▤", shard: "◇" };
export const MISSING = [
  { id: "p1", from: "the Arcade", hint: "Something you completed is missing from orbit." },
  { id: "p2", from: "the Observatory", hint: "A star you found hasn't arrived yet." },
  { id: "p3", from: "the Garden", hint: "Something grown is still missing." },
];
