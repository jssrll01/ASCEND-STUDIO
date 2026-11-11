import React from "react";
import { GAME } from "./config.js";
import { enterFullscreen } from "./useStage.js";

export default function Splash({ onDone }) {
  const go = async () => {
    await enterFullscreen();
    onDone();
  };
  return (
    <div className="screen splash" onClick={go}>
      <div className="grid" />
      <div className="splash-logo">{GAME.name}</div>
      <div className="splash-tap">TAP TO START</div>
      <div className="splash-sub">Full screen · Landscape</div>
    </div>
  );
}
