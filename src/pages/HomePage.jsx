import React, { useEffect, useState } from "react";
import { I } from "../icons.jsx";
import { HOME_BG, NEWS as FALLBACK_NEWS } from "../config.js";
import { loadNews } from "../api.js";

const MISSIONS = [
  { id: "identity", t: "Create your identity", r: "+100 Gold" },
  { id: "hello", t: "Say hello in Global Chat", r: "+50 Gold" },
  { id: "daily", t: "Check the Home page daily", r: "+20 Gems", claim: true },
];
const TEST_MODE = import.meta.env.VITE_TEST_MODE === "1";

export default function HomePage({ profile, missions, toast, onResetId, onClaim }) {
  const [news, setNews] = useState(FALLBACK_NEWS);
  const [busy, setBusy] = useState(false);
  const done = missions || {};

  useEffect(() => {
    let alive = true;
    loadNews()
      .then((rows) => { if (alive && rows.length) setNews(rows.map((n) => ({ tag: n.tag, title: n.title, date: n.date_label }))); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  const claim = async () => {
    if (busy) return;
    setBusy(true);
    const err = await onClaim();
    setBusy(false);
    toast(err || "+20 Gems claimed");
  };

  return (
    <div className="hp" style={{ backgroundImage: `url(${HOME_BG})` }}>
      <div className="hp-shade" />

      <div className="panel pcard">
        <div className="ph">PLAYER CARD</div>
        <div className="pc-name">@{profile.username}</div>
        <div className="pc-real">{profile.first} {profile.last}</div>
        <div className="pc-row"><span>Age</span><b>{profile.age}</b></div>
        <div className="pc-row"><span>Location</span><b>{profile.city}, {profile.country}</b></div>
        <div className="pc-row"><span>Life goal</span><b>{profile.goal}</b></div>
        {profile.career && <div className="pc-row"><span>Dream career</span><b>{profile.career}</b></div>}
        {profile.bio && <div className="pc-bio">“{profile.bio}”</div>}
        {TEST_MODE && <a className="pc-reset" onClick={onResetId}>Reset identity (test)</a>}
      </div>

      <div className="hero">
        <div className="season">SEASON 1</div>
        <h2>AWAKENING</h2>
        <p>Build your life. Rise beyond reality.</p>
        <button className="btn-start" onClick={() => toast("World mode is coming soon")}>
          <span className="pi">{I.play}</span>ENTER WORLD
        </button>
      </div>

      <div className="rcol">
        <div className="panel">
          <div className="ph">NEWS</div>
          {news.map((n) => (
            <div className="news" key={n.title}>
              <em className={n.tag}>{n.tag}</em>
              <span>{n.title}</span>
              <small>{n.date}</small>
            </div>
          ))}
        </div>
        <div className="panel">
          <div className="ph">DAILY MISSIONS</div>
          {MISSIONS.map((m) => {
            const isDone = !!done[m.id];
            const canClaim = m.claim && !isDone;
            return (
              <div className={"mission" + (isDone ? " done" : "")} key={m.id}
                onClick={canClaim ? claim : undefined} role={canClaim ? "button" : undefined}
                style={canClaim ? { cursor: "pointer" } : undefined}>
                <i>{isDone && I.check}</i>
                <span>{m.t}</span>
                <b>{canClaim ? (busy ? "…" : "CLAIM · " + m.r) : m.r}</b>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
