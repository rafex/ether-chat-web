import { describe, it, expect, beforeEach } from 'vitest';
import { ConfigService } from './config.service';
import { StorageService } from './storage.service';

// Minimal localStorage mock for jsdom environment
class MockStorage implements Storage {
  private store: Record<string, string> = {};
  get length(): number { return Object.keys(this.store).length; }
  key(index: number): string | null { return Object.keys(this.store)[index] ?? null; }
  getItem(key: string): string | null { return this.store[key] ?? null; }
  setItem(key: string, value: string): void { this.store[key] = value; }
  removeItem(key: string): void { delete this.store[key]; }
  clear(): void { this.store = {}; }
}

function makeService(): ConfigService {
  // Use a fresh StorageService backed by the global localStorage (jsdom provides it)
  const storage = new StorageService('test');
  return new ConfigService(storage);
}

beforeEach(() => {
  localStorage.clear();
});

describe('ConfigService', () => {
  it('returns default position when nothing is stored', () => {
    const svc = makeService();
    expect(svc.get().position).toBe('bottom-right');
  });

  it('returns default tinkerMode', () => {
    const svc = makeService();
    expect(svc.get().tinkerMode).toBe('hidden');
  });

  it('updates position correctly', () => {
    const svc = makeService();
    svc.update({ position: 'top-left' });
    expect(svc.get().position).toBe('top-left');
  });

  it('merges color overrides without losing other colors', () => {
    const svc = makeService();
    const original = svc.get().colors;
    svc.update({ colors: { ...original, accent: '#ff0000' } });
    expect(svc.get().colors.accent).toBe('#ff0000');
    expect(svc.get().colors.primary).toBe(original.primary);
  });

  it('persists config across service instances using same storage prefix', () => {
    const storage = new StorageService('persist_test');
    const svc1 = new ConfigService(storage);
    svc1.update({ position: 'top-right' });

    const svc2 = new ConfigService(storage);
    expect(svc2.get().position).toBe('top-right');
  });
});
