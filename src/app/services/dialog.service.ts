import { inject, Injectable, signal } from '@angular/core';
import { ModuleDefinition } from '../util/types';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private state = inject(StateService);

  async openDialog(module: ModuleDefinition, semesterIndex?: number, moduleIndex?: number) {
    return new Promise<void>((resolve) => {
      this.state.setDialogData(
        module,
        resolve,
        semesterIndex,
        moduleIndex
      );
    });
  }

  closeDialog() {
    this.state.dialogData()?.resolve();
  }
}
