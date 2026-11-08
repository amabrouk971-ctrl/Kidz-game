const fs = require('fs');
let code = fs.readFileSync('src/screens/QuestionEngineScreen.tsx', 'utf-8');

code = code.replace(/const \{ activePlayer, awardGameCompletion \} = useGame\(\);/, `const { activePlayer, awardGameCompletion, discoverUniverseItems } = useGame();`);

code = code.replace(/const finishGame = \(\) => \{/, `const finishGame = () => {
    // Discover all items seen as correct options
    const targetItemIds = questions.map(q => q.correctOptionId).filter(Boolean);
    discoverUniverseItems(targetItemIds as string[]);
`);

fs.writeFileSync('src/screens/QuestionEngineScreen.tsx', code);
