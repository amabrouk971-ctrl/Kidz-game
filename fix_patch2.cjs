const fs = require('fs');
const file = 'src/data/questions/static.ts';
let code = fs.readFileSync(file, 'utf-8');

code = code.replace(/    \}\n  religion: \[\n/m, "    }\n  ],\n  religion: [\n");

fs.writeFileSync(file, code);
