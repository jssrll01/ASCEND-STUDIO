import React, { useEffect, useRef, useState } from "react";
import { I } from "../icons.jsx";
import { BOTS, BOT_LINES, CHAT_SEED } from "../config.js";

const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const hue = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360; return h; };

function Msg({ m, me }) {
  return (
    <div className={"msg" + (me ? " me" : "")}>
      <div className="mav" style={{ background: `hsl(${hue(m.user)} 45% 35%)` }}>{m.user[0].toUpperCase()}</div>
      <div className="mbody">
        <div className="mmeta"><b>@{m.user}</b><small>Lv.{m.lv}</small><small>{m.time}</small></div>
        <div className="mtext">{m.text}</div>
      </div>
    </div>
  );
}

export default function ChatPage({ profile }) {
  const [msgs, setMsgs] = useState(CHAT_SEED);
  const [text, setText] = useState("");
  const list = useRef(null);

  useEffect(() => {
    if (list.current) list.current.scrollTop = list.current.scrollHeight;
  }, [msgs]);

  // fake incoming messages for testing
  useEffect(() => {
    const t = setInterval(() => {
      const b = BOTS[Math.floor(Math.random() * BOTS.length)];
      const line = BOT_LINES[Math.floor(Math.random() * BOT_LINES.length)];
      setMsgs((m) => [...m.slice(-79), { user: b.name, lv: b.lv, text: line, time: nowTime() }]);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const send = (e) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    setMsgs((m) => [...m.slice(-79), { user: profile.username, lv: 1, text: v, time: nowTime() }]);
    setText("");
  };

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
        <div className="ch-head"># GLOBAL CHAT <small>{BOTS.length + 1} online</small></div>
        <div className="msgs scroll" ref={list}>
          {msgs.map((m, i) => <Msg key={i} m={m} me={m.user === profile.username} />)}
        </div>
        <form className="composer" onSubmit={send}>
          <input value={text} maxLength={140} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
          <button type="submit">{I.send}</button>
        </form>
      </div>

      <div className="online">
        <div className="ph">ONLINE</div>
        <div className="olrow me"><i className="dot" />@{profile.username}<small>Lv.1</small></div>
        {BOTS.map((b) => (
          <div className="olrow" key={b.name}><i className="dot" />@{b.name}<small>Lv.{b.lv}</small></div>
        ))}
      </div>
    </div>
  );
}
