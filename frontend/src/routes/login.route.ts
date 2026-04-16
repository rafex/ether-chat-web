import type { Router } from '@/router';
import type { AuthService } from '@/services/auth.service';
import { LoginForm } from '@/components/LoginForm';

export function loginRoute(router: Router, auth: AuthService): void {
  router.register('/', () => {
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
