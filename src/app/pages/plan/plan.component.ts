import { Component, computed, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { moduleMap, plans } from '../../models/moduleplans';
import { degreeProgram, ModuleDefinition } from '../../util/types';

@Component({
  selector: 'app-plan',
  imports: [LucideAngularModule, FormsModule],
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.css'
})
export class PlanComponent {
  public selectedDegreeProgram = signal<degreeProgram>("I-VZ");
  public selectedModulePlan = computed(() => plans[this.selectedDegreeProgram()]);
  public selectedModule = signal<ModuleDefinition | undefined>(undefined);

  asModules(codes: string[]): (ModuleDefinition | undefined)[] {
    return codes.map(value => moduleMap.get(value));
  }

  public getMouleStyling(module: ModuleDefinition) {
    const colorClasses = {
      core: "bg-cyan-700",
      project: "bg-orange-700",
      elective: "bg-green-700",
      major: "bg-green-600",
    };

    return [
      ["col-span-1", "col-span-2", "col-span-3", "col-span-4"][Math.floor(module.credits / 3) - 1],
      colorClasses[module.type as keyof typeof colorClasses] ?? "bg-gray-600",
    ]
  }

  selectModule(module: ModuleDefinition | undefined) {
    this.selectedModule.set(module);
  }
}