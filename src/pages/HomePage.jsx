import React from "react";

const fmt = (n) => Number(n || 0).toLocaleString("en-US");

export default function HomePage({ profile }) {
  const xp = Number(profile.xp || 0);
  const level = 1 + Math.floor(xp / 100);
  return (
    <div className="m-home">
      <section className="m-card m-profile">
        <div className="m-avatar">{profile.username[0].toUpperCase()}</div>
        <div className="m-pinfo">
          <h2>@{profile.username}</h2>
          <p>{profile.first} {profile.last}</p>
          <div className="m-lv"><small>LEVEL {level}</small><div className="m-bar"><i style={{ width: (xp % 100) + "%" }} /></div></div>
        </div>
        <dl className="m-facts">
          <div><dt>Age</dt><dd>{profile.age}</dd></div>
          <div><dt>Location</dt><dd>{profile.city}, {profile.country}</dd></div>
          <div><dt>Life goal</dt><dd>{profile.goal}</dd></div>
        </dl>
      </section>

      <section className="m-stats">
        <div className="m-card m-stat"><small>CASH</small><b>{profile.energy} <em>/ {profile.energy_max}</em></b></div>
        <div className="m-card m-stat gold"><small>GOLD</small><b>{fmt(profile.gold)}</b></div>
        <div className="m-card m-stat gem"><small>DIAMONDS</small><b>{fmt(profile.gems)}</b></div>
      </section>
    </div>
  );
}
