import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login() {
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function google() {
    setBusy(true)
    setErr('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) { setErr(error.message); setBusy(false) }
  }

  return (
    <div className="screen">
      <div className="vtext">昇天</div>
      <h1 className="glitch small" data-text="ASCEND">ASCEND</h1>
      <p className="tagline">Rise Beyond Reality</p>
      <button className="btn" onClick={google} disabled={busy}>
        {busy ? 'Connecting…' : 'Continue with Google'}
      </button>
      {err && <p className="err">{err}</p>}
      <p className="dim tiny">18+ only. A calm world, waiting.</p>
    </div>
  )
}
