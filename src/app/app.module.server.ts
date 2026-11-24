import { NgModule } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { App } from './app';
import { AppModule } from './app-module';
import { serverRoutes } from './app.routes.server';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';

@NgModule({
  imports: [AppModule, FormsModule],
  providers: [
    provideHttpClient(withFetch()),
    provideServerRendering(withRoutes(serverRoutes))],
  bootstrap: [App],
})
export class AppServerModule { }
