import { listWorkflows, createWorkflow, deleteWorkflow } from './tools/workflow-tools.js';
import fs from 'fs';

async function main() {
    try {
        console.log('Reading sync workflow definition...');
        const workflowJson = JSON.parse(fs.readFileSync('./workflow_n8n_sync.json', 'utf8'));
        const workflowName = workflowJson.name;

        console.log('Searching for existing workflow:', workflowName);
        const listResult = await listWorkflows();

        if (!listResult.success) {
            throw new Error('Failed to list workflows: ' + listResult.error);
        }

        const existingWorkflow = listResult.data.find(w => w.name === workflowName);

        // Delete if exists
        if (existingWorkflow) {
            console.log('Found existing workflow with ID:', existingWorkflow.id);
            console.log('Deleting old workflow...');
            const deleteResult = await deleteWorkflow({ workflowId: existingWorkflow.id });
            console.log('Delete result:', deleteResult.success ? 'OK' : deleteResult.error);
        }

        // Create fresh
        console.log('Creating new workflow...');
        const args = {
            name: workflowJson.name,
            nodes: workflowJson.nodes,
            connections: workflowJson.connections
        };
        const result = await createWorkflow(args);

        if (result.success) {
            console.log('SUCCESS! Workflow created.');
            console.log('ID:', result.data.id);
            console.log('Name:', result.data.name);
            console.log('IMPORTANT: You need to activate this workflow and set credentials in n8n!');
        } else {
            console.error('FAILED to create workflow:', result.error);
        }

    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

main();
