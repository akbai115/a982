
const fs = require('fs');
const path = require('path');

const dir = '.';

fs.readdirSync(dir).forEach(file => {
    if (path.extname(file) === '.html') {
        try {
            let content = fs.readFileSync(file, 'utf8');
            let original = content;

            // Replacements - Order matters slightly
            // Replace longer sequences first
            content = content.split('â€™').join('’');
            content = content.split('â€”').join('—');
            content = content.split('â€“').join('–'); // En dash
            content = content.split('Â·').join('·');
            content = content.split('â–ˆ').join('█');
            content = content.split('â€œ').join('“');
            content = content.split('â€').join('”');

            if (content !== original) {
                console.log(`Fixing ${file}...`);
                fs.writeFileSync(file, content, 'utf8');
            }
        } catch (e) {
            console.error(`Error processing ${file}:`, e);
        }
    }
});
console.log('Done.');
