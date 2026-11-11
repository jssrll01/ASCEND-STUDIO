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
