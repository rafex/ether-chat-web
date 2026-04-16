import type { ChatConfig, ColorConfig, WidgetPosition, TinkerMode } from '@/types';
import { StorageService } from '@/services/storage.service';

const CONFIG_KEY = 'ether_config';

type ConfigListener = (config: ChatConfig) => void;

export class ConfigStore {
  private config: ChatConfig;
  private readonly storage: StorageService;
  private readonly listeners: Set<ConfigListener> = new Set();

  constructor(initialConfig: ChatConfig, storage: StorageService) {
    this.storage = storage;
    const stored = this.storage.get<Partial<ChatConfig>>(CONFIG_KEY);
    this.config = stored ? this.merge(initialConfig, stored) : initialConfig;
    this.applyTokens(this.config);
  }

  get(): ChatConfig {
    return { ...this.config, colors: { ...this.config.colors } };
  }

  update(partial: Partial<ChatConfig>): void {
    this.config = this.merge(this.config, partial);
    this.storage.set(CONFIG_KEY, this.config);
    this.applyTokens(this.config);
    this.notify();
  }

  setColors(colors: Partial<ColorConfig>): void {
    this.update({ colors: { ...this.config.colors, ...colors } });
  }

  setPosition(position: WidgetPosition): void {
    this.update({ position });
  }

  setTinkerMode(tinkerMode: TinkerMode): void {
    this.update({ tinkerMode });
  }

  subscribe(listener: ConfigListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private merge(base: ChatConfig, partial: Partial<ChatConfig>): ChatConfig {
    return {
      ...base,
      ...partial,
      colors: { ...base.colors, ...(partial.colors ?? {}) },
    };
  }

  private applyTokens(config: ChatConfig): void {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', config.colors.primary);
    root.style.setProperty('--color-accent', config.colors.accent);
    root.style.setProperty('--color-surface', config.colors.surface);
    root.style.setProperty('--color-text', config.colors.text);
  }

  private notify(): void {
    const snapshot = this.get();
    this.listeners.forEach((l) => l(snapshot));
  }
}
