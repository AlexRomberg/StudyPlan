import { Language, Semester } from "./types";

export const languages: { [key in Language]: string } = {
    [Language.Deutsch]: 'Deutsch',
    [Language.Englisch]: 'Englisch'
};

export const semesters: { [key in Semester]: string } = {
    [Semester.HS]: 'HS',
    [Semester.FS]: 'FS',
    [Semester.Blockweek]: 'Blockwoche'
};