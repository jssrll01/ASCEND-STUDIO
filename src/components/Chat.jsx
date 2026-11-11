import { useEffect, useRef, useState } from 'react'
import { supabase } from '../supabase'

const MAX = 300

export default function Chat({ session, profile, onLogout }) {
  const [tab, setTab] = useState('global')
  const [msgs, setMsgs] = useState([])
  const [text, setText] = useState('')
  const [online, setOnline] = useState(1)
  const [err, setErr] = useState('')
  const [showProfile, setShowProfile] = useState(false)
  const sent = useRef([])
  const endRef = useRef(null)
  const channel = tab === 'global' ? 'global' : profile.city
  const channelRef = useRef(channel)
  channelRef.current = channel

  // history for the current channel
  useEffect(() => {
    let alive = true
    setMsgs([])
    supabase.from('messages').select('*').eq('channel', channel)
      .order('created_at', { ascending: false }).limit(100)
      .then(({ data }) => { if (alive && data) setMsgs(data.reverse()) })
    return () => { alive = false }
  }, [channel])

  // realtime inserts
  useEffect(() => {
    const ch = supabase.channel('ascend-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (p) => {
        const m = p.new
        if (m.channel !== channelRef.current) return
        setMsgs((prev) => (prev.some((x) => x.id === m.id) ? prev : [...prev.slice(-199), m]))
      })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  // presence
  useEffect(() => {
    const ch = supabase.channel('ascend-online', { config: { presence: { key: session.user.id } } })
    ch.on('presence', { event: 'sync' }, () => setOnline(Object.keys(ch.presenceState()).length))
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') await ch.track({ username: profile.username, city: profile.city })
      })
    return () => { supabase.removeChannel(ch) }
  }, [session.user.id, profile.username, profile.city])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  async function send(e) {
    e.preventDefault()
    const content = text.trim()
    if (!content) return
    const now = Date.now()
    sent.current = sent.current.filter((t) => now - t < 10000)
    const last = sent.current[sent.current.length - 1]
    if (sent.current.length >= 5 || (last && now - last < 1000)) return setErr('Slow down a little…')
    sent.current.push(now)
    setErr('')
    setText('')
    const { error } = await supabase.from('messages').insert({
      content, channel, username: profile.username, city: profile.city
    })
    if (error) setErr(error.message)
  }

  const time = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="chat">
      <header className="bar">
        <div>
          <strong className="logo">ASCEND</strong>
          <span className="online">● {online} online</span>
        </div>
        <button className="ghost" onClick={() => setShowProfile(true)}>{profile.username}</button>
      </header>
      <nav className="tabs">
        <button className={tab === 'global' ? 'on' : ''} onClick={() => setTab('global')}>Global</button>
        <button className={tab === 'city' ? 'on' : ''} onClick={() => setTab('city')}>{profile.city}</button>
      </nav>
      <main className="msgs">
        {msgs.length === 0 && <p className="dim center">Quiet here. Say something.</p>}
        {msgs.map((m) => (
          <div key={m.id} className={'msg' + (m.user_id === session.user.id ? ' me' : '')}>
            <div className="meta">
              <span className="who">{m.username}</span>
              <span className="city">{m.city}</span>
              <span className="time">{time(m.created_at)}</span>
            </div>
            <div className="body">{m.content}</div>
          </div>
        ))}
        <div ref={endRef} />
      </main>
      <form className="composer" onSubmit={send}>
        {err && <p className="err">{err}</p>}
        <div className="row">
          <input value={text} onChange={(e) => setText(e.target.value.slice(0, MAX))} placeholder={tab === 'global' ? 'Speak to the world…' : `Speak to ${profile.city}…`} maxLength={MAX} />
          <button className="btn small">Send</button>
        </div>
        <span className="count">{text.length}/{MAX}</span>
      </form>
      {showProfile && (
        <div className="modal" onClick={() => setShowProfile(false)}>
          <div className="card" onClick={(e) => e.stopPropagation()}>
            <h3>{profile.username}</h3>
            <p>{profile.first_name} {profile.last_name}</p>
            <p className="dim">{profile.gender} · {profile.age}</p>
            <p className="dim">{profile.city}, {profile.country}</p>
            <button className="btn" onClick={onLogout}>Log out</button>
            <button className="ghost" onClick={() => setShowProfile(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
