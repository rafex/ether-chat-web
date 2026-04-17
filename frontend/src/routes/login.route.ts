import type { Router } from '@/router';
import type { AuthService } from '@/services/auth.service';
import { LoginForm } from '@/components/LoginForm';

export function loginRoute(router: Router, auth: AuthService, requireAuth: boolean): void {
  router.register('/', () => {
    // Si auth no es requerida, ir directo al chat
    if (!requireAuth) {
      router.navigate('/chat');
      return;
    }

    if (auth.isAuthenticated()) {
      router.navigate('/chat');
      return;
    }

    router.clearOutlet();
    const form = new LoginForm(auth);
    form.setSuccessHandler(() => router.navigate('/chat'));
    router.getOutlet().appendChild(form.getElement());
  });
}
