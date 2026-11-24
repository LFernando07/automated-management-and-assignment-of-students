import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Header } from './header/header';
import { ProjectList } from './project-list/project-list';
import { StudentList } from './student-list/student-list';
import { StudentForm } from './student-form/student-form';
import { StudentProjects } from './student-projects/student-projects';
import { Assignment } from './assignment/assignment';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { NoCacheInterceptor } from './no-cache-interceptor';

@NgModule({
  declarations: [App, Header, ProjectList, StudentList, StudentForm, StudentProjects, Assignment],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    // withFetch: usa la Fetch API en cliente y servidor
    // withInterceptorsFromDi: habilita los interceptores registrados con HTTP_INTERCEPTORS
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    // Interceptor que añade headers Cache-Control a peticiones de la API
    // Evita que Angular SSR Transfer State reutilice respuestas cacheadas en navegaciones SPA
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NoCacheInterceptor,
      multi: true
    }
  ],
  bootstrap: [App],
})
export class AppModule { }
