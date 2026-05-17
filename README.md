# OmniCue

Autonomous, real-time context-matching meeting companion.

## Local Development Guide

To test the full OmniCue stack locally before deploying to Google Cloud, follow these steps.

### 1. Start Local Elasticsearch
We use Docker to run a local, single-node Elasticsearch cluster without security (for ease of local development).

```bash
docker-compose up -d
```
Verify it's running by navigating to `http://localhost:9200`.

### 2. Ingest Mock Data
We have a set of mock enterprise documents in `static_mock_data/`. To index them into the local Elasticsearch instance:

```bash
cd scripts
npm install
node ingest_local.js
```
This will create the `company-knowledge-base` index and upload the 8 mock files.

### 3. Start the Elastic MCP Server
The Model Context Protocol (MCP) server acts as a bridge between the AI Agent and our Elasticsearch cluster. Run the official Elastic MCP server locally, pointing it to your local Docker container:

```bash
export ES_URL="http://localhost:9200"
npx -y @elastic/mcp-server-elasticsearch
```
*(Note: This process will appear to "hang" because it is listening for messages on standard input/output).*

### 3.1 Verify the MCP Server (Optional but Recommended)
To test that your MCP server is correctly connecting to Elasticsearch and exposing tools, you can use the official MCP Inspector. **Open a new terminal window** and run:

```bash
export ES_URL="http://localhost:9200"
npx @modelcontextprotocol/inspector npx @elastic/mcp-server-elasticsearch
```
The inspector will output a unique URL in your terminal (e.g., `http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=...`). Open that exact URL in your browser, click "Connect", and navigate to the **Tools** tab to trigger the `search` tool.

**Test Configuration:**
Provide the following exact arguments in the inspector UI to verify your data:
- **index**: `company-knowledge-base`
- **queryBody**: 
  ```json
  {
    "query": {
      "match": {
        "raw_markdown": "code freeze"
      }
    }
  }
  ```

### 4. Expose the MCP Server to the Internet (For GCP Agent Builder)
If you want to connect your local MCP server to Google Cloud Agent Builder (which runs in the cloud), you must expose it via a tunneling service like Ngrok:

```bash
ngrok http <mcp_server_port>
```
*Note: The MCP server typically communicates over stdio or SSE. Check the MCP documentation for specific port configurations if running an HTTP/SSE transport.*

Take the resulting public Ngrok URL and input it into your GCP Agent Builder Tool configuration.
