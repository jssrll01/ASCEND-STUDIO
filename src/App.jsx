import React, { useState } from "react";
import useStage from "./useStage.js";
import { K, load, save, clear } from "./store.js";
import Splash from "./Splash.jsx";
import Intro from "./Intro.jsx";
import Title from "./Title.jsx";
import Identity from "./Identity.jsx";
import Shell from "./Shell.jsx";

export default function App() {
  const { s, rot } = useStage();
  const [screen, setScreen] = useState("splash");
  const [user, setUser] = useState(() => load(K.user));
  const [profile, setProfile] = useState(() => load(K.profile));
  const [busy, setBusy] = useState(false);

  // hardcoded test login (Supabase + real Google comes later)
  const login = () => {
    setBusy(true);
    setTimeout(() => {
      const u = { email: "player@gmail.com", name: "Test Player" };
      save(K.user, u);
      setUser(u);
      setBusy(false);
      setScreen(profile ? "main" : "identity");
    }, 900);
  };
  const start = () => setScreen(profile ? "main" : "identity");
  const logout = () => { clear(K.user); setUser(null); setScreen("title"); };
  const createId = (p) => { save(K.profile, p); setProfile(p); setScreen("main"); };
  const resetId = () => { clear(K.profile); setProfile(null); setScreen("identity"); };

  const transform = `translate(-50%,-50%) ${rot ? "rotate(90deg) " : ""}scale(${s})`;

  return (
    <div className="stage" style={{ transform }}>
      {screen === "splash" && <Splash onDone={() => setScreen("intro")} />}
      {screen === "intro" && <Intro onDone={() => setScreen("title")} />}
      {screen === "title" && <Title user={user} busy={busy} onLogin={login} onStart={start} onLogout={logout} />}
      {screen === "identity" && <Identity onCreate={createId} />}
      {screen === "main" && profile && <Shell profile={profile} onLogout={logout} onResetId={resetId} />}
    </div>
  );
}
