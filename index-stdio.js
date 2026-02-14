#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    ListToolsRequestSchema,
    CallToolRequestSchema,
    ErrorCode,
    McpError
} from '@modelcontextprotocol/sdk/types.js';
import dotenv from 'dotenv';

// Import tool modules
import { toolRegistry } from './tools/tool-registry.js';
import { dispatchTool } from './tools/tool-dispatcher.js';

// Load environment variables
dotenv.config();

const N8N_API_KEY = process.env.N8N_API_KEY;

if (!N8N_API_KEY) {
    console.error('Error: N8N_API_KEY environment variable is required for Stdio mode.');
    process.exit(1);
}

class N8nStdioServer {
    constructor() {
        this.server = new Server(
            {
                name: 'n8n-mcp-server',
                version: '1.0.0',
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        );

        this.setupHandlers();
        this.setupErrorHandling();
    }

    setupHandlers() {
        // List Tools Handler
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: toolRegistry,
            };
        });

        // Call Tool Handler
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;

            try {
                // In Stdio mode, we rely on environment variables for auth.
                // We pass empty headers and session, so utils.js will fallback to process.env.N8N_API_KEY
                const result = await dispatchTool(name, args || {}, {}, null, new Map());

                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(result, null, 2),
                        },
                    ],
                };
            } catch (error) {
                // Handle specific error codes if available, otherwise generic
                if (error.message && error.message.includes('Unknown tool')) {
                    throw new McpError(ErrorCode.MethodNotFound, error.message);
                }

                throw new McpError(ErrorCode.InternalError, error.message);
            }
        });
    }

    setupErrorHandling() {
        this.server.onerror = (error) => {
            console.error('[MCP Error]', error);
        };

        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }

    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('n8n MCP Server running on stdio');
    }
}

const server = new N8nStdioServer();
server.run().catch((error) => {
    console.error('Fatal error running server:', error);
    process.exit(1);
});
