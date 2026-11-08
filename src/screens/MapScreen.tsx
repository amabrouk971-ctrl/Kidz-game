import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Lock, Droplets, Palette, Hash, Type, Shapes, Brain, Settings, Heart, Plane, Book, BookOpen, Briefcase, Globe } from 'lucide-react';
import { useGame } from '../store/GameContext';
import { BubbleBackground } from '../components/ui/BubbleBackground';
import { ParentGate } from '../components/ui/Modal';
import { GiftOpeningScreen } from '../components/ui/GiftOpeningScreen';

type Zone = {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: 'blue' | 'pink' | 'green' | 'orange' | 'purple' | 'teal';
  x: number;
  y: number;
  route: string;
};

const zones: Zone[] = [
  { id: 'universe', title: 'موسوعة المعرفة', icon: <Globe size={40} />, color: 'blue', x: 50, y: 50, route: 'universe' },
  { id: 'swim', title: 'مدرسة السباحة', icon: <Droplets size={40} />, color: 'blue', x: 15, y: 15, route: 'swimming' },
  { id: 'color', title: 'بحر الألوان', icon: <Palette size={40} />, color: 'pink', x: 35, y: 20, route: 'colors' },
  { id: 'num', title: 'جزيرة الأرقام', icon: <Hash size={40} />, color: 'green', x: 60, y: 15, route: 'numbers' },
  { id: 'let', title: 'كهف الحروف', icon: <Type size={40} />, color: 'orange', x: 85, y: 20, route: 'letters' },
  { id: 'shape', title: 'حديقة الأشكال', icon: <Shapes size={40} />, color: 'purple', x: 15, y: 50, route: 'shapes' },
  { id: 'mem', title: 'جزيرة الذاكرة', icon: <Brain size={40} />, color: 'teal', x: 35, y: 50, route: 'memory' },
  { id: 'politeness', title: 'عالم الأدب واللطف', icon: <Heart size={40} />, color: 'pink', x: 60, y: 50, route: 'politeness' },
  { id: 'quran', title: 'حديقة القرآن', icon: <Book size={40} />, color: 'green', x: 85, y: 50, route: 'quran' },
  { id: 'religion', title: 'عالم المعرفة الدينية', icon: <BookOpen size={40} />, color: 'purple', x: 15, y: 85, route: 'religion' },
  { id: 'jobs', title: 'مدينة المهن', icon: <Briefcase size={40} />, color: 'orange', x: 35, y: 80, route: 'jobs' },
  { id: 'general', title: 'عالم المعرفة', icon: <Globe size={40} />, color: 'teal', x: 60, y: 85, route: 'general' },
  { id: 'flight', title: 'أكاديمية المضيفات', icon: <Plane size={40} />, color: 'blue', x: 85, y: 80, route: 'flightAcademy' },
];

interface MapScreenProps {
  onSelectZone: (route: string) => void;
  onOpenParent: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({ onSelectZone, onOpenParent }) => {
  const { state } = useGame();
  const [showGate, setShowGate] = useState(false);
  const [showGiftOpen, setShowGiftOpen] = useState(false);

  const inventory = state.player.inventory || { items: {}, unopenedGifts: 0, placedItems: { room: [], aquarium: [] } };
  const hasUnopenedGifts = inventory.unopenedGifts > 0;

  const handleParentAccess = () => {
    setShowGate(true);
  };

  const handleGateSuccess = () => {
    setShowGate(false);
    onOpenParent();
  };

  const bgColors = {
    blue: 'bg-[radial-gradient(circle_at_center,_#60A5FA_0%,_#3B82F6_100%)]',
    pink: 'bg-[radial-gradient(circle_at_center,_#F472B6_0%,_#DB2777_100%)]',
    green: 'bg-[radial-gradient(circle_at_center,_#4ADE80_0%,_#16A34A_100%)]',
    orange: 'bg-[radial-gradient(circle_at_center,_#FDBA74_0%,_#EA580C_100%)]',
    purple: 'bg-[radial-gradient(circle_at_center,_#C084FC_0%,_#9333EA_100%)]',
    teal: 'bg-[radial-gradient(circle_at_center,_#2DD4BF_0%,_#0D9488_100%)]',
  };

  return (
    <div className="min-h-screen relative overflow-hidden rtl flex flex-col" style={{ background: 'linear-gradient(180deg, #46C7FF 0%, #0077BE 100%)' }}>
      <div className="absolute top-20 left-10 w-16 h-16 rounded-full bg-white/20 blur-sm pointer-events-none z-0"></div>
      <div className="absolute top-40 right-20 w-8 h-8 rounded-full bg-white/30 blur-sm pointer-events-none z-0"></div>
      <div className="absolute bottom-32 left-1/4 w-12 h-12 rounded-full bg-white/10 blur-md pointer-events-none z-0"></div>

      <BubbleBackground />
      
      {/* Top HUD */}
      <header className="flex justify-between items-center px-4 md:px-8 pt-6 z-10 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4 bg-white/90 px-4 md:px-6 py-2 rounded-full shadow-lg border-4 border-yellow-300">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-pink-300 rounded-full border-4 border-white flex items-center justify-center text-3xl shadow-inner">{state.player.avatar}</div>
          <div className="flex flex-col">
            <span className="text-blue-800 font-bold text-xl md:text-2xl leading-none">{state.player.name}</span>
            <span className="text-blue-500 text-xs md:text-sm font-bold uppercase tracking-wider">المغامِرة الصغيرَة</span>
          </div>
        </div>
        <div className="flex gap-2 md:gap-4">
          <div className="hidden sm:flex bg-white/90 px-4 md:px-6 py-2 rounded-full shadow-lg border-4 border-blue-400 items-center gap-2 md:gap-3">
            <span className="text-xl md:text-2xl"><Star fill="currentColor" size={24} className="text-blue-500" /></span>
            <span className="text-xl md:text-2xl font-black text-blue-900">{state.player.stars}</span>
          </div>
          <button 
            onClick={handleParentAccess}
            className="bg-yellow-400 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-xl md:text-3xl shadow-lg border-4 border-white cursor-pointer active:scale-95 transition-transform"
          >
            <Settings size={28} className="text-yellow-900" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow relative px-4 md:px-10 mt-4 z-10 overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-white text-4xl md:text-5xl font-black drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)]" style={{ textShadow: '2px 2px 0px #005FA3' }}>خريطة المغامرة</h1>
          <p className="text-blue-100 text-lg md:text-xl font-bold mt-2">اخترِي مكان لتبدئي المغامرة!</p>
        </div>
        
