
import fs from 'fs';

// Set env vars
process.env.N8N_BASE_URL = "https://n8n.cr-sites.com";
process.env.N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjljMTgwMS1kZmIwLTRkMTktYjk3Mi0zMTdhNjk5YWU2ZWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY0ODEyNzY1fQ.xH7WbiBpiVeAnrib26qaw2PwAyMqdFzNBNTqPK7YJac";

// Custom simple logger
function log(msg) {
    fs.appendFileSync('workflows_log.txt', msg + '\n');
    console.log(msg);
}

async function main() {
    try {
        const { listWorkflows } = await import('./tools/workflow-tools.js');

        log('Listing workflows...');
        const result = await listWorkflows({ limit: 10 });

        if (result.success) {
            log(`Found ${result.count} workflows`);
            result.data.forEach(w => {
                log(`- [${w.id}] ${w.name} (Active: ${w.active})`);
            });
            // Save full list to file for inspection
            fs.writeFileSync('workflows_list_full.json', JSON.stringify(result.data, null, 2));
        } else {
            log('Failed to list workflows: ' + result.error);
        }

    } catch (error) {
        log('Error: ' + error.message);
    }
}

main();
