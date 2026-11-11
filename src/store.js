export const K = { user: "ascend_user", profile: "ascend_profile" };

export function load(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
}
export function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
}
export function clear(key) {
  try { localStorage.removeItem(key); } catch (e) {}
}
