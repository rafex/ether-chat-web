import type { ChatConfig } from '@/types';
import { buildAppConfig } from '@/config/app.config';
import { ConfigStore } from '@/stores/config.store';
import { StorageService } from '@/services/storage.service';

export class ConfigService {
  private readonly store: ConfigStore;

  constructor(storage?: StorageService) {
    const s = storage ?? new StorageService();
    this.store = new ConfigStore(buildAppConfig(), s);
  }

  get(): ChatConfig {
    return this.store.get();
  }

  update(partial: Partial<ChatConfig>): void {
    this.store.update(partial);
  }

  getStore(): ConfigStore {
    return this.store;
  }
}
