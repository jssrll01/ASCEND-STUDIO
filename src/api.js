import { supabase } from "./supabase.js";

async function rpc(fn, args) {
  const { data, error } = await supabase.rpc(fn, args);
  if (error) throw new Error(error.message || "Request failed");
  return data;
}

export const getState = () => rpc("asc_state");
export const createPlayer = (p) => rpc("asc_create_player", { p });
export const claimDaily = () => rpc("asc_claim_daily");
export const sendMessage = (text) => rpc("asc_send_message", { p_text: text });
export const resetPlayer = () => rpc("asc_reset_player");

export async function loadMessages() {
  const { data, error } = await supabase
    .from("asc_messages").select("id,username,level,body,created_at")
    .order("created_at", { ascending: false }).limit(80);
  if (error) throw new Error(error.message);
  return (data || []).reverse();
}

export async function loadNews() {
  const { data, error } = await supabase
    .from("asc_news").select("id,tag,title,date_label")
    .order("sort", { ascending: true }).order("id", { ascending: false }).limit(6);
  if (error) throw new Error(error.message);
  return data || [];
}

export async function signInGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });
  if (error) throw new Error(error.message);
}

export const signOut = () => supabase.auth.signOut();

export async function loadMeta() {
  const [co, ci, op, as, st] = await Promise.all([
    supabase.from("asc_countries").select("name").order("sort"),
    supabase.from("asc_cities").select("country,name,is_main").order("sort"),
    supabase.from("asc_options").select("kind,label").order("sort"),
    supabase.from("asc_assets").select("key,url"),
    supabase.from("asc_settings").select("key,value"),
  ]);
  const bad = [co, ci, op, as, st].find((r) => r.error);
  if (bad) throw new Error(bad.error.message);
  const kind = (k) => op.data.filter((o) => o.kind === k).map((o) => o.label);
  return {
    countries: co.data.map((c) => c.name),
    cities: ci.data,
    genders: kind("gender"),
    goals: kind("goal"),
    assets: Object.fromEntries(as.data.map((a) => [a.key, a.url])),
    settings: Object.fromEntries(st.data.map((a) => [a.key, a.value])),
  };
}
