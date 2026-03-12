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

function revalidateAll() {
  revalidatePath("/planilha");
  revalidatePath("/dashboard");
  revalidatePath("/timeline");
}

export async function getCreators(): Promise<Creator[]> {
  if (!isSupabaseConfigured()) return MOCK_CREATORS.filter((c) => !c.archived);

  const supabase = getServer();
  const { data, error } = await supabase
    .from("creators")
    .select("*")
    .eq("archived", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCreators error:", error);
    return MOCK_CREATORS.filter((c) => !c.archived);
  }
  return (data as Creator[]) ?? [];
}

export async function createCreator(payload: CreatorInsert): Promise<{ ok: boolean; error?: string }> {
  const supabase = getServer();
  const { error } = await supabase.from("creators").insert([{ ...payload, archived: false }]);
  if (error) return { ok: false, error: error.message };
  revalidateAll();
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
  revalidateAll();
  return { ok: true };
}

/* Soft delete — marca archived = true, dado preservado no banco */
export async function archiveCreators(ids: string[]): Promise<{ ok: boolean; error?: string }> {
  const supabase = getServer();
  const { error } = await supabase
    .from("creators")
    .update({ archived: true, updated_at: new Date().toISOString() })
    .in("id", ids);
  if (error) return { ok: false, error: error.message };
  revalidateAll();
  return { ok: true };
}

/* Hard delete — reservado para uso interno/admin */
export async function deleteCreators(ids: string[]): Promise<{ ok: boolean; error?: string }> {
  const supabase = getServer();
  const { error } = await supabase.from("creators").delete().in("id", ids);
  if (error) return { ok: false, error: error.message };
  revalidateAll();
  return { ok: true };
}
