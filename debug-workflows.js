import { listWorkflows } from './tools/workflow-tools.js';

// Set env vars explicitly from the user's config
process.env.N8N_BASE_URL = "https://n8n.cr-sites.com";
process.env.N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjljMTgwMS1kZmIwLTRkMTktYjk3Mi0zMTdhNjk5YWU2ZWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY0ODEyNzY1fQ.xH7WbiBpiVeAnrib26qaw2PwAyMqdFzNBNTqPK7YJac";

async function main() {
    try {
        console.log('Fetching workflows from ' + process.env.N8N_BASE_URL + '...');
        const result = await listWorkflows({ limit: 10 });

        if (result.success) {
            console.log('\n--- Workflows ---');
            if (result.data.length === 0) {
                console.log('No workflows found.');
            } else {
                result.data.forEach(wf => {
                    console.log(`- ${wf.name} (ID: ${wf.id}) [Active: ${wf.active}]`);
                });
            }
            console.log('-----------------\n');
        } else {
            console.error('Failed to list workflows:', result.error);
            if (result.statusCode) console.error('Status Code:', result.statusCode);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

main();
