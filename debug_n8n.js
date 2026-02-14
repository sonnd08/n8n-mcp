import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Force load .env from current directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(process.cwd(), '.env');

const logStream = fs.createWriteStream('debug_output.txt', { flags: 'w', encoding: 'utf8' });
function log(msg) {
    console.log(msg);
    logStream.write(msg + '\n');
}

log('Current directory: ' + process.cwd());
log('Looking for .env at: ' + envPath);
log('File exists? ' + fs.existsSync(envPath));

const result = dotenv.config();

if (result.error) {
    log('Error loading .env: ' + result.error);
}

log('N8N_BASE_URL: ' + process.env.N8N_BASE_URL);
log('N8N_API_KEY Length: ' + (process.env.N8N_API_KEY ? process.env.N8N_API_KEY.length : 'MISSING'));
log('Snapshot of first 5 chars of API Key: ' + (process.env.N8N_API_KEY ? process.env.N8N_API_KEY.substring(0, 5) : 'N/A'));

// Import utils to see what it resolves
import { n8nApi } from './tools/utils.js';
log('Axios Base URL: ' + n8nApi.defaults.baseURL);

// Test Connection
log('Testing connection...');
try {
    // Attempt a raw axios call to bypass internal wrappers for debugging
    const headers = { 'X-N8N-API-KEY': process.env.N8N_API_KEY };
    const response = await n8nApi.get('/workflows', { headers });
    log('Connection SUCCESS! Workflows found: ' + response.data.data.length);
} catch (error) {
    log('Connection FAILED: ' + error.message);
    if (error.response) {
        log('Status: ' + error.response.status);
        log('Data: ' + JSON.stringify(error.response.data));
    }
}
