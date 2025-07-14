import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';
import fetch from 'node-fetch';
import { Client, Databases, Query } from 'node-appwrite';
import dotenv from 'dotenv';
import { DBModuleDefinition } from '../../src/app/util/types';
import { createInterface } from 'readline/promises';

dotenv.config();

// PDF location
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfDir = path.join(__dirname, 'pdfs');
if (!existsSync(pdfDir)) mkdirSync(pdfDir);


const client = new Client()
    .setEndpoint(process.env?.['APPWRITE_ENDPOINT'] ?? "")
    .setProject(process.env?.['APPWRITE_PROJECT_ID'] ?? "")
    .setKey(process.env?.['APPWRITE_API_KEY'] ?? "");

const databases = new Databases(client);

async function fetchModules() {
    const result = await databases.listDocuments<DBModuleDefinition>(
        'modules',
        'official_modules',
        [
            Query.limit(1000)
        ]
    );
    return result.documents;
}

async function downloadPDFs(modules: DBModuleDefinition[]) {
    const pdfs = modules.map(async (module) => {
        const pdfPath = path.join(pdfDir, `${module.code.replace('/', '_')}.pdf`);

        if (existsSync(pdfPath)) {
            return true;
        }

        try {
            const res = await fetch(module.url, {
                headers: {
                    cookie: `.AspNet.Cookies=${process.env['HSLU_ASP_SESSION']}; hslu=${process.env['HSLU_COOKIE']}"`,
                }
            });
            if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
            const buffer = await res.arrayBuffer();
            writeFileSync(pdfPath, Buffer.from(buffer));
            return true;
        } catch (err: any) {
            console.error(`Error fetching ${module.url}: ${err.message}`);
            return false;
        }
    });

    const responses = await Promise.all(pdfs);
    const failedModules = modules.filter((_, index) => !responses[index]);
    console.table(failedModules.map(m => ({
        code: m.code,
        url: m.url,
    })));
    return await Promise.all(pdfs);
}

async function askYesNo(question: string) {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const answer = await rl.question(`${question} (y/n): `);
    rl.close();
    return answer.trim().toLowerCase() === 'y';
}

