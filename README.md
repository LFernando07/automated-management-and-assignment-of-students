# 📚 Student Project Assignment — Frontend

> Aplicación web Angular para la gestión y asignación automática de proyectos a estudiantes basada en rendimiento académico y preferencias.

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Scripts Disponibles](#scripts-disponibles)
- [Variables de Entorno](#variables-de-entorno)
- [Componentes](#componentes)
- [Servicios](#servicios)
- [Rutas](#rutas)
- [Decisiones Técnicas](#decisiones-técnicas)

---

## Descripción

**Student Project Assignment** es el frontend de una plataforma que permite:

- Gestionar un catálogo de **estudiantes** con su promedio académico.
- Gestionar un catálogo de **proyectos** disponibles.
- **Asignar proyectos** a estudiantes de forma manual o automática.
- Visualizar los **resultados de asignación** generados por el backend.
- Configurar el **máximo de proyectos** que puede tener un estudiante.

Se comunica con un backend Spring Boot a través de una API REST.

---

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| **Angular** | 21.2.x | Framework principal (SSR habilitado) |
| **Angular SSR** | 21.2.x | Server-Side Rendering con Express |
| **Angular Router** | 21.2.x | Navegación SPA |
| **Angular Forms** | 21.2.x | Formularios con `ngModel` |
| **RxJS** | 7.8.x | Programación reactiva / HTTP |
| **TailwindCSS** | 4.x | Utilidades CSS base |
| **TypeScript** | 5.9.x | Tipado estático |
| **Express** | 5.x | Servidor SSR en producción |
| **pnpm** | 11.x | Gestor de paquetes |

---

## Arquitectura

```
Browser (SPA)
     │
     │ HTTP requests (localhost:9090)
     ▼
Spring Boot Backend ←──── API REST ────► Base de Datos
     │
     │ SSR (server-side rendering)
     ▼
Angular Express Server (puerto 4000 en producción / 4200 en dev)
```

### Flujo de Renderizado

La aplicación utiliza **Angular SSR con hidratación**:

1. El servidor Express renderiza la página inicial del lado del servidor.
2. El HTML pre-renderizado se envía al cliente junto con el **Transfer State**.
3. Angular hidrata el DOM en el cliente y toma el control como SPA.
4. Las rutas con parámetros dinámicos (`:id`) usan `RenderMode.Client` para evitar pre-renderizado.

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── header/                  # Navbar sticky con glassmorphism
│   ├── student-list/            # Lista de estudiantes (tabla + config)
│   ├── student-form/            # Formulario crear / editar estudiante
│   ├── student-projects/        # Proyectos asignados a un estudiante
│   ├── project-list/            # Lista y creación de proyectos
│   ├── assignment/              # Resultados de asignación automática
│   ├── student-service.ts       # HTTP service para estudiantes
│   ├── project-service.ts       # HTTP service para proyectos
│   ├── no-cache-interceptor.ts  # Interceptor HTTP anti-caché SSR
│   ├── student.ts               # Modelo Student
│   ├── project.ts               # Modelo Project
│   ├── app-module.ts            # Módulo raíz
│   ├── app-routing-module.ts    # Configuración de rutas
│   └── app.routes.server.ts     # Configuración SSR por ruta
├── environments/
│   ├── environment.ts           # Producción
│   └── environment.development.ts # Desarrollo
├── styles.css                   # Sistema de diseño global
└── server.ts                    # Servidor Express para SSR
```

---

## Requisitos Previos

- **Node.js** >= 20
- **pnpm** >= 11 — `npm install -g pnpm`
- **Angular CLI** >= 21 — `npm install -g @angular/cli`
- **Backend Spring Boot** corriendo en `http://localhost:9090`

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd frontend-sockproject

# 2. Instalar dependencias
pnpm install

# 3. Iniciar servidor de desarrollo
pnpm start
```

Abre `http://localhost:4200` en el navegador.

---

## Scripts Disponibles

| Comando | Descripción |
|---|---|
| `pnpm start` | Servidor de desarrollo (`ng serve`) con SSR |
| `pnpm run build` | Build de producción (genera `dist/`) |
| `pnpm run watch` | Build en modo watch (desarrollo) |
| `pnpm run prod` | Servidor con configuración de producción |
| `pnpm test` | Ejecuta tests con Vitest |
| `pnpm run serve:ssr:frontend-sockproject` | Levanta el servidor SSR compilado |

---

## Variables de Entorno

Los entornos se configuran en `src/environments/`:

| Archivo | `BASE_HOST` | `PRODUCTION` |
|---|---|---|
| `environment.ts` | `http://localhost:9090` | `true` |
| `environment.development.ts` | `http://localhost:9090` | `false` |

Para apuntar a un backend diferente, edita el valor de `BASE_HOST` en el archivo correspondiente.

---

## Componentes

### `Header`
Navbar sticky con efecto **glassmorphism** y backdrop-blur. Incluye menú responsive para móviles.

- **Selector:** `app-header`
- **Rutas:** Links a `/students`, `/projects`, `/assignment`

---

### `StudentList`
Vista principal de gestión de estudiantes.

- **Ruta:** `/students`
- **Funciones:**
  - Listar todos los estudiantes con promedio con badge de color (🟢 ≥9 / 🟡 ≥7 / 🔴 <7)
  - Eliminar estudiante
  - Navegar a editar estudiante
  - Navegar a proyectos del estudiante
  - Configurar el máximo de proyectos por estudiante
- **Refresco automático:** Se suscribe a `NavigationEnd` del Router para recargar la lista al volver de cualquier subruta.

---

### `StudentForm`
Formulario unificado para **crear** y **editar** estudiantes.

- **Rutas:** `/students/addstudent` | `/students/updatestudent/:id`
- **Funciones:**
  - Crear nuevo estudiante (POST)
  - Editar estudiante existente (PUT)
  - Validación de promedio (0–10)
  - Redirige a `/students` al guardar
- **Nota técnica:** Usa `ActivatedRoute.paramMap` observable (no `snapshot`) para detectar cambios de `:id` reactivamente.

---

### `StudentProjects`
Gestión de proyectos asignados a un estudiante específico.

- **Ruta:** `/students/:id/projects`
- **Funciones:**
  - Ver proyectos asignados al estudiante
  - Asignar un proyecto disponible (POST)
  - Eliminar un proyecto asignado (DELETE)
- **Nota técnica:** Usa `ActivatedRoute.params` observable para detectar navegación entre distintos estudiantes.

---

### `ProjectList`
Vista de gestión del catálogo de proyectos.

- **Ruta:** `/projects`
- **Funciones:**
  - Listar todos los proyectos
  - Crear nuevo proyecto (inline form)
  - Eliminar proyecto

---

### `Assignment`
Resultados de la asignación automática de proyectos a estudiantes.

- **Ruta:** `/assignment`
- **Funciones:**
  - Mostrar tabla Student → Proyecto asignado
  - Se refresca automáticamente al navegar a la vista

---

## Servicios

### `StudentService`
Encapsula todas las llamadas HTTP al endpoint `/students/` del backend.

| Método | HTTP | Endpoint | Descripción |
|---|---|---|---|
| `getAllStudents()` | GET | `/students/` | Lista todos los estudiantes |
| `getStudentById(id)` | GET | `/students/{id}` | Obtiene un estudiante por ID |
| `createStudent(student)` | POST | `/students/` | Crea un nuevo estudiante |
| `updateStudent(id, student)` | PUT | `/students/{id}` | Actualiza un estudiante |
| `deleteStudent(id)` | DELETE | `/students/{id}` | Elimina un estudiante |
| `getAvailableStudentProjects(studentId)` | GET | `/students/{id}/available-projects` | Proyectos disponibles para asignar |
| `addProjectToStudent(studentId, projectId)` | POST | `/students/{id}/projects/{pid}` | Asigna un proyecto |
| `deleteProjectFromStudent(studentId, projectId)` | DELETE | `/students/{id}/projects/{pid}` | Desasigna un proyecto |
| `getMaxProjectsPerStudents()` | GET | `/students/max-projects` | Obtiene el límite de proyectos |
| `updateMaxProjectsPerStudents(val)` | PUT | `/students/max-projects` | Actualiza el límite |
| `getStudentAssignment()` | GET | `/students/assignment` | Resultados de asignación |

### `ProjectService`
Encapsula todas las llamadas HTTP al endpoint `/projects/` del backend.

| Método | HTTP | Endpoint | Descripción |
|---|---|---|---|
| `getAllProjects()` | GET | `/projects/` | Lista todos los proyectos |
| `createProject(project)` | POST | `/projects/` | Crea un proyecto |
| `deleteProject(id)` | DELETE | `/projects/{id}` | Elimina un proyecto |

---

## Rutas

| Path | Componente | Render Mode |
|---|---|---|
| `/` | → redirect a `/students` | — |
| `/students` | `StudentList` | Prerender |
| `/students/addstudent` | `StudentForm` | Prerender |
| `/students/updatestudent/:id` | `StudentForm` | **Client** |
| `/students/:id/projects` | `StudentProjects` | **Client** |
| `/projects` | `ProjectList` | Prerender |
| `/assignment` | `Assignment` | Prerender |

> Las rutas con parámetros dinámicos (`:id`) usan `RenderMode.Client` porque el servidor no conoce los IDs en tiempo de build.

---

## Decisiones Técnicas

### `NoCacheInterceptor`
Se implementó un interceptor HTTP (`no-cache-interceptor.ts`) que añade headers `Cache-Control: no-cache` a todas las peticiones al backend. Esto evita que el **Angular SSR Transfer State** reutilice respuestas cacheadas del servidor en navegaciones SPA, lo que causaba que los componentes mostrasen datos vacíos sin recargar la página.

### `ChangeDetectorRef.detectChanges()`
Todos los componentes inyectan `ChangeDetectorRef` y llaman `.detectChanges()` después de cada asignación de datos HTTP. Esto resuelve el error `NG0100: ExpressionChangedAfterItHasBeenCheckedError` que ocurre cuando Angular SSR hidrata el DOM y un Observable HTTP modifica el estado **después** del ciclo inicial de verificación de cambios.

### Reactive Params vs Snapshot
Los componentes `StudentForm` y `StudentProjects` usan `ActivatedRoute.params` y `ActivatedRoute.paramMap` como Observables en lugar de `snapshot`. Esto garantiza que el componente reaccione correctamente si Angular reutiliza la instancia del componente al navegar entre rutas con distintos parámetros.

### NavigationEnd Subscription
`StudentList`, `ProjectList` y `Assignment` se suscriben al evento `NavigationEnd` del Router en su constructor. Esto asegura que los datos se recarguen siempre que el usuario regrese a esas vistas desde cualquier subruta, sin depender exclusivamente de `ngOnInit`.

---

## Recursos

- [Angular Documentation](https://angular.dev)
- [Angular SSR Guide](https://angular.dev/guide/ssr)
- [RxJS Documentation](https://rxjs.dev)
- [Spring Boot Backend](https://github.com/smoothcoode/Student_Project_Assignment)
