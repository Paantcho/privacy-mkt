/**
 * Privacy Design System — Ponto de entrada dos componentes
 *
 * Importe a partir daqui em qualquer projeto:
 * import { Button, Modal, Select, toast, SlidingTabs, TabContent, Portal } from "@/design-system/components/ui"
 */

export { Button } from "./button";
export { Modal } from "./modal";
export { Portal } from "./portal";
export { Select } from "./select";
export type { SelectOption } from "./select";
export { toast, ToastProvider, useToastStore } from "./toast";
export type { Toast, ToastType } from "./toast";
export { SlidingTabs } from "./sliding-tabs";
export type { SlideTab } from "./sliding-tabs";
export { TabContent } from "./tab-content";
