import { degreeProgram, ModuleDefinition } from "../util/types";
import moduleDefinitions from "./modules.json";

export const moduleMap = new Map<string, ModuleDefinition>(
    moduleDefinitions.map((module: ModuleDefinition) => [module.code, module])
);


const I_VZ: string[][] = [
    /* semester 6 */
    [
        "Wahl-Modul",
        "Wahl-Modul",
        "Wahl-Modul",
        "Major-Modul",
        "Major-Modul",
        "Major-Modul",
        "BAA",
    ],
    /* semester 5 */
    [
        "Wahl-Modul",
        "Wahl-Modul",
        "Wahl-Modul",
        "Major-Modul",
        "Major-Modul",
        "Major-Modul",
        "Wahl-Modul",
        "Wahl-Modul",
        "WIPRO",

    ],
    /* semester 4 */
    [
        "Wahl-Modul",
        "Wahl-Modul",
        "SWDA",
        "Major-Modul",
        "Wahl-Modul",
        "Wahl-Modul",
        "Wahl-Modul",
        "PREN2",
    ],
    /* semester 3 */
    [
        "DBS",
        "VSK",
        "Major-Modul",
        "ASTAT",
        "Wahl-Modul",
        "Wahl-Modul",
        "PREN1"
    ],
    /* semester 2 */
    [
        "ANA-F",
        "DMATH-CODE",
        "AD",
        "ITEO",
        "ISF",
        "MOD",
        "FKOM",
        "PMB"
    ],
    /* semester 1 */
    [
        "ANA-G",
        "DMATH-ALGO",
        "OOP",
        "CNA",
        "Wahl-Modul",
        "Wahl-Modul",
        "PTA"
    ],
];

const I_TZ: string[][] = [];

const AI_VZ: string[][] = [];

const AI_TZ: string[][] = [];

export const plans: { [key in degreeProgram]: string[][] } = {
    "I-VZ": I_VZ,
    "I-TZ": I_TZ,
    "AI-VZ": AI_VZ,
    "AI-TZ": AI_TZ
}