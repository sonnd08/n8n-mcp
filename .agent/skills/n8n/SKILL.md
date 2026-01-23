---
name: n8n Expert Development
description: Specialized workflow for developing, debugging, and maintaining n8n workflows with a focus on safety and reliability.
---

# n8n Expert Development Skill

This skill defines the strict protocols and best practices for working with n8n workflows. It is designed to prevent data loss, logic errors, and "hallucinated" nodes.

## 🛡️ WORKFLOW PHILOSOPHY: "SAFE TRACK"

When working with n8n, you must **ALWAYS** activate the **SAFE TRACK** mode. This is non-negotiable.

### 1. Stop & Think (CRITICAL)
*   **NEVER** modify an existing JSON workflow file directly without analyzing it first.
*   **NEVER** generate a new JSON workflow file without a prior approved plan.
*   **NEVER** assume a node exists or works a certain way without verifying documentation or context.

### 2. Proposal Phase
Before generating any JSON or Javascript code for n8n, you must present a detailed **Implementation Plan**:
*   **Trigger:** What starts the workflow? (Webhook, Cron, Event).
*   **Data Flow:** Describe the input data structure.
*   **Logic Steps:** List the nodes you intend to use and **why**.
    *   *Example:* "Use a 'Set' node to normalize key names."
    *   *Example:* "Use 'HTTPRequest' to call the external API."
*   **Error Handling:** How will failures be managed? (e.g., Error Trigger, Slack notification, "Continue on Fail").

### 3. Verification & confirmation
*   **WAIT** for the user to explicitly say "Adelante", "Proceed", or "Approved".
*   **DO NOT** generate the JSON file in the same turn as the proposal.

### 4. Finalization
*   Once approved, generate the **complete** JSON content.
*   Ensure the JSON is valid and ready for import into n8n.
*   If using the `n8n-mcp` tools, use `deploy_workflow.js` or `create_workflow_impl.js` logic where appropriate, but prefer delivering the JSON for the user to import if direct access is risky.

---

## 🛠️ Technical Best Practices

### Node Configuration
*   **Naming:** Give nodes descriptive names (e.g., `Fetch User Data` instead of `Supabase`).
*   **Expressions:** Use standard n8n expression syntax `{{ $json.field }}`. Beware of version differences in syntax.

### Common Integrations
*   **Evolution API:** Used for WhatsApp integration. Ensure API keys and Base URLs are parameterized or strictly defined in the environment.
*   **Supabase:** Preferred database. Use the `Supabase` node or `Postgres` node (if direct connection is better).
*   **JavaScript:** When using the `Code` node, write defensive code. Handle `undefined` inputs gracefully.

### Error Handling Patterns
*   **Critical Workflows:** Must have an `Error Trigger` node connecting to a notification service (e.g., WhatsApp Admin, Email).
*   **Item-Level Errors:** For processing lists, enable "Continue On Fail" on the processing node and use a `Switch` node immediately after to filter out `error` results.

### Environment & Context
*   Be aware of the `n8n-mcp` directory context.
*   Credentials are often managed via environment variables (`.env`).
*   Do not hardcode secrets in the JSON.

---

## 🚦 Interaction Checklist

Before marking a task as complete:
- [ ] Has the user approved the logic flow?
- [ ] Is the generated JSON valid?
- [ ] Have you considered edge cases (empty lists, API failures)?
