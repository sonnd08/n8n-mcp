
import fs from 'fs';

// Set env vars BEFORE importing tools
process.env.N8N_BASE_URL = "https://n8n.cr-sites.com";
process.env.N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjljMTgwMS1kZmIwLTRkMTktYjk3Mi0zMTdhNjk5YWU2ZWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY0ODEyNzY1fQ.xH7WbiBpiVeAnrib26qaw2PwAyMqdFzNBNTqPK7YJac";

function log(msg) {
    try {
        fs.appendFileSync('deploy_log.txt', msg + '\n');
    } catch (e) { }
    console.log(msg);
}

async function main() {
    try {
        log('Starting deployment...');
        const { createWorkflow } = await import('./tools/workflow-tools.js');
        log('Tools imported');

        const workflowJson = JSON.parse(fs.readFileSync('./workflow_seguimientos_diarios.json', 'utf8'));
        log(`Deploying workflow: ${workflowJson.name}...`);

        const args = {
            name: workflowJson.name,
            nodes: workflowJson.nodes,
            connections: workflowJson.connections,
            settings: workflowJson.settings || {}
        };

        const result = await createWorkflow(args);
        log('Result result:');
        log(JSON.stringify(result, null, 2));

    } catch (error) {
        log(`Error: ${error.message}`);
        if (error.stack) log(error.stack);
    }
}

main();
