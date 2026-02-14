import axios from 'axios';
import fs from 'fs';

const logStream = fs.createWriteStream('mcp_auth_test.txt', { flags: 'w', encoding: 'utf8' });
function log(msg) {
    console.log(msg);
    logStream.write(msg + '\n');
}

const MCP_URL = 'https://n8n.cr-sites.com/mcp-server/http';
// Using the token provided by the user in the prompt
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjljMTgwMS1kZmIwLTRkMTktYjk3Mi0zMTdhNjk5YWU2ZWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJtY3Atc2VydmVyLWFwaSIsImp0aSI6IjI0ZGI1Zjg1LWYyYzYtNDhhOS1hZDY4LThkY2I2MzZiNTk1MiIsImlhdCI6MTc2NzMwMjc2N30.8bi5hvcPaHQoCNmu25I2ytpPBfdLUPraJDfdCDb1F68';

log('Testing MCP Connection...');
log('URL: ' + MCP_URL);
log('Token (first 10 chars): ' + TOKEN.substring(0, 10) + '...');

async function testConnection() {
    try {
        const response = await axios.get(MCP_URL, {
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Accept': 'text/event-stream' // MCP uses SSE
            },
            timeout: 10000,
            validateStatus: () => true // Resolve promise for all status codes
        });

        log('------------------------------------------------');
        log('Response Status: ' + response.status + ' ' + response.statusText);
        log('Response Headers: ' + JSON.stringify(response.headers, null, 2));
        log('------------------------------------------------');

        const contentType = response.headers['content-type'];
        log('Content-Type: ' + contentType);

        if (typeof response.data === 'string') {
            log('Body Preview (first 500 chars):');
            log(response.data.substring(0, 500));
        } else {
            log('Body is not a string (likely JSON or stream), previewing:');
            log(JSON.stringify(response.data).substring(0, 500));
        }

    } catch (error) {
        log('FATAL ERROR: ' + error.message);
        if (error.code) log('Error Code: ' + error.code);
    }
}

testConnection();
