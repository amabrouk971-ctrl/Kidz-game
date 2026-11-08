import React, { useState, useEffect } from 'react';
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { ProfileSelectionScreen } from './screens/ProfileSelectionScreen';
import { SmartTechPortal } from './screens/SmartTechPortal';
import { MapScreen } from './screens/MapScreen';
import { ParentDashboard } from './screens/ParentDashboard';
import { ColorsGame } from './screens/games/ColorsGame';
import { NumbersGame } from './screens/games/NumbersGame';
import { LettersGame } from './screens/games/LettersGame';
import { ShapesGame } from './screens/games/ShapesGame';
import { MemoryGame } from './screens/games/MemoryGame';
import { SwimmingSchool } from './screens/games/SwimmingSchool';
import { PolitenessGame } from './screens/games/PolitenessGame';
import { FlightAcademyGame } from './screens/games/FlightAcademyGame';
import { QuranGarden } from './screens/games/QuranGarden';
import { ReligiousKnowledge } from './screens/games/ReligiousKnowledge';
import { CityOfJobs } from './screens/games/CityOfJobs';
import { GeneralKnowledge } from './screens/games/GeneralKnowledge';
import { InventoryScreen } from './screens/InventoryScreen';
import { RoomScreen } from './screens/RoomScreen';
import { AquariumScreen } from './screens/AquariumScreen';
import { GameProvider, useGame } from './store/GameContext';
import { RewardDebugPanel } from './components/debug/RewardDebugPanel';
import { UniverseEncyclopedia } from './screens/UniverseEncyclopedia';
import { QuestionEngineScreen } from './screens/QuestionEngineScreen';
import { UNIVERSE_CATEGORIES } from './data/universe';
import { AuthProvider } from './store/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { AdminDashboardScreen } from './screens/AdminDashboardScreen';

