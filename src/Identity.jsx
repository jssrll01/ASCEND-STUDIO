import React, { useState } from "react";
import { IDENTITY_BG, GENDERS, COUNTRIES, GOALS } from "./config.js";

const NAME_RX = /^[A-Za-z][A-Za-z '\-]{1,23}$/;

// Defined at module level on purpose: a component created inside another component is a new
// type on every keystroke, which rebuilds the inputs and closes the keyboard.
function Field({ label, msg, children }) {
  return (
    <div className={"field" + (msg ? " bad" : "")}>
      <label>{label}</label>
      {children}
      {msg && <em>{msg}</em>}
    </div>
  );
}

export default function Identity({ onCreate }) {
  const [f, setF] = useState({
    username: "", first: "", last: "", age: "", gender: "", country: "",
    city: "", goal: "", career: "", bio: "", agree: false,
  });
  const [tried, setTried] = useState(false);
  const [saving, setSaving] = useState(false);
  const [srvErr, setSrvErr] = useState("");
  const set = (k, v) => { setSrvErr(""); setF((o) => ({ ...o, [k]: v })); };

  const age = parseInt(f.age, 10);
  const err = {
    username: /^[A-Za-z0-9_]{3,16}$/.test(f.username) ? "" : "3-16 letters, numbers or _",
    first: NAME_RX.test(f.first.trim()) ? "" : "Enter a valid first name",
    last: NAME_RX.test(f.last.trim()) ? "" : "Enter a valid last name",
    age: isNaN(age) ? "Enter your age" : age < 18 ? "You must be 18 years old or above" : age > 99 ? "Enter a valid age" : "",
    gender: f.gender ? "" : "Select one",
    country: f.country ? "" : "Select your country",
    city: f.city.trim().length >= 2 ? "" : "Enter your city",
    goal: f.goal ? "" : "Pick a life goal",
    agree: f.agree ? "" : "You must accept the terms",
  };
  const ok = Object.values(err).every((e) => !e);
  const msg = (k) => ((tried || (k === "age" && f.age !== "")) && err[k]) || "";

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setTried(true);
    if (!ok) return;
    setSaving(true);
    setSrvErr("");
    const problem = await onCreate({
      username: f.username.trim(), first: f.first.trim(), last: f.last.trim(), age,
      gender: f.gender, country: f.country, city: f.city.trim(), goal: f.goal,
      career: f.career.trim(), bio: f.bio.trim(),
    });
    if (problem) { setSrvErr(problem); setSaving(false); }
  };

  return (
    <div className="screen identity" style={{ backgroundImage: `url(${IDENTITY_BG})` }}>
      <div className="id-shade" />
      <form className="id-panel" onSubmit={submit} noValidate>
        <header>
          <small>NEW PLAYER</small>
          <h2>CREATE YOUR IDENTITY</h2>
          <p>Your username is always shown to other players. Choose carefully.</p>
        </header>

        <div className="id-grid">
          <div className="col">
            <Field label="USERNAME (PUBLIC)" msg={msg("username")}>
              <div className="prefix"><span>@</span>
                <input maxLength={16} value={f.username} onChange={(e) => set("username", e.target.value)} placeholder="your_username" autoCapitalize="off" autoComplete="off" autoCorrect="off" />
              </div>
            </Field>
            <div className="two">
              <Field label="FIRST NAME" msg={msg("first")}><input maxLength={24} value={f.first} onChange={(e) => set("first", e.target.value)} placeholder="Juan" /></Field>
              <Field label="LAST NAME" msg={msg("last")}><input maxLength={24} value={f.last} onChange={(e) => set("last", e.target.value)} placeholder="Dela Cruz" /></Field>
            </div>
            <div className="two">
              <Field label="AGE (18+)" msg={msg("age")}><input type="number" inputMode="numeric" min="18" max="99" value={f.age} onChange={(e) => set("age", e.target.value)} placeholder="18+" /></Field>
              <Field label="GENDER" msg={msg("gender")}>
                <select value={f.gender} onChange={(e) => set("gender", e.target.value)}>
                  <option value="">Select</option>
                  {GENDERS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </Field>
            </div>
            <div className="two">
              <Field label="COUNTRY" msg={msg("country")}>
                <select value={f.country} onChange={(e) => set("country", e.target.value)}>
                  <option value="">Select</option>
                  {COUNTRIES.map((g) => <option key={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="STARTING CITY" msg={msg("city")}><input maxLength={30} value={f.city} onChange={(e) => set("city", e.target.value)} placeholder="Manila" /></Field>
            </div>
          </div>

          <div className="col">
            <Field label="LIFE GOAL" msg={msg("goal")}>
              <div className="chips">
                {GOALS.map((g) => (
                  <div key={g} className={"chip" + (f.goal === g ? " on" : "")} onClick={() => set("goal", g)}>{g}</div>
                ))}
              </div>
            </Field>
            <Field label="DREAM CAREER (OPTIONAL)" msg="">
              <input maxLength={30} value={f.career} onChange={(e) => set("career", e.target.value)} placeholder="Game developer, Doctor, Chef..." />
            </Field>
            <Field label={`BIO / MOTTO (OPTIONAL) ${f.bio.length}/120`} msg="">
              <textarea maxLength={120} value={f.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Tell the world who you are..." />
            </Field>
          </div>
        </div>

        {srvErr && <div className="id-err" role="alert">{srvErr}</div>}

        <footer>
          <div className={"agree" + (tried && err.agree ? " bad" : "")} onClick={() => set("agree", !f.agree)}>
            <i className={f.agree ? "on" : ""}>{f.agree ? "✓" : ""}</i>
            I am 18+ and accept the ASCEND terms
          </div>
          <button type="submit" className="btn-start small" disabled={saving}>{saving ? "SAVING…" : "CONFIRM IDENTITY"}</button>
        </footer>
      </form>
    </div>
  );
}
