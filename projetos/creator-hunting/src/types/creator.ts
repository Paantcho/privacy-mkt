export type Canal = "Instagram" | "TikTok" | "Kwai" | "X (Twitter)" | "YouTube" | "Outro";
export type Pais = "Brasil" | "Colômbia";
export type Tier = "—" | "Super Star" | "T1" | "T2" | "T3" | "T4" | "Maternidade";
export type Segmento =
  | "—"
  | "Beleza"
  | "Fitness"
  | "Lifestyle"
  | "Moda"
  | "Maternidade"
  | "Humor"
  | "Games"
  | "Educação"
  | "Gastronomia"
  | "Outro";

export type Status =
  | "Prospectada"
  | "Contatada"
  | "Respondeu"
  | "Interessa"
  | "Negociando"
  | "Ativou"
  | "Não quis"
  | "Já tem conta";

export type Analista = "Vitória" | "Stefanie" | "Bia" | "Mauricio";

export interface Creator {
  id: string;
  canal: Canal;
  pais: Pais;
  analista: Analista | null;
  nome: string | null;
  tier: Tier;
  segmento: Segmento;
  perfil_handle: string;
  contato: boolean;
  respondido: boolean;
  status: Status;
  obs: string | null;
  created_at: string;
  updated_at: string;
}

export type CreatorInsert = Omit<Creator, "id" | "created_at" | "updated_at">;
export type CreatorUpdate = Partial<CreatorInsert>;

/* ── Constantes de opções ─────────────────────────────────────── */

export const CANAIS: Canal[] = ["Instagram", "TikTok", "Kwai", "X (Twitter)", "YouTube", "Outro"];
export const PAISES: Pais[] = ["Brasil", "Colômbia"];
export const TIERS: Tier[] = ["—", "Super Star", "T1", "T2", "T3", "T4", "Maternidade"];
export const SEGMENTOS: Segmento[] = [
  "—", "Beleza", "Fitness", "Lifestyle", "Moda", "Maternidade",
  "Humor", "Games", "Educação", "Gastronomia", "Outro",
];
export const STATUS_LIST: Status[] = [
  "Prospectada", "Contatada", "Respondeu", "Interessa",
  "Negociando", "Ativou", "Não quis", "Já tem conta",
];
export const ANALISTAS: Analista[] = ["Vitória", "Stefanie", "Bia", "Mauricio"];

export const STATUS_COLORS: Record<Status, string> = {
  "Prospectada":  "bg-base-300 text-ink-500",
  "Contatada":    "bg-base-300 text-ink-500",
  "Respondeu":    "bg-primary-100 text-primary-700",
  "Interessa":    "bg-primary-200 text-primary-800",
  "Negociando":   "bg-primary-300 text-primary-900",
  "Ativou":       "bg-primary-500 text-white",
  "Não quis":     "bg-ink-100 text-ink-400",
  "Já tem conta": "bg-ink-100 text-ink-400",
};
