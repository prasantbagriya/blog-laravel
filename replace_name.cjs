const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('ChatWizs') || content.includes('chatwizs')) {
            content = content.replace(/ChatWizs/g, 'Blog');
            content = content.replace(/chatwizs/g, 'blog');
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated:', filePath);
        }
    } catch (e) {
        // skip
    }
}

function walk(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (!['node_modules', 'vendor', '.git'].includes(file)) {
                walk(filePath);
            }
        } else {
            if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.tsx') || filePath.endsWith('.ts') || filePath.endsWith('.json') || filePath.endsWith('.php')) {
                replaceInFile(filePath);
            }
        }
    }
}

walk(path.join(__dirname));
