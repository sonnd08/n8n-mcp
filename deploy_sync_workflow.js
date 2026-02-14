import { listWorkflows, createWorkflow, updateWorkflow } from './tools/workflow-tools.js';
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

        let result;
        if (existingWorkflow) {
            console.log('Found existing workflow with ID:', existingWorkflow.id);
            console.log('Updating workflow...');
            const args = {
                workflowId: existingWorkflow.id,
                name: workflowJson.name,
                nodes: workflowJson.nodes,
                connections: workflowJson.connections
            };
            result = await updateWorkflow(args);
        } else {
            console.log('Workflow not found. Creating new one...');
            const args = {
                name: workflowJson.name,
                nodes: workflowJson.nodes,
                connections: workflowJson.connections
            };
            result = await createWorkflow(args);
        }

        if (result.success) {
            console.log('SUCCESS! Workflow processed.');
            console.log('ID:', result.data.id);
            console.log('Name:', result.data.name);
        } else {
            console.error('FAILED to process workflow:', result.error);
        }

    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

main();
