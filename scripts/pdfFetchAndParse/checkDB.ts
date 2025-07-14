import { Client, Databases, Query } from "node-appwrite";
import { DBModuleDefinition } from "../../src/app/util/types";
import { createInterface } from "readline/promises";
import dotenv from "dotenv";

dotenv.config();

// output of parsing script
const moduleList = [/* ... */];

// appwrite
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

async function askYesNo(question: string) {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const answer = await rl.question(`${question} (y/n): `);
    rl.close();
    return answer.trim().toLowerCase() === 'y';
}

fetchModules().then(async (modules) => {
    for (const module of modules) {
        let moduleFound = false;
        for (const category of moduleList) {
            const foundModule = category.modules.find(m => m.code === module.code);
            if (foundModule) {
                moduleFound = true;

                if (module.url !== foundModule.href) {
                    console.log(`Module ${module.code} has a different URL:`);
                    console.log(`  Expected: ${foundModule.href}`);
                    console.log(`  Found:    ${module.url}`);

                    if (await askYesNo("Update?")) {
                        const doc = await databases.getDocument<DBModuleDefinition>('modules', 'official_modules', module.code);
                        const { credits, code, name, language, lecturer, semester } = doc;

                        try {
                            await databases.updateDocument('modules', 'official_modules', doc.$id, {
                                url: foundModule.href,
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
                    }
                }
            }
        }
        if (!moduleFound) {
            console.log(`Module ${module.code} not found in predefined list.`);
            console.log(`  Name: ${module.name}`);
            console.log(`  URL:  ${module.url}`);
        }
    };

    moduleList.forEach(category => {
        category.modules.forEach(module => {
            const foundModule = modules.find(m => m.code === module.code);
            if (!foundModule) {
                console.log(`Module ${module.code} not found in database.`);
                console.log(`  Name: ${module.name}`);
                console.log(`  URL:  ${module.href}`);
            }
        });
    });
}).catch(error => {
    console.error("Error fetching modules:", error);
});