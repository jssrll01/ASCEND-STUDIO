import { useEffect, useRef } from 'react'

export default function Intro({ onDone }) {
  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    const t = setTimeout(() => done.current(), 7000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="screen intro">
      <div className="vtext">昇天</div>
      <h1 className="glitch fade" data-text="ASCEND" style={{ animationDelay: '0.3s' }}>ASCEND</h1>
      <p className="tagline fade" style={{ animationDelay: '2s' }}>Rise Beyond Reality</p>
      <p className="studio fade" style={{ animationDelay: '3.6s' }}>ASCEND STUDIO</p>
      <p className="powered fade" style={{ animationDelay: '4.6s' }}>Powered by XM</p>
    </div>
  )
}