async function parsePDFs(modules: DBModuleDefinition[]) {
    const badPaths: string[] = [];

    for (const module of modules) {
        const pdfPath = path.join(pdfDir, `${module.code.replace('/', '_')}.pdf`);
        try {
            const pdfData = readFileSync(pdfPath);
            const parsed = await pdfParse(pdfData);
            const text = parsed.text.slice(0, 1500);
            const lines = text.split('\n');

            let isHorbModule = module.url.includes('modulbeschriebe-ta');
            let isOldModule = ['GIS'].includes(module.code);
            if (isHorbModule || isOldModule) {
                console.warn(`WARNING: ${module.code} is a unsupported module, lookup ECTS-Credits, Lecturer, Semester and Language by hand.`);
                badPaths.push(pdfPath.toString());
                continue;
            }

            for (let l = 0; l < lines.length; l++) {
                const line = lines[l];

                if (line.startsWith('Modul: ') || line.startsWith('Module: ')) {
                    let modulename = line.replace('Modul: ', '').replace('Module: ', '').trim();
                    if (!(['Modulkürzel', 'Modulcode', 'Module Abbreviation', 'Abbreviation'].some(t => lines[l + 1].startsWith(t)))) {
                        modulename += " " + lines[l + 1].trim();
                    }
                    if (module.name !== modulename) {
                        console.warn(`WARNING: Module name mismatch for ${module.code}. Expected: ${module.name}, Found: ${modulename} (\u001b]8;;${module.url}\u0007OPEN PDF\u001b]8;;\u0007)`);
                        if (await askYesNo("Update?")) {
                            const doc = await databases.getDocument<DBModuleDefinition>('modules', 'official_modules', module.code);
                            const { credits, code, name, language, lecturer, semester, url } = doc;

                            try {
                                await databases.updateDocument('modules', 'official_modules', doc.$id, {
                                    url,
                                    credits,
                                    code,
                                    name: modulename,
                                    language,
                                    lecturer,
                                    semester
                                });
                                console.log(`Updated URL for module ${module.code}`);
                            } catch (err) {
                                console.error(`Failed to update module ${module.code}:`, err);
                            }
                        } else {
                            badPaths.push(pdfPath.toString());
                        }
                    }
                } else if (line.startsWith('ECTS-Credits') || line.startsWith('ECTS Credit Points')) {
                    const credits = Number(line.replace('ECTS-Credits', '').replace('ECTS Credit Points', '').trim());
                    if (module.credits !== credits) {
                        console.warn(`WARNING: ECTS-Credits mismatch for ${module.code}. Expected: ${module.credits}, Found: ${credits} (\u001b]8;;${module.url}\u0007OPEN PDF\u001b]8;;\u0007)`);
                        if (await askYesNo("Update?")) {
                            const doc = await databases.getDocument<DBModuleDefinition>('modules', 'official_modules', module.code);
                            const { code, name, language, lecturer, semester, url } = doc;

                            try {
                                await databases.updateDocument('modules', 'official_modules', doc.$id, {
                                    url,
                                    credits,
                                    code,
                                    name,
                                    language,
                                    lecturer,
                                    semester
                                });
                                console.log(`Updated URL for module ${module.code}`);
                            } catch (err) {
                                console.error(`Failed to update module ${module.code}:`, err);
                            }
                        } else {
                            badPaths.push(pdfPath.toString());
                        }
                    }

                } else if (line.startsWith('Durchführung') || line.startsWith('Scheduling')) {
                    const semester = [
                        (line.includes("Herbst") || line.includes("Fall")) ? "hs" : undefined,
                        (line.includes("Frühling") || line.includes("Spring")) ? "fs" : undefined
                    ].filter(Boolean);

                    if (!module.semester.every(sem => semester.includes(sem))) {
                        console.warn(`WARNING: Semester mismatch for ${module.code}. Expected: ${module.semester.join(', ')}, Found: ${semester.join(', ')} (\u001b]8;;${module.url}\u0007OPEN PDF\u001b]8;;\u0007)`);
                        if (await askYesNo("Update?")) {
                            const doc = await databases.getDocument<DBModuleDefinition>('modules', 'official_modules', module.code);
                            const { credits, code, name, language, lecturer, url } = doc;

                            try {
                                await databases.updateDocument('modules', 'official_modules', doc.$id, {
                                    url,
                                    credits,
                                    code,
                                    name,
                                    language,
                                    lecturer,
                                    semester
                                });
                                console.log(`Updated URL for module ${module.code}`);
                            } catch (err) {
                                console.error(`Failed to update module ${module.code}:`, err);
                            }
                        } else {
                            badPaths.push(pdfPath.toString());
                        }
                    }
                } else if (line.startsWith('Modulverantwortliche/r') || line.startsWith('Modulverantwortung') || line.startsWith('Module Coordinator')) {
                    const lecturer = line.replace('Modulverantwortliche/r', '').replace('Modulverantwortung', '').replace('Module Coordinator', '').split(",")[0].trim();
                    if (module.lecturer !== lecturer) {
                        console.warn(`WARNING: Lecturer mismatch for ${module.code}. Expected: ${module.lecturer}, Found: ${lecturer} (\u001b]8;;${module.url}\u0007OPEN PDF\u001b]8;;\u0007)`);
                        if (await askYesNo("Update?")) {
                            const doc = await databases.getDocument<DBModuleDefinition>('modules', 'official_modules', module.code);
                            const { credits, code, name, language, semester, url } = doc;

                            try {
                                await databases.updateDocument('modules', 'official_modules', doc.$id, {
                                    url,
                                    credits,
                                    code,
                                    name,
                                    language,
                                    lecturer,
                                    semester
                                });
                                console.log(`Updated URL for module ${module.code}`);
                            } catch (err) {
                                console.error(`Failed to update module ${module.code}:`, err);
                            }
                        } else {
                            badPaths.push(pdfPath.toString());
                        }
                    }
                } else if (line.startsWith('Seite')) {
                    console.warn(`WARNING: ${module.code} is a Horb module saved like a Inf module, lookup ECTS-Credits, Semester and Language by hand.`);
                    badPaths.push(pdfPath);
                    break;
                }
            }
        } catch (err: any) {
            console.error(`Error parsing ${module.code}: ${err.message}`);
        }
    }

    return badPaths;
}

