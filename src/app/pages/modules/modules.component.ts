import { Component, computed, signal } from '@angular/core';
import moduleDefinitions from "../../models/modules.json";
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-modules',
  imports: [LucideAngularModule],
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.css'
})
export class ModulesComponent {
  modules = computed(() => Object.groupBy(moduleDefinitions, ({ type }) => type));
  moduleGroups: { key: "core" | "extension" | "additional" | "blockweek", name: string }[] = [
    { name: 'Kern-Module', key: 'core' },
    { name: 'Erweiterungs-Module', key: 'extension' },
    { name: 'Zusatz-Module', key: 'additional' },
    { name: 'Blockwochen', key: 'blockweek' }
  ]
  modulesOpen = signal({
    core: true,
    extension: true,
    additional: true,
    blockweek: true
  });

  toggleModuleGroup(group: "core" | "extension" | "additional" | "blockweek") {
    this.modulesOpen.update(open => ({ ...open, [group]: !open[group] }));
  }
}