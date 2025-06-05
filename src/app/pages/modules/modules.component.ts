import { Component, computed, inject, signal } from '@angular/core';
import moduleDefinitions from "../../models/modules.json";
import { LucideAngularModule } from 'lucide-angular';
import { DialogService } from '../../services/dialog.service';
import { ModuleDefinition } from '../../util/types';
import { PersonalizationService } from '../../services/personalization.service';

@Component({
  selector: 'app-modules',
  imports: [LucideAngularModule],
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.css'
})
export class ModulesComponent {
  private dialog = inject(DialogService);
  private personalization = inject(PersonalizationService);

  modules = computed(() => Object.groupBy(moduleDefinitions, ({ type }) => type));
  moduleGroups: { key: "core" | "extension" | "additional" | "blockweek", name: string }[] = [
    { name: 'Kern-Module', key: 'core' },
    { name: 'Erweiterungs-Module', key: 'extension' },
    { name: 'Zusatz-Module', key: 'additional' },
    { name: 'Blockwochen', key: 'blockweek' }
  ]
  modulesOpen = signal({
    core: true,
    extension: true,
    additional: true,
    blockweek: true
  });

  toggleModuleGroup(group: "core" | "extension" | "additional" | "blockweek") {
    this.modulesOpen.update(open => ({ ...open, [group]: !open[group] }));
  }

  openModule(module: ModuleDefinition) {
    this.dialog.openDialog(module);
  }

  isCredited(module: ModuleDefinition): boolean {
    const personalization = this.personalization.getModulePersonalization(module.code);
    return personalization?.credited ?? false;
  }

  isDone(module: ModuleDefinition): boolean {
    const personalization = this.personalization.getModulePersonalization(module.code);
    return personalization?.done ?? false;
  }

  isInterested(module: ModuleDefinition): boolean {
    const personalization = this.personalization.getModulePersonalization(module.code);
    return personalization?.interested ?? false;
  }
}