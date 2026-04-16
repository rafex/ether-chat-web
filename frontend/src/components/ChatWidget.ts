import type { ChatService } from '@/services/chat.service';
import type { ConfigStore } from '@/stores/config.store';
import { MessageList } from './MessageList';
import { Composer } from './Composer';
import { ConfigPanel } from './ConfigPanel';
import chatWidgetTemplate from './templates/chat-widget.pug';

export class ChatWidget {
  private element: HTMLElement;
  private readonly chatService: ChatService;
  private readonly configStore: ConfigStore;
  private messageList: MessageList | null = null;
  private composer: Composer | null = null;
  private configPanel: ConfigPanel | null = null;
  private configVisible = false;
  private readonly unsubscribers: Array<() => void> = [];

  constructor(chatService: ChatService, configStore: ConfigStore) {
    this.chatService = chatService;
    this.configStore = configStore;
    this.element = this.build();
  }

  mount(parent: HTMLElement): void {
    parent.appendChild(this.element);
    this.applyPositionClass(this.configStore.get().position);
    this.unsubscribers.push(
      this.configStore.subscribe((config) => {
        this.applyPositionClass(config.position);
        this.messageList?.setTinkerMode(config.tinkerMode);
      }),
    );
  }

  destroy(): void {
    this.configPanel?.destroy();
    this.unsubscribers.forEach((u) => u());
    this.element.remove();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  private build(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = chatWidgetTemplate({ title: 'Ether Chat' });
    const el = wrapper.firstElementChild as HTMLElement;

    const listContainer = el.querySelector<HTMLElement>('.message-list');
    const composerContainer = el.querySelector<HTMLElement>('.composer');

    if (listContainer) {
      this.messageList = new MessageList(listContainer, this.configStore.get().tinkerMode);
    }

    if (composerContainer) {
      this.composer = new Composer(composerContainer);
      this.composer.setSendHandler((text) => void this.send(text));
    }

    el.querySelector<HTMLButtonElement>('[data-action="config"]')?.addEventListener('click', () =>
      this.openConfig(el),
    );
    el.querySelector<HTMLButtonElement>('[data-action="close"]')?.addEventListener('click', () =>
      el.dispatchEvent(new CustomEvent('widget-close', { bubbles: true })),
    );
    el.addEventListener('config-close', () => this.closeConfig());

    this.unsubscribers.push(
      this.chatService.onMessage((msg) => this.messageList?.appendMessage(msg)),
      this.chatService.onStateChange((state) => {
        this.messageList?.updateAgentState(state);
        const isActive = state.status !== 'idle' && state.status !== 'error';
        this.composer?.setEnabled(!isActive);
      }),
    );

    return el;
  }

  private async send(text: string): Promise<void> {
    this.composer?.clear();
    this.composer?.setEnabled(false);
    try {
      await this.chatService.sendMessage(text);
    } finally {
      this.composer?.setEnabled(true);
      this.composer?.focus();
    }
  }

  private openConfig(el: HTMLElement): void {
    if (this.configVisible) return;
    this.configPanel = new ConfigPanel(this.configStore);
    this.configPanel.mount(el);
    this.configVisible = true;
  }

  private closeConfig(): void {
    this.configPanel?.destroy();
    this.configPanel = null;
    this.configVisible = false;
  }

  private applyPositionClass(position: string): void {
    const classes = ['chat-widget--bottom-right', 'chat-widget--bottom-left', 'chat-widget--top-right', 'chat-widget--top-left', 'chat-widget--embedded'];
    classes.forEach((c) => this.element.classList.remove(c));
    this.element.classList.add(`chat-widget--${position}`);
  }
}
