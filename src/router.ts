export type Handler = (req: Request, params?: Record<string, string>) => Response | Promise<Response>;

interface Route {
  method: string;
  path: string;
  handler: Handler;
}

export class Router {
  private routes: Route[] = [];

  get(path: string, handler: Handler) {
    return this.add('GET', path, handler);
  }

  post(path: string, handler: Handler) {
    return this.add('POST', path, handler);
  }

  put(path: string, handler: Handler) {
    return this.add('PUT', path, handler);
  }

  delete(path: string, handler: Handler) {
    return this.add('DELETE', path, handler);
  }

  patch(path: string, handler: Handler) {
    return this.add('PATCH', path, handler);
  }

  private add(method: string, path: string, handler: Handler) {
    this.routes.push({
      method,
      path,
      handler,
    });
    return this;
  }

  match(req: Request) {
    const url = new URL(req.url);
    const pathname = url.pathname;
    
    for (const route of this.routes) {
      if (route.method !== req.method) continue;
      
      if (route.path.includes(':')) {
        const pattern = route.path.replace(/:(\w+)/g, '(?<$1>[^/]+)');
        const regex = new RegExp(`^${pattern}$`);
        const match = pathname.match(regex);
        
        if (match) {
          const params: Record<string, string> = {};
          if (match.groups) {
            Object.assign(params, match.groups);
          }
          return { handler: route.handler, params };
        }
      } else if (route.path === pathname) {
        return { handler: route.handler, params: {} };
      }
    }
    return null;
  }

  all() {
    return this.routes;
  }
}
