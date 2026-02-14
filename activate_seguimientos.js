
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
        log('Starting activation...');
        const { activateWorkflow } = await import('./tools/workflow-tools.js');

        const workflowId = 'M41AzCPlhql4OhOe'; // ID from previous run logs
        log(`Activating workflow ID: ${workflowId}...`);

        const result = await activateWorkflow({ workflowId });

        log('Activation result:');
        log(JSON.stringify(result, null, 2));

        if (result.success) {
            log('✅ Workflow activated successfully!');
        } else {
            console.error('❌ Failed to activate workflow:', result.error);
        }

    } catch (error) {
        log(`Error: ${error.message}`);
        if (error.stack) log(error.stack);
    }
}

main();
