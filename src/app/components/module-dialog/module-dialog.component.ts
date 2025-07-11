import { Component, computed, effect, inject, model, signal } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { Currency, LucideAngularModule } from 'lucide-angular';
import { PersonalizationService } from '../../services/personalization.service';
import { FormsModule } from '@angular/forms';
import { ModulePersonalization } from '../../util/types';
import { StateService } from '../../services/state.service';
import { SemesterPipe } from '../../pipes/semester.pipe';
import { LanguagePipe } from '../../pipes/language.pipe';
import { ModuleService } from '../../services/module.service';
import { genericModules, moduleGroups } from '../../util/modules';


@Component({
  selector: 'app-module-dialog',
  imports: [LucideAngularModule, FormsModule, LanguagePipe, SemesterPipe],
  templateUrl: './module-dialog.component.html',
  styleUrl: './module-dialog.component.css'
})
export class ModuleDialogComponent {
  state = inject(StateService);
  dialog = inject(DialogService);
  personalization = inject(PersonalizationService);
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
