const fs = require('fs');
let code = fs.readFileSync('src/screens/SmartTechPortal.tsx', 'utf-8');

code = code.replace(/const totalProgress = Object\.values\(activePlayer\.progress\)\.reduce\(\(a: number, b: number\) => a \+ \(Number\(b\) \|\| 0\), 0\);/, `const totalProgress = Object.values(activePlayer.progress).reduce((a: number, b: any) => a + (typeof b === 'number' ? b : 0), 0) as number;`);

fs.writeFileSync('src/screens/SmartTechPortal.tsx', code);
