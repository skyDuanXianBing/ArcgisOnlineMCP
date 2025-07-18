#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createServer } from "./server.js";

async function main() {
  const server: McpServer = createServer();

  // For Smithery TypeScript Deploy, use stdio transport
  // Smithery will handle the HTTP layer automatically
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("ArcGIS Online MCP Server running on Smithery with TypeScript Deploy");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
