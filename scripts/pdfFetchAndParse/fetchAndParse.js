import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';
import fetch from 'node-fetch';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const jsonFile = path.join(__dirname, '../../src/app/models/modules.json');
const pdfDir = path.join(__dirname, 'pdfs');
if (!existsSync(pdfDir)) mkdirSync(pdfDir);

const cookies = {
    asp: "INSERT_COOKIE_HERE",
    hslu: "INSERT_COOKIE_HERE",
}; // Replace with your actual cookie string

// to prevent rate limiting, we only fetch 10 modules at a time
let counter = 10;

(async () => {
    const modules = JSON.parse(readFileSync(jsonFile));
    const badPaths = [];

    for (const module of modules) {
        if (!module.url) continue;

        const pdfPath = path.join(pdfDir, `${module.code.replace('/', '_')}.pdf`);

        if (!existsSync(pdfPath)) {
            if (counter <= 0) {
                return modules;
            }
            counter--;

            console.log(`Fetching ${module.code} from ${module.url}`);

            try {
                const res = await fetch(module.url, {
                    headers: {
                        cookie: `.AspNet.Cookies=${cookies.asp}; hslu=${cookies.hslu}"`,
                    }
                });
                if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
                const buffer = await res.arrayBuffer();
                writeFileSync(pdfPath, Buffer.from(buffer));
                console.log(`Saved ${module.code}.pdf`);
            } catch (err) {
                console.error(`Error fetching ${module.url}: ${err.message}`);
                continue;
            }
        }

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
                    module.name = modulename;

                } else if (line.startsWith('ECTS-Credits') || line.startsWith('ECTS Credit Points')) {
                    module.credits = Number(line.replace('ECTS-Credits', '').replace('ECTS Credit Points', '').trim());

                } else if (line.startsWith('Durchführung') || line.startsWith('Scheduling')) {
                    module.semester = [
                        (line.includes("Herbst") || line.includes("Fall")) ? "HS" : undefined,
                        (line.includes("Frühling") || line.includes("Spring")) ? "FS" : undefined
                    ].filter(Boolean).join(' / ');

                } else if (line.startsWith('Unterrichtssprache')) {
                    module.language = line.replace('Unterrichtssprache', '').trim();
                } else if (line.startsWith('Language of Instruction')) {
                    module.language = line.replace('Language of Instruction', '').trim().replace('English', 'Englisch');
                } else if (line.startsWith('Modulverantwortliche/r') || line.startsWith('Modulverantwortung') || line.startsWith('Module Coordinator')) {
                    module.lecturer = line.replace('Modulverantwortliche/r', '').replace('Modulverantwortung', '').replace('Module Coordinator', '').split(",")[0].trim();
                } else if (line.startsWith('Seite')) {
                    console.warn(`WARNING: ${module.code} is a Horb module saved like a Inf module, lookup ECTS-Credits, Semester and Language by hand.`);
                    this.badPaths.push(pdfPath);
                    break;
                }
            }
        } catch (err) {
            console.error(`Error parsing ${module.code}: ${err.message}`);
        }

    }

    console.table(badPaths);
    return modules;
})().then((modules) => {
    writeFileSync(jsonFile, JSON.stringify(modules, null, 4), {
        encoding: 'utf8',
        flag: 'w'
    });
});