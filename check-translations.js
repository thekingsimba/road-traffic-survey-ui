const fs = require('fs');
const { execSync } = require('child_process');

const en = JSON.parse(fs.readFileSync('src/locales/en.json', 'utf8'));
const fr = JSON.parse(fs.readFileSync('src/locales/fr.json', 'utf8'));

// Get all translation keys used in the codebase, excluding import statements
const usedKeys = new Set();
try {
  const output = execSync('grep -r "t(\'" src/ | grep -v "import.*t(\'" | grep -o "t(\'[^\']*\'" | sort | uniq', { encoding: 'utf8' });
  output.split('\n').forEach(line => {
    const match = line.match(/t\('([^']+)'\)/);
    if (match && !match[1].startsWith('@')) {
      usedKeys.add(match[1]);
    }
  });
} catch (e) {
  console.log('Error extracting keys:', e.message);
}

console.log('Used keys count (excluding imports):', usedKeys.size);
console.log('EN keys count:', Object.keys(en).length);
console.log('FR keys count:', Object.keys(fr).length);

// Check for missing keys
const missingInEn = [...usedKeys].filter(key => !(key in en));
const missingInFr = [...usedKeys].filter(key => !(key in fr));

console.log('Missing in EN:', missingInEn.length, missingInEn);
console.log('Missing in FR:', missingInFr.length, missingInFr);

if (missingInEn.length === 0 && missingInFr.length === 0) {
  console.log('✅ All translation keys are present!');
} else {
  console.log('❌ Some translation keys are missing');
}
