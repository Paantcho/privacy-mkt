# Creator Hunting · CS — PRD v1.0

> **Produto:** Ferramenta interna de prospecção de creators
> **Cliente:** Privacy (plataforma social brasileira de creators)
> **Usuário principal:** Time de CS (Customer Success) — analistas de prospecção
> **Elaborado por:** Departamento de Marketing · Privacy
> **Versão:** 1.0 · Março 2026
> **Classificação:** CONFIDENCIAL — Uso interno

---

## 0. Sumário Executivo

O Creator Hunting é a ferramenta interna da Privacy para gestão do pipeline de prospecção comercial de novos creators. Substitui o fluxo atual baseado em planilhas Excel avulsas — que se perdem, não salvam histórico e não permitem acompanhamento em tempo real — por uma aplicação web própria com banco de dados real, métricas de conversão e controle de metas.

O sistema permite que analistas de CS cadastrem, acompanhem e convertam creators ao longo de um funil de 7 estágios, com visibilidade completa para a liderança sobre volume, ritmo e performance individual.

**O sistema não publica conteúdo. Não integra com redes sociais. Não é um CRM genérico.**

**MISSÃO**

Dar ao time de CS da Privacy uma ferramenta de prospecção profissional, com dados reais, métricas de conversão e controle de metas — com a qualidade visual e experiência de produto que a marca Privacy exige, seguindo rigorosamente o Design System Privacy v3.2.

**REGRA INVIOLÁVEL DE DESIGN**

Todo e qualquer elemento visual — cores, tipografia, espaçamento, componentes, animações, estados — deve seguir exclusivamente o **Design System Privacy v3.2** (`Design_system_privacy_v3.html`). Nenhuma cor, fonte, forma ou padrão de interação pode ser inventado fora do que está documentado nesse arquivo. Se um componente novo precisar ser criado, deve seguir a hierarquia do sistema: mesmos tokens de cor, mesmos raios de borda (`--r-*`), mesma tipografia Poppins, mesmos tokens de espaçamento (`--sp-*`) e animações (`--d-*`, `--ease-*`).

---

## 1. Problema

O fluxo atual de prospecção:

1. Analista pesquisa um creator manualmente (Instagram, TikTok, etc.)
2. Lança dados no Excel local
3. Exporta e manda por WhatsApp ou e-mail
4. Não há histórico de quem foi abordado
5. Não há métricas de conversão por analista, canal ou segmento
6. Não há como saber o ritmo (pace) do time em relação às metas
7. Planilhas se perdem, duplicam e ficam desatualizadas

**Consequência:** a liderança não tem visão real do pipeline de prospecção, o time não sabe se está no ritmo, e creators já abordados podem ser contatados novamente por outro analista.

---

## 2. Identidade Visual

### 2.1 Fonte da Verdade Visual

O **Design System Privacy v3.2** (`Design_system_privacy_v3.html`) é a única referência de design. Em caso de conflito entre este PRD e o Design System, **o Design System prevalece**.

### 2.2 Paleta — Tokens Principais

| Token CSS | Valor | Uso |
|-----------|-------|-----|
| `--l500` / `--primary` | `#F68D3D` | Laranja Privacy — ações, CTAs, item ativo, ponto do logo |
| `--bg` | `#1C1C1E` | Fundo principal dark mode |
| `--srf` | `#242428` | Surface padrão (cards, header) |
| `--srf2` | `#2C2C30` | Surface elevada |
| `--offwhite` | `#F4EEE5` | Fundo light mode |
| `--txt` | `#FFFFFF` | Texto primário dark |
| `--txt2` | `#A0A0A4` | Texto secundário |
| `--bdr` | `#38383C` | Bordas |

**Dark mode é o tema principal.** Light mode será implementado como adaptação posterior — a estrutura deve suportar ambos via variáveis CSS, mas o design, QA e validação acontecem primeiro no dark.

Modais e formulários inline: sempre fundo `#FFFFFF`, independente do tema ativo.

### 2.3 Princípios de Design (do Design System Privacy v3.2)

- **100% Flat** — zero `box-shadow` ou `drop-shadow` em qualquer elemento
- **Dark mode como padrão** — `--bg` charcoal como base
- **Poppins exclusivamente** — nenhuma outra fonte em nenhum lugar
- **Animações em toda interação** — usando os tokens `--d*` e `--ease-*` do sistema
- **Laranja com intenção** — apenas para ações, estados ativos e destaques críticos
- **Anti-genérico** — nenhum componente de template ou estética de dashboard genérico. A ferramenta deve parecer um produto Privacy, não um template Lovable.

