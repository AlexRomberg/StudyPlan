import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ModuleDefinition, ModuleGroup } from '../../util/types';
import { StateService } from '../../services/state.service';
import { DialogService } from '../../services/dialog.service';
import { FormsModule } from '@angular/forms';
import { moduleGroups } from '../../util/modules';
import { ModuleService } from '../../services/module.service';
import { PersonalizationService } from '../../services/personalization.service';

@Component({
  selector: 'app-modules',
  imports: [LucideAngularModule, FormsModule],
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.css'
})
export class ModulesComponent {
  private dialog = inject(DialogService);
  state = inject(StateService);
  modules = inject(ModuleService);
  personalization = inject(PersonalizationService);

  moduleGroups = moduleGroups;
  modulesOpen = signal<{ [key in keyof ModuleGroup]: boolean }>({
    core: true,
    project: true,
    extension: false,
    additional: false,
    blockweek: false
  });

  loadModules() {
    this.modules.reload();
  }

  openModule(module: ModuleDefinition) {
    this.dialog.openDialog({ current: module.code });
  }

  toggleModuleGroup(group: keyof ModuleGroup) {
    this.modulesOpen.update(open => ({ ...open, [group]: !open[group] }));
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