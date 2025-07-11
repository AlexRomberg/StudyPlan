import { effect, Injectable, signal } from '@angular/core';
import { ModulePersonalization } from '../util/types';

@Injectable({
  providedIn: 'root'
})
export class PersonalizationService {
  private modulePersonalizations;
  private personalModulePlan;

  constructor() {
    this.modulePersonalizations = signal(
      this.tryLoadLocalStorage<ModulePersonalization[]>("module-personalizations", [])
    );
    this.personalModulePlan = signal(
      this.tryLoadLocalStorage<{ plan: ({ code: string, template?: string } | null)[][], degreeProgram: string } | undefined>("personal-module-plan", undefined)
    );

    effect(() => {
      localStorage.setItem('module-personalizations', JSON.stringify(this.modulePersonalizations()));
    });
    effect(() => {
      localStorage.setItem('personal-module-plan', JSON.stringify(this.personalModulePlan()));
    });
  }

  private tryLoadLocalStorage<T>(name: string, defaultValue: T): T {
    const storedData = localStorage.getItem(name);
    if (storedData && storedData !== 'undefined') {
      try {
        return JSON.parse(storedData);
      } catch (e) {
        console.error(`Failed to parse ${name}:`, e);
      }
    }
    return defaultValue;
  }

  getModulePersonalization(code: string): ModulePersonalization {
    return this.modulePersonalizations().find(p => p.code === code) ?? {
      code, notes: '', credited: false, done: false, interested: false
    };
  }

  setModulePersonalization(code: string, personalization: Partial<ModulePersonalization>) {
    const currentPersonalization = this.getModulePersonalization(code);

    this.modulePersonalizations.update(personalizations => [
      ...(personalizations.filter(p => p.code !== code)),
      { ...currentPersonalization, ...personalization }
    ]);
  }

  get modulePlan() {
    return this.personalModulePlan.asReadonly();
  }

  getModuleBySemesterAndIndex(semesterIndex: number, moduleIndex: number): { code: string, template?: string } | null {
    const currentPlan = this.personalModulePlan();
    if (!currentPlan || !currentPlan.plan[semesterIndex]) return null;

    return currentPlan.plan[semesterIndex][moduleIndex];
  }

  setModulePlan(plan: ({ code: string, template?: string } | null)[][], degreeProgram: string) {
    this.personalModulePlan.set({ plan, degreeProgram });
  }

  updateModuleInPlan(semesterIndex: number, moduleIndex: number, code: string) {
    const currentPlan = this.personalModulePlan();
    if (!currentPlan) return;

    let currentModule = currentPlan.plan[semesterIndex]?.[moduleIndex];
    if (currentModule) {
      if (!currentModule.template) {
        currentModule.template = currentModule.code;
      }
      currentModule.code = code;
    } else {
      currentModule = { code, template: undefined };
    }

    const updatedPlan = currentPlan.plan.map((semester, sIndex) =>
      sIndex === semesterIndex
        ? semester.map((mod, mIndex) => (mIndex === moduleIndex ? currentModule : mod))
        : semester
    );

    this.personalModulePlan.set({
      degreeProgram: currentPlan.degreeProgram,
      plan: updatedPlan
    });
  }

  resetModuleInPlan(semesterIndex: number, moduleIndex: number) {
    const currentPlan = this.personalModulePlan();
    if (!currentPlan) return;

    const resetModule = {
      code: currentPlan.plan[semesterIndex]?.[moduleIndex]?.template ?? '',
      template: undefined
    }

    const updatedPlan = currentPlan.plan.map((semester, sIndex) =>
      sIndex === semesterIndex
        ? semester.map((mod, mIndex) => (mIndex === moduleIndex ? resetModule : mod))
        : semester
    );

    this.personalModulePlan.set({
      degreeProgram: currentPlan.degreeProgram,
      plan: updatedPlan
    });
  }

  resetModulePlan() {
    this.personalModulePlan.set(undefined);
  }
}
