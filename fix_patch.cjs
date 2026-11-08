const fs = require('fs');
const file = 'src/data/questions/static.ts';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace(/    \}\n  \],\n    \{\n      id: 'manners_11'/m, "    },\n    {\n      id: 'manners_11'");

fs.writeFileSync(file, code);
