const fs = require('fs');
const code = fs.readFileSync('public/build/assets/app-BGCCnEIc.js', 'utf8');
const lines = code.split('\n');
if (lines.length >= 92) {
    const line = lines[91];
    console.log("SURROUNDING CODE:");
    console.log(line.substring(Math.max(0, 74832 - 150), 74832 + 150));
}
