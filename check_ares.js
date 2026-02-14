import { listWorkflows } from './tools/workflow-tools.js';
import fs from 'fs';

const logStream = fs.createWriteStream('workflow_check.txt', { flags: 'w', encoding: 'utf8' });
function log(msg) {
    console.log(msg);
    logStream.write(msg + '\n');
}

async function check() {
    try {
        log('Listing all workflows...');
        const result = await listWorkflows(); // Removed limit to get all
        if (result.success) {
            const aresWorkflows = result.data.filter(w => w.name.includes('ARES'));
            log('Found ' + aresWorkflows.length + ' ARES workflows:');
            aresWorkflows.forEach(w => log('- ' + w.name + ' (ID: ' + w.id + ', Active: ' + w.active + ')'));

            if (aresWorkflows.length === 0) {
                log('No ARES workflows found in the ' + result.data.length + ' total workflows.');
                log('Sample of existing names:');
                result.data.slice(0, 5).forEach(w => log('- ' + w.name));
            }
        } else {
            log('Failed to list workflows: ' + result.error);
        }
    } catch (e) {
        log('Error checking workflows: ' + e.message);
    }
}

check();
