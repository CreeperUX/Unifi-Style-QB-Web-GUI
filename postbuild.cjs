// Post-build: remove crossorigin attributes from script/link tags
// qBittorrent doesn't send CORS headers, and crossorigin without CORS blocks loading
const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'dist', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

html = html.replace(/ crossorigin/gi, '');

fs.writeFileSync(htmlPath, html);
console.log('[postbuild] Removed crossorigin attributes from index.html');
