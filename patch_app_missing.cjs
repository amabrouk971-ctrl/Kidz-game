const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/jobs: 'professions',/, `jobs: 'professions',\n          memory: 'general',\n          flightAcademy: 'transportation',`);

fs.writeFileSync('src/App.tsx', code);
