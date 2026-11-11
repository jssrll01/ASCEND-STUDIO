import { useEffect, useRef, useState } from 'react'
import { supabase } from '../supabase'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

async function sha256(s) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, '0')).join('')
}

function loadGsi() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) return resolve()
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.onload = resolve
    s.onerror = () => reject(new Error('Could not load Google sign-in.'))
    document.head.appendChild(s)
  })
}

export default function Login() {
  const [err, setErr] = useState('')
  const btn = useRef(null)

  useEffect(() => {
    let dead = false
    ;(async () => {
      if (!CLIENT_ID) return setErr('Missing VITE_GOOGLE_CLIENT_ID.')
      try {
        await loadGsi()
        if (dead) return
        const raw = crypto.randomUUID() + crypto.randomUUID()
        const hashed = await sha256(raw)
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          nonce: hashed,
          use_fedcm_for_prompt: true,
          callback: async ({ credential }) => {
            const { error } = await supabase.auth.signInWithIdToken({
              provider: 'google',
              token: credential,
              nonce: raw
            })
            if (error) setErr(error.message)
          }
        })
        window.google.accounts.id.renderButton(btn.current, {
          theme: 'filled_black',
          size: 'large',
          shape: 'rectangular',
          text: 'continue_with',
          width: 260
        })
        window.google.accounts.id.prompt()
      } catch (e) {
        setErr(e.message)
      }
    })()
    return () => { dead = true; window.google?.accounts?.id?.cancel() }
  }, [])

  return (
    <div className="screen">
      <div className="vtext">昇天</div>
      <h1 className="glitch small" data-text="ASCEND">ASCEND</h1>
      <p className="tagline">Rise Beyond Reality</p>
      <div ref={btn} style={{ minHeight: 44 }} />
      {err && <p className="err">{err}</p>}
    </div>
  )
}
