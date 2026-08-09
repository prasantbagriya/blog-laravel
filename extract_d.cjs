const fs = require('fs');
const code = fs.readFileSync('public/build/assets/app-BGCCnEIc.js', 'utf8');
const lines = code.split('\n');
if (lines.length >= 92) {
    const line = lines[91];
    // Find "function d(" or "const d=" or "let d="
    const idx = line.indexOf('d=function');
    if (idx !== -1) {
        console.log("d definition:");
        console.log(line.substring(Math.max(0, idx - 50), idx + 200));
    }
    const idx2 = line.indexOf('function d(');
    if (idx2 !== -1) {
        console.log("function d:");
        console.log(line.substring(Math.max(0, idx2 - 50), idx2 + 200));
    }
}
