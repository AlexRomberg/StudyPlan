import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, LucideAngularModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  state = inject(StateService);
  links = [
    {
      title: 'Modulübersicht',
      route: 'modules',
      icon: 'layout-list'
    },
    {
      title: 'Studienplanung',
      route: 'plan',
      icon: 'grid-3x3'
    }
  ]
}
