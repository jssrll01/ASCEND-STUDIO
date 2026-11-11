import React, { useState } from "react";
import { I } from "./icons.jsx";
import { GAME } from "./config.js";
import useChat from "./useChat.js";
import HomePage from "./pages/HomePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";

const NAV = [
  { id: "home", label: "Home", icon: I.home },
  { id: "chat", label: "Chat", icon: I.chat },
];

const fmt = (n) => Number(n || 0).toLocaleString("en-US");

export default function Shell({ profile, missions, onLogout, onResetId, onClaim, onRefresh }) {
  const [page, setPage] = useState("home");
  const [toast, setToast] = useState(null);
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(null), 2200); };

  const xp = Number(profile.xp || 0);
  const level = 1 + Math.floor(xp / 100);
  const chat = useChat(profile.username, level, page === "chat", () => {
    onRefresh();
    showToast("Mission complete: +50 Gold");
  });

  return (
    <div className="screen shell">
      <div className="hud">
        <div className="hud-logo">{GAME.name}</div>
        <div className="player">
          <div className="pav">{profile.username[0].toUpperCase()}</div>
          <div className="pinfo">
            <b>@{profile.username}</b>
            <div className="lvrow"><small>LV.{level}</small><div className="xp"><i style={{ width: (xp % 100) + "%" }} /></div></div>
          </div>
        </div>
        <div className="spacer" />
        <div className="cur"><span className="ic">{I.energy}</span>{profile.energy} / {profile.energy_max}</div>
        <div className="cur"><span className="ic">{I.gold}</span>{fmt(profile.gold)}</div>
        <div className="cur"><span className="ic">{I.gem}</span>{fmt(profile.gems)}</div>
      </div>

      <nav className="rail">
        {NAV.map((n) => (
          <div key={n.id} className={"nav" + (page === n.id ? " on" : "")} onClick={() => setPage(n.id)}>
            {n.icon}<span>{n.label}</span>
            {n.id === "chat" && chat.unread > 0 && <b className="badge">{chat.unread > 99 ? "99+" : chat.unread}</b>}
          </div>
        ))}
        <div className="grow" />
        <div className="nav" onClick={onLogout}>{I.logout}<span>Logout</span></div>
      </nav>

      <main className="content" key={page}>
        {page === "home" && <HomePage profile={profile} missions={missions} toast={showToast} onResetId={onResetId} onClaim={onClaim} />}
        {page === "chat" && <ChatPage profile={profile} chat={chat} toast={showToast} />}
      </main>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
