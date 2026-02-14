
import axios from 'axios';
import fs from 'fs';

const N8N_BASE_URL = "https://n8n.cr-sites.com";
const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjljMTgwMS1kZmIwLTRkMTktYjk3Mi0zMTdhNjk5YWU2ZWMiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY0ODEyNzY1fQ.xH7WbiBpiVeAnrib26qaw2PwAyMqdFzNBNTqPK7YJac";

async function main() {
    try {
        console.log('Requesting credentials...');
        if (!process.env.N8N_API_KEY) {
            // Fallback or explicit set if env not working for some reason
        }

        const response = await axios.get(`${N8N_BASE_URL}/api/v1/credentials`, {
            headers: {
                'X-N8N-API-KEY': N8N_API_KEY,
                'Content-Type': 'application/json'
            }
        });

        const creds = response.data.data.filter(c =>
            c.name.toLowerCase().includes('postgres') ||
            c.type.toLowerCase().includes('postgres')
        );

        console.log('Found credentials:', creds.length);
        fs.writeFileSync('creds.json', JSON.stringify(creds, null, 2));
        console.log('Saved to creds.json');

    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) console.error(JSON.stringify(error.response.data));
    }
}

main();
