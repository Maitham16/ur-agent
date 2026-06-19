import fs from 'fs';
import path from 'path';

const commandsFile = '/Users/maith/Desktop/ur3-gemini/UR-1.5.0/src/commands.ts';
let content = fs.readFileSync(commandsFile, 'utf8');

const commandsToRemove = ['login', 'logout', 'share', 'oauthRefresh'];

for (const cmd of commandsToRemove) {
  const importRegex = new RegExp(`import ${cmd} from '\\./commands/[a-zA-Z0-9_-]+/index\\.js'\\n`, 'g');
  content = content.replace(importRegex, '');
  
  const exportRegex1 = new RegExp(`^\\s*${cmd},\\n`, 'gm');
  content = content.replace(exportRegex1, '');
  
  const exportRegex2 = new RegExp(`^\\s*${cmd}, // .*\\n`, 'gm');
  content = content.replace(exportRegex2, '');
}

fs.writeFileSync(commandsFile, content);

// Also fix OAUTH_BETA_HEADER in oauth.ts
const oauthFile = '/Users/maith/Desktop/ur3-gemini/UR-1.5.0/src/constants/oauth.ts';
let oauthContent = fs.readFileSync(oauthFile, 'utf8');
if (!oauthContent.includes('OAUTH_BETA_HEADER')) {
  oauthContent += '\nexport const OAUTH_BETA_HEADER = "dummy";\n';
  fs.writeFileSync(oauthFile, oauthContent);
}

console.log('Fixed commands and oauth.ts');
