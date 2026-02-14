import { getWorkflow } from './tools/workflow-tools.js';

async function main() {
    try {
        const workflowId = 'Xxv14Eqn5p2qb9E6';

        console.log('Fetching workflow:', workflowId);
        const result = await getWorkflow({ workflowId });

        if (result.success) {
            console.log(JSON.stringify(result.data, null, 2));
        } else {
            console.error('FAILED:', result.error);
        }

    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

main();
