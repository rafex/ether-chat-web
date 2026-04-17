import '@/styles/main.scss';
import { Router } from '@/router';
import { StorageService } from '@/services/storage.service';
import { ConfigService } from '@/services/config.service';
import { SessionStore } from '@/stores/session.store';
import { AuthService } from '@/services/auth.service';
import { RestTransport } from '@/transports/rest.transport';
import { ChatService } from '@/services/chat.service';
import { loginRoute } from '@/routes/login.route';
import { chatRoute } from '@/routes/chat.route';

function bootstrap(): void {
  const app = document.getElementById('app');
  if (!app) throw new Error('Root element #app not found');

  // Shared infrastructure
  const storage = new StorageService();
  const configService = new ConfigService(storage);
  const config = configService.get();
  const configStore = configService.getStore();

  const sessionStore = new SessionStore(storage);

  const auth = new AuthService(
    { baseUrl: config.backendUrl, authEndpoint: config.authEndpoint },
    sessionStore,
  );

  // Check for JWT in URL hash or query params (e.g. ?token=xxx)
  const params = new URLSearchParams(window.location.search);
  const jwtParam = params.get('token');
  if (jwtParam) {
    auth.setJwt(jwtParam);
    // Remove token from URL to avoid leaking it in history
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    window.history.replaceState(null, '', url.toString());
  }

  const transport = new RestTransport({
    baseUrl: config.backendUrl,
    chatEndpoint: config.chatEndpoint,
  });

  const chatService = new ChatService(transport, auth);

  // requireAuth se lee directo del env, nunca del store (evita override via localStorage)
  const requireAuth = import.meta.env.VITE_AUTH_REQUIRED !== 'false';
  const router = new Router(app);
  loginRoute(router, auth, requireAuth);
  chatRoute(router, chatService, configStore, auth, requireAuth);
  router.register('*', () => router.navigate('/'));

  router.start();
}

bootstrap();
