import React, { useCallback, useEffect, useState } from "react";
import useStage, { enterFullscreen } from "./useStage.js";
import { supabase, configured } from "./supabase.js";
import { getState, createPlayer, claimDaily, resetPlayer, signInGoogle, signOut } from "./api.js";
import Intro from "./Intro.jsx";
import Title from "./Title.jsx";
import Identity from "./Identity.jsx";
import Shell from "./Shell.jsx";

const returningFromLogin = () => /[?&]code=|access_token=/.test(window.location.search + window.location.hash);
const EMPTY = { player: null, missions: {} };

export default function App() {
  const { s, rot, w, h } = useStage();
  const [screen, setScreen] = useState(() => (returningFromLogin() ? "title" : "intro"));
  const [user, setUser] = useState(null);
  const [state, setState] = useState(EMPTY);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Fullscreen needs a user gesture, so the first tap anywhere does it (no tap-to-start screen)
  useEffect(() => {
    const go = () => { enterFullscreen(); window.removeEventListener("pointerup", go); };
    window.addEventListener("pointerup", go);
    return () => window.removeEventListener("pointerup", go);
  }, []);

  const loadState = useCallback(async () => {
    try {
      const st = await getState();
      setState({ player: (st && st.player) || null, missions: (st && st.missions) || {} });
    } catch (e) { setError(e.message); }
  }, []);

  useEffect(() => {
    if (!configured) { setError("The game server is not configured yet."); setReady(true); return undefined; }
    let alive = true;
    const apply = async (session) => {
      const su = session && session.user;
      const meta = (su && su.user_metadata) || {};
      const u = su ? { id: su.id, email: su.email, name: meta.full_name || meta.name || (su.email || "Player").split("@")[0] } : null;
      if (!alive) return;
      setUser(u);
      if (u) {
        await loadState();
        if (returningFromLogin()) window.history.replaceState({}, "", window.location.pathname);
      } else {
        setState(EMPTY);
      }
      if (alive) setReady(true);
    };
    // Do not call Supabase inside this callback directly (it can deadlock), so defer it
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED") return;
      setTimeout(() => apply(session), 0);
    });
    return () => { alive = false; sub.subscription.unsubscribe(); };
  }, [loadState]);

  // Never sit on a signed-in screen without a session
  useEffect(() => {
    if (ready && !user && (screen === "identity" || screen === "main")) setScreen("title");
  }, [ready, user, screen]);

  const login = async () => {
    setError(""); setBusy(true);
    try { await signInGoogle(); } catch (e) { setError(e.message); setBusy(false); }
  };
  const start = () => { enterFullscreen(); setScreen(state.player ? "main" : "identity"); };
  const logout = async () => { await signOut(); setUser(null); setState(EMPTY); setScreen("title"); };
  const createId = async (p) => {
    try {
      const st = await createPlayer(p);
      setState({ player: st.player, missions: st.missions || {} });
      setScreen("main");
      return "";
    } catch (e) { return e.message; }
  };
  const claim = async () => {
    try {
      const r = await claimDaily();
      if (!r || !r.ok) return (r && r.error) || "Could not claim.";
      setState({ player: r.player, missions: r.missions || {} });
      return "";
    } catch (e) { return e.message; }
  };
  const resetId = async () => {
    if (!window.confirm("Delete your identity and start over?")) return;
    try { await resetPlayer(); await loadState(); setScreen("identity"); } catch (e) { setError(e.message); }
  };

  const transform = `translate(-50%,-50%) ${rot ? "rotate(90deg) " : ""}scale(${s})`;

  return (
    <div className="stage" style={{ transform, width: w, height: h }}>
      {screen === "intro" && <Intro onDone={() => setScreen("title")} />}
      {screen === "title" && <Title user={user} busy={busy || !ready} error={error} onLogin={login} onStart={start} onLogout={logout} />}
      {screen === "identity" && user && <Identity onCreate={createId} />}
      {screen === "main" && state.player && (
        <Shell profile={state.player} missions={state.missions} onLogout={logout} onResetId={resetId} onClaim={claim} onRefresh={loadState} />
      )}
    </div>
  );
}