### 2.4 Cores de Canal

| Canal | Hex | Token DS |
|-------|-----|----------|
| Instagram | `#D4638C` | Rosa derivado IG |
| TikTok | `#4AABB3` | Teal derivado TikTok |
| Kwai | `#FF6A2E` | Laranja Kwai (derivado `--l600`) |
| X (Twitter) | `#5B8AB5` | Azul Twitter suavizado |
| YouTube | `#C75454` | Vermelho YouTube suavizado |
| Outro | `#78787C` | `--i400` neutro |

### 2.5 Cores de Status (Pipeline)

| Status | Hex | Token DS | Significado |
|--------|-----|----------|-------------|
| Prospectada | `#78787C` | `--i400` | Identificada, ainda não contatada |
| Contatada | `#F68D3D` | `--primary` | Mensagem enviada |
| Respondeu | `#0288D1` | `--sky500` | Respondeu à abordagem |
| Interesse 🔥 | `#FFB300` | `--amb500` | Demonstrou interesse |
| Negociando | `#8B7CB5` | `--pur` | Em negociação ativa |
| Ativou ✅ | `#48A879` | `--grn` | Criou conta na Privacy |
| Não quis | `#C95454` | `--red` | Recusou |
| Já tem conta | `#A0A0A4` | `--txt2` | Já era creator Privacy |

### 2.6 Cores de Segmento

| Segmento | Hex | Token DS |
|----------|-----|----------|
| Beleza | `#D4638C` | Rosa |
| Fitness | `#48A879` | `--grn` |
| Lifestyle | `#8B7CB5` | `--pur` |
| Moda | `#F68D3D` | `--primary` |
| Maternidade | `#FFB300` | `--amb500` |
| Humor | `#4AABB3` | Teal |
| Games | `#3F51B5` | `--ind500` |
| Tech | `#5B8AB5` | Azul |
| Educação | `#00897B` | `--teal500` |
| Gastronomia | `#7A9A6B` | Verde oliva |
| Outro | `#78787C` | `--i400` |

---

## 3. Modelo de Dados

### 3.1 Entidades Principais

#### `analysts` (analistas)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | uuid | PK | Identificador único |
| `name` | text | Sim | Nome do analista |
| `email` | text | Não | E-mail Google Workspace (fase SSO) |
| `role` | enum | Sim | `admin` \| `analyst` |
| `focus` | text | Não | Foco de prospecção (ex: "T3/T4/Maternidade") |
| `strategy` | enum | Não | `volume` \| `estrategico` \| `expansao` |
| `active` | boolean | Sim | Se está ativo no sistema |
| `created_at` | timestamptz | Auto | Data de criação |

**Analistas iniciais:** Vitória, Stefanie, Bia, Mauricio.

#### `prospects` (creators prospectados)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | uuid | PK | Identificador único |
| `channel` | enum | Sim | Canal de origem |
| `country` | enum | Sim | País |
| `analyst_id` | uuid | FK → analysts | Quem prospectou |
| `name` | text | Não | Nome real do creator |
| `tier` | enum | Não | Classificação de tamanho |
| `segment` | enum | Não | Nicho/segmento |
| `profile_url` | text | Sim | @ ou link do perfil |
| `contacted` | boolean | Sim | Se já foi contatada |
| `responded` | boolean | Sim | Se respondeu |
| `status` | enum | Sim | Status no pipeline |
| `notes` | text | Não | Observações rápidas |
| `contacted_at` | timestamptz | Não | Data do primeiro contato |
| `responded_at` | timestamptz | Não | Data da resposta |
| `status_changed_at` | timestamptz | Auto | Última mudança de status |
| `created_at` | timestamptz | Auto | Data de cadastro |
| `updated_at` | timestamptz | Auto | Última edição |

**Enums de `channel`:** `instagram`, `tiktok`, `kwai`, `x_twitter`, `youtube`, `outro`

**Enums de `country`:** `brasil`, `colombia`

**Enums de `tier`:** `super_star`, `t1`, `t2`, `t3`, `t4`, `maternidade`

