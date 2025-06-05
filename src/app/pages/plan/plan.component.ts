import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { moduleMap, plans } from '../../models/moduleplans';
import { degreeProgram, ModuleDefinition } from '../../util/types';
import { PersonalizationService } from '../../services/personalization.service';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-plan',
  imports: [LucideAngularModule, FormsModule],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.css'
})
export class PlanComponent {
  private personalization = inject(PersonalizationService);
  private dialog = inject(DialogService);

  public selectedDegreeProgram = signal<degreeProgram>(this.personalization.getDegreeProgram());
  public selectedModulePlan = computed(() => plans[this.selectedDegreeProgram()]);

  constructor() {
    effect(() => { this.personalization.setDegreeProgram(this.selectedDegreeProgram()); });
  }

  asModules(codes: string[]): (ModuleDefinition | undefined)[] {
    return codes.map(value => moduleMap.get(value));
  }

  public getModuleStyling(module: ModuleDefinition) {
    const colorClasses = {
      core: "bg-cyan-700",
      project: "bg-orange-700",
      elective: "bg-green-700",
      major: "bg-green-600",
      work: "bg-purple-700",
    };

    return [
      ["col-span-1", "col-span-2", "col-span-3", "col-span-4"][Math.floor(module.credits / 3) - 1],
      colorClasses[module.type as keyof typeof colorClasses] ?? "bg-zinc-700",
    ]
  }

  isCredited(module: ModuleDefinition): boolean {
    const personalization = this.personalization.getModulePersonalization(module.code);
    return personalization?.credited ?? false;
  }

  isDone(module: ModuleDefinition): boolean {
    const personalization = this.personalization.getModulePersonalization(module.code);
    return personalization?.done ?? false;
  }

  selectModule(module: ModuleDefinition | undefined, semesterIndex: number | undefined, moduleIndex: number | undefined) {
    if (!module) { return; }

    this.dialog.openDialog(module, semesterIndex, moduleIndex);
  }

  resolveModule(module: ModuleDefinition, semesterIndex: number, moduleIndex: number) {
    if (!module.isGenericModule) {
      return { code: module.code, isPersonalized: false };
    }
    const personalization = this.personalization.getModulePlanPersonalization(this.personalization.getDegreeProgram(), semesterIndex, moduleIndex);
    if (!personalization) {
      return { code: module.code, isPersonalized: false };
    }
    return { code: personalization.linkedModule, isPersonalized: true };
  }
}