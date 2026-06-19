import fs from 'fs';

const oauthFile = '/Users/maith/Desktop/ur3-gemini/UR-1.5.0/src/constants/oauth.ts';
let oauthContent = fs.readFileSync(oauthFile, 'utf8');
if (!oauthContent.includes('fileSuffixForOauthConfig')) {
  oauthContent += '\nexport const fileSuffixForOauthConfig = "dummy";\n';
  fs.writeFileSync(oauthFile, oauthContent);
}

const commandsFile = '/Users/maith/Desktop/ur3-gemini/UR-1.5.0/src/commands.ts';
let commandsContent = fs.readFileSync(commandsFile, 'utf8');
if (commandsContent.includes('import login from')) {
  commandsContent = commandsContent.replace(/import login from .*\n/g, '');
}
if (commandsContent.includes('import logout from')) {
  commandsContent = commandsContent.replace(/import logout from .*\n/g, '');
}
fs.writeFileSync(commandsFile, commandsContent);

console.log('Fixed for tests');
