import { useEffect, useRef, useState } from 'react'

export default function Dropdown({ label, value, options, onChange, disabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])

  return (
    <div className="field" ref={ref}>
      <span>{label}</span>
      <button
        type="button"
        className={'dd-btn' + (open ? ' open' : '')}
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        <span className={value ? '' : 'dim'}>{value || 'Select…'}</span>
        <span className="dd-arrow">▾</span>
      </button>
      {open && (
        <ul className="dd-list">
          {options.map((o) => (
            <li
              key={o}
              className={o === value ? 'sel' : ''}
              onClick={() => { onChange(o); setOpen(false) }}
            >
              {o}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
