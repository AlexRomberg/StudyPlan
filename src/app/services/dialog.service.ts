import { Injectable, signal } from '@angular/core';
import { ModuleDefinition } from '../util/types';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogData = signal<{ module: ModuleDefinition, resolve: () => void, semesterIndex: number | undefined, moduleIndex: number | undefined } | undefined>(undefined);
  public get moduleDialogData() {
    return this.dialogData.asReadonly();
  }

  async openDialog(module: ModuleDefinition, semesterIndex?: number, moduleIndex?: number) {
    return new Promise<void>((resolve) => {
      this.dialogData.set({
        module,
        resolve: () => {
          this.dialogData.set(undefined);
          resolve();
        },
        semesterIndex,
        moduleIndex
      });
    });
  }

  closeDialog() {
    const data = this.dialogData();
    if (data) {
      data.resolve();
    }
  }
}
