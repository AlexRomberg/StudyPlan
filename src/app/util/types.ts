export interface Module {
    code: string;
    name: string;
    type: "core" | "project" | "elective";
    credits: number;
}

export interface ModuleDefinition {
    code: string,
    name: string
    credits: number,
    url: string | null,
    type: string,
    isGenericModule: boolean,
    // TODO: The following properties are still missing
    semester: string | null,
    lecturer: string | null,
    language: string | null,
}

export interface ModulePersonalization {
    code: string;
    notes: string;
    credited: boolean;
    done: boolean;
    interested: boolean;
}

export type degreeProgram = "I-VZ" | "I-TZ";