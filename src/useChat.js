import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "./supabase.js";
import { loadMessages, sendMessage } from "./api.js";

// Live global chat: messages (realtime), who is online (presence), unread counter.
export default function useChat(username, level, active, onRewarded) {
  const [msgs, setMsgs] = useState([]);
  const [online, setOnline] = useState([]);
  const [unread, setUnread] = useState(0);
  const [status, setStatus] = useState("connecting");
  const activeRef = useRef(active);
  const chRef = useRef(null);
  const rewardRef = useRef(onRewarded);
  const levelRef = useRef(level);
  activeRef.current = active;
  rewardRef.current = onRewarded;
  levelRef.current = level;

  useEffect(() => { if (active) setUnread(0); }, [active]);

  const refetch = useCallback(async () => {
    try { setMsgs(await loadMessages()); } catch (e) { /* keep what we have */ }
  }, []);

  useEffect(() => {
    let alive = true;
    refetch();
    const ch = supabase.channel("asc-global", { config: { presence: { key: username } } });
    chRef.current = ch;
    ch.on("postgres_changes", { event: "INSERT", schema: "public", table: "asc_messages" }, (payload) => {
      const m = payload.new;
      if (!alive || !m) return;
      setMsgs((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev, m].slice(-80)));
      if (!activeRef.current && m.username !== username) setUnread((n) => n + 1);
    })
      .on("presence", { event: "sync" }, () => {
        if (!alive) return;
        const st = ch.presenceState();
        const list = Object.keys(st).map((k) => ({ username: k, lv: (st[k][0] && st[k][0].lv) || 1 }));
        list.sort((a, b) => a.username.localeCompare(b.username));
        setOnline(list);
      })
      .subscribe((s) => {
        if (!alive) return;
        if (s === "SUBSCRIBED") { setStatus("live"); ch.track({ lv: levelRef.current }); }
        else if (s === "CHANNEL_ERROR" || s === "TIMED_OUT" || s === "CLOSED") setStatus("error");
      });
    return () => { alive = false; chRef.current = null; supabase.removeChannel(ch); };
  }, [username, refetch]);

  // If realtime is down, poll so chat still works
  useEffect(() => {
    if (status === "live") return undefined;
    const t = setInterval(refetch, 10000);
    return () => clearInterval(t);
  }, [status, refetch]);

  useEffect(() => {
    if (chRef.current && status === "live") chRef.current.track({ lv: level });
  }, [level, status]);

  // returns "" on success, or an error message
  const send = useCallback(async (text) => {
    try {
      const r = await sendMessage(text);
      if (!r || !r.ok) return (r && r.error) || "Could not send.";
      if (status !== "live") refetch();
      if (r.rewarded && rewardRef.current) rewardRef.current();
      return "";
    } catch (e) { return e.message; }
  }, [status, refetch]);

  return { msgs, online, unread, status, send };
}
