import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

try {
  const result = execSync('grep -rl "ur_editor" src/', { encoding: 'utf8', cwd: '/Users/maith/Desktop/ur3-gemini/UR-1.5.0' });
  const files = result.trim().split('\n').filter(Boolean);
  
  for (const file of files) {
    const filePath = path.join('/Users/maith/Desktop/ur3-gemini/UR-1.5.0', file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // UI related
    content = content.replace(/ur_editorHide/g, 'cursorHide');
    content = content.replace(/ur_editorShow/g, 'cursorShow');
    content = content.replace(/ur_editorMove/g, 'cursorMove');
    content = content.replace(/ur_editorTo/g, 'cursorTo');
    content = content.replace(/ur_editorRef/g, 'cursorRef');
    content = content.replace(/useDeclaredur_editor/g, 'useDeclaredCursor');
    content = content.replace(/declareur_editor/g, 'declareCursor');
    content = content.replace(/ur_editorFiltered/g, 'cursorFiltered');
    content = content.replace(/showur_editor/g, 'showCursor');
    content = content.replace(/ur_editor/g, 'cursor');
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed', file);
  }
} catch (e) {
  console.log('Error', e.message);
}

try {
  const result = execSync('grep -rl "showcursor" src/', { encoding: 'utf8', cwd: '/Users/maith/Desktop/ur3-gemini/UR-1.5.0' });
  const files = result.trim().split('\n').filter(Boolean);
  
  for (const file of files) {
    const filePath = path.join('/Users/maith/Desktop/ur3-gemini/UR-1.5.0', file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    content = content.replace(/showcursor/g, 'showCursor');
    
    fs.writeFileSync(filePath, content);
  }
} catch (e) {}

console.log('Done');
