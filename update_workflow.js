import { updateWorkflow, deleteWorkflow } from './tools/workflow-tools.js';
import fs from 'fs';

async function main() {
    try {
        const workflowId = 'xjiVvATOqvZLxcKZ'; // ID from previous deploy

        console.log('Reading updated workflow definition...');
        const workflowJson = JSON.parse(fs.readFileSync('./workflow_seo_extractor.json', 'utf8'));

        console.log('Updating workflow:', workflowJson.name);
        console.log('Workflow ID:', workflowId);

        const args = {
            workflowId: workflowId,
            name: workflowJson.name,
            nodes: workflowJson.nodes,
            connections: workflowJson.connections,
            settings: workflowJson.settings || {}
        };

        const result = await updateWorkflow(args);

        if (result.success) {
            console.log('SUCCESS! Workflow updated.');
            console.log('ID:', result.data.id);
            console.log('Active:', result.data.active);
            console.log('Name:', result.data.name);
        } else {
            console.error('FAILED to update workflow:', result.error);
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
