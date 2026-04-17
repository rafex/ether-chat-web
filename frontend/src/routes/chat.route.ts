import type { Router } from '@/router';
import type { ChatService } from '@/services/chat.service';
import type { ConfigStore } from '@/stores/config.store';
import type { AuthService } from '@/services/auth.service';
import { ChatWidget } from '@/components/ChatWidget';

export function chatRoute(
  router: Router,
  chatService: ChatService,
  configStore: ConfigStore,
  auth: AuthService,
  requireAuth: boolean,
): void {
  let widget: ChatWidget | null = null;

  router.register('/chat', () => {
    if (requireAuth && !auth.isAuthenticated()) {
      router.navigate('/');
      return;
    }

    router.clearOutlet();
    widget?.destroy();

    widget = new ChatWidget(chatService, configStore);
    const mode = configStore.get().mode;

    if (mode === 'embedded') {
      widget.mount(router.getOutlet());
    } else if (mode === 'fullscreen') {
      widget.mount(document.body);
    } else {
      // floating (default)
      widget.mount(document.body);
      widget.getElement().addEventListener('widget-close', () => {
        widget?.destroy();
        widget = null;
      });
      renderFloatingToggle(router.getOutlet(), widget, configStore.get().position);
    }
  });
}

function renderFloatingToggle(
  outlet: HTMLElement,
  widget: ChatWidget,
  position: string,
): void {
  const btn = document.createElement('button');
  btn.className = `chat-toggle chat-toggle--${position}`;
  btn.setAttribute('aria-label', 'Abrir chat');
  btn.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>`;
  outlet.appendChild(btn);

  btn.addEventListener('click', () => {
    widget.getElement().removeAttribute('aria-hidden');
    btn.style.display = 'none';
  });

  widget.getElement().addEventListener('widget-close', () => {
    widget.getElement().setAttribute('aria-hidden', 'true');
    btn.style.display = '';
  });
}
