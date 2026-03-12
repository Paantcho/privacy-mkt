# CLAUDE.md — Briefing Permanente do Privacy Hub

## Sobre o Hub

Privacy Hub é um workspace de desenvolvimento pessoal.
Não é um produto SaaS — é uma base para construir ferramentas e projetos rapidamente.
Cada projeto vive em `projetos/<nome>/` e herda o design system da raiz.

## Documentos Obrigatórios (ler SEMPRE antes de agir)

- `memory/WORKING.md` — projeto ativo e estado atual
- `memory/MEMORY.md` — decisões e preferências permanentes

## Design System

- Pasta: `design-system/`
- Tokens: `design-system/styles/globals.css`
- Componentes: `design-system/components/ui/`
- Tailwind: `design-system/styles/tailwind.config.ts`

## Paleta Privacy

```
Primária:  #F68D3D (laranja)
Ink:       #23201F (carvão)
BG:        #F4EEE5 (off-white)
Surface:   #FFFFFF (branco — cards, modais)
```

## Stack Padrão

Next.js 15 · TypeScript · Tailwind 4 · Framer Motion · Vercel

## Regras Invioláveis

- Flat design — zero box-shadow em UI
- Fonte exclusiva: Urbanist
- Motion: Framer Motion obrigatório
- Selects: componente `Select` — nunca `<select>` nativo
- Toasts: `toast.*` — nunca `alert()` ou lib externa
- Modais: 3 camadas + Portal — nunca `if (!open) return null`
- Cards: sempre stagger de entrada

## Ciclo de Trabalho

PLAN → EXECUTE → REFLECT
Nunca entregar sem revisar.
