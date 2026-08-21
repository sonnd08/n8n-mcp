# n8n MCP Server

> [!IMPORTANT]
> **This repository is archived and no longer maintained.**
>
> For an actively maintained n8n MCP integration, use
> [czlonkowski/n8n-mcp](https://github.com/czlonkowski/n8n-mcp).
>
> Depending on your use case, accessing n8n directly through its API with an API
> key—or using carefully scoped direct database access—may be a simpler, more
> straightforward solution than running a separate MCP server. The focused
> workflow-building guidance in
> [czlonkowski/n8n-skills](https://github.com/czlonkowski/n8n-skills) may also be
> useful alongside your chosen access method.

A comprehensive **Model Context Protocol (MCP) server** that provides AI assistants with direct access to your n8n automation platform. This server enables seamless integration between AI tools (like Claude Desktop) and n8n workflows, variables, credentials, and executions.

## 🚀 Features

### Complete n8n Integration (18 Tools)
- **Workflow Management (7 tools)**
  - `list_workflows` - List all workflows
  - `get_workflow` - Get workflow details by ID
  - `create_workflow` - Create new workflows
  - `update_workflow` - Update existing workflows
  - `delete_workflow` - Delete workflows
  - `activate_workflow` - Activate workflows
  - `deactivate_workflow` - Deactivate workflows

- **Variable Management (5 tools)**
  - `list_variables` - List all variables
  - `get_variable` - Get variable by key
  - `create_variable` - Create new variables
  - `update_variable` - Update existing variables
  - `delete_variable` - Delete variables

- **Credential Management (3 tools)**
  - `list_credentials` - List all credentials (sanitized)
  - `create_credential` - Create new credentials
  - `delete_credential` - Delete credentials

- **Execution Management (2 tools)**
  - `list_executions` - List workflow executions
  - `get_execution` - Get execution details by ID

- **System Management (1 tool)**
  - `self_test` - Test server connectivity and permissions

### Hybrid Architecture
- **MCP Protocol**: Full JSON-RPC 2.0 compliance via stdio transport
- **HTTP Bridge**: Health checks and testing endpoints
- **Auto-detection**: Automatically switches between modes

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- n8n instance running and accessible
- n8n API key configured

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd n8n-mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings:
   # N8N_API_KEY=your-api-key-here
   # N8N_BASE_URL=http://localhost:5678
   # MCP_PORT=3001
   ```

4. **Test the installation**
   ```bash
   # Test HTTP endpoints
   node index.js &
   curl http://localhost:3001/health
   
   # Test MCP protocol
   node test-all-tools.js
   ```

## 🔧 Usage

### For MCP Clients (Claude Desktop, etc.)

The server runs as a stdio-based MCP server for AI clients:

```bash
node index.js
```

**Claude Desktop Configuration** (`~/.claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "n8n": {
      "command": "node",
      "args": ["index.js"],
      "cwd": "/path/to/n8n-mcp",
      "env": {
        "N8N_API_KEY": "your-n8n-api-key-here",
        "N8N_BASE_URL": "http://localhost:5678"
      }
    }
  }
}
```

### For HTTP Monitoring

When run in a terminal (TTY), the server provides HTTP endpoints:

```bash
node index.js
# Server starts on http://localhost:3001

# Available endpoints:
# GET  /health - Health check
# POST /test   - Run self-test
# GET  /       - Usage instructions
```

### Direct MCP Testing

Test the MCP protocol directly:

```bash
# Initialize connection
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | node index.js

# List tools
echo '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' | node index.js

# Call a tool
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"self_test","arguments":{}}}' | node index.js
```

## 🧪 Testing

### Comprehensive Test Suite

Run the complete test suite to validate all 18 tools:

```bash
node test-all-tools.js
```

This will:
- Test MCP protocol compliance
- Validate all tool definitions
- Check n8n API connectivity
- Verify error handling
- Provide detailed results

### Manual Testing

```bash
# Health check
curl http://localhost:3001/health

# Quick self-test
curl -POST http://localhost:3001/test

# Individual tool test
echo '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"list_workflows","arguments":{"limit":5}}}' | node index.js
```

## 🔒 Security

### API Key Management
- Store API keys in environment variables
- Use `.env` files for local development
- Never commit API keys to version control

### Credential Sanitization
- Credential data is automatically sanitized in responses
- Only metadata (ID, name, type) is exposed
- Sensitive credential data is never returned

### Network Security
- HTTP server binds to localhost by default
- CORS headers configured for cross-origin requests
- No sensitive data exposed via HTTP endpoints

## 🐛 Troubleshooting

### Common Issues

**1. "N8N_API_TOKEN not configured"**
```bash
# Solution: Set your API key
export N8N_API_KEY=your-api-key-here
# Or add to .env file
```

**2. "Connection refused" errors**
```bash
# Solution: Check n8n is running
curl http://localhost:5678/api/v1/workflows?limit=1 -H "X-N8N-API-KEY: your-key"
```

**3. "License does not allow for feat:variables"**
```bash
# This is expected for n8n Community Edition
# Variables require n8n Pro/Enterprise license
# The tool will still work but return license errors
```

**4. "GET method not allowed" for credentials**
```bash
# Some n8n configurations restrict credential access
# Check your n8n security settings
```

**5. Port already in use (EADDRINUSE)**
```bash
# Solution: Kill existing process or change port
pkill -f "node index.js"
# Or set different port: MCP_PORT=3002 node index.js
```

### Debug Mode

Enable verbose logging:
```bash
DEBUG=1 node index.js
```

### Validate Configuration

```bash
# Test n8n connectivity
curl -H "X-N8N-API-KEY: your-key" http://localhost:5678/api/v1/workflows?limit=1

# Test MCP server
node test-all-tools.js
```

## 📊 Monitoring

### Health Checks

```bash
# Basic health
curl http://localhost:3001/health

# Detailed system test
curl -X POST http://localhost:3001/test | jq '.result.summary'
```

### Performance Monitoring

The server logs all tool executions and provides timing information:
- Tool execution time
- n8n API response time
- Error rates and types

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `node test-all-tools.js`
5. Submit a pull request

### Adding New Tools

1. Add tool definition in `setupToolHandlers()`
2. Implement the tool method
3. Add test case in `test-all-tools.js`
4. Update documentation

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Related Projects

- [n8n](https://n8n.io/) - Workflow automation platform
- [Model Context Protocol](https://github.com/anthropics/mcp) - Protocol specification
- [Claude Desktop](https://claude.ai/download) - AI assistant with MCP support

## 📞 Support

- **Issues**: Use GitHub Issues for bug reports
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check this README and inline code comments

---

**Ready to automate with AI? 🤖✨**

Your n8n workflows are now accessible to AI assistants through the Model Context Protocol!
