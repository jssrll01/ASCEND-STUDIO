import { useEffect } from 'react'

export default function Intro({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 7000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="screen intro" onClick={onDone} role="button" tabIndex={0}>
      <div className="vtext">昇天</div>
      <h1 className="glitch fade" data-text="ASCEND" style={{ animationDelay: '0.3s' }}>ASCEND</h1>
      <p className="tagline fade" style={{ animationDelay: '2s' }}>Rise Beyond Reality</p>
      <p className="studio fade" style={{ animationDelay: '3.6s' }}>ASCEND STUDIO</p>
      <p className="powered fade" style={{ animationDelay: '4.6s' }}>Powered by XM</p>
      <p className="skip">tap to skip</p>
    </div>
  )
}
