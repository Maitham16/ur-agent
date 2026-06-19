import fs from 'fs';
import path from 'path';

const file = '/Users/maith/Desktop/ur3-gemini/UR-1.5.0/src/components/LogoV2/WelcomeV2.tsx';
let content = fs.readFileSync(file, 'utf8');

// The original crab art pieces
const crabTop = ' █████████ ';
const crabMid = '██▄█████▄██';
const crabBot = ' █████████ ';
const crabLegs = '\\u2588 \\u2588   \\u2588 \\u2588';

// New house art pieces
const houseTop = '   ▄███▄   ';
const houseMid = '  ███████  ';
const houseBot = '  ███████  ';
const houseLegs = '\\u2588\\u2588\\u2588   \\u2588\\u2588\\u2588';

// We need to carefully replace the top and bottom.
// In the file, the first occurence for each theme is top, the second is bottom.
// We can just find all indices of crabTop and replace them alternatingly.

let parts = content.split(crabTop);
let newContent = parts[0];
for (let i = 1; i < parts.length; i++) {
  if (i % 2 !== 0) {
    // Top
    newContent += houseTop + parts[i];
  } else {
    // Bottom
    newContent += houseBot + parts[i];
  }
}

newContent = newContent.replace(new RegExp(crabMid, 'g'), houseMid);
newContent = newContent.replace(new RegExp(crabLegs.replace(/\\/g, '\\\\'), 'g'), houseLegs);

fs.writeFileSync(file, newContent);
console.log('Fixed WelcomeV2.tsx');
