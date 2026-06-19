import fs from 'fs';

const sessionTracingFile = '/Users/maith/Desktop/ur3-gemini/UR-1.5.0/src/utils/telemetry/sessionTracing.ts';
if (fs.existsSync(sessionTracingFile)) {
  let content = fs.readFileSync(sessionTracingFile, 'utf8');
  if (!content.includes('endLLMRequestSpan')) {
    content += '\nexport const endLLMRequestSpan = () => {};\n';
  }
  if (!content.includes('startToolBlockedOnUserSpan')) {
    content += '\nexport const startToolBlockedOnUserSpan = () => {};\n';
  }
  if (!content.includes('endToolBlockedOnUserSpan')) {
    content += '\nexport const endToolBlockedOnUserSpan = () => {};\n';
  }
  fs.writeFileSync(sessionTracingFile, content);
} else {
  fs.writeFileSync(sessionTracingFile, 'export const endLLMRequestSpan = () => {};\nexport const startToolBlockedOnUserSpan = () => {};\nexport const endToolBlockedOnUserSpan = () => {};\n');
}

console.log('Fixed for tests 7');
