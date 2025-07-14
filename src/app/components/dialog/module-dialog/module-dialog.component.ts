import { Component, computed, inject } from '@angular/core';
import { StateService } from '../../../services/state.service';
import { genericModules, moduleGroups } from '../../../util/modules';
import { ModuleService } from '../../../services/module.service';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { PersonalizationService } from '../../../services/personalization.service';
import { DialogService } from '../../../services/dialog.service';
import { ModulePersonalization } from '../../../util/types';
import { LanguagePipe } from '../../../pipes/language.pipe';
import { SemesterPipe } from '../../../pipes/semester.pipe';

@Component({
  selector: 'app-module-dialog',
  imports: [LucideAngularModule, FormsModule, LanguagePipe, SemesterPipe],
  templateUrl: './module-dialog.component.html'
})
export class ModuleDialogComponent {
  private personalization = inject(PersonalizationService);

  state = inject(StateService);
  dialog = inject(DialogService);
  modules = inject(ModuleService);
  moduleGroups = moduleGroups;


  resolvedModules = computed(() => {
    const module = this.state.dialogData()?.module
    const allModules = [...(this.modules.modules() ?? []), ...genericModules];
    return {
      current: allModules.find(m => m.code === module?.current),
      template: allModules.find(m => m.code === module?.template),
    }
  });

  modulePersonalization = computed(() => {
    const module = this.state.dialogData()?.module;
    if (!module) return undefined;
    return this.personalization.getModulePersonalization(module.current);
  });

  customModuleCode = computed(() => {
    const semesterIndex = this.state.dialogData()?.semesterIndex;
    const moduleIndex = this.state.dialogData()?.moduleIndex;
    if (semesterIndex === undefined || moduleIndex === undefined) return undefined;

    const module = this.personalization.getModuleBySemesterAndIndex(semesterIndex, moduleIndex);
    return module?.template ? module?.code : undefined;
  });

  updatePersonalization(key: keyof ModulePersonalization, value: any) {
    const module = this.state.dialogData()?.module;
    if (!module) return;
    this.personalization.setModulePersonalization(module.current, {
      [key]: value
    });
  }

  updateModuleText(code: string) {
    const module = this.state.dialogData()?.module;
    const semester = this.state.dialogData()?.semesterIndex;
    const moduleIndex = this.state.dialogData()?.moduleIndex;

    if (!module || semester === undefined || moduleIndex === undefined) {
      return;
    }

    this.personalization.updateModuleInPlan(semester, moduleIndex, code);
  }

  resetModuleAssignment() {
    const semesterIndex = this.state.dialogData()?.semesterIndex;
    const moduleIndex = this.state.dialogData()?.moduleIndex;
    if (semesterIndex === undefined || moduleIndex === undefined) return;

    this.personalization.resetModuleInPlan(semesterIndex, moduleIndex);
    this.dialog.closeDialog();
  }
}
