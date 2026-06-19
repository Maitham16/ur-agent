import fs from 'fs';

const perfettoFile = '/Users/maith/Desktop/ur3-gemini/UR-1.5.0/src/utils/telemetry/perfettoTracing.ts';
if (fs.existsSync(perfettoFile)) {
  let content = fs.readFileSync(perfettoFile, 'utf8');
  if (!content.includes('isPerfettoTracingEnabled')) {
    content += '\nexport const isPerfettoTracingEnabled = () => false;\n';
    fs.writeFileSync(perfettoFile, content);
  }
}

console.log('Fixed for tests 4');
