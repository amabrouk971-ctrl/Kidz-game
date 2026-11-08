const fs = require('fs');
let code = fs.readFileSync('src/data/questions/generator.ts', 'utf-8');

code = code.replace(/import \{ UNIVERSE_OBJECTS, UniverseCategory \} from '\.\.\/universe\/objects';/, `import { UNIVERSE_OBJECTS } from '../universe/objects';\nimport { UniverseCategory } from '../universe/types';`);

fs.writeFileSync('src/data/questions/generator.ts', code);
