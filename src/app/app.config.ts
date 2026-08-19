import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),

    providePrimeNG({
      ripple: true,

      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'system'
        }
      }
    })
  ]
};