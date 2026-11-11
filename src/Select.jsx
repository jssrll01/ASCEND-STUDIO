import React, { useEffect, useRef, useState } from "react";

// Custom dropdown (the native one opens outside the scaled stage and looks wrong)
export default function Select({ value, onChange, options, placeholder = "Select", disabled, up }) {
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const off = (e) => { if (box.current && !box.current.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", off);
    return () => document.removeEventListener("pointerdown", off);
  }, [open]);
  return (
    <div className={"dd" + (open ? " open" : "") + (up ? " up" : "")} ref={box}>
      <button type="button" className="dd-btn" disabled={disabled} onClick={() => setOpen((o) => !o)}>
        <span className={value ? "" : "dd-ph"}>{value || placeholder}</span><i className="dd-arrow" />
      </button>
      {open && (
        <div className="dd-list">
          {options.map((o) => (
            <div key={o} className={"dd-opt" + (o === value ? " on" : "")} onClick={() => { onChange(o); setOpen(false); }}>{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}
