const fs = require('fs');
let code = fs.readFileSync('src/components/characters/CharacterGuide.tsx', 'utf-8');

code = code.replace(/speak\(message, undefined, type === 'player' \? 'tia' : type, emotion\)/g, "speak(message, undefined, (type === 'player' ? 'tia' : type) as any, emotion as Emotion)");

fs.writeFileSync('src/components/characters/CharacterGuide.tsx', code);