        {/* Gift Button prominent if gifts available */}
        {hasUnopenedGifts && (
          <div className="flex justify-center mb-8">
            <motion.button
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.9, 1.1, 0.9], rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              onClick={() => setShowGiftOpen(true)}
              className="bg-pink-500 text-white font-black text-2xl px-8 py-4 rounded-full border-4 border-white shadow-xl shadow-pink-500/50 flex items-center gap-4 relative"
            >
              <span className="text-4xl">🎁</span>
              افتحي الهدايا!
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-pink-900 w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 border-white shadow-md">
                {inventory.unopenedGifts}
              </div>
            </motion.button>
          </div>
        )}

        <div className="relative w-full md:h-[600px] max-w-5xl mx-auto pb-32 flex flex-col md:block">
          {zones.map((zone, idx) => (
            <div
              key={zone.id}
              className="relative md:absolute left-auto top-auto md:left-[var(--md-left)] md:top-[var(--md-top)] md:-translate-x-1/2 md:-translate-y-1/2 flex flex-col items-center group cursor-pointer my-4 mx-auto md:m-0 w-full md:w-[180px]"
              style={{
                '--md-left': `${zone.x}%`,
                '--md-top': `${zone.y}%`
              } as React.CSSProperties}
              onClick={() => onSelectZone(zone.route)}
            >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full border-[6px] md:border-[8px] border-white shadow-2xl flex items-center justify-center relative text-white ${bgColors[zone.color]}`}
              >
                {zone.icon}
              </motion.div>
              <span className="mt-2 md:mt-4 text-white font-black text-base md:text-xl lg:text-2xl text-center bg-blue-900/40 px-4 py-1 rounded-full shadow-sm whitespace-nowrap">
                {zone.title}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white/95 h-[100px] md:h-28 safe-pb flex items-center justify-center gap-2 md:gap-6 px-2 md:px-8 border-t-[6px] border-yellow-300 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] relative z-20 w-full overflow-x-auto hide-scrollbar">
        <button onClick={() => onSelectZone('map')} className="flex flex-col items-center gap-1 active:scale-90 transition-transform scale-110 -translate-y-4 mx-1">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-500 rounded-full flex items-center justify-center text-3xl shadow-lg border-4 border-white">🗺️</div>
          <span className="font-black text-blue-900 text-[10px] md:text-sm mt-1">المغامرة</span>
        </button>
        <button onClick={() => onSelectZone('inventory')} className="flex flex-col items-center gap-1 active:scale-90 transition-transform relative mx-1">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2 border-white">🎒</div>
          <span className="font-black text-pink-900 text-[10px] md:text-sm">شنطتي</span>
          {hasUnopenedGifts && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-pink-900 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
              {inventory.unopenedGifts}
            </div>
          )}
        </button>
        <button onClick={() => onSelectZone('room')} className="flex flex-col items-center gap-1 active:scale-90 transition-transform mx-1">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2 border-white">🏠</div>
          <span className="font-black text-purple-900 text-[10px] md:text-sm">أوضتي</span>
        </button>
        <button onClick={() => onSelectZone('aquarium')} className="flex flex-col items-center gap-1 active:scale-90 transition-transform mx-1">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-cyan-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2 border-white">🐠</div>
          <span className="font-black text-cyan-900 text-[10px] md:text-sm">حوضي</span>
        </button>
        <button className="flex flex-col items-center gap-1 active:scale-90 transition-transform mx-1">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg border-2 border-white">🏆</div>
          <span className="font-black text-yellow-800 text-[10px] md:text-sm">إنجازاتي</span>
        </button>
      </nav>

      {/* Footer Message */}
      <div className="absolute bottom-28 md:bottom-32 left-0 right-0 flex justify-center items-center px-4 pointer-events-none z-10 hidden sm:flex">
        <p className="text-[11px] md:text-xs text-white/80 bg-black/30 px-3 py-1 rounded-full italic text-center max-w-lg shadow-sm" dir="rtl">
          * اللعبة بتساعد الأطفال تتعرف على أساسيات السباحة، لكن تعلم السباحة الحقيقي لازم يكون مع مدرب متخصص.
        </p>
      </div>

      {showGate && (
        <ParentGate onSuccess={handleGateSuccess} onCancel={() => setShowGate(false)} />
      )}

      {showGiftOpen && (
        <GiftOpeningScreen onDone={() => setShowGiftOpen(false)} />
      )}
    </div>
  );
};
