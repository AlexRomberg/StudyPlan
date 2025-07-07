import { Component, computed, inject } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { LucideAngularModule } from 'lucide-angular';
import { PersonalizationService } from '../../services/personalization.service';
import { FormsModule } from '@angular/forms';
import { GenericModuleDefinition, ModuleDefinition, ModulePersonalization, ModulePlanPersonalizationItem } from '../../util/types';
import { StateService } from '../../services/state.service';
import { SemesterPipe } from '../../pipes/semester.pipe';
import { LanguagePipe } from '../../pipes/language.pipe';


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
  modulePersonalization = computed(() => {
    const module = this.state.dialogData()?.module;
    if (!module) return undefined;
    return this.personalization.getModulePersonalization(module.code);
  });

  isGenericModule(module: ModuleDefinition): module is GenericModuleDefinition {
    return 'isGenericModule' in module && module.isGenericModule === true;
  }

  updatePersonalization(key: keyof ModulePersonalization, value: any) {
    const module = this.state.dialogData()?.module;
    if (!module) return;
    this.personalization.setModulePersonalization(module.code, {
      [key]: value
    });
  }
}
