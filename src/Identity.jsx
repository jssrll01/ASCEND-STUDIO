import React, { useState } from "react";
import { IDENTITY_BG, GENDERS, COUNTRIES, GOALS } from "./config.js";

export default function Identity({ onCreate }) {
  const [f, setF] = useState({
    username: "", first: "", last: "", age: "", gender: "", country: "",
    city: "", goal: "", career: "", bio: "", agree: false,
  });
  const [tried, setTried] = useState(false);
  const set = (k, v) => setF((o) => ({ ...o, [k]: v }));

  const age = parseInt(f.age, 10);
  const nameRx = /^[A-Za-z][A-Za-z '\-]{1,23}$/;
  const err = {
    username: /^[A-Za-z0-9_]{3,16}$/.test(f.username) ? "" : "3-16 letters, numbers or _",
    first: nameRx.test(f.first.trim()) ? "" : "Enter a valid first name",
    last: nameRx.test(f.last.trim()) ? "" : "Enter a valid last name",
    age: isNaN(age) ? "Enter your age" : age < 18 ? "You must be 18 years old or above" : age > 99 ? "Enter a valid age" : "",
    gender: f.gender ? "" : "Select one",
    country: f.country ? "" : "Select your country",
    city: f.city.trim().length >= 2 ? "" : "Enter your city",
    goal: f.goal ? "" : "Pick a life goal",
    agree: f.agree ? "" : "You must accept the terms",
  };
  const ok = Object.values(err).every((e) => !e);
  const show = (k) => (tried || (k === "age" && f.age !== "")) && err[k];

  const submit = (e) => {
    e.preventDefault();
    setTried(true);
    if (!ok) return;
    onCreate({
      username: f.username.trim(), first: f.first.trim(), last: f.last.trim(), age,
      gender: f.gender, country: f.country, city: f.city.trim(), goal: f.goal,
      career: f.career.trim(), bio: f.bio.trim(), createdAt: new Date().toISOString(),
    });
  };

  const Field = ({ k, label, children }) => (
    <div className={"field" + (show(k) ? " bad" : "")}>
      <label>{label}</label>
      {children}
      {show(k) && <em>{err[k]}</em>}
    </div>
  );

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
            <Field k="username" label="USERNAME (PUBLIC)">
              <div className="prefix"><span>@</span>
                <input maxLength={16} value={f.username} onChange={(e) => set("username", e.target.value)} placeholder="your_username" autoCapitalize="off" />
              </div>
            </Field>
            <div className="two">
              <Field k="first" label="FIRST NAME"><input maxLength={24} value={f.first} onChange={(e) => set("first", e.target.value)} placeholder="Juan" /></Field>
              <Field k="last" label="LAST NAME"><input maxLength={24} value={f.last} onChange={(e) => set("last", e.target.value)} placeholder="Dela Cruz" /></Field>
            </div>
            <div className="two">
              <Field k="age" label="AGE (18+)"><input type="number" inputMode="numeric" min="18" max="99" value={f.age} onChange={(e) => set("age", e.target.value)} placeholder="18" /></Field>
              <Field k="gender" label="GENDER">
                <select value={f.gender} onChange={(e) => set("gender", e.target.value)}>
                  <option value="">Select</option>
                  {GENDERS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </Field>
            </div>
            <div className="two">
              <Field k="country" label="COUNTRY">
                <select value={f.country} onChange={(e) => set("country", e.target.value)}>
                  <option value="">Select</option>
                  {COUNTRIES.map((g) => <option key={g}>{g}</option>)}
                </select>
              </Field>
              <Field k="city" label="STARTING CITY"><input maxLength={30} value={f.city} onChange={(e) => set("city", e.target.value)} placeholder="Manila" /></Field>
            </div>
          </div>

          <div className="col">
            <Field k="goal" label="LIFE GOAL">
              <div className="chips">
                {GOALS.map((g) => (
                  <div key={g} className={"chip" + (f.goal === g ? " on" : "")} onClick={() => set("goal", g)}>{g}</div>
                ))}
              </div>
            </Field>
            <Field k="career" label="DREAM CAREER (OPTIONAL)">
              <input maxLength={30} value={f.career} onChange={(e) => set("career", e.target.value)} placeholder="Game developer, Doctor, Chef..." />
            </Field>
            <Field k="bio" label={`BIO / MOTTO (OPTIONAL) ${f.bio.length}/120`}>
              <textarea maxLength={120} value={f.bio} onChange={(e) => set("bio", e.target.value)} placeholder="Tell the world who you are..." />
            </Field>
          </div>
        </div>

        <footer>
          <div className={"agree" + (tried && err.agree ? " bad" : "")} onClick={() => set("agree", !f.agree)}>
            <i className={f.agree ? "on" : ""}>{f.agree ? "✓" : ""}</i>
            I am 18+ and accept the ASCEND terms
          </div>
          <button type="submit" className="btn-start small">CONFIRM IDENTITY</button>
        </footer>
      </form>
    </div>
  );
}