**Enums de `segment`:** `beleza`, `fitness`, `lifestyle`, `moda`, `maternidade`, `humor`, `games`, `tech`, `educacao`, `gastronomia`, `outro`

**Enums de `status`:** `prospectada`, `contatada`, `respondeu`, `interesse`, `negociando`, `ativou`, `nao_quis`, `ja_tem_conta`

#### `goals` (metas por analista)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | uuid | PK | Identificador único |
| `analyst_id` | uuid | FK → analysts | Analista |
| `period_type` | enum | Sim | `weekly` \| `monthly` |
| `period_start` | date | Sim | Início do período |
| `contacts_target` | int | Sim | Meta de contatos no período |
| `signups_target` | int | Sim | Meta de cadastros (ativações) no período |
| `response_rate_target` | decimal | Não | Meta de taxa de resposta (%) |
| `activation_rate_target` | decimal | Não | Meta de taxa de ativação (%) |
| `created_at` | timestamptz | Auto | Data de criação |
| `updated_at` | timestamptz | Auto | Última edição |

#### `activity_log` (timeline)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | uuid | PK | Identificador único |
| `prospect_id` | uuid | FK → prospects | Creator afetado |
| `analyst_id` | uuid | FK → analysts | Quem fez a ação |
| `action` | enum | Sim | Tipo da ação |
| `details` | jsonb | Não | Dados adicionais (campo alterado, valor anterior, novo) |
| `created_at` | timestamptz | Auto | Timestamp da ação |

**Enums de `action`:** `created`, `status_changed`, `edited`, `assigned`, `note_added`

**Estrutura de `details` (exemplo para status_changed):**
```json
{
  "field": "status",
  "from": "contatada",
  "to": "respondeu",
  "prospect_name": "@creator"
}
```

### 3.2 Índices Recomendados

- `prospects`: index em `analyst_id`, `status`, `channel`, `country`, `created_at`
- `activity_log`: index em `prospect_id`, `analyst_id`, `created_at`
- `goals`: index em `analyst_id`, `period_start`

### 3.3 Row Level Security (RLS) — Fase SSO

No MVP (sem login), RLS está desativado. Quando o SSO entrar:
- **Analista:** lê/edita apenas registros onde `analyst_id` = seu ID
- **Admin:** lê/edita todos os registros. Pode criar/editar metas de qualquer analista.

---

## 4. Layout e Navegação

### 4.1 Estrutura Geral

SPA (single page application). Sem sidebar. Navegação por tabs internas.

```
[Header fixo 64px]
[Tab Bar]
[Content Area — restante da viewport]
[Footer discreto]
```

### 4.2 Header

| Elemento | Spec |
|----------|------|
| Altura | 64px fixo |
| Fundo | `--srf` com borda inferior 1px `--bdr` |
| Logo | `privacy.` — ponto em `--primary`. Dark: texto `--txt`. Light: texto charcoal |
| Subtítulo | "Prospecção comercial · DD/MM/AAAA · dia útil X/Y" — Poppins Regular, `--txt2` |
| Título | "Creator Hunting · CS" — Poppins SemiBold |
| KPI Strip (direita) | 3 números compactos: TOTAL (branco), HOJE (laranja), ATIVARAM (verde) |
| Botão CSV | Exportar dados filtrados. Ícone download + "CSV" |

### 4.3 Tab Bar

4 tabs, sempre visíveis, com ícones semânticos:

| Tab | Ícone | Função |
|-----|-------|--------|
| 📋 Planilha | Table/grid | Cadastro e gestão de creators |
| 📊 Dashboard | BarChart | Métricas e funil de conversão |
| 🎯 Metas & Pace | Target | Metas por analista e ritmo semanal |
| 🕐 Timeline | Clock/History | Log de atividades |

Tab ativa: texto `--primary`, fundo `--primary` com opacidade 12%, borda-radius pill, animação spring. Transição entre tabs: fade + slide direcional 200ms.

### 4.4 Footer

Uma linha centralizada: "Dados salvos automaticamente · Conte conosco! 💚"
Poppins Regular 12px, `--txt2`, margem top 40px.

---

## 5. Tab: Dashboard (Prioridade 1)

Esta é a primeira entrega. Dá visibilidade imediata à liderança sobre o estado do pipeline, mesmo enquanto o time continua usando Excel.

