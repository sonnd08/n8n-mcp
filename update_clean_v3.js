
import axios from 'axios';
import fs from 'fs';

const N8N_BASE_URL = "https://n8n.cr-sites.com";
const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjljMTgwMS1kZmIwLTRkMTktYjk3Mi0zMTdhNjk5YWU2ZWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY0ODEyNzY1fQ.xH7WbiBpiVeAnrib26qaw2PwAyMqdFzNBNTqPK7YJac";
const WORKFLOW_ID = 'M41AzCPlhql4OhOe';

function log(msg) {
    fs.appendFileSync('update_v3.log', msg + '\n');
    console.log(msg);
}

async function main() {
    try {
        log(`Getting workflow ${WORKFLOW_ID}...`);
        const getRes = await axios.get(`${N8N_BASE_URL}/api/v1/workflows/${WORKFLOW_ID}`, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });

        const currentWorkflow = getRes.data;
        const newDef = JSON.parse(fs.readFileSync('./workflow_seguimientos_diarios.json', 'utf8'));

        // Clean credentials
        const cleanNodes = newDef.nodes.map(n => {
            if (n.type === 'n8n-nodes-base.postgres') {
                if (n.credentials && n.credentials.postgres) {
                    n.credentials.postgres.id = "";
                }
            }
            return n;
        });

        const payload = {
            name: currentWorkflow.name,
            nodes: cleanNodes,
            connections: newDef.connections,
            settings: currentWorkflow.settings || {}
        };

        log('Sending Update...');
        const putRes = await axios.put(`${N8N_BASE_URL}/api/v1/workflows/${WORKFLOW_ID}`, payload, {
            headers: { 'X-N8N-API-KEY': N8N_API_KEY }
        });

        log('✅ Update Success!');

    } catch (error) {
        log('❌ Error updating:');
        if (error.response) {
            log(error.response.status + ' ' + error.response.statusText);
            log(JSON.stringify(error.response.data, null, 2));
        } else {
            log(error.message);
        }
    }
}

main();
