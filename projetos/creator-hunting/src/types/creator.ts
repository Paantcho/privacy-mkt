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

/* Cores semânticas por status — usadas em badges/pills na tabela */
export const STATUS_STYLE: Record<Status, { bg: string; color: string; dot: string }> = {
  "Prospectada":  { bg: "rgba(211,196,176,0.35)", color: "#A08E7E",  dot: "#A08E7E" },
  "Contatada":    { bg: "rgba(59,130,246,0.10)",  color: "#2563EB",  dot: "#3B82F6" },
  "Respondeu":    { bg: "rgba(245,158,11,0.12)",  color: "#B45309",  dot: "#D97706" },
  "Interessa":    { bg: "rgba(246,141,61,0.14)",  color: "#D97A33",  dot: "#F68D3D" },
  "Negociando":   { bg: "rgba(139,92,246,0.12)",  color: "#6D28D9",  dot: "#8B5CF6" },
  "Ativou":       { bg: "rgba(22,163,74,0.12)",   color: "#15803D",  dot: "#16A34A" },
  "Não quis":     { bg: "rgba(239,68,68,0.08)",   color: "#B91C1C",  dot: "#EF4444" },
  "Já tem conta": { bg: "rgba(211,196,176,0.35)", color: "#A08E7E",  dot: "#A08E7E" },
};

/* Mantido por compatibilidade — prefer STATUS_STYLE */
export const STATUS_COLORS: Record<Status, string> = {
  "Prospectada":  "",
  "Contatada":    "",
  "Respondeu":    "",
  "Interessa":    "",
  "Negociando":   "",
  "Ativou":       "",
  "Não quis":     "",
  "Já tem conta": "",
};