### 5.1 KPI Cards — Topo

7 cards em grid horizontal, entrada em stagger (50ms entre cards), animação count-up nos números:

| KPI | Cálculo | Cor do número |
|-----|---------|---------------|
| Total Prospectadas | `count(prospects)` | `--txt` branco |
| Hoje | `count(prospects WHERE created_at = today)` | `--primary` laranja |
| Contatadas | `count(prospects WHERE contacted = true)` | `--txt` |
| Responderam | `count(prospects WHERE responded = true)` | `--txt` |
| Interesse 🔥 | `count(prospects WHERE status = 'interesse')` | `--amb500` |
| Ativaram ✅ | `count(prospects WHERE status = 'ativou')` | `--grn` |
| Taxa Resposta % | `(responderam / contatadas) × 100` | `--txt` |

Cada card: fundo `--srf`, borda 1px `--bdr`, radius `--r-lg` (16px). Número grande (Poppins Bold 32px), label abaixo (Poppins Regular 11px caps, `--txt2`). Hover: borda muda para `--primary` opacity 30%.

### 5.2 Funil Comercial — Hunting

Card de largura ~60% da viewport (lado esquerdo). Título: "FUNIL COMERCIAL · HUNTING" em Poppins SemiBold 13px caps, cor `--primary`.

Cada linha do funil:

| Elemento | Spec |
|----------|------|
| Label | Nome do status + emoji. Poppins SemiBold 14px, cor do status |
| Barra de progresso | Altura 4px, fundo `--bdr`, preenchimento na cor do status, animação de largura 500ms ease-dec |
| Porcentagem | À direita da barra. Poppins Regular 13px, `--txt2` |
| Contagem | Número absoluto. Poppins SemiBold 14px, `--txt` |

Ordem das linhas: Prospectadas → Contatadas → Responderam → Interesse → Negociando → Ativaram.

A barra de "Prospectadas" é sempre 100%. As demais são proporcionais ao total de prospectadas.

### 5.3 Por Analista

Card ao lado direito do funil (~40% da viewport). Título: "POR ANALISTA" em caps.

Grid de mini-cards, um por analista. Cada mini-card: nome do analista (Poppins SemiBold 14px), total de prospects, mini-barra de ativação. Se não houver dados: texto "Sem dados ainda" em `--txt2`.

### 5.4 Por Canal

Abaixo de "Por Analista", no mesmo card ou em card adjacente. Título: "POR CANAL".

Cada canal representado como pill/badge com a cor do canal + número de prospects. Os canais com 0 prospects não aparecem.

### 5.5 Distribuição por Status

Barra de cards horizontal na base da tab. Um card por status do pipeline:

| Status | Cor do número |
|--------|---------------|
| Prospectada | `--i400` |
| Contatada | `--primary` |
| Respondeu | `--sky500` |
| Interesse 🔥 | `--amb500` |
| Negociando | `--pur` |
| Ativou ✅ | `--grn` |
| Não quis | `--red` |
| Já tem conta | `--txt2` |

Cada card: número grande na cor do status, label abaixo em `--txt2`. Fundo `--srf`, borda `--bdr`.

### 5.6 Filtros do Dashboard

Barra de filtros acima dos KPIs:

| Filtro | Tipo | Opções |
|--------|------|--------|
| Período | Pills (Hoje, 7 dias, 15 dias, 30 dias, Tudo) | Default: Tudo |
| Date range | Dois inputs de data (dd/mm/aaaa) | Customizável |
| Segmento | Dropdown multi-select | Todos os segmentos |

Filtros aplicam a todos os cards simultaneamente. Transição suave (fade 200ms) ao mudar filtro.

---

## 6. Tab: Planilha (Prioridade 2)

Substitui o Excel. A experiência deve ser familiar para o time — mesmos campos, mesmo fluxo — mas com persistência real e filtros avançados.

### 6.1 Formulário de Nova Prospecção

Sempre visível no topo da tab. Título: "+ NOVA PROSPECÇÃO" em Poppins SemiBold, cor `--primary`.

**Regra do DS v3.2:** Formulários sempre com fundo `#FFFFFF`, independente do tema.

Campos em grid responsivo (6 colunas em desktop, 2 em mobile):

