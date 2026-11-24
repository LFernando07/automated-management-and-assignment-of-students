import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Rutas con parámetros dinámicos: no se pueden pre-renderizar en build time
  // porque el servidor no conoce los IDs en ese momento
  {
    path: 'students/updatestudent/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'students/:id/projects',
    renderMode: RenderMode.Client
  },
  // Resto de rutas estáticas: se pre-renderizan normalmente
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
