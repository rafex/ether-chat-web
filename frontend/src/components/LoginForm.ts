import type { AuthService } from '@/services/auth.service';
import loginTemplate from './templates/login-form.pug';

type LoginSuccessHandler = () => void;

interface LoginFormMessages {
  emptyFields?: string;
  genericError?: string;
}

export class LoginForm {
  private element: HTMLElement;
  private readonly auth: AuthService;
  private readonly messages: Required<LoginFormMessages>;
  private onSuccess: LoginSuccessHandler | null = null;

  constructor(auth: AuthService, messages?: LoginFormMessages) {
    this.auth = auth;
    this.messages = {
      emptyFields: messages?.emptyFields ?? 'Ingresa usuario y contraseña.',
      genericError: messages?.genericError ?? 'Error al ingresar.',
    };
    this.element = this.build();
  }

  getElement(): HTMLElement {
    return this.element;
  }

  setSuccessHandler(handler: LoginSuccessHandler): void {
    this.onSuccess = handler;
  }

  private build(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = loginTemplate({});
    const el = wrapper.firstElementChild as HTMLElement;

    const form = el.querySelector<HTMLFormElement>('.login-form');
    const errorEl = el.querySelector<HTMLParagraphElement>('.login-form__error');
    const submitBtn = el.querySelector<HTMLButtonElement>('.login-form__submit');

    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      void this.handleSubmit(form, errorEl, submitBtn);
    });

    return el;
  }

  private async handleSubmit(
    form: HTMLFormElement,
    errorEl: HTMLParagraphElement | null,
    submitBtn: HTMLButtonElement | null,
  ): Promise<void> {
    const data = new FormData(form);
    const username = (data.get('username') as string).trim();
    const password = (data.get('password') as string).trim();

    if (!username || !password) {
      if (errorEl) errorEl.textContent = this.messages.emptyFields;
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    if (errorEl) errorEl.textContent = '';

    try {
      await this.auth.login({ username, password });
      this.onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : this.messages.genericError;
      if (errorEl) errorEl.textContent = msg;
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }
}