| Campo | Tipo | Default | Obrigatório |
|-------|------|---------|-------------|
| Canal | Select customizado | Instagram | Sim |
| País | Select customizado | Brasil | Sim |
| Analista | Select customizado | "Quem?" | Sim |
| Nome | Text input | — | Não |
| Tier | Select customizado | — | Não |
| Segmento/Nicho | Select customizado | — | Não |
| Perfil / @ | Text input | — | Sim |
| Contato | Select (SIM/NÃO) | SIM | Sim |
| Respondido | Select (SIM/NÃO) | NÃO | Sim |
| Status | Select customizado | Contatada | Sim |
| OBS | Text input | — | Não |

Botão "+ Salvar": largura total do formulário, fundo `--primary`, texto carvão, Poppins SemiBold. Hover: scale 1.02. Tap: scale 0.97.

Dica abaixo do form: "Enter para salvar · Clique em qualquer célula para editar inline" — Poppins Regular 12px, `--txt2`.

### 6.2 Barra de Filtros da Planilha

Abaixo do formulário, acima da tabela:

| Filtro | Tipo |
|--------|------|
| Busca | Input texto com ícone lupa — busca por @ ou nome |
| Analista | Pills horizontais: Todos (count), Vitória (count), Stefanie (count), Bia (count), Mauricio (count) |
| País | Dropdown: Todos os países, Brasil, Colômbia |
| Status | Dropdown: Todos status, [cada status] |
| Tier | Dropdown: Todos tiers, [cada tier] |
| Segmento | Dropdown: Todos segmentos, [cada segmento] |
| Período | Pills (Hoje, 7 dias, 15 dias, 30 dias, Tudo) + date range |

Pill ativa (analista): fundo `--primary`, texto carvão. Pill inativa: fundo transparente, borda `--bdr`, texto `--txt2`.

Contador no canto direito: "X de Y" total filtrado.

### 6.3 Tabela de Dados

Colunas:

| Coluna | Largura | Alinhamento |
|--------|---------|-------------|
| ☐ (checkbox) | 40px | Centro |
| Canal | 100px | Esquerda |
| País | 80px | Esquerda |
| Analista | 100px | Esquerda |
| Nome | 120px | Esquerda |
| Tier | 80px | Esquerda |
| Segmento | 100px | Esquerda |
| Perfil / Link | flex | Esquerda |
| Contato | 70px | Centro |
| Respondido | 80px | Centro |
| Status | 120px | Esquerda |
| OBS | 120px | Esquerda |
| ⚠ (indicador) | 60px | Centro |

**Specs visuais da tabela:**
- Header: fundo `--srf2`, texto `--txt2` caps Poppins SemiBold 11px
- Rows: fundo `--srf`, borda bottom 1px `--bdr`, hover: fundo `--srf2`
- Texto: Poppins Regular 13px, `--txt`
- Perfil / Link: cor `--primary`, clicável (abre em nova aba)
- Contato SIM: badge verde `--grn` / NÃO: texto normal
- Status: dropdown inline com cor do status (ver seção 2.5)
- OBS: editável inline — clique para ativar input
- Rows com animação de entrada stagger (i × 40ms, máx 400ms)

**Edição inline:** Clicar em qualquer célula editável ativa o input diretamente na célula. Enter salva, Escape cancela. Salvamento automático no Supabase — sem botão "salvar" separado para edições.

**Indicador ⚠:** Badge laranja "999d" quando a prospect está parada no mesmo status há muito tempo (threshold configurável, default: 7 dias para Contatada, 14 dias para outros).

**Checkbox:** Permite seleção múltipla para ações em batch (mover status, deletar, reatribuir analista).

### 6.4 Ações em Batch

Quando 1+ rows estão selecionadas, barra de ações aparece fixada no bottom:

| Ação | Cor |
|------|-----|
| Mover Status → | `--primary` |
| Reatribuir → | `--sky500` |
| Excluir | `--red` |

Confirmação via modal (DS v3.2: fundo branco, overlay carvão 70% + blur 12px).

### 6.5 Exportar CSV

Botão no header. Exporta dados visíveis (filtros aplicados) como CSV com encoding UTF-8 BOM (compatível com Excel em português).

---

## 7. Tab: Metas & Pace (Prioridade 3)

Permite definir metas semanais/mensais por analista e acompanhar o ritmo em tempo real.

### 7.1 Benchmarks de Creator Economy

Card informativo no topo. Três colunas com as estratégias de prospecção:

