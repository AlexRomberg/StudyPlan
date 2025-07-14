import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { DialogService } from './services/dialog.service';
import { StateService } from './services/state.service';
import { DialogComponent } from "./components/dialog/dialog/dialog.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, DialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'StudyPlan';
  dialog = inject(DialogService);
  state = inject(StateService);

}
