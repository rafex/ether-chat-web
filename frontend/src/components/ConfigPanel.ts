import type { ChatConfig, WidgetPosition, TinkerMode } from '@/types';
import type { ConfigStore } from '@/stores/config.store';
import configPanelTemplate from './templates/config-panel.pug';

export class ConfigPanel {
  private element: HTMLElement;
  private readonly store: ConfigStore;
  private unsubscribe: (() => void) | null = null;

  constructor(store: ConfigStore) {
    this.store = store;
    this.element = this.build();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  mount(parent: HTMLElement): void {
    parent.appendChild(this.element);
    this.unsubscribe = this.store.subscribe((config) => this.syncUI(config));
    this.syncUI(this.store.get());
  }

  destroy(): void {
    this.unsubscribe?.();
    this.element.remove();
  }

  private build(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = configPanelTemplate({});
    const el = wrapper.firstElementChild as HTMLElement;

    // Position buttons
    el.querySelectorAll<HTMLButtonElement>('[data-position]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pos = btn.dataset['position'] as WidgetPosition;
        if (pos) this.store.setPosition(pos);
      });
    });

    // Color buttons
    el.querySelectorAll<HTMLButtonElement>('[data-color]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const color = btn.dataset['color'];
        if (color) this.store.setColors({ accent: color });
      });
    });

    // Tinker mode buttons
    el.querySelectorAll<HTMLButtonElement>('[data-tinker]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset['tinker'] as TinkerMode;
        if (mode) this.store.setTinkerMode(mode);
      });
    });

    // Close button
    el.querySelector<HTMLButtonElement>('[data-action="close-config"]')?.addEventListener(
      'click',
      () => el.dispatchEvent(new CustomEvent('config-close', { bubbles: true })),
    );

    return el;
  }

  private syncUI(config: ChatConfig): void {
    this.element.querySelectorAll<HTMLButtonElement>('[data-position]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset['position'] === config.position));
    });

    this.element.querySelectorAll<HTMLButtonElement>('[data-color]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset['color'] === config.colors.accent));
    });

    this.element.querySelectorAll<HTMLButtonElement>('[data-tinker]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset['tinker'] === config.tinkerMode));
    });
  }
}
