import { GenericModuleDefinition, ModuleGroup } from "./types";

export const genericModules: GenericModuleDefinition[] = [
    {
        code: "Wahl-Modul",
        name: "Wahl-Modul",
        credits: 3,
        isGenericModule: true
    },
    {
        code: "Major-Modul",
        name: "Major-Modul",
        credits: 3,
        isGenericModule: true
    },
    {
        code: "Anrechnung Berufstätigkeit",
        name: "Anrechnung Berufstätigkeit",
        credits: 6,
        isGenericModule: true
    }
];

export const moduleGroups: { key: keyof ModuleGroup, name: string }[] = [
    { name: 'Kern-Module', key: 'core' },
    { name: 'Erweiterungs-Module', key: 'extension' },
    { name: 'Zusatz-Module', key: 'additional' },
    { name: 'Blockwochen', key: 'blockweek' }
]
