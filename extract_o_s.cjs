const fs = require('fs');
const code = fs.readFileSync('public/build/assets/app-BGCCnEIc.js', 'utf8');
const lines = code.split('\n');
if (lines.length >= 92) {
    const line = lines[91];
    const idx = line.indexOf('function o(');
    if (idx !== -1) console.log(line.substring(Math.max(0, idx - 50), idx + 300));
    const idx2 = line.indexOf('function s(');
    if (idx2 !== -1) console.log(line.substring(Math.max(0, idx2 - 50), idx2 + 300));
}
