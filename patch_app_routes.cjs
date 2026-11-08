const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace all specific game routes with the QuestionEngineScreen
code = code.replace(/case 'colors':[\s\S]*?case 'general':\s+return <GeneralKnowledge onBack=\{\(\) => setCurrentScreen\('portal'\)\} \/>;/, 
`case 'colors':
      case 'numbers':
      case 'letters':
      case 'shapes':
      case 'memory':
      case 'swimming':
      case 'politeness':
      case 'flightAcademy':
      case 'quran':
      case 'religion':
      case 'jobs':
      case 'general': {
        const routeToCategory: Record<string, string> = {
          colors: 'colors',
          numbers: 'numbers',
          letters: 'letters',
          shapes: 'shapes',
          swimming: 'swimming',
          politeness: 'manners',
          quran: 'quran',
          religion: 'religion',
          jobs: 'professions',
          general: 'general'
        };
        const catId = routeToCategory[currentScreen];
        const catMap: Record<string, any> = {
          colors: { title: 'الألوان', color: 'text-pink-600', bgGradient: 'from-pink-300 to-rose-400' },
          numbers: { title: 'الأرقام', color: 'text-blue-600', bgGradient: 'from-blue-300 to-indigo-400' },
          letters: { title: 'الحروف', color: 'text-amber-600', bgGradient: 'from-amber-300 to-yellow-400' },
          shapes: { title: 'الأشكال', color: 'text-purple-600', bgGradient: 'from-purple-300 to-fuchsia-400' },
          swimming: { title: 'السباحة', color: 'text-cyan-600', bgGradient: 'from-cyan-300 to-blue-400' },
          manners: { title: 'الأدب', color: 'text-emerald-600', bgGradient: 'from-emerald-300 to-teal-400' },
          quran: { title: 'القرآن', color: 'text-emerald-800', bgGradient: 'from-emerald-400 to-green-600' },
          religion: { title: 'الدين', color: 'text-teal-600', bgGradient: 'from-teal-300 to-emerald-400' },
          professions: { title: 'المهن', color: 'text-indigo-600', bgGradient: 'from-indigo-300 to-purple-400' },
          general: { title: 'المعرفة', color: 'text-slate-600', bgGradient: 'from-slate-300 to-gray-500' }
        };
        const c = catMap[catId] || catMap.general;
        
        return <QuestionEngineScreen 
          categoryId={catId || 'general'} 
          categoryTitle={c.title}
          categoryColor={c.color}
          categoryGradient={c.bgGradient}
          onBack={() => setCurrentScreen('portal')} 
          onNavigate={setCurrentScreen} 
        />;
      }`);

fs.writeFileSync('src/App.tsx', code);
