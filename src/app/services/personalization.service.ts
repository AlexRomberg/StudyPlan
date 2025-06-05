import { Injectable } from '@angular/core';
import { degreeProgram, ModulePersonalization, ModulePlanPersonalization } from '../util/types';

@Injectable({
  providedIn: 'root'
})
export class PersonalizationService {

  constructor() { }

  getDegreeProgram(): degreeProgram {
    return (localStorage.getItem("degreeProgram") as degreeProgram) ?? "I-VZ";
  }

  setDegreeProgram(degreeProgram: degreeProgram) {
    localStorage.setItem("degreeProgram", degreeProgram);
  }

  getModulePersonalizations(): ModulePersonalization[] {
    const personalization = localStorage.getItem(`modulePersonalization`);
    if (personalization) {
      return JSON.parse(personalization) as ModulePersonalization[];
    }
    return [];
  }

  getModulePersonalization(moduleCode: string): ModulePersonalization | undefined {
    return this.getModulePersonalizations().find(m => m.code === moduleCode);
  }

  setModulePersonalization(moduleCode: string, personalization: Partial<ModulePersonalization>) {
    const personalizations = this.getModulePersonalizations();
    const existingPersonalization = personalizations.find(m => m.code === moduleCode) || { code: moduleCode, notes: '', credited: false };
    const newPersonalization = {
      ...existingPersonalization,
      ...personalization,
      code: moduleCode
    };

    const newPersonalizations = [
      ...personalizations.filter(m => m.code !== moduleCode),
      newPersonalization
    ];
    localStorage.setItem(`modulePersonalization`, JSON.stringify(newPersonalizations));
  }

  getModulePlanPersonalizations(degreeProgram: degreeProgram) {
    const personalization = localStorage.getItem(`modulePlanPersonalization`);
    if (personalization) {
      const modulePlan = (JSON.parse(personalization) as ModulePlanPersonalization)
      return modulePlan[degreeProgram] ?? [];
    }
    return [];
  }

  getModulePlanPersonalization(degreeProgram: degreeProgram, semesterIndex: number, moduleIndex: number) {
    return this.getModulePlanPersonalizations(degreeProgram).find(c => c.semesterIndex === semesterIndex && c.moduleIndex === moduleIndex);
  }

  setModulePlanPersonalization(degreeProgram: degreeProgram, semesterIndex: number, moduleIndex: number, linkedModule: string) {
    const personalization = localStorage.getItem(`modulePlanPersonalization`) ?? "{}";
    const modulePlan = (JSON.parse(personalization) as ModulePlanPersonalization)
    const filteredModulPlan = (modulePlan[degreeProgram] ?? []).filter(p => !(p.semesterIndex === semesterIndex && p.moduleIndex === moduleIndex));
    modulePlan[degreeProgram] = [...filteredModulPlan, ...(linkedModule ? [{ semesterIndex, moduleIndex, linkedModule }] : [])];
    localStorage.setItem("modulePlanPersonalization", JSON.stringify(modulePlan));
  }
}
