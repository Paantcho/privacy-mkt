# Privacy Design System

Sistema de design compartilhado por todos os projetos do Privacy Hub.

## Paleta

| Token | Valor | Uso |
|---|---|---|
| Primária | `#F68D3D` | Botões, pills ativas, accent |
| Ink | `#23201F` | Texto principal, elementos escuros |
| BG | `#F4EEE5` | Fundo geral da app |
| Surface | `#FFFFFF` | Cards, modais |
| Dark BG | `#23201F` | Fundo no dark mode |
| Dark Surface | `#2E2B2A` | Cards no dark mode |

## Componentes

| Componente | Arquivo | Uso |
|---|---|---|
| `Button` | `components/ui/button.tsx` | Botão com motion — variantes primary/secondary/ghost/danger |
| `Modal` | `components/ui/modal.tsx` | Modal 3 camadas + Portal integrado |
| `Portal` | `components/ui/portal.tsx` | createPortal para document.body |
| `Select` | `components/ui/select.tsx` | Dropdown customizado — zero select nativo |
| `toast.*` + `ToastProvider` | `components/ui/toast.tsx` | Sistema de toast |
| `SlidingTabs` | `components/ui/sliding-tabs.tsx` | Tabs com pill spring laranja |
| `TabContent` | `components/ui/tab-content.tsx` | Conteúdo com animação direcional |

## Como usar em um projeto

```tsx
// globals.css do projeto
@import "../../design-system/styles/globals.css";

// tailwind.config.ts do projeto
import baseConfig from "../../design-system/styles/tailwind.config";
export default { ...baseConfig, content: ["./src/**/*.{ts,tsx}"] };

// Componentes
import { Button, Modal, toast } from "../../design-system/components/ui";
```

## Adicionar ao root layout

```tsx
import { ToastProvider } from "../../design-system/components/ui";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
```
