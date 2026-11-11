import React, { useEffect, useRef, useState } from "react";

const hm = (iso) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function ChatPage({ profile, chat }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const list = useRef(null);

  useEffect(() => {
    if (list.current) list.current.scrollTop = list.current.scrollHeight;
  }, [chat.msgs]);

  const send = async (e) => {
    e.preventDefault();
    const v = text.trim();
    if (!v || sending) return;
    setSending(true);
    const r = await chat.send(v);
    setSending(false);
    if (r) setErr(r); else { setErr(""); setText(""); }
  };

  return (
    <div className="m-chat">
      <header className="m-chat-head">World Chat</header>
      <div className="m-msgs" ref={list}>
        {chat.msgs.length === 0 && <div className="m-empty">No messages yet.</div>}
        {chat.msgs.map((m) => (
          <div key={m.id} className={"m-msg" + (m.username === profile.username ? " me" : "")}>
            <div className="m-meta"><b>@{m.username}</b><small>{hm(m.created_at)}</small></div>
            <div className="m-bubble">{m.body}</div>
          </div>
        ))}
      </div>
      {err && <div className="m-err">{err}</div>}
      <form className="m-composer" onSubmit={send}>
        <input value={text} maxLength={140} onChange={(e) => setText(e.target.value)} placeholder="Message" autoComplete="off" />
        <button type="submit" disabled={sending || !text.trim()}>Send</button>
      </form>
    </div>
  );
}
