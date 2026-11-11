import React from "react";

const TEST_MODE = import.meta.env.VITE_TEST_MODE === "1";

export default function SettingsPage({ profile, onLogout, onResetId }) {
  return (
    <div className="m-settings">
      <h2>Settings</h2>
      <section className="m-card m-row">
        <div><small>SIGNED IN AS</small><b>@{profile.username}</b></div>
        <button className="m-btn danger" onClick={onLogout}>Log out</button>
      </section>
      {TEST_MODE && (
        <section className="m-card m-row">
          <div><small>TESTING</small><b>Reset identity</b></div>
          <button className="m-btn" onClick={onResetId}>Reset</button>
        </section>
      )}
    </div>
  );
}
