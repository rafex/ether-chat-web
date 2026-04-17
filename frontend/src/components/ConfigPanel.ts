import type { ChatConfig, WidgetPosition, TinkerMode, ThemePreset } from '@/types';
import type { ConfigStore } from '@/stores/config.store';
import { THEMES } from '@/config/app.config';
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

    // Theme preset buttons
    el.querySelectorAll<HTMLButtonElement>('[data-theme]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset['theme'] as ThemePreset;
        if (theme && theme in THEMES) this.store.setTheme(theme);
      });
    });

    // Preset accent color buttons
    el.querySelectorAll<HTMLButtonElement>('[data-color]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const color = btn.dataset['color'];
        if (color) this.store.setColors({ accent: color });
      });
    });

    // Color pickers (input type=color) para los 4 tokens
    const colorInputs: Record<string, keyof ChatConfig['colors']> = {
      'input-color-primary': 'primary',
      'input-color-accent':  'accent',
      'input-color-surface': 'surface',
      'input-color-text':    'text',
    };
    Object.entries(colorInputs).forEach(([id, token]) => {
      el.querySelector<HTMLInputElement>(`#${id}`)?.addEventListener('input', (e) => {
        const value = (e.target as HTMLInputElement).value;
        this.store.setColors({ [token]: value });
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
    // Detectar si el config actual coincide con algun theme preset
    const activeTheme = (Object.keys(THEMES) as ThemePreset[]).find((t) =>
      THEMES[t].primary === config.colors.primary &&
      THEMES[t].accent  === config.colors.accent  &&
      THEMES[t].surface === config.colors.surface &&
      THEMES[t].text    === config.colors.text,
    );
    this.element.querySelectorAll<HTMLButtonElement>('[data-theme]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset['theme'] === activeTheme));
    });

    this.element.querySelectorAll<HTMLButtonElement>('[data-position]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset['position'] === config.position));
    });

    this.element.querySelectorAll<HTMLButtonElement>('[data-color]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset['color'] === config.colors.accent));
    });

    // Sync color inputs con el estado actual
    const fields: Array<[string, string]> = [
      ['input-color-primary', config.colors.primary],
      ['input-color-accent',  config.colors.accent],
      ['input-color-surface', config.colors.surface],
      ['input-color-text',    config.colors.text],
    ];
    fields.forEach(([id, value]) => {
      const input = this.element.querySelector<HTMLInputElement>(`#${id}`);
      if (input) input.value = value;
    });

    this.element.querySelectorAll<HTMLButtonElement>('[data-tinker]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset['tinker'] === config.tinkerMode));
    });
  }
}
