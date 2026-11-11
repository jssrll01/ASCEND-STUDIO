import { useEffect, useState } from "react";

const editing = () => {
  const a = document.activeElement;
  return !!a && (a.tagName === "INPUT" || a.tagName === "TEXTAREA" || a.tagName === "SELECT");
};

// Fixed 1280x720 stage, scaled to fit, rotated to landscape when phone is upright.
export default function useStage() {
  const [st, setSt] = useState({ s: 1, rot: false, w: 1280, h: 720 });

  useEffect(() => {
    const f = () => {
      // The on-screen keyboard resizes the window. Do not re-layout (or flip the rotation) while typing.
      if (editing()) return;
      const w = window.innerWidth, h = window.innerHeight;
      const portrait = h > w;
      const W = portrait ? h : w, H = portrait ? w : h;
      const sc = Math.min(W / 1280, H / 720);
      const next = { s: sc, rot: portrait, w: Math.round(W / sc), h: Math.round(H / sc) };
      setSt((o) => (o.s === next.s && o.rot === next.rot && o.w === next.w && o.h === next.h ? o : next));
    };
    const later = () => setTimeout(f, 350);
    f();
    window.addEventListener("resize", f);
    window.addEventListener("orientationchange", f);
    document.addEventListener("focusout", later);
    return () => {
      window.removeEventListener("resize", f);
      window.removeEventListener("orientationchange", f);
      document.removeEventListener("focusout", later);
    };
  }, []);

  return st;
}

// Must be called from a user tap (browser rule)
export async function enterFullscreen() {
  const el = document.documentElement;
  try {
    if (!document.fullscreenElement && el.requestFullscreen) {
      await el.requestFullscreen({ navigationUI: "hide" });
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    }
  } catch (e) {}
  try {
    if (screen.orientation && screen.orientation.lock) await screen.orientation.lock("landscape");
  } catch (e) {}
}
