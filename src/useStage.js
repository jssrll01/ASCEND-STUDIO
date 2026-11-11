import { useEffect, useState } from "react";

// Fixed 1280x720 stage, scaled to fit, rotated to landscape when phone is upright.
export default function useStage() {
  const [st, setSt] = useState({ s: 1, rot: false });

  useEffect(() => {
    const f = () => {
      const w = window.innerWidth, h = window.innerHeight;
      const portrait = h > w;
      const W = portrait ? h : w, H = portrait ? w : h;
      setSt({ s: Math.min(W / 1280, H / 720), rot: portrait });
    };
    f();
    window.addEventListener("resize", f);
    window.addEventListener("orientationchange", f);
    return () => {
      window.removeEventListener("resize", f);
      window.removeEventListener("orientationchange", f);
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
