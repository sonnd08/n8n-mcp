
import fs from 'fs';

// Set env vars
process.env.N8N_BASE_URL = "https://n8n.cr-sites.com";
process.env.N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjljMTgwMS1kZmIwLTRkMTktYjk3Mi0zMTdhNjk5YWU2ZWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY0ODEyNzY1fQ.xH7WbiBpiVeAnrib26qaw2PwAyMqdFzNBNTqPK7YJac";

function log(msg) {
    fs.appendFileSync('creds_log.txt', msg + '\n');
    console.log(msg);
}

async function main() {
    try {
        const { n8nApi, getAuthenticatedConfig } = await import('./tools/utils.js');
        const config = getAuthenticatedConfig({}, null, new Map());

        log('Listing credentials...');
        const response = await n8nApi.get('/credentials', config);

        const postgresCreds = response.data.data.filter(c =>
            c.name.includes('Postgres') || c.type.includes('postgres')
        );

        log('Postgres credentials found:');
        log(JSON.stringify(postgresCreds, null, 2));

    } catch (error) {
        log('Error: ' + error.message);
    }
}

main();
