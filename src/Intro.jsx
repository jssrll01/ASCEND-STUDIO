import React, { useEffect, useState } from "react";
import { GAME } from "./config.js";

export default function Intro({ onDone }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 2500),
      setTimeout(() => setPhase(2), 4500),
      setTimeout(onDone, 8200),
    ];
    return () => t.forEach(clearTimeout);
  }, []);

  return (
    <div className="screen intro">
      <div className="grid" />
      {phase === 0 && (
        <div className="studio">{GAME.producer}<div className="bar" /><small>PRESENTS</small></div>
      )}
      {phase === 1 && <div className="xm">POWERED BY <b>{GAME.powered}</b></div>}
      {phase === 2 && (
        <>
          <div className="ititle">
            {GAME.name.split("").map((c, i) => (
              <span key={i} style={{ animationDelay: i * 0.12 + "s" }}>{c}</span>
            ))}
          </div>
          <div className="itag">{GAME.tag}</div>
        </>
      )}
    </div>
  );
}