fetchModules().then(modules => {
    downloadPDFs(modules).then(r => {
        parsePDFs(modules).then(issues => {
            console.log(`Found ${issues.length} issues with module PDFs:`);
            console.table(issues);
        });
    });
});

// (async () => {
//     const modules = JSON.parse(readFileSync(jsonFile));
//     const badPaths = [];

//     for (const module of modules) {
//         if (!module.url) continue;

//         const pdfPath = path.join(pdfDir, `${module.code.replace('/', '_')}.pdf`);

//         if (!existsSync(pdfPath)) {
//             if (counter <= 0) {
//                 return modules;
//             }
//             counter--;

//             console.log(`Fetching ${module.code} from ${module.url}`);

//             try {
//                 const res = await fetch(module.url, {
//                     headers: {
//                         cookie: `.AspNet.Cookies=${cookies.asp}; hslu=${cookies.hslu}"`,
//                     }
//                 });
//                 if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
//                 const buffer = await res.arrayBuffer();
//                 writeFileSync(pdfPath, Buffer.from(buffer));
//                 console.log(`Saved ${module.code}.pdf`);
//             } catch (err) {
//                 console.error(`Error fetching ${module.url}: ${err.message}`);
//                 continue;
//             }
//         }

//         try {
//             const pdfData = readFileSync(pdfPath);
//             const parsed = await pdfParse(pdfData);
//             const text = parsed.text.slice(0, 1500);
//             const lines = text.split('\n');

//             let isHorbModule = module.url.includes('modulbeschriebe-ta');
//             let isOldModule = ['GIS'].includes(module.code);
//             if (isHorbModule || isOldModule) {
//                 console.warn(`WARNING: ${module.code} is a unsupported module, lookup ECTS-Credits, Lecturer, Semester and Language by hand.`);
//                 badPaths.push(pdfPath.toString());
//                 continue;
//             }

//             for (let l = 0; l < lines.length; l++) {
//                 const line = lines[l];

//                 if (line.startsWith('Modul: ') || line.startsWith('Module: ')) {
//                     let modulename = line.replace('Modul: ', '').replace('Module: ', '').trim();
//                     if (!(['Modulkürzel', 'Modulcode', 'Module Abbreviation', 'Abbreviation'].some(t => lines[l + 1].startsWith(t)))) {
//                         modulename += " " + lines[l + 1].trim();
//                     }
//                     module.name = modulename;

//                 } else if (line.startsWith('ECTS-Credits') || line.startsWith('ECTS Credit Points')) {
//                     module.credits = Number(line.replace('ECTS-Credits', '').replace('ECTS Credit Points', '').trim());

//                 } else if (line.startsWith('Durchführung') || line.startsWith('Scheduling')) {
//                     module.semester = [
//                         (line.includes("Herbst") || line.includes("Fall")) ? "HS" : undefined,
//                         (line.includes("Frühling") || line.includes("Spring")) ? "FS" : undefined
//                     ].filter(Boolean).join(' / ');

//                 } else if (line.startsWith('Unterrichtssprache')) {
//                     module.language = line.replace('Unterrichtssprache', '').trim();
//                 } else if (line.startsWith('Language of Instruction')) {
//                     module.language = line.replace('Language of Instruction', '').trim().replace('English', 'Englisch');
//                 } else if (line.startsWith('Modulverantwortliche/r') || line.startsWith('Modulverantwortung') || line.startsWith('Module Coordinator')) {
//                     module.lecturer = line.replace('Modulverantwortliche/r', '').replace('Modulverantwortung', '').replace('Module Coordinator', '').split(",")[0].trim();
//                 } else if (line.startsWith('Seite')) {
//                     console.warn(`WARNING: ${module.code} is a Horb module saved like a Inf module, lookup ECTS-Credits, Semester and Language by hand.`);
//                     this.badPaths.push(pdfPath);
//                     break;
//                 }
//             }
//         } catch (err) {
//             console.error(`Error parsing ${module.code}: ${err.message}`);
//         }

//     }

//     console.table(badPaths);
//     return modules;
// })().then((modules) => {
//     writeFileSync(jsonFile, JSON.stringify(modules, null, 4), {
//         encoding: 'utf8',
//         flag: 'w'
//     });
// });