const fs = require('fs');
let code = fs.readFileSync('src/data/questions/generator.ts', 'utf-8');

code = code.replace(/const objects = UNIVERSE_OBJECTS\.filter\(o => o\.categoryId === categoryId\);/, `const objects = categoryId === 'general' ? UNIVERSE_OBJECTS : UNIVERSE_OBJECTS.filter(o => o.categoryId === categoryId);`);

fs.writeFileSync('src/data/questions/generator.ts', code);
