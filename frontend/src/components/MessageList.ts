import type { Message, TinkerMode } from '@/types';
import { TinkerBlockComponent } from './TinkerBlock';
import { TypingIndicator } from './TypingIndicator';
import type { AgentState } from '@/types';

export class MessageList {
  private readonly element: HTMLElement;
  private readonly typingIndicator: TypingIndicator;
  private tinkerMode: TinkerMode;

  constructor(container: HTMLElement, initialTinkerMode: TinkerMode) {
    this.element = container;
    this.tinkerMode = initialTinkerMode;
    this.typingIndicator = new TypingIndicator();
    this.element.appendChild(this.typingIndicator.getElement());
  }

  appendMessage(message: Message): void {
    const bubble = this.createBubble(message);
    this.element.insertBefore(bubble, this.typingIndicator.getElement());
    this.scrollToBottom();
  }

  updateAgentState(state: AgentState): void {
    this.typingIndicator.update(state);
    this.scrollToBottom();
  }

  setTinkerMode(mode: TinkerMode): void {
    this.tinkerMode = mode;
    this.element.querySelectorAll<HTMLElement>('.tinker-block').forEach((el) => {
      const btn = el.querySelector<HTMLButtonElement>('.tinker-block__header');
      const body = el.querySelector<HTMLPreElement>('.tinker-block__body');
      if (!btn || !body) return;
      switch (mode) {
        case 'hidden':
          body.hidden = true;
          body.setAttribute('aria-hidden', 'true');
          btn.setAttribute('aria-expanded', 'false');
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
    });
  }

  private createBubble(message: Message): HTMLElement {
    const article = document.createElement('article');
    article.className = `message message--${message.role}`;
    article.setAttribute('aria-label', message.role === 'user' ? 'Tu mensaje' : 'Respuesta del agente');

    const bubble = document.createElement('div');
    bubble.className = 'message__bubble';
    bubble.textContent = message.content;

    article.appendChild(bubble);

    if (message.tinkerBlocks.length > 0) {
      message.tinkerBlocks.forEach((block) => {
        const comp = new TinkerBlockComponent(block);
        article.appendChild(comp.render(this.tinkerMode));
      });
    }

    const time = document.createElement('time');
    time.className = 'message__time';
    time.dateTime = message.timestamp.toISOString();
    time.textContent = message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    article.appendChild(time);

    return article;
  }

  private scrollToBottom(): void {
    this.element.scrollTop = this.element.scrollHeight;
  }
}
