import React from "react";
import { I } from "../icons.jsx";
import { HOME_BG, NEWS, MISSIONS } from "../config.js";

export default function HomePage({ profile, toast, onResetId }) {
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
        <a className="pc-reset" onClick={onResetId}>Reset identity (test)</a>
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
          {NEWS.map((n) => (
            <div className="news" key={n.title}>
              <em className={n.tag}>{n.tag}</em>
              <span>{n.title}</span>
              <small>{n.date}</small>
            </div>
          ))}
        </div>
        <div className="panel">
          <div className="ph">DAILY MISSIONS</div>
          {MISSIONS.map((m) => (
            <div className={"mission" + (m.done ? " done" : "")} key={m.t}>
              <i>{m.done && I.check}</i>
              <span>{m.t}</span>
              <b>{m.r}</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
