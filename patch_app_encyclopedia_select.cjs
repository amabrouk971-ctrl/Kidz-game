const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/<UniverseEncyclopedia onBack=\{\(\) => setCurrentScreen\('portal'\)\} onSelectCategory=\{\(\) => \{\}\} \/>/, 
`<UniverseEncyclopedia onBack={() => setCurrentScreen('portal')} onSelectCategory={(catId) => setUniverseCategory(catId)} />`);

fs.writeFileSync('src/App.tsx', code);
