import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import { icons } from './util/icons';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), {
    provide: LUCIDE_ICONS,
    multi: true,
    useValue: new LucideIconProvider(icons)
  }]
};
