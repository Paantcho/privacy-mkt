"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { Creator, CreatorInsert, CreatorUpdate } from "@/types/creator";
import { MOCK_CREATORS } from "@/lib/mock-data";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

function isSupabaseConfigured() {
  return (
    SUPABASE_URL.startsWith("https://") &&
    !SUPABASE_URL.includes("SEU_PROJETO") &&
    SUPABASE_KEY.length > 20
  );
}

function getServer() {
  return createClient(SUPABASE_URL, SUPABASE_KEY);
}

export async function getCreators(): Promise<Creator[]> {
  if (!isSupabaseConfigured()) return MOCK_CREATORS;

  const supabase = getServer();
  const { data, error } = await supabase
    .from("creators")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCreators error:", error);
    return MOCK_CREATORS;
  }
  return (data as Creator[]) ?? [];
}

export async function createCreator(payload: CreatorInsert): Promise<{ ok: boolean; error?: string }> {
  const supabase = getServer();
  const { error } = await supabase.from("creators").insert([payload]);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/planilha");
  revalidatePath("/dashboard");
  revalidatePath("/timeline");
  return { ok: true };
}

export async function updateCreator(
  id: string,
  payload: CreatorUpdate
): Promise<{ ok: boolean; error?: string }> {
  const supabase = getServer();
  const { error } = await supabase
    .from("creators")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/planilha");
  revalidatePath("/dashboard");
  revalidatePath("/timeline");
  return { ok: true };
}

export async function deleteCreators(ids: string[]): Promise<{ ok: boolean; error?: string }> {
  const supabase = getServer();
  const { error } = await supabase.from("creators").delete().in("id", ids);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/planilha");
  revalidatePath("/dashboard");
  revalidatePath("/timeline");
  return { ok: true };
}
