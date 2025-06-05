import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { ModuleDialogComponent } from './components/module-dialog/module-dialog.component';
import { DialogService } from './services/dialog.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, ModuleDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'StudyPlan';
  dialog = inject(DialogService);
  isDialogOpen = computed(() => Boolean(this.dialog.moduleDialogData()));
}
