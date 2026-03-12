"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import type { Creator, CreatorInsert, CreatorUpdate } from "@/types/creator";

function getServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function getCreators(): Promise<Creator[]> {
  const supabase = getServer();
  const { data, error } = await supabase
    .from("creators")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCreators error:", error);
    return [];
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
