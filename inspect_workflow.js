
import fs from 'fs';

// Set env vars
process.env.N8N_BASE_URL = "https://n8n.cr-sites.com";
process.env.N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjljMTgwMS1kZmIwLTRkMTktYjk3Mi0zMTdhNjk5YWU2ZWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY0ODEyNzY1fQ.xH7WbiBpiVeAnrib26qaw2PwAyMqdFzNBNTqPK7YJac";

async function main() {
    try {
        const { getWorkflow } = await import('./tools/workflow-tools.js');

        console.log('Getting Leads R&R workflow...');
        const result = await getWorkflow({ workflowId: '3vZyObH9koXfTnp8' });

        if (result.success) {
            // Buscamos cualquier nodo que tenga credenciales de postgres
            const pgNodes = result.data.nodes.filter(n =>
                (n.credentials && n.credentials.postgres) ||
                (n.type && n.type.toLowerCase().includes('postgres'))
            );

            console.log('Postgres nodes found:', pgNodes.length);
            if (pgNodes.length > 0) {
                console.log(JSON.stringify(pgNodes[0].credentials, null, 2));
                fs.writeFileSync('pg_creds_found.json', JSON.stringify(pgNodes[0].credentials, null, 2));
            } else {
                console.log('No postgres nodes found in this workflow.');
            }
        }

    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
