const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/case 'general': \{/, `case 'universe': {
        const cat = UNIVERSE_CATEGORIES.find(c => c.id === universeCategory);
        return cat ? (
          <QuestionEngineScreen 
            categoryId={cat.id} 
            categoryTitle={cat.title}
            categoryColor={cat.color}
            categoryGradient={cat.bgGradient}
            onBack={() => setUniverseCategory(null)} 
            onNavigate={setCurrentScreen} 
          />
        ) : (
          <UniverseEncyclopedia onBack={() => setCurrentScreen('map')} onSelectCategory={(catId) => setUniverseCategory(catId)} />
        );
      }
      case 'general': {`);

fs.writeFileSync('src/App.tsx', code);
