import { Injectable } from '@angular/core';
import { Client, Databases, Query } from 'appwrite';
import { environment } from '../../environments/environment.development';
import { DBDegreeProgramConfig, DBModuleDefinition, ModuleGroup } from '../util/types';

@Injectable({
  providedIn: 'root'
})
export class DBService {
  private client: Client;
  private dbs: Databases;

  constructor() {
    this.client = new Client()
      .setEndpoint(environment.appwriteEndpoint)
      .setProject(environment.appwriteProjectId);
    this.dbs = new Databases(this.client);
  }

  async getModules() {
    try {
      const result = await this.dbs.listDocuments<DBModuleDefinition>("modules", "official_modules", [
        Query.limit(200),
        Query.offset(0),
        Query.orderAsc("code")
      ]);
      return result.documents;
    } catch (error) {
      console.error("Error fetching modules:", error);
      return null;
    }
  }

  async getModuleByGroup(degreeProgram: string): Promise<ModuleGroup> {
    const modules = await this.getModules();
    const degreeProgramConfig = await this.dbs.listDocuments<DBDegreeProgramConfig>("modules", "degree_program_configs", [
      Query.equal("name", degreeProgram),
      Query.limit(1)
    ]);

    if (!modules || degreeProgramConfig.total <= 0) {
      console.error("Modules or degree program config not found for:", degreeProgram);
      return { core: [], extension: [], additional: [], blockweek: [] };
    }

    const config = degreeProgramConfig.documents[0];
    console.log(JSON.stringify(modules.filter(m => !config.coreModules.includes(m.code) && !config.extensionModules.includes(m.code) && !config.additionalModules.includes(m.code) && !config.blockweekModules.includes(m.code)).map(m => m.code)));

    return {
      core: modules.filter(module => config.coreModules.includes(module.code)),
      extension: modules.filter(module => config.extensionModules.includes(module.code)),
      additional: modules.filter(module => config.additionalModules.includes(module.code)),
      blockweek: modules.filter(module => config.blockweekModules.includes(module.code)),
    }
  }

  async getDegreePrograms(): Promise<string[]> {
    const result = await this.dbs.listDocuments<DBDegreeProgramConfig>("modules", "degree_program_configs", [
      Query.limit(200),
      Query.offset(0),
      Query.select(["name"])
    ]);
    return result.documents.map(doc => doc.name);
  }
}
