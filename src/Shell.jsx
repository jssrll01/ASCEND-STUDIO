import React, { useState } from "react";
import useChat from "./useChat.js";
import HomePage from "./pages/HomePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

const svg = (d) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const ICONS = {
  home: svg(<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />),
  chat: svg(<path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-5 4v-4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />),
  settings: svg(<><circle cx="12" cy="12" r="3" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" /></>),
};
const NAV = [
  { id: "home", label: "Home" },
  { id: "chat", label: "Chat" },
  { id: "settings", label: "Settings" },
];

export default function Shell({ profile, onLogout, onResetId }) {
  const [page, setPage] = useState("home");
  const chat = useChat(profile.username);

  return (
    <div className="screen m-shell">
      <nav className="m-rail">
        {NAV.map((n) => (
          <button key={n.id} className={"m-nav" + (page === n.id ? " on" : "")} onClick={() => setPage(n.id)}>
            {ICONS[n.id]}<span>{n.label}</span>
          </button>
        ))}
      </nav>
      <main className="m-main" key={page}>
        {page === "home" && <HomePage profile={profile} />}
        {page === "chat" && <ChatPage profile={profile} chat={chat} />}
        {page === "settings" && <SettingsPage profile={profile} onLogout={onLogout} onResetId={onResetId} />}
      </main>
    </div>
  );
}
