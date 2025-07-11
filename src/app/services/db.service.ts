import { Injectable } from '@angular/core';
import { Client, Databases, Query } from 'appwrite';
import { environment } from '../../environments/environment.development';
import { DBDegreeProgramConfig, DBModuleDefinition, DBSemesterPlan, ModuleGroup } from '../util/types';

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
    const result = await this.dbs.listDocuments<DBModuleDefinition>("modules", "official_modules", [
      Query.limit(200),
      Query.offset(0),
      Query.orderAsc("code")
    ]);
    return result.documents;
  }

  async getDegreeProgramConfigs(): Promise<DBDegreeProgramConfig[]> {
    const result = await this.dbs.listDocuments<DBDegreeProgramConfig>("modules", "degree_program_configs", [
      Query.limit(200),
      Query.offset(0),
      Query.orderAsc("name")
    ]);
    return result.documents;
  }

  async getSemesterPlans(): Promise<DBSemesterPlan[]> {
    const result = await this.dbs.listDocuments<DBSemesterPlan>("modules", "semester_plans", [
      Query.limit(200),
      Query.offset(0),
      Query.orderAsc("name")
    ]);
    return result.documents;
  }
}
