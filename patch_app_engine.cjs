const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/import \{ UniverseGame \} from '\.\/screens\/UniverseGame';/, `import { QuestionEngineScreen } from './screens/QuestionEngineScreen';\nimport { UNIVERSE_CATEGORIES } from './data/universe';`);

code = code.replace(/case 'universeGame':\s+return universeCategory \? \([\s\S]*?\)\s+:\s+\([\s\S]*?\);/, `case 'universeGame': {
        const cat = UNIVERSE_CATEGORIES.find(c => c.id === universeCategory);
        return cat ? (
          <QuestionEngineScreen 
            categoryId={cat.id} 
            categoryTitle={cat.title}
            categoryColor={cat.color}
            categoryGradient={cat.bgGradient}
            onBack={() => setCurrentScreen('universe')} 
            onNavigate={setCurrentScreen} 
          />
        ) : (
          <UniverseEncyclopedia onBack={() => setCurrentScreen('portal')} onSelectCategory={() => {}} />
        );
      }`);

fs.writeFileSync('src/App.tsx', code);
