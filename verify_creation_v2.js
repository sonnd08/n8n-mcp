
import { listWorkflows } from './tools/workflow-tools.js';
import fs from 'fs';

// Set env vars
process.env.N8N_BASE_URL = "https://n8n.cr-sites.com";
process.env.N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjljMTgwMS1kZmIwLTRkMTktYjk3Mi0zMTdhNjk5YWU2ZWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY0ODEyNzY1fQ.xH7WbiBpiVeAnrib26qaw2PwAyMqdFzNBNTqPK7YJac";

function log(msg) {
    fs.appendFileSync('verify_log.txt', msg + '\n');
}

async function main() {
    try {
        log("Listing workflows...");
        const result = await listWorkflows({ limit: 100 });
        if (result.success) {
            const myWorkflow = result.data.find(w => w.name === "Image Generation Mockup (Replicate)");
            if (myWorkflow) {
                log(`FOUND: ${myWorkflow.name} (ID: ${myWorkflow.id})`);
                log(`Active: ${myWorkflow.active}`);
            } else {
                log("NOT FOUND: Workflow with that name not found.");
            }
        } else {
            log("Error listing: " + result.error);
        }
    } catch (e) {
        log("Exception: " + e.message);
    }
}
main();
