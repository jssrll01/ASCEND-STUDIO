import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase.js";
import { loadMessages, sendMessage } from "./api.js";

// Plain global chat: messages only (realtime, with polling fallback). No rewards, no presence.
export default function useChat(username) {
  const [msgs, setMsgs] = useState([]);
  const [live, setLive] = useState(false);

  const refetch = useCallback(async () => {
    try { setMsgs(await loadMessages()); } catch (e) { /* keep what we have */ }
  }, []);

  useEffect(() => {
    let alive = true;
    refetch();
    const ch = supabase.channel("asc-global-" + username);
    ch.on("postgres_changes", { event: "INSERT", schema: "public", table: "asc_messages" }, (payload) => {
      const m = payload.new;
      if (!alive || !m) return;
      setMsgs((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m].slice(-80)));
    }).subscribe((s) => {
      if (!alive) return;
      setLive(s === "SUBSCRIBED");
    });
    return () => { alive = false; supabase.removeChannel(ch); };
  }, [username, refetch]);

  useEffect(() => {
    if (live) return undefined;
    const t = setInterval(refetch, 8000);
    return () => clearInterval(t);
  }, [live, refetch]);

  // returns "" on success, or an error message
  const send = useCallback(async (text) => {
    try {
      const r = await sendMessage(text);
      if (!r || !r.ok) return (r && r.error) || "Could not send.";
      if (!live) refetch();
      return "";
    } catch (e) { return e.message; }
  }, [live, refetch]);

  return { msgs, send };
}
