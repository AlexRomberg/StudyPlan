import { Injectable, signal } from '@angular/core';
import { ModuleDefinition } from '../util/types';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialogData = signal<{ module: ModuleDefinition, resolve: () => void } | undefined>(undefined);
  public get moduleDialogData() {
    return this.dialogData.asReadonly();
  }

  async openDialog(module: ModuleDefinition) {
    return new Promise<void>((resolve) => {
      this.dialogData.set({
        module,
        resolve: () => {
          this.dialogData.set(undefined);
          resolve();
        }
      });
    });
  }
}
