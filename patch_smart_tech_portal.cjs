const fs = require('fs');
let code = fs.readFileSync('src/screens/SmartTechPortal.tsx', 'utf-8');

code = code.replace(/Object\.values\(activePlayer\.progress\)\.reduce\(\(a, b\) => a \+ b, 0\)/, `Object.values(activePlayer.progress).reduce((a: number, b: number) => a + (Number(b) || 0), 0)`);

fs.writeFileSync('src/screens/SmartTechPortal.tsx', code);
