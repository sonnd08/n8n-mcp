
import axios from 'axios';
import fs from 'fs';

const N8N_BASE_URL = "https://n8n.cr-sites.com";
const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjljMTgwMS1kZmIwLTRkMTktYjk3Mi0zMTdhNjk5YWU2ZWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY0ODEyNzY1fQ.xH7WbiBpiVeAnrib26qaw2PwAyMqdFzNBNTqPK7YJac";
const WORKFLOW_ID = 'M41AzCPlhql4OhOe';

async function main() {
    try {
        console.log(`Getting workflow ${WORKFLOW_ID}...`);
        const getRes = await axios.get(`${N8N_BASE_URL}/api/v1/workflows/${WORKFLOW_ID}`, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });

        const currentWorkflow = getRes.data;
        const newDef = JSON.parse(fs.readFileSync('./workflow_seguimientos_diarios.json', 'utf8'));

        // Prepare update payload
        // We only want to send updatable fields
        const payload = {
            name: currentWorkflow.name,
            nodes: newDef.nodes,
            connections: newDef.connections,
            settings: currentWorkflow.settings || {},
            active: currentWorkflow.active
        };

        console.log('Sending Update...');
        const putRes = await axios.put(`${N8N_BASE_URL}/api/v1/workflows/${WORKFLOW_ID}`, payload, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });

        console.log('✅ Update Success!');
        console.log('Name:', putRes.data.name);
        console.log('Nodes count:', putRes.data.nodes.length);

    } catch (error) {
        console.error('❌ Error updating:');
        if (error.response) {
            console.error(error.response.status, error.response.statusText);
            console.error(JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

main();
