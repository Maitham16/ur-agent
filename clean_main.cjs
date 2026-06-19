const fs = require('fs');

const path = '/Users/maith/Desktop/ur3-gemini/UR-1.5.0/src/main.tsx';
let content = fs.readFileSync(path, 'utf8');

// Strip out URHQ/UR CLI options
content = content.replace(/\.option\('--urai', 'Use UR subscription \(default\)'\)/g, '');

// Strip out auth command block using index
const authCommandStart = content.indexOf(`auth.command('login').description('Sign in to your URHQ account')`);
const authLogoutEnd = content.indexOf(`await authLogout();\n  });`, authCommandStart);
if (authCommandStart !== -1 && authLogoutEnd !== -1) {
  content = content.substring(0, authCommandStart) + content.substring(authLogoutEnd + `await authLogout();\n  });`.length);
}

// Remove telemetry function calls
content = content.replace(/void initializeAnalyticsGates\(\);/g, '');
content = content.replace(/void logStartupTelemetry\(\);/g, '');
content = content.replace(/logSessionTelemetry\(\);/g, '');
content = content.replace(/initializeTelemetryAfterTrust\(\);/g, '');

// Replace uraiMcpPromise
const mcpPromiseOriginal = `const uraiMcpPromise = isNonInteractiveSession ? Promise.resolve({
      clients: [],
      tools: [],
      commands: []
    }) : uraiConfigPromise.then(configs => Object.keys(configs).length > 0 ? prefetchAllMcpResources(configs) : {
      clients: [],
      tools: [],
      commands: []
    });
    // Merge with dedup by name: each prefetchAllMcpResources call independently
    // adds helper tools (ListMcpResourcesTool, ReadMcpResourceTool) via
    // local dedup flags, so merging two calls can yield duplicates. print.ts
    // already uniqBy's the final tool pool, but dedup here keeps appState clean.
    const mcpPromise = Promise.all([localMcpPromise, uraiMcpPromise]).then(([local, urai]) => ({
      clients: [...local.clients, ...urai.clients],
      tools: uniqBy([...local.tools, ...urai.tools], 'name'),
      commands: uniqBy([...local.commands, ...urai.commands], 'name')
    }));`;

const mcpPromiseNew = `const mcpPromise = localMcpPromise;`;
content = content.replace(mcpPromiseOriginal, mcpPromiseNew);

// nullify logEvent globally
// Instead of replacing all logEvent(...) lines which is risky, let's just make the function do nothing in analytics/index.ts
// We'll leave the logEvent calls in main.tsx intact to avoid syntax errors, since analytics/index.ts will be neutered.

fs.writeFileSync(path, content);
console.log("Cleaned main.tsx");
