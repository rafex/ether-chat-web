type RouteHandler = () => void;

export class Router {
  private readonly routes = new Map<string, RouteHandler>();
  private readonly outlet: HTMLElement;

  constructor(outlet: HTMLElement) {
    this.outlet = outlet;
  }

  register(path: string, handler: RouteHandler): this {
    this.routes.set(path, handler);
    return this;
  }

  start(): void {
    window.addEventListener('hashchange', () => this.handle());
    this.handle();
  }

  navigate(path: string): void {
    window.location.hash = path;
  }

  clearOutlet(): void {
    this.outlet.innerHTML = '';
  }

  getOutlet(): HTMLElement {
    return this.outlet;
  }

  private handle(): void {
    const hash = window.location.hash.slice(1) || '/';
    const handler = this.routes.get(hash) ?? this.routes.get('*');
    if (handler) {
      handler();
    }
  }
}
