import { useSyncExternalStore } from "react";

const K = "unknown.house.v1";

export type BoxItemId = "questions" | "control" | "replaying" | "tomorrow" | "expectations" | "notyours";

export type HouseState = {
  curtainsOpen: boolean;
  recordOn: boolean;
  fridgeOpened: boolean;
  drawerOpened: boolean;
  bookPulled: boolean;
  lampOn: boolean;
  boxOpened: boolean;
  noteRead: boolean;
  storedItems: BoxItemId[];
  doorOpened: boolean;
  // beach
  timeOfDay: number; // 0..1, 0 = deep night, 1 = day, driven by moon/sun drag
  moonPos: number; // 0..100 across sky
  constellationFound: boolean;
};

const init: HouseState = {
  curtainsOpen: false,
  recordOn: false,
  fridgeOpened: false,
  drawerOpened: false,
  bookPulled: false,
  lampOn: true,
  boxOpened: false,
  noteRead: false,
  storedItems: [],
  doorOpened: false,
  timeOfDay: 0.15,
  moonPos: 50,
  constellationFound: false,
};

let s = init;
const subs = new Set<() => void>();
if (typeof window !== "undefined") {
  try { s = { ...init, ...JSON.parse(localStorage.getItem(K) || "{}") }; } catch {}
}
function save() {
  try { localStorage.setItem(K, JSON.stringify(s)); } catch {}
  subs.forEach((f) => f());
}
function patch(p: Partial<HouseState>) { s = { ...s, ...p }; save(); }

export const setCurtains = (v: boolean) => patch({ curtainsOpen: v });
export const setRecord = (v: boolean) => patch({ recordOn: v });
export const openFridge = () => patch({ fridgeOpened: true });
export const openDrawer = () => patch({ drawerOpened: true });
export const pullBook = () => patch({ bookPulled: true });
export const toggleLamp = () => patch({ lampOn: !s.lampOn });
export const openBox = () => patch({ boxOpened: true });
export const readNote = () => patch({ noteRead: true });
export const openDoor = () => patch({ doorOpened: true });
export const setMoon = (pos: number, time: number) => patch({ moonPos: pos, timeOfDay: time });
export const foundConstellation = () => patch({ constellationFound: true });

export const storeItem = (id: BoxItemId) => {
  if (s.storedItems.includes(id)) return;
  patch({ storedItems: [...s.storedItems, id] });
};

export const useHouse = () =>
  useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => s, () => init);