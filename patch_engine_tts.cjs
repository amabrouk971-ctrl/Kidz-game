const fs = require('fs');
let code = fs.readFileSync('src/screens/QuestionEngineScreen.tsx', 'utf-8');

code = code.replace(/import \{ audioManager \} from '\.\.\/lib\/audio\/AudioManager';/, `import { audioManager } from '../lib/audio/AudioManager';\nimport { speak } from '../utils/audio';`);
code = code.replace(/audioManager\.playTTS\(/g, `speak(`);

fs.writeFileSync('src/screens/QuestionEngineScreen.tsx', code);