| Estratégia | Descrição | Benchmarks |
|------------|-----------|------------|
| **Volume** | Alta cadência, menor conversão por unidade | Tx. Resposta 15–25%, Tx. Ativação 3–8% |
| **Estratégico** | Baixo volume, alta personalização | Tx. Resposta 25–35%, Tx. Ativação 10–18% |
| **Expansão** | Novo mercado, fase de descoberta | Tx. Resposta 10–18%, Tx. Ativação 2–6% |

Cada coluna: badge com nome da estratégia na cor correspondente (Volume = `--primary`, Estratégico = `--grn`, Expansão = `--sky500`). Descrição abaixo. Fonte do benchmark em `--txt2` italic.

### 7.2 Cards por Analista

Grid de 2 colunas. Um card por analista com:

**Header do card:**
- Nome do analista (Poppins Bold 20px)
- Foco (ex: "T3/T4/Maternidade") — Poppins Regular 13px, `--txt2`
- Badge de estratégia (cor da estratégia)
- Botão "✏️ Editar meta" — ghost button, alinhado à direita

**Metas (4 números):**
- Meta contatos/sem
- Meta cadastros/sem
- Meta tx. resposta
- Meta tx. ativação

Cada número: Poppins Bold 18px, label acima em Poppins Regular 11px `--txt2`.

**Pace Semana — Dia X/Y:**
- Badge de pace: "⬆ Acima" (verde) | "⬇ Abaixo" (vermelho) | "↔ No ritmo" (laranja)
- Contatadas esta semana: valor real vs esperado
- Meta semana: X · ~Y/dia
- Tx. resposta atual: valor vs meta
- Ativações (novos cadastros): valor vs meta semanal
- Tx. ativação: valor% · benchmark: X–Y%

**Regras de cálculo do Pace:**
- `esperado_hoje = (meta_semanal / dias_uteis_semana) × dia_util_atual`
- Se real ≥ esperado → "Acima" (verde)
- Se real < esperado × 0.8 → "Abaixo" (vermelho)
- Senão → "No ritmo" (laranja)

### 7.3 Tabela Resumo de Metas

Abaixo dos cards. Tabela consolidada com uma linha por analista:

| Coluna | Descrição |
|--------|-----------|
| Analista | Nome |
| Foco | Segmento/tier de foco |
| Contatos/Sem | Meta semanal |
| Esperado | Esperado até hoje |
| Real Cont. | Contatos realizados |
| Tx. Resp Meta | Meta de taxa de resposta |
| Real Resp. | Taxa real |
| Cads/Sem | Meta semanal de cadastros |
| Real Cads. | Cadastros realizados |
| Pace | Badge (Acima/Abaixo/No ritmo) |

### 7.4 Modal de Edição de Meta

Acessível pelo botão "Editar meta" em cada card de analista.

**Regra DS v3.2:** Modal com fundo branco, overlay carvão 70% + blur 12px.

Campos:
- Meta contatos/semana (number input)
- Meta cadastros/semana (number input)
- Meta tx. resposta % (number input)
- Meta tx. ativação % (number input)

Botões: Cancelar (ghost) + Salvar (primary). Toast de confirmação ao salvar.

**Permissão futura:** Apenas admins podem editar metas. No MVP, qualquer usuário pode.

---

## 8. Tab: Timeline (Prioridade 4)

Feed de atividade que mostra todas as movimentações no sistema.

### 8.1 Estrutura do Feed

Lista vertical, ordenada por data (mais recente primeiro). Cada item:

```
[Avatar/Ícone do analista] [Nome do analista] [ação] [@creator] — [tempo relativo]
```

Exemplos:
- "Vitória marcou @becaa_barreto como **Contatada** — há 2h"
- "Stefanie cadastrou @novocreator via Instagram — há 5h"
- "Bia alterou status de @creator de Interesse para Negociando — ontem"
- "Mauricio adicionou nota em @creator — 12/03/2026"

### 8.2 Filtros do Timeline

| Filtro | Tipo |
|--------|------|
| Busca | Input — buscar por @ do creator |
| Analista | Dropdown: Todos analistas, [cada analista] |
| Tipo de ação | Dropdown: Todos, Cadastro, Mudança de status, Edição, Nota |

### 8.3 Estado Vazio