function AppContent() {
  const { globalState } = useGame();
  
  // States: splash, profileSelection, onboarding, portal, map, inventory, room, aquarium, parent, [games]
  const [currentScreen, setCurrentScreen] = useState<string>(() => {
    try {
      const rawHash = window.location.hash ? window.location.hash.replace(/^#\/?/, '').split('?')[0] : '';
      const rawPath = window.location.pathname ? window.location.pathname.replace(/^\/+|\/+$/g, '').split('?')[0] : '';
      const target = rawHash || rawPath;
      const validScreens = [
        'splash', 'profileSelection', 'onboarding', 'portal', 'map', 
        'inventory', 'room', 'aquarium', 'parent', 'admin', 'universe',
        'colors', 'numbers', 'letters', 'shapes', 'memory', 'swimming', 
        'politeness', 'flightAcademy', 'quran', 'religion', 'jobs', 'general'
      ];
      if (validScreens.includes(target)) {
        return target;
      }
    } catch {}
    return 'splash';
  });
  const [universeCategory, setUniverseCategory] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (currentScreen !== 'splash') {
        const targetHash = currentScreen === 'portal' ? '' : `#${currentScreen}`;
        if (window.location.hash !== targetHash) {
          // Safely preserve pathname and all search query parameters (__aistudio_auth_token, session index, etc.)
          const safeUrl = window.location.pathname + window.location.search + targetHash;
          window.history.replaceState(window.history.state, '', safeUrl);
        }
      }
    } catch {}
  }, [currentScreen]);

  useEffect(() => {
    const handleHashChange = () => {
      try {
        const hash = window.location.hash ? window.location.hash.replace(/^#\/?/, '').split('?')[0] : '';
        if (hash && hash !== currentScreen) {
          setCurrentScreen(hash);
        }
      } catch {}
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentScreen]);
  
  // Decide where to go after splash
  const handleSplashComplete = () => {
    if (globalState.profiles.length > 0) {
      setCurrentScreen('portal');
    } else {
      setCurrentScreen('onboarding');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onComplete={handleSplashComplete} />;
      case 'onboarding':
        return <OnboardingScreen 
          onComplete={() => setCurrentScreen('portal')} 
          onBack={globalState.profiles.length > 0 ? () => setCurrentScreen('profileSelection') : undefined} 
        />;
      case 'profileSelection':
        return <ProfileSelectionScreen 
          onSelect={() => setCurrentScreen('portal')} 
          onNew={() => setCurrentScreen('onboarding')} 
          onOpenAdmin={() => setCurrentScreen('admin')}
        />;
      case 'admin':
        return <AdminDashboardScreen onBack={() => setCurrentScreen('portal')} />;
      case 'portal':
        return <SmartTechPortal 
          onNavigate={setCurrentScreen} 
          onLogout={() => setCurrentScreen('profileSelection')} 
        />;
      case 'map':
        return <MapScreen onSelectZone={setCurrentScreen} onOpenParent={() => setCurrentScreen('parent')} onBack={() => setCurrentScreen('portal')} />;
      case 'parent':
        return (
          <div className="min-h-screen bg-gray-900 overflow-y-auto">
            <ParentDashboard onClose={() => setCurrentScreen('portal')} />
          </div>
        );
      case 'inventory':
        return <InventoryScreen onBack={() => setCurrentScreen('portal')} />;
      case 'room':
        return <RoomScreen onBack={() => setCurrentScreen('portal')} />;
      case 'aquarium':
        return <AquariumScreen onBack={() => setCurrentScreen('portal')} />;
      case 'universe': {
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
      case 'colors':
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
          memory: 'general',
          flightAcademy: 'transportation',
          general: 'general'
        };
        const catId = routeToCategory[currentScreen];
        const catMap: Record<string, any> = {
          colors: { title: 'عالم الألوان', color: 'text-pink-600', bgGradient: 'from-pink-300 to-rose-400' },
          numbers: { title: 'جزيرة الأرقام', color: 'text-blue-600', bgGradient: 'from-blue-300 to-indigo-400' },
          letters: { title: 'كهف الحروف', color: 'text-amber-600', bgGradient: 'from-amber-300 to-yellow-400' },
          shapes: { title: 'حديقة الأشكال', color: 'text-purple-600', bgGradient: 'from-purple-300 to-fuchsia-400' },
          swimming: { title: 'مدرسة السباحة', color: 'text-cyan-600', bgGradient: 'from-cyan-300 to-blue-400' },
          manners: { title: 'عالم الأدب واللطف', color: 'text-emerald-600', bgGradient: 'from-emerald-300 to-teal-400' },
          politeness: { title: 'عالم الأدب واللطف', color: 'text-emerald-600', bgGradient: 'from-emerald-300 to-teal-400' },
          quran: { title: 'حديقة القرآن', color: 'text-emerald-800', bgGradient: 'from-emerald-400 to-green-600' },
          religion: { title: 'عالم المعرفة الدينية', color: 'text-teal-600', bgGradient: 'from-teal-300 to-emerald-400' },
          professions: { title: 'مدينة المهن', color: 'text-indigo-600', bgGradient: 'from-indigo-300 to-purple-400' },
          jobs: { title: 'مدينة المهن', color: 'text-indigo-600', bgGradient: 'from-indigo-300 to-purple-400' },
          transportation: { title: 'أكاديمية الطيران', color: 'text-sky-600', bgGradient: 'from-sky-300 to-blue-400' },
          flightAcademy: { title: 'أكاديمية الطيران', color: 'text-sky-600', bgGradient: 'from-sky-300 to-blue-400' },
          general: { title: 'عالم المعرفة', color: 'text-slate-600', bgGradient: 'from-slate-300 to-gray-500' }
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
      }
      default:
        return <SplashScreen onComplete={handleSplashComplete} />;
    }
  };

  return (
    <div className="font-sans antialiased text-slate-900 min-h-[100dvh] w-full overflow-x-hidden select-none bg-slate-50 scroll-smooth">
      {renderScreen()}
      <AuthModal />
      <RewardDebugPanel />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </AuthProvider>
  );
}
