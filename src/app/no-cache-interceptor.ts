import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

/**
 * Interceptor que deshabilita el caché HTTP para todas las peticiones a la API del backend.
 * 
 * Sin esto, Angular SSR (Transfer State) puede cachear respuestas del servidor
 * y reutilizarlas en navegaciones SPA, causando que los componentes muestren
 * datos vacíos o desactualizados sin recargar la página.
 */
@Injectable()
export class NoCacheInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Solo aplica a peticiones hacia nuestra API del backend
    if (req.url.startsWith(environment.BASE_HOST)) {
      const noCacheReq = req.clone({
        setHeaders: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      return next.handle(noCacheReq);
    }
    return next.handle(req);
  }
}
