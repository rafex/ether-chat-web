import type { TinkerBlock as TinkerBlockData, TinkerMode } from '@/types';
import tinkerTemplate from './templates/tinker-block.pug';

export class TinkerBlockComponent {
  private readonly data: TinkerBlockData;
  private element: HTMLElement | null = null;

  constructor(data: TinkerBlockData) {
    this.data = data;
  }

  render(mode: TinkerMode): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = tinkerTemplate({ id: this.data.id, content: this.data.content });
    const el = wrapper.firstElementChild as HTMLElement;

    const btn = el.querySelector<HTMLButtonElement>('.tinker-block__header');
    const body = el.querySelector<HTMLPreElement>('.tinker-block__body');

    if (!btn || !body) {
      this.element = el;
      return el;
    }

    this.applyMode(btn, body, mode);
    btn.addEventListener('click', () => this.toggle(btn, body));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.toggle(btn, body);
      }
    });

    this.element = el;
    return el;
  }

  updateMode(mode: TinkerMode): void {
    if (!this.element) return;
    const btn = this.element.querySelector<HTMLButtonElement>('.tinker-block__header');
    const body = this.element.querySelector<HTMLPreElement>('.tinker-block__body');
    if (btn && body) this.applyMode(btn, body, mode);
  }

  private applyMode(btn: HTMLButtonElement, body: HTMLPreElement, mode: TinkerMode): void {
    switch (mode) {
      case 'hidden':
        body.hidden = true;
        body.setAttribute('aria-hidden', 'true');
        btn.setAttribute('aria-expanded', 'false');
        this.element?.classList.add('tinker-block--hidden');
        break;
      case 'visible':
        body.hidden = false;
        body.removeAttribute('aria-hidden');
        btn.setAttribute('aria-expanded', 'true');
        break;
      case 'expandable':
        body.hidden = true;
        body.setAttribute('aria-hidden', 'true');
        btn.setAttribute('aria-expanded', 'false');
        break;
    }
  }

  private toggle(btn: HTMLButtonElement, body: HTMLPreElement): void {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const next = !expanded;
    btn.setAttribute('aria-expanded', String(next));
    body.hidden = !next;
    if (next) {
      body.removeAttribute('aria-hidden');
    } else {
      body.setAttribute('aria-hidden', 'true');
    }
  }
}
