const fs = require('fs');
let code = fs.readFileSync('src/components/game/GameEngine.tsx', 'utf-8');

code = code.replace(/import \{ useGame \} from '\.\.\/\.\.\/store\/GameContext';/, `import { useGame } from '../../store/GameContext';\nimport { RewardItem } from '../../types';\nimport { RewardCelebration } from './RewardCelebration';`);

fs.writeFileSync('src/components/game/GameEngine.tsx', code);
