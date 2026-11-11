import React, { useMemo } from "react";
import useMeta from "./useMeta.js";
import { GoogleG } from "./icons.jsx";

export default function Title({ user, busy, error, onLogin, onStart, onLogout }) {
  const parts = useMemo(
    () => Array.from({ length: 26 }, () => ({ l: Math.random() * 100, d: 6 + Math.random() * 8, dl: Math.random() * 8, s: 2 + Math.random() * 3 })),
    []
  );
  const name = user?.name || "Player";
  const meta = useMeta();
  const S = (meta && meta.settings) || {};

  return (
    <div className="screen title" style={meta && meta.assets.title_bg ? { backgroundImage: `url(${meta.assets.title_bg})` } : undefined}>
      <div className="shade" /><div className="vig" />
      <div className="particles">
        {parts.map((p, i) => (
          <i key={i} style={{ left: p.l + "%", animationDuration: p.d + "s", animationDelay: p.dl + "s", width: p.s, height: p.s }} />
        ))}
      </div>
      <div className="corner-top">{S.version ? "v" + S.version : ""}</div>

      <div className="logo">
        <div className="game-type">{S.type}</div>
        <h1>{S.name}</h1>
        <div className="tag"><b>—</b> {S.tag}</div>
      </div>

      <div className="login-box">
        {!user ? (
          <>
            <button className="btn-google" onClick={onLogin} disabled={busy}>
              <GoogleG />{busy ? "Connecting…" : "Continue with Google"}
            </button>
            <div className="hint">{error || "Sign in to save your progress"}</div>
          </>
        ) : (
          <>
            <div className="user-chip">
              <div className="av">{name[0]?.toUpperCase()}</div>
              <div><small>WELCOME BACK</small><span>{name}</span></div>
            </div>
            <button className="btn-start" onClick={onStart}>START</button>
            <div className="hint"><a onClick={onLogout}>Switch account</a></div>
          </>
        )}
      </div>

      <div className="footer">
        <div>© {new Date().getFullYear()} <b>{S.producer}</b></div>
        <div>Powered by <b className="xmb">{S.powered}</b></div>
      </div>
    </div>
  );
}
