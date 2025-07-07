import { computed, inject, Injectable, resource } from '@angular/core';
import { DBService } from './db.service';
import { ModuleGroup } from '../util/types';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private db = inject(DBService);
  private state = inject(StateService);

  private modulesResource = resource({
    defaultValue: undefined,
    loader: () => this.db.getModules(),
  });
  private configsResource = resource({
    defaultValue: undefined,
    loader: () => this.db.getDegreeProgramConfigs(),
  });

  public modules = computed(() => this.modulesResource.value())

  public modulesByScope = computed<ModuleGroup | undefined | null>(() => {
    const modules = this.modules();
    const config = this.configsResource.value()?.find(c => c.name === this.state.moduleScope())

    if (modules == undefined || config == undefined) {
      return undefined;
    } else if (!modules || !config) {
      console.error("Modules or degree program config not found for:", this.state.moduleScope());
      return null;
    }

    return {
      core: modules.filter(module => config.coreModules.includes(module.code)),
      extension: modules.filter(module => config.extensionModules.includes(module.code)),
      additional: modules.filter(module => config.additionalModules.includes(module.code)),
      blockweek: modules.filter(module => config.blockweekModules.includes(module.code)),
    }
  });

  public moduleScopes = computed(() => this.configsResource.value()?.map(c => c.name))

  public reload(config?: { modules: boolean, configs: boolean }) {
    if (config?.modules ?? true) {
      this.modulesResource.reload();
    }
    if (config?.configs ?? true) {
      this.configsResource.reload();
    }
  }
}
