import { createWorkflow, listWorkflows, updateWorkflow } from './tools/workflow-tools.js';

const SETUP_WORKFLOW = {
    name: "ARES: DB Setup (Run Once)",
    nodes: [
        {
            parameters: {},
            id: "manual-trigger",
            name: "When clicking 'Execute Workflow'",
            type: "n8n-nodes-base.manualTrigger",
            typeVersion: 1,
            position: [250, 300]
        },
        {
            parameters: {
                operation: "executeQuery",
                query: `CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    whatsapp_phone TEXT UNIQUE NOT NULL,
    name TEXT,
    streak_current INT DEFAULT 0,
    streak_highest INT DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    timezone TEXT DEFAULT 'America/Argentina/Buenos_Aires',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    mood_score INT CHECK (mood_score BETWEEN 1 AND 10),
    urge_intensity INT CHECK (urge_intensity BETWEEN 1 AND 10),
    notes TEXT,
    successful_day BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS memories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    message JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(whatsapp_phone);
CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_memories_embedding ON memories USING hnsw (embedding vector_cosine_ops);`,
                options: {}
            },
            id: "postgres-setup",
            name: "Execute Setup SQL",
            type: "n8n-nodes-base.postgres",
            typeVersion: 2.4,
            position: [500, 300]
        }
    ],
    connections: {
        "manual-trigger": {
            main: [[{ node: "postgres-setup", type: "main", index: 0 }]]
        }
    }
};

async function deploy() {
    try {
        console.log(`Checking existing workflow: ${SETUP_WORKFLOW.name}`);
        const list = await listWorkflows();
        const existing = list.data.find(w => w.name === SETUP_WORKFLOW.name);

        if (existing) {
            console.log(`Updating ${SETUP_WORKFLOW.name}...`);
            await updateWorkflow({ workflowId: existing.id, ...SETUP_WORKFLOW });
        } else {
            console.log(`Creating ${SETUP_WORKFLOW.name}...`);
            await createWorkflow(SETUP_WORKFLOW);
        }
        console.log("Success! Setup workflow deployed.");
    } catch (e) {
        console.error('Deployment failed:', e.message);
    }
}

deploy();
