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

const I_TZ: string[][] = [
    /* semester 8 */
    [
        "Major-Modul",
        "Major-Modul",
        "Major-Modul",
        "BAA",
    ],
    /* semester 7 */
    [
        "Major-Modul",
        "Major-Modul",
        "Major-Modul",
        "Wahl-Modul",
        "Anrechnung Berufstätigkeit",
        "WIPRO",
    ],
    /* semester 6 */
    [
        "Major-Modul",
        "Wahl-Modul",
        "Wahl-Modul",
        "Wahl-Modul",
        "Anrechnung Berufstätigkeit",
        "PREN2",
    ],
    /* semester 5 */
    [
        "Major-Modul",
        "Wahl-Modul",
        "SWDA",
        "Anrechnung Berufstätigkeit",
        "PREN1",
    ],
    /* semester 4 */
    [
        "DBS",
        "VSK",
        "ASTAT",
        "Wahl-Modul",
        "Wahl-Modul",
        "Wahl-Modul",
    ],
    /* semester 3 */
    [
        "ANA-F",
        "DMATH-CODE",
        "ITEO",
        "ISF",
        "MOD",
        "Wahl-Modul",
    ],
    /* semester 2 */
    [
        "CNA",
        "AD",
        "Wahl-Modul",
        "FKOM",
        "PMB"
    ],
    /* semester 1 */
    [
        "ANA-G",
        "DMATH-ALGO",
        "OOP",
        "Wahl-Modul",
        "PTA"
    ]
];

export const plans: { [key in degreeProgram]: string[][] } = {
    "I-VZ": I_VZ,
    "I-TZ": I_TZ
}