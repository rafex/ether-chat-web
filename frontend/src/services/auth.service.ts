import type { Credentials, Session } from '@/types';
import type { SessionStore } from '@/stores/session.store';

interface AuthServiceConfig {
  baseUrl: string;
  authEndpoint: string;
  timeoutMs?: number;
}

interface LoginResponse {
  token: string;
  expires_at?: string;
  user_id?: string;
}

export class AuthService {
  private readonly config: AuthServiceConfig;
  private readonly sessionStore: SessionStore;

  constructor(config: AuthServiceConfig, sessionStore: SessionStore) {
    this.config = config;
    this.sessionStore = sessionStore;
  }

  /** Accept a pre-existing JWT token and store the session. */
  setJwt(token: string, expiresAt?: Date): void {
    const session: Session = { token, expiresAt: expiresAt ?? undefined };
    this.sessionStore.set(session);
  }

  /** Login with username/password against the configured auth endpoint. */
  async login(credentials: Credentials): Promise<Session> {
    const url = `${this.config.baseUrl}${this.config.authEndpoint}`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs ?? 10_000);

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      throw new Error(`Auth error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as LoginResponse;

    const session: Session = {
      token: data.token,
      ...(data.expires_at ? { expiresAt: new Date(data.expires_at) } : {}),
      ...(data.user_id ? { userId: data.user_id } : {}),
    };

    this.sessionStore.set(session);
    return session;
  }

  logout(): void {
    this.sessionStore.clear();
  }

  isAuthenticated(): boolean {
    return this.sessionStore.isAuthenticated();
  }

  getToken(): string | null {
    return this.sessionStore.getToken();
  }
}
