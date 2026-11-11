import { useState } from 'react'
import { supabase } from '../supabase'
import { CITIES, GENDERS, COUNTRY } from '../constants'
import Dropdown from './Dropdown.jsx'

export default function ProfileSetup({ user, onDone }) {
  const [f, setF] = useState({ username: '', first_name: '', last_name: '', gender: '', city: '', age: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const pick = (k) => (v) => setF({ ...f, [k]: v })

  async function submit(e) {
    e.preventDefault()
    setErr('')
    const username = f.username.trim()
    const age = Number(f.age)
    if (!/^[A-Za-z0-9_]{3,16}$/.test(username)) return setErr('Username: 3-16 characters, letters, numbers or underscore.')
    if (!f.first_name.trim() || !f.last_name.trim()) return setErr('Enter your first and last name.')
    if (!f.gender) return setErr('Choose a gender.')
    if (!f.city) return setErr('Choose a city.')
    if (!Number.isInteger(age) || age < 18 || age > 120) return setErr('You must be 18 or older.')
    setBusy(true)
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username,
        first_name: f.first_name.trim(),
        last_name: f.last_name.trim(),
        gender: f.gender,
        country: COUNTRY,
        city: f.city,
        age
      })
      .select()
      .single()
    setBusy(false)
    if (error) return setErr(error.code === '23505' ? 'That username is already taken.' : error.message)
    onDone(data)
  }

  return (
    <div className="screen top">
      <div className="vtext">新生</div>
      <h2 className="title">Create your self</h2>
      <form className="card" onSubmit={submit}>
        <label>Username<input value={f.username} onChange={set('username')} maxLength={16} autoCapitalize="none" autoComplete="off" /></label>
        <label>First name<input value={f.first_name} onChange={set('first_name')} maxLength={40} /></label>
        <label>Last name<input value={f.last_name} onChange={set('last_name')} maxLength={40} /></label>
        <Dropdown label="Gender" value={f.gender} options={GENDERS} onChange={pick('gender')} />
        <Dropdown label="Country" value={COUNTRY} options={[COUNTRY]} onChange={() => {}} disabled />
        <Dropdown label="City" value={f.city} options={CITIES} onChange={pick('city')} />
        <label>Age<input type="number" inputMode="numeric" min="18" max="120" value={f.age} onChange={set('age')} /></label>
        {err && <p className="err">{err}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Saving…' : 'Enter the world'}</button>
      </form>
    </div>
  )
}
