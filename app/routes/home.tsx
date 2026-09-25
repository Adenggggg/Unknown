import { useNavigate } from "react-router";
import { sfx, setSound } from "~/lib/sound";
export default function Home() {
  const go = useNavigate();
  return <button onClick={() => { setSound(true); sfx.select(); go("/world"); }} className="pad min-h-dvh w-full grid place-items-center text-left">
    <div className="fade"><p className="text-[10px] tracking-[.5em] opacity-50">UNKNOWN / SYSTEM ONLINE</p>
      <h1 className="mt-6 text-3xl font-light leading-tight">7 things are<br />waiting for you.</h1>
      <p className="mt-16 text-xs tracking-widest opacity-40 animate-pulse">Tap anywhere to begin.</p></div></button>;
}
