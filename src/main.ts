
/**
 * Fallo en el main entry point de la aplicación, no se puede arrancar la aplicación.
 * Pero con el zone.js se puede arrancar la aplicación.
 */
import 'zone.js'
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
