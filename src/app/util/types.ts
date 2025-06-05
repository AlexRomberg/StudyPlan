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
    type: string
}

export type degreeProgram = "I-VZ" | "I-TZ" | "AI-VZ" | "AI-TZ";