import { Component, inject } from '@angular/core';
import { StateService } from '../../../services/state.service';
import { WelcomeDialogComponent } from "../welcome-dialog/welcome-dialog.component";
import { ModuleDialogComponent } from "../module-dialog/module-dialog.component";

@Component({
  selector: 'app-dialog',
  imports: [WelcomeDialogComponent, ModuleDialogComponent],
  templateUrl: './dialog.component.html'
})
export class DialogComponent {
  state = inject(StateService);
}
