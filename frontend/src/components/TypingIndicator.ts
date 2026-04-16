import type { AgentState } from '@/types';
import typingTemplate from './templates/typing-indicator.pug';

const STATE_LABELS: Record<string, string> = {
  typing: 'Escribiendo...',
  processing: 'Procesando...',
  error: 'Error al conectar',
  reconnecting: 'Reconectando...',
};

export class TypingIndicator {
  private element: HTMLElement;

  constructor() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = typingTemplate({ label: STATE_LABELS['typing'] });
    this.element = wrapper.firstElementChild as HTMLElement;
    this.element.style.display = 'none';
  }

  getElement(): HTMLElement {
    return this.element;
  }

  update(state: AgentState): void {
    const isActive = state.status !== 'idle';
    this.element.style.display = isActive ? '' : 'none';
    const span = this.element.querySelector('span');
    if (span) {
      span.textContent = STATE_LABELS[state.status] ?? state.message ?? '';
    }
  }
}
