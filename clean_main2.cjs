const fs = require('fs');

const path = '/Users/maith/Desktop/ur3-gemini/UR-1.5.0/src/main.tsx';
let content = fs.readFileSync(path, 'utf8');

// Strip out URHQ/UR CLI options and auth command
content = content.replace(/\.option\('--urai', 'Use UR subscription \(default\)'\)/g, '');
content = content.replace(/auth\.command\('login'\)[\s\S]*?authLogout\(\);\n  \}\);\n/g, '');

// nullify urai MCP
content = content.replace(/const uraiMcpPromise = isNonInteractiveSession \? Promise\.resolve\(\{[\s\S]*?clients: \[\.\.\.local\.clients, \.\.\.urai\.clients\],[\s\S]*?\}\);/g, 
  `const uraiMcpPromise = Promise.resolve({ clients: [], tools: [], commands: [] });
    const mcpPromise = localMcpPromise.then((local) => ({
      clients: local.clients,
      tools: local.tools,
      commands: local.commands
    }));`);

// Strip out telemetry initialization
content = content.replace(/void initializeAnalyticsGates\(\);/g, '');
content = content.replace(/void logStartupTelemetry\(\);/g, '');
content = content.replace(/logSessionTelemetry\(\);/g, '');
content = content.replace(/initializeTelemetryAfterTrust\(\);/g, '');

// For logEvent, just leave it as is or replace the import to do nothing? 
// The prompt said "strip ... telemetry from main.tsx". Let's remove the function bodies of logEvent in analytics/index.ts.
// But to strip from main.tsx, maybe I should just remove the lines containing `logEvent(`? That breaks multiline statements.

fs.writeFileSync(path, content);
console.log("Cleaned main.tsx");
