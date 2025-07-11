import { inject, Injectable } from '@angular/core';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private state = inject(StateService);

  async openDialog(module: { current: string, template?: string }, semesterIndex?: number, moduleIndex?: number) {
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
