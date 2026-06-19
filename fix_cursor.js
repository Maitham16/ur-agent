import fs from 'fs';
import path from 'path';

const filesToFix = [
  'src/components/PromptInput/PromptInput.tsx',
  'src/hooks/useSearchInput.ts',
  'src/hooks/useTextInput.ts',
  'src/hooks/useVimInput.ts',
  'src/components/design-system/FuzzyPicker.tsx',
  'src/screens/REPL.tsx',
  'src/utils/cursor.ts',
  'src/types/textInputTypes.ts'
];

for (const file of filesToFix) {
  const fullPath = path.resolve('/Users/maith/Desktop/ur3-gemini/UR-1.5.0', file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix camel casing and exports
    content = content.replace(/setcursorOffset/g, 'setCursorOffset');
    content = content.replace(/ur_editorOffset/g, 'cursorOffset');
    content = content.replace(/disablecursorMovement/g, 'disableCursorMovement');
    content = content.replace(/disableur_editorMovement/g, 'disableCursorMovement');
    content = content.replace(/setur_editorOffset/g, 'setCursorOffset');
    content = content.replace(/ur_editorLine/g, 'cursorLine');
    content = content.replace(/ur_editorColumn/g, 'cursorColumn');
    content = content.replace(/ur_editorChar/g, 'cursorChar');
    content = content.replace(/ur_editor/g, 'cursor');
    content = content.replace(/Cursor as cursor/g, 'Cursor');
    content = content.replace(/import \{ cursor \}/g, 'import { Cursor }');
    content = content.replace(/const cursor = Cursor.fromText/g, 'const cursorInst = Cursor.fromText');
    content = content.replace(/\bcursor\./g, 'cursorInst.');
    content = content.replace(/\bcursor = /g, 'cursorInst = ');
    content = content.replace(/latestcursorRef\.current = cursor/g, 'latestcursorRef.current = cursorInst');
    content = content.replace(/cursor\.equals/g, 'cursorInst.equals');
    content = content.replace(/cursor\.text/g, 'cursorInst.text');
    content = content.replace(/cursor\.offset/g, 'cursorInst.offset');
    content = content.replace(/\(cursor\)/g, '(cursorInst)');
    
    // For specific variable clashes in useTextInput
    content = content.replace(/const cursorInst = Cursor\.fromText/g, 'const cursorInst = Cursor.fromText');
    content = content.replace(/useRef\(cursor\)/g, 'useRef(cursorInst)');
    
    // More edge cases for useTextInput and others
    content = content.replace(/setcursorOffset/g, 'setCursorOffset');

    fs.writeFileSync(fullPath, content);
  }
}

console.log('Fixed cursor casing');
