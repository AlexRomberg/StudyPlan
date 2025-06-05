import { Component, computed, inject } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { LucideAngularModule } from 'lucide-angular';
import { PersonalizationService } from '../../services/personalization.service';
import { FormsModule } from '@angular/forms';
import { ModulePersonalization, ModulePlanPersonalizationItem } from '../../util/types';
import { moduleMap } from '../../models/moduleplans';

@Component({
  selector: 'app-module-dialog',
  imports: [LucideAngularModule, FormsModule],
  templateUrl: './module-dialog.component.html',
  styleUrl: './module-dialog.component.css'
})
export class ModuleDialogComponent {
  dialog = inject(DialogService);
  personalization = inject(PersonalizationService);

  personalizationData = computed<ModulePersonalization | null>(() => {
    const module = this.dialog.moduleDialogData()?.module;
    if (!module) return null;
    return this.personalization.getModulePersonalization(module.code) ?? {
      code: module.code,
      notes: '',
      credited: false,
      done: false,
      interested: false
    };
  });

  modulePlanPersonalizationData = computed<ModulePlanPersonalizationItem | undefined>(() => {
    const module = this.dialog.moduleDialogData()?.module;
    const semesterIndex = this.dialog.moduleDialogData()?.semesterIndex;
    const moduleIndex = this.dialog.moduleDialogData()?.moduleIndex;

    if (!module || semesterIndex === undefined || moduleIndex === undefined) return undefined;
    return this.personalization.getModulePlanPersonalization(this.personalization.getDegreeProgram(), semesterIndex, moduleIndex);
  });

  resolvedModule = computed(() => {
    const module = this.dialog.moduleDialogData()?.module;
    if (!module) {
      return undefined;
    }
    if (module.isGenericModule) {
      return this.getLinkedModule()
    }
    return module;
  });

  public updateNotes(notes: string) {
    const module = this.resolvedModule();
    if (!module) return;
    this.personalization.setModulePersonalization(module.code, {
      notes,
    });
  }

  public updateCredited(credited: boolean) {
    const module = this.resolvedModule();
    if (!module) return;
    this.personalization.setModulePersonalization(module.code, {
      credited
    });
  }

  public updateInterested(interested: boolean) {
    const module = this.resolvedModule();
    if (!module) return;
    this.personalization.setModulePersonalization(module.code, {
      interested
    });
  }

  public updateDone(done: boolean) {
    const module = this.resolvedModule();
    if (!module) return;
    this.personalization.setModulePersonalization(module.code, {
      done
    });
  }

  closeDialog() {
    this.dialog.moduleDialogData()?.resolve();
  }

  getLinkedModule() {
    const code = this.modulePlanPersonalizationData()?.linkedModule;
    if (!code) {
      return undefined
    }
    return moduleMap.get(code);
  }

  assignModule() {
    const module = prompt("Wie heisst das Modul?");
    const semesterIndex = this.dialog.moduleDialogData()?.semesterIndex;
    const moduleIndex = this.dialog.moduleDialogData()?.moduleIndex;

    if (module === null || semesterIndex === undefined || moduleIndex === undefined) return;
    this.personalization.setModulePlanPersonalization(this.personalization.getDegreeProgram(), semesterIndex, moduleIndex, module);
    this.closeDialog();
  }
}
