import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walk(dirPath, callback);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      callback(dirPath);
    }
  });
}

walk('/Users/maith/Desktop/ur3-gemini/UR-1.5.0/src', (file) => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  const replacements = [
    [/ur_editorOffset/g, 'cursorOffset'],
    [/showur_editor/g, 'showCursor'],
    [/onChangeur_editorOffset/g, 'onChangeCursorOffset'],
    [/disableur_editorMovement/g, 'disableCursorMovement'],
    [/setur_editorOffset/g, 'setCursorOffset'],
    [/ur_editorLine/g, 'cursorLine'],
    [/ur_editorColumn/g, 'cursorColumn'],
    [/ur_editorChar/g, 'cursorChar']
  ];
  
  for (const [regex, replacement] of replacements) {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
  }
});

console.log('Fixed more cursor variables');
