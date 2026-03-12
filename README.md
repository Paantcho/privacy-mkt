# Privacy Hub

Workspace de desenvolvimento pessoal — base para criar ferramentas e projetos rapidamente.

## Estrutura

```
privacy-mkt/
  design-system/    ← biblioteca compartilhada (tokens, componentes, estilos)
  agents/           ← orquestrador e agentes
  memory/           ← estado e decisões permanentes
  projetos/         ← cada projeto em pasta separada
  .cursor/rules/    ← regras do Cursor (valem para todos os projetos)
```

## Paleta

- Laranja `#F68D3D` — cor primária
- Carvão `#23201F` — ink / texto
- Off-white `#F4EEE5` — fundo
- Branco `#FFFFFF` — cards e modais

## Criar novo projeto

Peça ao Cursor: _"Cria um projeto chamado [nome] para [objetivo]"_

O orquestrador vai:
1. Ler as decisões em `memory/MEMORY.md`
2. Criar `projetos/[nome]/`
3. Configurar design system
4. Inicializar estrutura Next.js

## Design System

Ver `design-system/README.md`
