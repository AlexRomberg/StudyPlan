import { GenericModuleDefinition, ModuleGroup } from "./types";

export const genericModules: GenericModuleDefinition[] = [
    {
        code: "Wahl-Modul",
        name: "Wahl-Modul",
        credits: 3,
        isGenericModule: true,
        type: "elective",
    },
    {
        code: "Major-Modul",
        name: "Major-Modul",
        credits: 3,
        isGenericModule: true,
        type: "major",
    },
    {
        code: "Anrechnung Berufstätigkeit",
        name: "Anrechnung Berufstätigkeit",
        credits: 6,
        isGenericModule: true,
        type: "work",
    }
];

export const moduleGroups: { key: keyof ModuleGroup, name: string }[] = [
    { name: 'Kern-Module', key: 'core' },
    { name: 'Projekt-Module', key: 'project' },
    { name: 'Erweiterungs-Module', key: 'extension' },
    { name: 'Zusatz-Module', key: 'additional' },
    { name: 'Blockwochen', key: 'blockweek' }
]
