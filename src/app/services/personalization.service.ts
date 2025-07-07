import { effect, Injectable, signal } from '@angular/core';
import { ModulePersonalization, ModulePlanPersonalization } from '../util/types';

@Injectable({
  providedIn: 'root'
})
export class PersonalizationService {
  private modulePersonalizations;

  constructor() {
    const personalizations = this.tryLoadModulePersonalizations();
    this.modulePersonalizations = signal<ModulePersonalization[]>(personalizations);

    effect(() => {
      localStorage.setItem('module-personalizations', JSON.stringify(this.modulePersonalizations()));
    });
  }

  private tryLoadModulePersonalizations(): ModulePersonalization[] {
    const storedPersonalizations = localStorage.getItem('module-personalizations');
    if (storedPersonalizations) {
      try {
        return JSON.parse(storedPersonalizations);
      } catch (e) {
        console.error('Failed to parse module personalizations:', e);
      }
    }
    return [];
  }

  getModulePersonalization(code: string): ModulePersonalization {
    return this.modulePersonalizations().find(p => p.code === code) ?? {
      code, notes: '', credited: false, done: false, interested: false
    };
  }

  setModulePersonalization(code: string, personalization: Partial<ModulePersonalization>): void {
    const currentPersonalization = this.getModulePersonalization(code);

    this.modulePersonalizations.update(personalizations => [
      ...(personalizations.filter(p => p.code !== code)),
      { ...currentPersonalization, ...personalization }
    ]);
  }
}
