const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'resources', 'js', 'Pages', 'Static');
const files = fs.readdirSync(dir);

for (const file of files) {
    if (file.endsWith('.jsx')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace mt-16 with padding top style
        content = content.replace(
            /className="container mx-auto px-4 py-8 max-w-4xl mt-16 flex-grow"/g,
            'className="container mx-auto px-4 pb-8 max-w-4xl min-h-[60vh] flex-grow" style={{ paddingTop: \'160px\' }}'
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed:', file);
    }
}
