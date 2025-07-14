import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { StateService } from '../../../services/state.service';

@Component({
  selector: 'app-welcome-dialog',
  imports: [LucideAngularModule],
  templateUrl: './welcome-dialog.component.html'
})
export class WelcomeDialogComponent {
  state = inject(StateService);
}
