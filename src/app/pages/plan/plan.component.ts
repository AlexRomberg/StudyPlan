import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { PersonalizationService } from '../../services/personalization.service';
import { ModuleService } from '../../services/module.service';
import { ModuleDefinition } from '../../util/types';
import { DialogService } from '../../services/dialog.service';
import { StateService } from '../../services/state.service';
import { genericModules } from '../../util/modules';

@Component({
  selector: 'app-plan',
  imports: [LucideAngularModule, FormsModule],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.css'
})
export class PlanComponent {
  personalization = inject(PersonalizationService);
  modules = inject(ModuleService);
  dialog = inject(DialogService);
  state = inject(StateService);

  planningState = signal<"template" | "edit">("template");
  private colorClasses = {
    core: "bg-cyan-700",
    project: "bg-orange-700",
    elective: "bg-green-700",
    major: "bg-green-600",
    work: "bg-purple-700",
  };


  importModulePlan(modulePlan: (string)[], degreeProgram: string) {
    const plan = modulePlan.map(semester => (JSON.parse(semester) as (string | null)[]).map(module => module ? ({ code: module, template: undefined }) : null));
    this.personalization.setModulePlan(plan, degreeProgram);
  }

  public getModuleStyling(module: { current?: ModuleDefinition, template?: ModuleDefinition }) {
    if (!module.current) {
      return [];
    }

    let type = undefined;
    if (this.modules.isGenericModule(module.current)) {
      type = module.current.type;
    } else if (module.template && this.modules.isGenericModule(module.template)) {
      type = module.template.type;
    }

    type = type
      ?? this.modules.getModuleType(module.current, this.personalization.modulePlan()!.degreeProgram)
      ?? (module.template ? this.modules.getModuleType(module.template, this.personalization.modulePlan()!.degreeProgram) : undefined);

    return [
      ["col-span-1", "col-span-2", "col-span-3", "col-span-4"][Math.floor(module.current.credits / 3) - 1],
      this.colorClasses[type as keyof typeof this.colorClasses] ?? "bg-zinc-700",
    ]
  }

  getUnknownModuleStyling(moduleNames: { code: string; template?: string | undefined; } | null) {
    const genericModule = genericModules.find(m => m.code === moduleNames?.code || m.code === moduleNames?.template);
    if (!genericModule) {
      return ["bg-zinc-700"];
    }

    return [this.colorClasses[genericModule.type] ?? "bg-zinc-700"];
  }

  resetModulePlan() {
    if (!confirm("Bist du sicher, dass du den Modulplan zurücksetzen möchtest? Alle Änderungen gehen verloren.")) {
      return;
    }

    this.personalization.resetModulePlan();
    this.planningState.set("template");
  }

  isCredited(module: ModuleDefinition): boolean {
    const personalization = this.personalization.getModulePersonalization(module.code);
    return personalization?.credited ?? false;
  }

  isDone(module: ModuleDefinition): boolean {
    const personalization = this.personalization.getModulePersonalization(module.code);
    return personalization?.done ?? false;
  }

  resolveModule(module: { current?: ModuleDefinition, template?: ModuleDefinition }) {
    return { ...module.current ?? { code: 'Unbekannt' }, isPersonalized: Boolean(module.template) };
  }

  selectModule(module: { current?: ModuleDefinition, template?: ModuleDefinition }, semesterIndex: number | undefined, moduleIndex: number | undefined) {
    if (!module.current) { return; }

    this.dialog.openDialog({ current: module.current.code, template: module.template?.code }, semesterIndex, moduleIndex);
  }

  selectModuleTemplate(moduleNames: { code: string; template?: string | undefined; } | null, semesterIndex: number | undefined, moduleIndex: number | undefined) {
    if (!moduleNames) { return; }
    this.dialog.openDialog({ current: moduleNames.code, template: moduleNames.template }, semesterIndex, moduleIndex);
  }
}