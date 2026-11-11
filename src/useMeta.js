import { useEffect, useState } from "react";
import { loadMeta } from "./api.js";

const KEY = "asc_meta_v1";
let cache = null;
try { cache = JSON.parse(localStorage.getItem(KEY)); } catch (e) { cache = null; }
const subs = new Set();

const preload = (r) =>
  Object.values((r && r.assets) || {}).forEach((u) => { const i = new Image(); i.src = u; });

// Known from the last visit: start downloading images immediately
if (cache) preload(cache);

let started = false;
function refresh() {
  if (started) return;
  started = true;
  loadMeta()
    .then((r) => {
      cache = r;
      try { localStorage.setItem(KEY, JSON.stringify(r)); } catch (e) {}
      preload(r);
      subs.forEach((f) => f(r));
    })
    .catch(() => { started = false; });
}
// Start the request when the app loads, not when a screen mounts
refresh();

export default function useMeta() {
  const [m, setM] = useState(cache);
  useEffect(() => {
    subs.add(setM);
    if (!started) refresh();
    return () => { subs.delete(setM); };
  }, []);
  return m;
}