Quando não há atividades: ícone ilustrativo + "Nenhuma alteração registrada ainda. Edite campos na planilha para começar a rastrear mudanças." — centralizado, Poppins Regular 14px, `--txt2`.

### 8.4 Estrutura de Dados para Auditoria (Futuro)

O campo `details` (jsonb) no `activity_log` já armazena campo alterado, valor anterior e novo valor. Isso permite, no futuro, expandir o Timeline para uma auditoria completa sem alteração de schema.

---

## 9. Autenticação e Permissões

### 9.1 MVP — Sem Login

O sistema roda localmente. O analista se identifica selecionando seu nome no dropdown "Analista" ao cadastrar uma prospect. Não há restrição de acesso — qualquer pessoa com a URL pode usar todas as funcionalidades.

### 9.2 Fase SSO — Google Workspace

Login via Google OAuth integrado ao domínio da Privacy. O sistema reconhece automaticamente o e-mail do usuário logado, cria o registro no banco se for novo, e associa o perfil ao analista correspondente.

**Dois perfis:**

| Perfil | Permissões |
|--------|-----------|
| **Analista** | Vê e edita apenas seus próprios dados. Opera dentro das metas que recebeu. Não pode editar metas. |
| **Admin** | Vê dados de todos os analistas + os próprios. Define metas. Configura regras de inputs (canais, países, tiers, segmentos). Gerencia analistas. |

A URL de redirecionamento pós-login leva ao Dashboard. Sessão protege todas as rotas.

---

## 10. Stack Técnica

### 10.1 Arquitetura

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15 · TypeScript · Tailwind 4 |
| Animações | Framer Motion |
| Banco de dados | Supabase (PostgreSQL cloud) |
| Deploy | Vercel |
| Localização no repo | `projetos/creator-hunting/` no Privacy Hub |

### 10.2 Pré-requisito — Atualização do Design System do Hub

O design system implementado no repositório (`design-system/`) atualmente usa **Urbanist** e charcoal `#23201F`. O **Design System Privacy v3.2** (fonte da verdade) usa **Poppins** e charcoal `#1C1C1E`.

Antes de iniciar o Creator Hunting, é necessário alinhar o hub:
- `globals.css`: trocar Urbanist → Poppins, `#23201F` → `#1C1C1E`
- `tailwind.config.ts`: atualizar font-family
- Todos os componentes em `design-system/components/ui/`: atualizar referências de cor
- `memory/MEMORY.md` e `.cursor/rules/`: atualizar referências

Essa atualização afeta todos os projetos futuros do hub — é uma decisão permanente.

### 10.3 Supabase

- **Projeto:** criar projeto dedicado no Supabase
- **Tabelas:** conforme seção 3 (Modelo de Dados)
- **RLS:** desativado no MVP, ativado na fase SSO
- **Realtime:** subscriptions ativas para `prospects` e `activity_log` — quando um analista faz uma alteração, todos os outros veem em tempo real
- **Storage:** não necessário no MVP (sem upload de imagens)

### 10.4 Componentes do Design System (reutilizar, nunca reinventar)

| Componente do DS | Uso no Creator Hunting |
|------------------|----------------------|
| `SlidingTabs` | Tab bar principal |
| `TabContent` | Animação direcional entre tabs |
| `Modal` | Edição de meta, confirmação de exclusão, ações batch |
| `Select` | Todos os dropdowns (canal, país, analista, tier, segmento, status) |
| `Button` | Todos os botões |
| `toast.*` | Feedback de ações (salvar, deletar, editar) |
| `Portal` | Dentro dos modais |

---

## 11. Responsividade

| Breakpoint | Layout |
|------------|--------|
| ≥ 1440px | Tabela completa, Dashboard 2 colunas, Metas 2 colunas |
| 1024–1439px | Tabela com scroll horizontal, Dashboard 2 colunas |
| 768–1023px | Formulário 2 colunas, Dashboard 1 coluna, Metas 1 coluna |
| < 768px | Tudo 1 coluna, tabela em card view (cada row vira card) |

---

## 12. Roadmap de Implementação

### Fase 0 — Pré-requisito: Atualizar Design System do Hub
Alinhar `design-system/` com DS Privacy v3.2: Poppins, `#1C1C1E`, tokens atualizados. Atualizar regras do Cursor e memória.

