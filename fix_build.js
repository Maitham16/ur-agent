import fs from 'fs';

const printFile = '/Users/maith/Desktop/ur3-gemini/UR-1.5.0/src/cli/print.ts';
if (fs.existsSync(printFile)) {
  let content = fs.readFileSync(printFile, 'utf8');
  content = content.replace(/import \{ OAuthService \} from 'src\/services\/oauth\/index\.js'\n?/g, '');
  content = content.replace(/OAuthService/g, 'any');
  fs.writeFileSync(printFile, content);
}

const notifsFile = '/Users/maith/Desktop/ur3-gemini/UR-1.5.0/src/hooks/notifs/useCanSwitchToExistingSubscription.tsx';
if (fs.existsSync(notifsFile)) {
  let content = fs.readFileSync(notifsFile, 'utf8');
  content = content.replace(/import \{.*\} from 'src\/services\/oauth\/getOauthProfile\.js';\n?/g, 'const getOauthProfileFromApiKey = () => null;');
  fs.writeFileSync(notifsFile, content);
}

const upgradeFile = '/Users/maith/Desktop/ur3-gemini/UR-1.5.0/src/commands/upgrade/upgrade.tsx';
if (fs.existsSync(upgradeFile)) {
  let content = fs.readFileSync(upgradeFile, 'utf8');
  content = content.replace(/import \{.*\} from '\.\.\/\.\.\/services\/oauth\/getOauthProfile\.js';\n?/g, 'const getOauthProfileFromOauthToken = () => null;');
  fs.writeFileSync(upgradeFile, content);
}

const installGitHubFile = '/Users/maith/Desktop/ur3-gemini/UR-1.5.0/src/commands/install-github-app/OAuthFlowStep.tsx';
if (fs.existsSync(installGitHubFile)) {
  let content = fs.readFileSync(installGitHubFile, 'utf8');
  content = content.replace(/import \{ OAuthService \} from '\.\.\/\.\.\/services\/oauth\/index\.js';\n?/g, 'type OAuthService = any;\n');
  content = content.replace(/OAuthService\.startFlow/g, '(() => null)');
  fs.writeFileSync(installGitHubFile, content);
}

const vimOpsFile = '/Users/maith/Desktop/ur3-gemini/UR-1.5.0/src/vim/operators.ts';
if (fs.existsSync(vimOpsFile)) {
  let content = fs.readFileSync(vimOpsFile, 'utf8');
  content = content.replace(/\.\.\/utils\/ur_editor\.js/g, '../utils/cursor.js');
  content = content.replace(/ur_editor/g, 'cursor');
  fs.writeFileSync(vimOpsFile, content);
}

console.log('Fixed build errors');
