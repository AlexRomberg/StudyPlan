import { Component, inject, OnInit, resource, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { ModuleDefinition, ModuleGroup, OfficialModuleDefinition } from '../../util/types';
import { DBService } from '../../services/db.service';
import { StateService } from '../../services/state.service';
import { DialogService } from '../../services/dialog.service';
import { FormsModule } from '@angular/forms';
import { moduleGroups } from '../../util/modules';

@Component({
  selector: 'app-modules',
  imports: [LucideAngularModule, FormsModule],
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.css'
})
export class ModulesComponent implements OnInit {
  private db = inject(DBService);
  private dialog = inject(DialogService);
  state = inject(StateService);

  moduleGroups = moduleGroups;
  moduleDefinitions = signal<OfficialModuleDefinition[] | null | undefined>(undefined);
  modulesOpen = signal({
    core: true,
    extension: true,
    additional: true,
    blockweek: true
  });
  groupedModules = resource({
    defaultValue: { core: [], extension: [], additional: [], blockweek: [] },
    params: () => (this.state.moduleGrouping()),
    loader: ({ params }) => this.db.getModuleByGroup(params)
  });

  ngOnInit() {
    this.loadModules();
  }

  loadModules() {
    this.moduleDefinitions.set(undefined);
    this.db.getModules().then(modules => {
      this.moduleDefinitions.set(modules);
    });
  }

  openModule(module: ModuleDefinition) {
    this.dialog.openDialog(module)
  }

  toggleModuleGroup(group: keyof ModuleGroup) {
    this.modulesOpen.update(open => ({ ...open, [group]: !open[group] }));
  }

  // isCredited(module: ModuleDefinition): boolean {
  //   const personalization = this.personalization.getModulePersonalization(module.code);
  //   return personalization?.credited ?? false;
  // }

  // isDone(module: ModuleDefinition): boolean {
  //   const personalization = this.personalization.getModulePersonalization(module.code);
  //   return personalization?.done ?? false;
  // }

  // isInterested(module: ModuleDefinition): boolean {
  //   const personalization = this.personalization.getModulePersonalization(module.code);
  //   return personalization?.interested ?? false;
  // }
}