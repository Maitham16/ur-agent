import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

try {
  // First, rename files
  const filesToRename = [
    'src/ink/cursor.ts',
    'src/ink/hooks/use-declared-cursor.ts',
    'src/ink/components/cursorDeclarationContext.ts',
    'src/utils/cursor.ts'
  ];

  for (const file of filesToRename) {
    const filePath = path.join('/Users/maith/Desktop/ur3-gemini/UR-1.5.0', file);
    if (fs.existsSync(filePath)) {
      const newPath = filePath.replace(/cursor/i, 'caret');
      execSync(`mv ${filePath} ${newPath}`);
      console.log(`Renamed ${filePath} to ${newPath}`);
    }
  }

  // Second, global search and replace
  const result = execSync('grep -rl -i "cursor" src/ test/', { encoding: 'utf8', cwd: '/Users/maith/Desktop/ur3-gemini/UR-1.5.0' });
  const files = result.trim().split('\n').filter(Boolean);
  
  for (const file of files) {
    const filePath = path.join('/Users/maith/Desktop/ur3-gemini/UR-1.5.0', file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      content = content.replace(/cursor/g, 'caret');
      content = content.replace(/Cursor/g, 'Caret');
      content = content.replace(/CURSOR/g, 'CARET');
      
      fs.writeFileSync(filePath, content);
      console.log('Fixed', file);
    }
  }
} catch (e) {
  console.log('Error', e.message);
}

console.log('Done renaming cursor to caret');
