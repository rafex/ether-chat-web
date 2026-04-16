export class StorageService {
  private readonly prefix: string;

  constructor(prefix = 'ether') {
    this.prefix = prefix;
  }

  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.prefixed(key));
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.prefixed(key), JSON.stringify(value));
    } catch (err) {
      console.warn('StorageService: write failed', err);
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(this.prefixed(key));
    } catch {
      // ignore
    }
  }

  clear(): void {
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(this.prefix + '_'));
      keys.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore
    }
  }

  private prefixed(key: string): string {
    return `${this.prefix}_${key}`;
  }
}
