const fs = require('fs');
let code = fs.readFileSync('src/lib/audio/AudioManager.ts', 'utf-8');
code = code.replace(/public getVolumes\(\) \{\n\s*return this\.vols;\n\s*\}\n\s*\}/, `public getVolumes() {\n    return this.vols;\n  }`);
fs.writeFileSync('src/lib/audio/AudioManager.ts', code);
