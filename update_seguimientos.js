
import fs from 'fs';

// Set env vars
process.env.N8N_BASE_URL = "https://n8n.cr-sites.com";
process.env.N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjljMTgwMS1kZmIwLTRkMTktYjk3Mi0zMTdhNjk5YWU2ZWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY0ODEyNzY1fQ.xH7WbiBpiVeAnrib26qaw2PwAyMqdFzNBNTqPK7YJac";

// Function to read creds from file if it exists
function getCredId() {
    try {
        if (fs.existsSync('creds.json')) {
            const creds = JSON.parse(fs.readFileSync('creds.json', 'utf8'));
            if (creds && creds.length > 0) {
                return creds[0].id;
            }
        }
    } catch (e) { }
    return null;
}

async function main() {
    try {
        const { updateWorkflow } = await import('./tools/workflow-tools.js');

        const workflowJson = JSON.parse(fs.readFileSync('./workflow_seguimientos_diarios.json', 'utf8'));
        const workflowId = 'M41AzCPlhql4OhOe';

        // Try to inject cred ID if found
        const credId = getCredId();
        if (credId) {
            console.log(`Injecting Postgres Cred ID: ${credId}`);
            const pgNode = workflowJson.nodes.find(n => n.type === 'n8n-nodes-base.postgres');
            if (pgNode && pgNode.credentials && pgNode.credentials.postgres) {
                pgNode.credentials.postgres.id = credId;
            }
        } else {
            console.log('No credentials found in local cache. Using placeholder.');
        }

        console.log(`Updating workflow: ${workflowId}...`);

        const args = {
            workflowId: workflowId,
            nodes: workflowJson.nodes,
            connections: workflowJson.connections
        };

        const result = await updateWorkflow(args);

        console.log('Result:', JSON.stringify(result, null, 2));

        if (result.success) {
            console.log('✅ Workflow updated successfully!');
        } else {
            console.error('❌ Failed to update workflow:', result.error);
        }

    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

main();
