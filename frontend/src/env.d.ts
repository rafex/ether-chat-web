/// <reference types="vite/client" />

declare module '*.pug' {
  const template: (locals?: Record<string, unknown>) => string;
  export default template;
}

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_AUTH_ENDPOINT: string;
  readonly VITE_CHAT_ENDPOINT: string;
  readonly VITE_WIDGET_POSITION?: string;
  readonly VITE_WIDGET_MODE?: string;
  readonly VITE_TINKER_MODE?: string;
  readonly VITE_COLOR_PRIMARY?: string;
  readonly VITE_COLOR_ACCENT?: string;
  readonly VITE_COLOR_SURFACE?: string;
  readonly VITE_COLOR_TEXT?: string;
  // 'true' | 'false' — si es false el chat abre directo sin login
  readonly VITE_AUTH_REQUIRED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
