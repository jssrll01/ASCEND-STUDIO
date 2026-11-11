import React, { useEffect, useRef, useState } from "react";
import { I } from "../icons.jsx";

const hm = (iso) => new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const hue = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };

function Msg({ m, me }) {
  return (
    <div className={"msg" + (me ? " me" : "")}>
      <div className="mav" style={{ background: `hsl(${hue(m.username)} 45% 35%)` }}>{m.username[0].toUpperCase()}</div>
      <div className="mbody">
        <div className="mmeta"><b>@{m.username}</b><small>Lv.{m.level}</small><small>{hm(m.created_at)}</small></div>
        <div className="mtext">{m.body}</div>
      </div>
    </div>
  );
}

export default function ChatPage({ profile, chat, toast }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const list = useRef(null);

  useEffect(() => {
    if (list.current) list.current.scrollTop = list.current.scrollHeight;
  }, [chat.msgs]);

  const send = async (e) => {
    e.preventDefault();
    const v = text.trim();
    if (!v || sending) return;
    setSending(true);
    const err = await chat.send(v);
    setSending(false);
    if (err) toast(err); else setText("");
  };

  const state = chat.status === "live" ? chat.online.length + " online" : chat.status === "error" ? "reconnecting…" : "connecting…";

  return (
    <div className="chat">
      <div className="ch-side">
        <div className="ph">CHANNELS</div>
        <div className="chan on"># Global</div>
        <div className="chan lock"># Guild <span>{I.lock}</span></div>
        <div className="chan lock"># Trade <span>{I.lock}</span></div>
        <div className="chan lock"># Help <span>{I.lock}</span></div>
      </div>

      <div className="ch-main">
        <div className="ch-head"># GLOBAL CHAT <small>{state}</small></div>
        <div className="msgs scroll" ref={list}>
          {chat.msgs.length === 0 && (
            <div style={{ margin: "auto", opacity: 0.6, fontSize: 18, letterSpacing: 2 }}>No messages yet. Say hello!</div>
          )}
          {chat.msgs.map((m) => <Msg key={m.id} m={m} me={m.username === profile.username} />)}
        </div>
        <form className="composer" onSubmit={send}>
          <input value={text} maxLength={140} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." autoComplete="off" />
          <button type="submit" onMouseDown={(e) => e.preventDefault()}>{I.send}</button>
        </form>
      </div>

      <div className="online">
        <div className="ph">ONLINE</div>
        {chat.online.map((o) => (
          <div className={"olrow" + (o.username === profile.username ? " me" : "")} key={o.username}>
            <i className="dot" />@{o.username}<small>Lv.{o.lv}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
