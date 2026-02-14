
import { listWorkflows } from './tools/workflow-tools.js';

// Set env vars
process.env.N8N_BASE_URL = "https://n8n.cr-sites.com";
process.env.N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjljMTgwMS1kZmIwLTRkMTktYjk3Mi0zMTdhNjk5YWU2ZWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY0ODEyNzY1fQ.xH7WbiBpiVeAnrib26qaw2PwAyMqdFzNBNTqPK7YJac";

async function main() {
    try {
        console.log("Listing workflows...");
        const result = await listWorkflows({ limit: 100 });
        if (result.success) {
            const myWorkflow = result.data.find(w => w.name === "Image Generation Mockup (Replicate)");
            if (myWorkflow) {
                console.log(`FOUND: ${myWorkflow.name} (ID: ${myWorkflow.id})`);
                console.log(`Active: ${myWorkflow.active}`);
            } else {
                console.log("NOT FOUND: Workflow with that name not found.");
            }
        } else {
            console.error("Error listing:", result.error);
        }
    } catch (e) {
        console.error(e);
    }
}
main();
