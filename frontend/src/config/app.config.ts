import type { ChatConfig, ColorConfig, WidgetPosition, WidgetMode, TinkerMode, ThemePreset } from '@/types';

// ─── Theme presets ─────────────────────────────────────────────────────────────

export const THEMES: Record<ThemePreset, ColorConfig> = {
  dark: {
    primary: '#1a1a2e',
    accent:  '#e94560',
    surface: '#16213e',
    text:    '#eaeaea',
  },
  light: {
    primary: '#f0f4f8',
    accent:  '#e94560',
    surface: '#ffffff',
    text:    '#1a1a2e',
  },
  rafex: {
    primary: '#0a0e1a',
    accent:  '#00d4aa',
    surface: '#0d1526',
    text:    '#e2f0ff',
  },
};

// ─── Default config ────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: ChatConfig = {
  position: 'bottom-right',
  mode: 'floating',
  tinkerMode: 'hidden',
  colors: { ...THEMES.dark },
  backendUrl: '',
  authEndpoint: '/api/auth/login',
  chatEndpoint: '/api/chat/message',
  requireAuth: true,
};

// ─── Env overrides ─────────────────────────────────────────────────────────────

function fromEnv(): Partial<ChatConfig> {
  const partial: Partial<ChatConfig> = {};

  if (import.meta.env.VITE_BACKEND_URL) {
    partial.backendUrl = import.meta.env.VITE_BACKEND_URL;
  }
  if (import.meta.env.VITE_AUTH_ENDPOINT) {
    partial.authEndpoint = import.meta.env.VITE_AUTH_ENDPOINT;
  }
  if (import.meta.env.VITE_CHAT_ENDPOINT) {
    partial.chatEndpoint = import.meta.env.VITE_CHAT_ENDPOINT;
  }

  const positions: WidgetPosition[] = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  const pos = import.meta.env.VITE_WIDGET_POSITION as WidgetPosition;
  if (pos && positions.includes(pos)) {
    partial.position = pos;
  }

  const modes: WidgetMode[] = ['floating', 'embedded', 'fullscreen'];
  const mode = import.meta.env.VITE_WIDGET_MODE as WidgetMode;
  if (mode && modes.includes(mode)) {
    partial.mode = mode;
  }

  const tinkerModes: TinkerMode[] = ['hidden', 'visible', 'expandable'];
  const tinker = import.meta.env.VITE_TINKER_MODE as TinkerMode;
  if (tinker && tinkerModes.includes(tinker)) {
    partial.tinkerMode = tinker;
  }

  if (
    import.meta.env.VITE_COLOR_PRIMARY ||
    import.meta.env.VITE_COLOR_ACCENT ||
    import.meta.env.VITE_COLOR_SURFACE ||
    import.meta.env.VITE_COLOR_TEXT
  ) {
    partial.colors = {
      ...DEFAULT_CONFIG.colors,
      ...(import.meta.env.VITE_COLOR_PRIMARY ? { primary: import.meta.env.VITE_COLOR_PRIMARY } : {}),
      ...(import.meta.env.VITE_COLOR_ACCENT  ? { accent:  import.meta.env.VITE_COLOR_ACCENT  } : {}),
      ...(import.meta.env.VITE_COLOR_SURFACE ? { surface: import.meta.env.VITE_COLOR_SURFACE } : {}),
      ...(import.meta.env.VITE_COLOR_TEXT    ? { text:    import.meta.env.VITE_COLOR_TEXT    } : {}),
    };
  }

  // VITE_AUTH_REQUIRED=false desactiva el login (acceso directo al chat)
  if (import.meta.env.VITE_AUTH_REQUIRED !== undefined) {
    partial.requireAuth = import.meta.env.VITE_AUTH_REQUIRED !== 'false';
  }

  return partial;
}

// ─── Builder ───────────────────────────────────────────────────────────────────

export function buildAppConfig(overrides: Partial<ChatConfig> = {}): ChatConfig {
  return {
    ...DEFAULT_CONFIG,
    ...fromEnv(),
    ...overrides,
    colors: {
      ...DEFAULT_CONFIG.colors,
      ...(fromEnv().colors ?? {}),
      ...(overrides.colors ?? {}),
    },
  };
}
