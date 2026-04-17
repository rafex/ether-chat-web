// ─── Message types ────────────────────────────────────────────────────────────

export interface TinkerBlock {
  id: string;
  content: string;
  isVisible: boolean;
}

export type MessageRole = 'user' | 'agent';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  rawContent: string;
  timestamp: Date;
  tinkerBlocks: TinkerBlock[];
}

// ─── Auth types ───────────────────────────────────────────────────────────────

export type AuthMode = 'jwt' | 'credentials';

export interface Credentials {
  username: string;
  password: string;
}

export interface Session {
  token: string;
  expiresAt?: Date;
  userId?: string;
}

// ─── Config types ─────────────────────────────────────────────────────────────

export type WidgetPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export type WidgetMode = 'floating' | 'embedded' | 'fullscreen';
export type TinkerMode = 'hidden' | 'visible' | 'expandable';
export type ThemePreset = 'dark' | 'light' | 'rafex';

export interface ColorConfig {
  primary: string;
  accent: string;
  surface: string;
  text: string;
}

export interface ChatConfig {
  position: WidgetPosition;
  mode: WidgetMode;
  tinkerMode: TinkerMode;
  colors: ColorConfig;
  backendUrl: string;
  authEndpoint: string;
  chatEndpoint: string;
  requireAuth: boolean;
}

// ─── Transport types ──────────────────────────────────────────────────────────

export interface TransportRequest {
  message: string;
  sessionToken?: string;
  conversationId?: string;
}

export interface TransportResponse {
  content: string;
  conversationId?: string;
  partial?: boolean;
}

// ─── Agent state types ────────────────────────────────────────────────────────

export type AgentStatus = 'idle' | 'typing' | 'processing' | 'error' | 'reconnecting';

export interface AgentState {
  status: AgentStatus;
  message?: string;
}
