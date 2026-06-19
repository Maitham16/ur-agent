import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

// Find all files that import from ur_editor
try {
  const result = execSync('grep -rl "ur_editor\\.js" src/', { encoding: 'utf8', cwd: '/Users/maith/Desktop/ur3-gemini/UR-1.5.0' });
  const files = result.trim().split('\n').filter(Boolean);
  
  for (const file of files) {
    const filePath = path.join('/Users/maith/Desktop/ur3-gemini/UR-1.5.0', file);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/ur_editor\.js/g, 'cursor.js');
    content = content.replace(/import type \{ ur_editor \} from '\.\.\/utils\/cursor\.js'/g, "import type { Cursor } from '../utils/cursor.js'");
    content = content.replace(/import \{ ur_editor \} from '\.\.\/utils\/cursor\.js'/g, "import { Cursor } from '../utils/cursor.js'");
    content = content.replace(/ur_editor\./g, 'Cursor.');
    // change type annotations
    content = content.replace(/: ur_editor/g, ': Cursor');
    // change parameter types
    content = content.replace(/\(ur_editor: ur_editor/g, '(cursor: Cursor');
    content = content.replace(/, ur_editor: ur_editor/g, ', cursor: Cursor');
    content = content.replace(/ctx\.ur_editor/g, 'ctx.cursor');
    fs.writeFileSync(filePath, content);
    console.log('Fixed', file);
  }
} catch (e) {
  console.log('Error', e.message);
}

// Find all instances of ctx.ur_editor and ur_editor
try {
  const result = execSync('grep -rl "ur_editor" src/', { encoding: 'utf8', cwd: '/Users/maith/Desktop/ur3-gemini/UR-1.5.0' });
  const files = result.trim().split('\n').filter(Boolean);
  
  for (const file of files) {
    const filePath = path.join('/Users/maith/Desktop/ur3-gemini/UR-1.5.0', file);
    let content = fs.readFileSync(filePath, 'utf8');
    // We already renamed the file import above. Let's just fix other usages
    content = content.replace(/ctx\.ur_editor/g, 'ctx.cursor');
    content = content.replace(/ur_editor: ur_editor/g, 'cursor: Cursor');
    fs.writeFileSync(filePath, content);
  }
} catch (e) {}

console.log('Done');
