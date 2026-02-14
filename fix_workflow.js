import { deleteWorkflow, createWorkflow } from './tools/workflow-tools.js';

async function main() {
    try {
        const oldWorkflowId = 'Xxv14Eqn5p2qb9E6';

        // Delete old workflow
        console.log('Deleting old workflow:', oldWorkflowId);
        const deleteResult = await deleteWorkflow({ workflowId: oldWorkflowId });
        console.log('Delete result:', deleteResult.success ? 'OK' : deleteResult.error);

        // Create new workflow with correct configuration
        const workflowData = {
            name: "SEO Data Extractor",
            nodes: [
                {
                    "parameters": {
                        "httpMethod": "POST",
                        "path": "seo-analysis",
                        "options": {}
                    },
                    "type": "n8n-nodes-base.webhook",
                    "typeVersion": 2,
                    "position": [0, 0],
                    "id": "webhook-node",
                    "name": "Webhook Trigger"
                },
                {
                    "parameters": {
                        "operation": "google",
                        "q": "={{ $json.body.keyword }}",
                        "additionalFields": {
                            "gl": "ar",
                            "hl": "es"
                        },
                        "requestOptions": {}
                    },
                    "type": "n8n-nodes-serpapi.serpApi",
                    "typeVersion": 1,
                    "position": [250, 0],
                    "id": "serpapi-node",
                    "name": "Google SERP Search"
                },
                {
                    "parameters": {
                        "options": {
                            "temperature": 0.2
                        }
                    },
                    "type": "@n8n/n8n-nodes-langchain.lmChatGoogleGemini",
                    "typeVersion": 1,
                    "position": [500, 200],
                    "id": "google-gemini-model",
                    "name": "Google Gemini Chat Model"
                },
                {
                    "parameters": {
                        "promptType": "define",
                        "text": "=### ROLE\nYou are a Senior SEO Strategist and Conversion Rate Optimization (CRO) Expert specializing in \"Rank and Rent\" local service websites for the Argentine market.\n\n### TASK\nAnalyze the provided SERP Data. Compare the content found in the top competitors against your internal expert knowledge of what a perfect, comprehensive service page should contain.\n\n### INPUT DATA\n1. Target Keyword/Niche: {{ $(\"Webhook Trigger\").item.json.body.keyword }}\n2. Location: Argentina (gl: ar)\n3. SERP Data (Competitors): {{ JSON.stringify($json) }}\n\n### ANALYSIS LOGIC\n1. **Identify Entities Found:** What topics are the competitors already covering?\n2. **Identify TRUE GAPS:** Based on your expert knowledge of the trade (e.g., specific tools, regulations, common emergency pain points in Argentina), what are the competitors FAILING to mention? These are my opportunities.\n3. **Interactive Tool Ideation:** Propose a logic-based \"Micro-Tool\" (Calculator, Quiz, Estimator) specific to this niche that helps the user solve a specific doubt regarding price or quantity.\n\n### OUTPUT FORMAT\nReturn ONLY a raw JSON object. No markdown, no intro.\nUse this schema:\n\n{\n  \"analysis_summary\": {\n    \"niche_difficulty\": \"Low/Medium/High\",\n    \"search_intent\": \"Informational/Transactional\"\n  },\n  \"semantic_profile\": {\n    \"core_entities_found\": [\"Array of strings\"],\n    \"missing_semantic_gaps\": [\"Array of strings: Critical topics NOT found in SERP\"],\n    \"local_nuances\": [\"Array of strings: Rioplatense terms to use (e.g., 'Flete', 'Cochera', 'Presupuesto')\"]\n  },\n  \"content_strategy\": {\n    \"recommended_h1\": \"String\",\n    \"structure_outline\": [\n      {\n        \"heading_level\": \"H2\",\n        \"title\": \"String\",\n        \"content_instructions\": \"String: How to fill the gap here\"\n      }\n    ]\n  },\n  \"interactive_tool_suggestion\": {\n    \"tool_name\": \"String (e.g., 'Calculadora de Materiales')\",\n    \"tool_goal\": \"String (What problem does it solve?)\",\n    \"required_inputs\": [\"Array of strings: What does the user need to enter? e.g., 'Ancho', 'Largo', 'Tipo de Material'\"],\n    \"logic_description\": \"String: How to calculate the result based on inputs\"\n  }\n}",
                        "hasOutputParser": false
                    },
                    "type": "@n8n/n8n-nodes-langchain.chainLlm",
                    "typeVersion": 1.4,
                    "position": [500, 0],
                    "id": "ai-agent-chain",
                    "name": "SEO Strategist Agent"
                },
                {
                    "parameters": {
                        "jsCode": "const rawOutput = items[0].json.text || \"\";\nconst cleanJson = rawOutput.replace(/```json/g, \"\").replace(/```/g, \"\").trim();\n\ntry {\n  const parsed = JSON.parse(cleanJson);\n  return { json: parsed };\n} catch (e) {\n  return { json: { error: \"Failed to parse JSON\", raw_output: rawOutput } };\n}"
                    },
                    "type": "n8n-nodes-base.code",
                    "typeVersion": 2,
                    "position": [850, 0],
                    "id": "cleanup-json-node",
                    "name": "Clean JSON"
                },
                {
                    "parameters": {
                        "respondWith": "json",
                        "responseBody": "={{ $json }}",
                        "options": {}
                    },
                    "type": "n8n-nodes-base.respondToWebhook",
                    "typeVersion": 1.1,
                    "position": [1100, 0],
                    "id": "response-node",
                    "name": "Send API Response"
                }
            ],
            connections: {
                "Webhook Trigger": {
                    "main": [[{ "node": "Google SERP Search", "type": "main", "index": 0 }]]
                },
                "Google SERP Search": {
                    "main": [[{ "node": "SEO Strategist Agent", "type": "main", "index": 0 }]]
                },
                "Google Gemini Chat Model": {
                    "ai_languageModel": [[{ "node": "SEO Strategist Agent", "type": "ai_languageModel", "index": 0 }]]
                },
                "SEO Strategist Agent": {
                    "main": [[{ "node": "Clean JSON", "type": "main", "index": 0 }]]
                },
                "Clean JSON": {
                    "main": [[{ "node": "Send API Response", "type": "main", "index": 0 }]]
                }
            }
        };

        console.log('Creating new workflow...');
        const result = await createWorkflow(workflowData);

        if (result.success) {
            console.log('SUCCESS! Workflow created.');
            console.log('ID:', result.data.id);
            console.log('Active:', result.data.active);
            console.log('Name:', result.data.name);
        } else {
            console.error('FAILED:', result.error);
            console.error('Status code:', result.statusCode);
        }

    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

main();
