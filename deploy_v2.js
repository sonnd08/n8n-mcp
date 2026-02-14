import { createWorkflow } from './tools/workflow-tools.js';
import fs from 'fs';

// Override env vars after module load but before API calls
// Note: utils.js reads these at module load, so we use .env file instead
// For this script, we'll pass credentials directly

async function main() {
    try {
        console.log('Reading workflow definition...');
        const workflowJson = JSON.parse(fs.readFileSync('./workflow_seo_extractor.json', 'utf8'));

        console.log('Deploying workflow:', workflowJson.name);
        console.log('Target URL:', process.env.N8N_BASE_URL || 'from .env');

        const args = {
            name: workflowJson.name,
            nodes: workflowJson.nodes,
            connections: workflowJson.connections,
            settings: workflowJson.settings || {}
        };

        const result = await createWorkflow(args);

        if (result.success) {
            console.log('SUCCESS! Workflow deployed.');
            console.log('ID:', result.data.id);
            console.log('Active:', result.data.active);
            console.log('Name:', result.data.name);
        } else {
            console.error('FAILED to deploy workflow:', result.error);
            console.error('Status code:', result.statusCode);
        }

    } catch (error) {
        console.error('Unexpected error:', error.message);
        if (error.response) {
            console.error('API Response:', JSON.stringify(error.response.data, null, 2));
        }
    }
}

main();
