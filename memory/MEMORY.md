# MEMORY.md — Decisões Permanentes do Privacy Hub

Lido por TODOS os agentes ANTES de qualquer ação.
Decisões aqui valem para TODOS os projetos.
Atualizado quando há decisão importante, preferência nova ou lição aprendida.

---

## Sobre o Usuário

- Diretor de arte / Designer
- Não é desenvolvedor — explicar decisões técnicas de forma simples
- Prioriza qualidade visual e elegância
- Idioma: português brasileiro sempre

---

## Paleta de Marca Privacy

```
Primária (Laranja):  #F68D3D
Ink (Carvão):        #23201F
BG (Off-white):      #F4EEE5
Surface:             #FFFFFF
Dark mode BG:        #23201F
Dark mode Surface:   #2E2B2A
Dark mode Text:      #F4EEE5
```

---

## Design — Decisões Permanentes

- **Flat design absoluto** — zero box-shadow em qualquer elemento de UI
- **Fonte única:** Urbanist (Bold, SemiBold, Regular)
- **Modais:** sempre branco #FFFFFF com overlay carvão 70% + blur 12px
- **Background da app:** #F4EEE5 — nunca bg-gray, bg-slate, bg-zinc

---

## Motion — Decisões Permanentes

- **Framer Motion** obrigatório para todos os componentes React animados
- Botões sempre: hover scale(1.03) / tap scale(0.96)
- Cards sempre com stagger de entrada (i × 60ms, máx 300ms)
- Modal: sempre 3 camadas + AnimatePresence + Portal
- NUNCA `if (!open) return null` em componente animado

---

## Proibições Globais (valem em TODOS os projetos)

> Adicione aqui qualquer proibição que surgir durante o desenvolvimento.

- NUNCA usar `<select>` nativo HTML — sempre `Select` do design-system
- NUNCA usar `alert()` ou `confirm()` — sempre `toast.*`
- NUNCA usar `transition: all`
- NUNCA usar fontes diferentes de Urbanist

---

## Stack Padrão

Next.js 15 · TypeScript · Tailwind 4 · Framer Motion · Vercel

---

## Preferências do Usuário

- Comunicação em português BR
- Tom profissional mas acessível
- Rollback sempre disponível (git checkout --)
- Não implementar animações novas sem aprovação visual
- Design próprio — nunca usar padrões de UI copiados de outros sistemas
