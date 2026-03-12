import { createClient } from "@supabase/supabase-js";
import type { Creator } from "@/types/creator";

export type Database = {
  public: {
    Tables: {
      creators: {
        Row: Creator;
        Insert: Omit<Creator, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Creator, "id" | "created_at" | "updated_at">>;
      };
    };
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
