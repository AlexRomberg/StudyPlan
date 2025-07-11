import { computed, inject, Injectable, resource } from '@angular/core';
import { DBService } from './db.service';
import { GenericModuleDefinition, ModuleDefinition, ModuleGroup } from '../util/types';
import { StateService } from './state.service';
import { PersonalizationService } from './personalization.service';
import { genericModules } from '../util/modules';

@Injectable({
  providedIn: 'root'
})
export class ModuleService {
  private db = inject(DBService);
  private state = inject(StateService);
  private personalization = inject(PersonalizationService);

  private modulesResource = resource({
    defaultValue: undefined,
    loader: () => this.db.getModules(),
  });
  private configsResource = resource({
    defaultValue: undefined,
    loader: () => this.db.getDegreeProgramConfigs(),
  });
  private semesterPlansResource = resource({
    defaultValue: undefined,
    loader: () => this.db.getSemesterPlans(),
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
      project: modules.filter(module => config.projectModules.includes(module.code)),
      extension: modules.filter(module => config.extensionModules.includes(module.code)),
      additional: modules.filter(module => config.additionalModules.includes(module.code)),
      blockweek: modules.filter(module => config.blockweekModules.includes(module.code)),
    }
  });

  public moduleScopes = computed(() => this.configsResource.value()?.map(c => c.name))

  public semesterPlans = computed(() => this.semesterPlansResource.value());

  public resolvedPersonalizedModulePlan = computed(() => {
    const modulePlan = this.personalization.modulePlan()?.plan;
    const modules = this.modulesResource.value();
    if (!modulePlan || !modules) {
      return undefined;
    }

    return modulePlan.map(
      semester => semester.map(
        module => {
          return module ? {
            current: (modules.find(m => m.code === module.code) ?? genericModules.find(m => m.code === module.code)),
            template: (modules.find(m => m.code === module.template) ?? genericModules.find(m => m.code === module.template))
          } : null;
        }));
  });

  public getModuleType(module: ModuleDefinition, degreeProgram: string): keyof ModuleGroup | undefined {
    const config = this.configsResource.value()?.find(c => c.name === degreeProgram);
    if (!config) {
      return undefined;
    }

    if (config.extensionModules.includes(module.code)) {
      return "extension";
    } else if (config.coreModules.includes(module.code)) {
      return "core";
    } else if (config.projectModules.includes(module.code)) {
      return "project";
    } else if (config.additionalModules.includes(module.code)) {
      return "additional";
    } else if (config.blockweekModules.includes(module.code)) {
      return "blockweek";
    }
    return undefined;
  }

  public reload(config?: { modules: boolean, configs: boolean, semesterPlans: boolean }) {
    if (config?.modules ?? true) {
      this.modulesResource.reload();
    }
    if (config?.configs ?? true) {
      this.configsResource.reload();
    }
    if (config?.semesterPlans ?? true) {
      this.semesterPlansResource.reload();
    }
  }

  isGenericModule(module: ModuleDefinition): module is GenericModuleDefinition {
    return 'isGenericModule' in module && module.isGenericModule === true;
  }
}
