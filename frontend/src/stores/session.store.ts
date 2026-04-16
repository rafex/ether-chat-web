import type { Session } from '@/types';
import { StorageService } from '@/services/storage.service';

const SESSION_KEY = 'ether_session';

export class SessionStore {
  private session: Session | null = null;
  private readonly storage: StorageService;

  constructor(storage: StorageService) {
    this.storage = storage;
    this.session = this.storage.get<Session>(SESSION_KEY);
  }

  get(): Session | null {
    return this.session;
  }

  set(session: Session): void {
    this.session = session;
    this.storage.set(SESSION_KEY, session);
  }

  clear(): void {
    this.session = null;
    this.storage.remove(SESSION_KEY);
  }

  isAuthenticated(): boolean {
    if (!this.session) return false;
    if (this.session.expiresAt && new Date(this.session.expiresAt) <= new Date()) {
      this.clear();
      return false;
    }
    return true;
  }

  getToken(): string | null {
    return this.session?.token ?? null;
  }
}
