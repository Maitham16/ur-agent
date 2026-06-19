const fs = require('fs');
const path = require('path');

const filesToClean = [
  'src/entrypoints/init.ts',
  'src/components/Feedback.tsx',
  'src/hooks/useApiKeyVerification.ts',
  'src/query/deps.ts',
  'src/QueryEngine.ts',
  'src/services/awaySummary.ts',
  'src/services/compact/autoCompact.ts',
  'src/services/compact/compact.ts',
  'src/services/mockRateLimits.ts',
  'src/commands/privacy-settings/privacy-settings.tsx',
  'src/components/grove/Grove.tsx'
];

for (const file of filesToClean) {
  const fullPath = path.join('/Users/maith/Desktop/ur3-gemini/UR-1.5.0', file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    // Remove imports containing ur.js, grove.js, oauth
    content = content.replace(/import\s+.*?\s+from\s+['"].*?ur\.js['"];?\n/g, '');
    content = content.replace(/import\s+.*?\s+from\s+['"].*?grove\.js['"];?\n/g, '');
    content = content.replace(/import\s+.*?\s+from\s+['"].*?oauth.*?['"];?\n/g, '');
    fs.writeFileSync(fullPath, content);
    console.log("Cleaned", file);
  } else {
    console.log("Not found", file);
  }
}
