
import fs from 'fs';
import path from 'path';

// Set env vars (copied from debug-credentials.js)
process.env.N8N_BASE_URL = "https://n8n.cr-sites.com";
process.env.N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjljMTgwMS1kZmIwLTRkMTktYjk3Mi0zMTdhNjk5YWU2ZWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY0ODEyNzY1fQ.xH7WbiBpiVeAnrib26qaw2PwAyMqdFzNBNTqPK7YJac";

async function main() {
    try {
        const { createWorkflow } = await import('./tools/workflow-tools.js');

        const workflowPath = './workflow_image_generation.json';
        console.log(`Reading workflow from ${workflowPath}...`);

        const workflowJson = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));

        const args = {
            name: workflowJson.name,
            nodes: workflowJson.nodes,
            connections: workflowJson.connections
        };

        console.log(`Creating workflow "${args.name}"...`);
        const result = await createWorkflow(args);

        if (result.success) {
            console.log('✅ Workflow created successfully!');
            console.log(`ID: ${result.data.id}`);
            console.log(`Name: ${result.data.name}`);
        } else {
            console.error('❌ Failed to create workflow:', result.message);
            if (result.error) console.error(result.error);
        }

    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

main();
