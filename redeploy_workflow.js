import { deleteWorkflow, createWorkflow } from './tools/workflow-tools.js';
import fs from 'fs';

async function main() {
    try {
        const oldWorkflowId = 'xjiVvATOqvZLxcKZ';

        // Delete old workflow
        console.log('Deleting old workflow:', oldWorkflowId);
        const deleteResult = await deleteWorkflow({ workflowId: oldWorkflowId });
        if (deleteResult.success) {
            console.log('Old workflow deleted successfully');
        } else {
            console.log('Warning: Could not delete old workflow:', deleteResult.error);
        }

        // Create new workflow
        console.log('Reading updated workflow definition...');
        const workflowJson = JSON.parse(fs.readFileSync('./workflow_seo_extractor.json', 'utf8'));

        console.log('Creating workflow:', workflowJson.name);

        const args = {
            name: workflowJson.name,
            nodes: workflowJson.nodes,
            connections: workflowJson.connections
        };

        const result = await createWorkflow(args);

        if (result.success) {
            console.log('SUCCESS! Workflow created.');
            console.log('ID:', result.data.id);
            console.log('Active:', result.data.active);
            console.log('Name:', result.data.name);
        } else {
            console.error('FAILED to create workflow:', result.error);
            console.error('Status code:', result.statusCode);
        }

    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

main();
