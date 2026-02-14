
import fs from 'fs';

// Set env vars
process.env.N8N_BASE_URL = "https://n8n.cr-sites.com";
process.env.N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjljMTgwMS1kZmIwLTRkMTktYjk3Mi0zMTdhNjk5YWU2ZWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY0ODEyNzY1fQ.xH7WbiBpiVeAnrib26qaw2PwAyMqdFzNBNTqPK7YJac";

function log(msg) {
    fs.appendFileSync('update_log.txt', msg + '\n');
    console.log(msg);
}

async function main() {
    try {
        const { updateWorkflow } = await import('./tools/workflow-tools.js');

        log('Reading workflow definition...');
        // Asegurarnos de leer el archivo correcto que tiene el nodo Postgres
        const workflowJson = JSON.parse(fs.readFileSync('./workflow_seguimientos_diarios.json', 'utf8'));
        const workflowId = 'M41AzCPlhql4OhOe'; // ID del workflow activo

        // Remove credentials object to avoid validation error if ID is invalid
        // Or set 'id' to empty string to prompt user selection
        const pgNode = workflowJson.nodes.find(n => n.type === 'n8n-nodes-base.postgres');
        if (pgNode) {
            log('Postgres node found. Cleaning credentials for manual selection...');
            // We keep the credential TYPE but remove the ID so n8n asks for it
            // pgNode.credentials = { postgres: { id: "" } }; 
            // Actually, safe bet is to remove it or try a potential ID if we had one.
            // Let's try sending it without specific credential ID binding if possible, 
            // or just kept as is (placeholder) which might show as missing credential in UI.

            // Si mandamos un ID que no existe, n8n suele aceptarlo pero muestra error en UI.
            // El JSON actual tiene "POSTGRES_CRED_ID_PLACEHOLDER".
        }

        log(`Updating workflow ${workflowId} with Postgres node...`);

        const args = {
            workflowId: workflowId,
            nodes: workflowJson.nodes,
            connections: workflowJson.connections
        };

        const result = await updateWorkflow(args);

        log('Update Result:');
        log(JSON.stringify(result, null, 2));

        if (result.success) {
            log('✅ Workflow updated successfully!');
        } else {
            log('❌ Failed to update workflow: ' + result.error);
        }

    } catch (error) {
        log('Unexpected error: ' + error.message);
        if (error.stack) log(error.stack);
    }
}

main();
