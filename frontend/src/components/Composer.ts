type SendHandler = (text: string) => void;

interface ComposerOptions {
  maxHeight?: number;
}

export class Composer {
  private readonly textarea: HTMLTextAreaElement;
  private readonly sendBtn: HTMLButtonElement;
  private readonly maxHeight: number;
  private onSend: SendHandler | null = null;

  constructor(container: HTMLElement, options?: ComposerOptions) {
    const textarea = container.querySelector<HTMLTextAreaElement>('.composer__input');
    const sendBtn = container.querySelector<HTMLButtonElement>('.composer__send');

    if (!textarea || !sendBtn) {
      throw new Error('Composer: required elements not found in container');
    }

    this.textarea = textarea;
    this.sendBtn = sendBtn;
    this.maxHeight = options?.maxHeight ?? 120;
    this.bindEvents();
  }

  setSendHandler(handler: SendHandler): void {
    this.onSend = handler;
  }

  setEnabled(enabled: boolean): void {
    this.textarea.disabled = !enabled;
    this.sendBtn.disabled = !enabled;
  }

  clear(): void {
    this.textarea.value = '';
    this.resize();
    this.sendBtn.disabled = true;
  }

  focus(): void {
    this.textarea.focus();
  }

  private bindEvents(): void {
    this.textarea.addEventListener('input', () => {
      this.resize();
      this.sendBtn.disabled = this.textarea.value.trim().length === 0;
    });

    this.textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.submit();
      }
    });

    this.sendBtn.addEventListener('click', () => this.submit());
    this.sendBtn.disabled = true;
  }

  private submit(): void {
    const text = this.textarea.value.trim();
    if (!text || !this.onSend) return;
    this.onSend(text);
  }

  private resize(): void {
    this.textarea.style.height = 'auto';
    this.textarea.style.height = `${Math.min(this.textarea.scrollHeight, this.maxHeight)}px`;
  }
}