### Fase 1 — Dashboard (Prioridade 1)
Estrutura do projeto em `projetos/creator-hunting/`. Supabase configurado. Schema do banco. Header + tab bar. Dashboard completo: KPIs, funil, por analista, por canal, distribuição, filtros. Dados podem ser seed (inseridos manualmente) para validação.

### Fase 2 — Planilha (Prioridade 2)
Formulário de nova prospecção. Tabela de dados com edição inline. Filtros (analista, canal, país, tier, segmento, período, busca). Ações batch. Exportar CSV. Activity log (escrita — cada ação gera registro).

### Fase 3 — Metas & Pace (Prioridade 3)
Benchmarks. Cards por analista com metas e pace. Tabela resumo. Modal de edição de meta. Cálculos de pace em tempo real.

### Fase 4 — Timeline (Prioridade 4)
Feed de atividade lendo do `activity_log`. Filtros. Estado vazio. Tempo relativo.

### Fase 5 — Polish + QA Visual
Animações refinadas. Responsividade completa. Performance (Lighthouse 90+). Light mode como adaptação do dark mode.

### Fase 6 — SSO + Permissões
Login Google OAuth via Supabase Auth. Perfis admin/analista. RLS ativado. Redirect pós-login. Gerenciamento de analistas.

### Fase 7 — Enriquecimento (Futuro)
API Instagram/TikTok para dados automáticos de seguidores, engajamento. Sugestão de tier automática baseada em métricas.

---

## 13. Regras Invioláveis

### Design
1. **Design System Privacy v3.2 é a única referência visual.** O arquivo `Design_system_privacy_v3.html` prevalece sobre este PRD em caso de conflito.
2. Tokens CSS do DS: usados diretamente, nunca substituídos por hex direto no código.
3. **Poppins exclusivamente.** Zero outras fontes.
4. **Dark mode como default.** Fundo `--bg` charcoal.
5. **Modais e formulários: sempre fundo `#FFFFFF`.**
6. **Zero box-shadow.** 100% flat.
7. Toda interação tem feedback animado usando tokens `--d*` e `--ease-*` do DS.
8. Cada canal e status tem cor dedicada. Usados em todo contexto visual.
9. Selects: sempre componente `Select` do design system — **nunca `<select>` nativo**.
10. Toasts: sempre `toast.*` — **nunca `alert()` ou lib externa**.

### Dados
1. **Supabase é a fonte da verdade.** Salvamento automático — sem botão "salvar" global.
2. Toda mutação (criar, editar status, editar campo) gera registro no `activity_log`.
3. Realtime via Supabase subscriptions — alterações visíveis para todos os usuários conectados.
4. Exportar CSV respeita filtros ativos.

### Produto
1. O sistema não publica conteúdo. Não integra com redes sociais (fase 7 apenas lê dados).
2. No MVP, qualquer usuário pode fazer qualquer ação (sem restrição de perfil).
3. Metas são editáveis por qualquer usuário no MVP; apenas admins na fase SSO.
4. Nenhum dado real de creator (nomes, @, perfis) aparece em screenshots, demos ou documentação pública — usar dados fictícios com a regra de anonimização do DS v3.2.

---

## 14. Diferenças em Relação ao Protótipo Lovable

O protótipo do CMO (`csmkt.lovable.app`) serviu como validação de fluxo. O Creator Hunting definitivo se diferencia em:

| Aspecto | Protótipo Lovable | Creator Hunting definitivo |
|---------|-------------------|--------------------------|
| Tipografia | Mista / default | Poppins exclusivamente (DS v3.2) |
| Formulários | Fundo escuro | Fundo `#FFFFFF` sempre |
| KPI Cards | Números soltos | Count-up animado + stagger de entrada |
| Funil | Barras simples | Barras animadas com porcentagem proporcional |
| Metas & Pace | Visual de planilha | Cards estruturados com badge de pace |
| Animações | Mínimas | Toda interação tem feedback (DS v3.2) |
| Banco | Supabase básico | Schema completo + activity_log + RLS (futuro) |
| Autenticação | Nenhuma | Dropdown MVP → SSO Google (futuro) |
| Design | Estética Lovable genérica | Design System Privacy v3.2 |

---

**Creator Hunting · CS — PRD v1.0**
**Departamento de Marketing · Privacy · Março 2026**
**Documento vivo. Qualquer alteração cria nova versão.**
