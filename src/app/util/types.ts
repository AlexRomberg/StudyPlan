import { Models } from "appwrite";
import { moduleGroups } from "./modules";

export interface GenericModuleDefinition {
    code: string,
    name: string,
    credits: number,
    isGenericModule: true,
    type: "core" | "project" | "elective" | "major" | "work"
}

export interface OfficialModuleDefinition {
    code: string,
    name: string,
    credits: number,
    url: string,
    semester: Semester[],
    lecturer: string,
    language: Language[],
}

export type ModuleDefinition = OfficialModuleDefinition | GenericModuleDefinition;
export interface DBModuleDefinition extends OfficialModuleDefinition, Models.Document { }
export interface DBDegreeProgramConfig extends Models.Document {
    name: string;
    coreModules: string[];
    projectModules: string[];
    extensionModules: string[];
    additionalModules: string[];
    blockweekModules: string[];
}

export type ModuleGroup = {
    [key in "core" | "project" | "extension" | "additional" | "blockweek"]: OfficialModuleDefinition[]
}

export enum Semester {
    HS = "hs",
    FS = "fs",
    Blockweek = "blockweek",
}

export enum Language {
    Deutsch = "de",
    Englisch = "en",
}

export interface ModulePersonalization {
    code: string;
    notes: string;
    credited: boolean;
    done: boolean;
    interested: boolean;
}

export interface DBSemesterPlan extends Models.Document {
    name: string;
    semesterModules: (string)[];
    degreeProgram: string;
}

// --- CLEANUP --------------------------------------------
export interface Module {
    code: string;
    name: string;
    type: "core" | "project" | "elective";
    credits: number;
}



export type ModulePlanPersonalization = {
    [key: string]: ModulePlanPersonalizationItem[]
}
export interface ModulePlanPersonalizationItem {
    semesterIndex: number;
    moduleIndex: number;
    linkedModule: string;
}