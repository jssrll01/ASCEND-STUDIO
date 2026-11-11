import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Intro from './components/Intro.jsx'
import Login from './components/Login.jsx'
import ProfileSetup from './components/ProfileSetup.jsx'
import Chat from './components/Chat.jsx'

export default function App() {
  const [intro, setIntro] = useState(true)
  const [session, setSession] = useState(undefined)
  const [profile, setProfile] = useState(undefined)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => data.subscription.unsubscribe()
  }, [])

  const uid = session?.user?.id
  useEffect(() => {
    if (session === undefined) return
    if (!uid) { setProfile(null); return }
    setProfile(undefined)
    let alive = true
    supabase.from('profiles').select('*').eq('id', uid).maybeSingle()
      .then(({ data }) => { if (alive) setProfile(data || null) })
    return () => { alive = false }
  }, [uid, session === undefined])

  if (!supabase) {
    return (
      <div className="screen">
        <h2 className="title">ASCEND</h2>
        <p className="dim">Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY at build time.</p>
      </div>
    )
  }
  if (intro) return <Intro onDone={() => setIntro(false)} />
  if (session === undefined || (session && profile === undefined)) {
    return <div className="screen"><p className="dim pulse">…</p></div>
  }
  if (!session) return <Login />
  if (!profile) return <ProfileSetup user={session.user} onDone={setProfile} />
  return (
    <Chat
      session={session}
      profile={profile}
      onLogout={async () => { await supabase.auth.signOut(); setProfile(null) }}
    />
  )
}
