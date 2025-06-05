import { Component, computed, inject } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { LucideAngularModule } from 'lucide-angular';
import { PersonalizationService } from '../../services/personalization.service';
import { FormsModule } from '@angular/forms';
import { ModulePersonalization } from '../../util/types';

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

  public updateNotes(notes: string) {
    const module = this.dialog.moduleDialogData()?.module;
    if (!module) return;
    this.personalization.setModulePersonalization(module.code, {
      notes,
    });
  }

  public updateCredited(credited: boolean) {
    const module = this.dialog.moduleDialogData()?.module;
    if (!module) return;
    this.personalization.setModulePersonalization(module.code, {
      credited
    });
  }

  public updateInterested(interested: boolean) {
    const module = this.dialog.moduleDialogData()?.module;
    if (!module) return;
    this.personalization.setModulePersonalization(module.code, {
      interested
    });
  }

  public updateDone(done: boolean) {
    const module = this.dialog.moduleDialogData()?.module;
    if (!module) return;
    this.personalization.setModulePersonalization(module.code, {
      done
    });
  }

  closeDialog() {
    this.dialog.moduleDialogData()?.resolve();
  }
}
