import React, { useState } from "react";
import { I } from "./icons.jsx";
import { GAME, WALLET } from "./config.js";
import HomePage from "./pages/HomePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";

const NAV = [
  { id: "home", label: "Home", icon: I.home },
  { id: "chat", label: "Chat", icon: I.chat },
];

export default function Shell({ profile, onLogout, onResetId }) {
  const [page, setPage] = useState("home");
  const [toast, setToast] = useState(null);
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2200); };

  return (
    <div className="screen shell">
      <div className="hud">
        <div className="hud-logo">{GAME.name}</div>
        <div className="player">
          <div className="pav">{profile.username[0].toUpperCase()}</div>
          <div className="pinfo">
            <b>@{profile.username}</b>
            <div className="lvrow"><small>LV.1</small><div className="xp"><i style={{ width: "8%" }} /></div></div>
          </div>
        </div>
        <div className="spacer" />
        <div className="cur"><span className="ic">{I.energy}</span>{WALLET.energy}</div>
        <div className="cur"><span className="ic">{I.gold}</span>{WALLET.gold}</div>
        <div className="cur"><span className="ic">{I.gem}</span>{WALLET.gems}</div>
      </div>

      <nav className="rail">
        {NAV.map((n) => (
          <div key={n.id} className={"nav" + (page === n.id ? " on" : "")} onClick={() => setPage(n.id)}>
            {n.icon}<span>{n.label}</span>
            {n.id === "chat" && <b className="badge">3</b>}
          </div>
        ))}
        <div className="grow" />
        <div className="nav" onClick={onLogout}>{I.logout}<span>Logout</span></div>
      </nav>

      <main className="content" key={page}>
        {page === "home" && <HomePage profile={profile} toast={showToast} onResetId={onResetId} />}
        {page === "chat" && <ChatPage profile={profile} />}
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
