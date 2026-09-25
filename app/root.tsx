import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./app.css";
import { Toast } from "~/components/shared/Toast";
export function Layout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" /><meta name="theme-color" content="#050507" /><title>UNKNOWN</title><Meta /><Links /></head><body>{children}<ScrollRestoration /><Scripts /></body></html>;
}
export function HydrateFallback() { return null; }
export default function App() { return <><Outlet /><Toast /></>; }
