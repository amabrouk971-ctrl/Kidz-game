import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Home, RotateCcw, Gift, Play } from 'lucide-react';
import { audioManager } from '../../lib/audio/AudioManager';
import { useGame } from '../../store/GameContext';
import { RewardItem } from '../../types';
import { RewardCelebration } from './RewardCelebration';
import { CelebratoryHeartsAndStars } from '../effects/CelebratoryHeartsAndStars';

export interface GameEngineProps {
  gameId: string;
  gameTitle: string;
  totalQuestions?: number;
  onBack: () => void;
  onNavigate?: (screen: string) => void;
  themeColor: string; // e.g. 'from-pink-400 to-pink-600'
  celebrationTheme?: 'politeness' | 'standard';
  renderQuestion: (
    questionIndex: number, 
    onCorrect: () => void, 
    onIncorrect: () => void
  ) => React.ReactNode;
}

export const GameEngine: React.FC<GameEngineProps> = ({
  gameId,
  gameTitle,
  totalQuestions = 10,
  onBack,
  onNavigate,
  themeColor,
  celebrationTheme,
  renderQuestion
}) => {
  const isPoliteness = celebrationTheme === 'politeness' || gameId === 'politeness' || gameId.includes('manner');
  const { completeLevel, awardGameCompletion, activePlayer } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'success' | 'wrong' | 'finished'>('playing');
  const [score, setScore] = useState(0);
  const [earnedReward, setEarnedReward] = useState<RewardItem | null>(null);

  // Play background music for this specific game
  useEffect(() => {
    // Determine theme based on gameId
    if (gameId === 'quran') {
      audioManager.playTheme('quran');
    } else if (gameId === 'swimming') {
      audioManager.playTheme('swimming');
    } else {
      audioManager.playTheme('learning');
    }

    return () => {
      // Restore portal music on exit
      audioManager.playTheme('portal');
    };
  }, [gameId]);

  const handleCorrect = () => {
    setGameState('success');
    if (isPoliteness) {
      audioManager.playApplause();
    } else {
      audioManager.playEffect('success');
    }
    setScore(prev => prev + 1);
    
    setTimeout(() => {
      if (currentIndex + 1 >= totalQuestions) {
        finishGame();
      } else {
        setCurrentIndex(prev => prev + 1);
        setGameState('playing');
      }
    }, 2000);
  };

  const handleIncorrect = () => {
    setGameState('wrong');
    audioManager.playEffect('retry');
    
    setTimeout(() => {
      setGameState('playing');
    }, 2000);
  };

  const finishGame = () => {
    setGameState('finished');
    if (activePlayer) {
      const reward = awardGameCompletion(gameId, gameId as any, 10);
      setEarnedReward(reward);
    }
  };

  const handleReplay = () => {
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
  };

  return (
    <div className={`min-h-[100dvh] w-full overflow-y-auto overflow-x-hidden safe-pt safe-pb safe-px rtl relative bg-gradient-to-b ${themeColor}`}>
      {/* Header / Nav */}
      <div className="flex items-center justify-between p-4 sticky top-0 z-50">
        <button onClick={onBack} className="bg-white p-3 rounded-full shadow-lg border-2 border-slate-200 text-slate-700 hover:text-slate-900 transition-transform active:scale-95">
          <ArrowRight size={28} />
        </button>
        <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-md tracking-tight">
          {gameTitle}
        </h1>
        <div className="w-12 h-12"></div> {/* Spacer for centering */}
      </div>

      {/* Progress Bar (Only when playing) */}
      {gameState !== 'finished' && (
        <div className="w-full max-w-2xl mx-auto px-6 mb-4 md:mb-8">
          <div className="flex justify-between text-white font-bold mb-2 drop-shadow-md text-lg">
            <span>السؤال {currentIndex + 1} من {totalQuestions}</span>
          </div>
          <div className="w-full bg-white/30 h-6 rounded-full border-2 border-white/50 overflow-hidden flex shadow-inner">
            {Array.from({ length: totalQuestions }).map((_, i) => (
              <div 
                key={i} 
                className={`flex-1 h-full border-r border-white/20 last:border-0 transition-colors duration-500 ${
                  i < currentIndex ? 'bg-amber-400' : 
                  i === currentIndex ? 'bg-white' : 'bg-transparent'
                }`}
              ></div>
            ))}
          </div>
        </div>
      )}

      {/* Game Content Area */}
      <div className="max-w-4xl mx-auto px-4 pb-20 relative z-10 flex flex-col items-center min-h-[60vh] justify-center">
        <AnimatePresence mode="wait">
          {gameState === 'playing' && (
            <motion.div
              key={`question-${currentIndex}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="w-full flex flex-col items-center"
            >
              {renderQuestion(currentIndex, handleCorrect, handleIncorrect)}
            </motion.div>
          )}

          {gameState === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center justify-center py-10"
            >
              {isPoliteness && (
                <CelebratoryHeartsAndStars
                  show={true}
                  duration={2500}
                  message="ما شاء الله! تحية طيبة وسلوك مهذب! 💖✨"
                  subMessage="أحسنت يا بطل الذوق والأدب! 🌟"
                />
              )}
              <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5, repeat: 2 }}>
                <Star size={100} fill="#f59e0b" className="text-amber-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] mb-6" />
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black text-white drop-shadow-lg mb-4">برافو!</h2>
              <p className="text-2xl md:text-3xl font-bold text-amber-200">
                {isPoliteness ? 'سلوك مهذب وجميل جداً! 💖' : 'إجابة صحيحة يا بطل!'}
              </p>
            </motion.div>
          )}

          {gameState === 'wrong' && (
            <motion.div
              key="wrong"
              initial={{ x: [-10, 10, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-10"
            >
              <span className="text-6xl mb-4">💪</span>
              <h2 className="text-3xl md:text-5xl font-black text-white drop-shadow-lg mb-4">ولا يهمك، نجرب تاني!</h2>
              <p className="text-xl md:text-2xl font-bold text-white/90">بص كويس وجرب مرة كمان</p>
            </motion.div>
          )}

          {gameState === 'finished' && earnedReward && activePlayer && (
            <RewardCelebration
              starsEarned={10}
              reward={earnedReward}
              playerName={activePlayer.name}
              onReplay={handleReplay}
              onHome={onBack}
              onInventory={onNavigate ? () => onNavigate('inventory') : undefined}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
