import { getWorkflow } from './tools/workflow-tools.js';

// Set env vars explicitly from the user's config
process.env.N8N_BASE_URL = "https://n8n.cr-sites.com";
process.env.N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjljMTgwMS1kZmIwLTRkMTktYjk3Mi0zMTdhNjk5YWU2ZWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY0ODEyNzY1fQ.xH7WbiBpiVeAnrib26qaw2PwAyMqdFzNBNTqPK7YJac";

async function main() {
    try {
        console.log('Fetching workflow details...');
        const result = await getWorkflow({ workflowId: '3vZyObH9koXfTnp8' });

        if (result.success) {
            console.log(JSON.stringify(result.data, null, 2));
        } else {
            console.error('Failed to get workflow:', result.error);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

main();
