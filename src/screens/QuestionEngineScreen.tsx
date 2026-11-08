import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Star, Volume2, Trophy } from 'lucide-react';
import { useGame } from '../store/GameContext';
import { audioManager } from '../lib/audio/AudioManager';
import { speak } from '../utils/audio';
import { RewardCelebration } from '../components/game/RewardCelebration';
import { CelebratoryHeartsAndStars } from '../components/effects/CelebratoryHeartsAndStars';
import { RewardItem } from '../types';
import { Question, getQuestionsForCategory } from '../data/questions';

interface Props {
  categoryId: string;
  categoryTitle: string;
  categoryColor: string;
  categoryGradient: string;
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

export const QuestionEngineScreen: React.FC<Props> = ({ 
  categoryId, categoryTitle, categoryColor, categoryGradient, onBack, onNavigate 
}) => {
  const { activePlayer, awardGameCompletion, discoverUniverseItems, gameConfigs } = useGame();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'success' | 'wrong' | 'finished'>('intro');
  const [earnedReward, setEarnedReward] = useState<RewardItem | null>(null);

  // Find game config if edited by admin (check direct id and aliases)
  const currentConfig = gameConfigs.find(
    (c) =>
      c.id === categoryId ||
      (categoryId === 'manners' && c.id === 'politeness') ||
      (categoryId === 'politeness' && c.id === 'manners') ||
      (categoryId === 'professions' && c.id === 'jobs') ||
      (categoryId === 'jobs' && c.id === 'professions') ||
      (categoryId === 'transportation' && c.id === 'flightAcademy') ||
      (categoryId === 'flightAcademy' && c.id === 'transportation')
  );

  useEffect(() => {
    // 1. Check if admin configured custom questions
    let finalQuestions: Question[] = [];

    if (currentConfig?.customQuestions && currentConfig.customQuestions.length > 0) {
      const customMapped: Question[] = currentConfig.customQuestions.map((cq) => ({
        id: cq.id,
        categoryId,
        questionText: cq.question,
        targetItemId: cq.id,
        options: cq.options.map((optText, optIdx) => ({
          id: `${cq.id}_opt_${optIdx}`,
          text: optText,
          icon: optIdx === cq.correctIndex ? '🌟' : '💡',
        })),
        correctOptionId: `${cq.id}_opt_${cq.correctIndex}`,
      }));
      finalQuestions = [...customMapped];
    }

    // 2. Supplement with generated questions up to at least 5-10 questions
    const generated = getQuestionsForCategory(categoryId, 10);
    if (finalQuestions.length === 0) {
      finalQuestions = generated;
    } else if (finalQuestions.length < 5) {
      finalQuestions = [...finalQuestions, ...generated.slice(0, 5 - finalQuestions.length)];
    }

    setQuestions(finalQuestions);
    audioManager.playTheme('learning');
  }, [categoryId, currentConfig]);

  const handleStart = () => {
    if (questions.length === 0) {
      onBack();
      return;
    }
    setGameState('playing');
    playInstruction(questions[0]);
  };

  const playInstruction = (q?: Question) => {
    if (q && q.questionText) {
      speak(q.questionText);
    }
  };

  const isMannersCategory = categoryId === 'manners' || categoryId === 'politeness';

  const handleCorrect = () => {
    setGameState('success');
    if (isMannersCategory) {
      audioManager.playApplause();
    } else {
      audioManager.playEffect('success');
    }
    const compliments = isMannersCategory 
      ? ['ما شاء الله على الأدب والذوق!', 'تحية طيبة ورائعة!', 'أحسنت يا بطل الأخلاق!', 'برافو عليك يا مؤدب!']
      : ['برافو!', 'عاش!', 'أيوه كده!', 'شطورة!', 'ممتاز!'];
    speak(compliments[Math.floor(Math.random() * compliments.length)]);
    setTimeout(() => {
      handleNext();
    }, 2000);
  };

  const handleWrong = () => {
    setGameState('wrong');
    audioManager.playEffect('retry');
    const retries = ['قربتي!', 'بصي تاني.', 'نجرب مرة كمان؟'];
    speak(retries[Math.floor(Math.random() * retries.length)]);
    setTimeout(() => {
      setGameState('playing');
      if (questions[currentIndex]) {
        playInstruction(questions[currentIndex]);
      }
    }, 2000);
  };

  const handleNext = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx >= questions.length) {
      finishGame();
    } else {
      setCurrentIndex(nextIdx);
      setGameState('playing');
      playInstruction(questions[nextIdx]);
    }
  };

  const finishGame = () => {
    const targetItemIds = questions.map(q => q.correctOptionId).filter(Boolean);
    discoverUniverseItems?.(targetItemIds as string[]);

    setGameState('finished');
    if (activePlayer) {
      const rewardStarCount = currentConfig?.rewardStars || 20;
      const reward = awardGameCompletion(`engine_${categoryId}` as any, 'generalKnowledge', rewardStarCount);
      setEarnedReward(reward);
    }
  };

  return (
    <div className={`min-h-[100dvh] w-full overflow-y-auto overflow-x-hidden safe-pt safe-pb safe-px rtl relative bg-gradient-to-b ${categoryGradient}`}>
      <div className="flex items-center justify-between p-4 sticky top-0 z-50">
        <button onClick={onBack} className="bg-white p-3 rounded-full shadow-lg border-2 border-slate-200 text-slate-700 active:scale-95 transition-transform">
          <ArrowRight size={28} />
        </button>
        <h1 className="text-2xl md:text-4xl font-black text-white drop-shadow-md flex items-center gap-2">
          {categoryTitle}
        </h1>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/40 shadow-sm text-white font-bold">
          ⭐ {currentIndex + 1}/{questions.length}
        </div>
      </div>

      {gameState !== 'finished' && gameState !== 'intro' && (
        <div className="w-full max-w-2xl mx-auto px-6 mb-4">
          <div className="w-full bg-black/10 h-6 rounded-full overflow-hidden flex shadow-inner p-1 gap-1">
            {questions.map((_, i) => (
              <div key={i} className={`flex-1 h-full rounded-full transition-colors ${
                i < currentIndex ? 'bg-amber-400' : i === currentIndex ? 'bg-white' : 'bg-black/10'
              }`} />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 pb-20 relative z-10 flex flex-col items-center min-h-[60vh] justify-center">
        <AnimatePresence mode="wait">
          {gameState === 'intro' && (
            <motion.div key="intro" className="flex flex-col items-center text-center bg-white/90 p-8 rounded-[40px] shadow-2xl max-w-lg border-4 border-white">
              <span className="text-8xl mb-4">🎮</span>
              <h2 className="text-4xl font-black text-slate-800 mb-2">مستعد للمغامرة؟</h2>
              <p className="text-xl text-slate-600 mb-6 font-bold">{questions.length} أسئلة ممتعة في {categoryTitle}</p>
              <button onClick={handleStart} className={`mt-4 ${categoryColor.replace('text-', 'bg-')} text-white px-10 py-5 rounded-full font-black text-3xl shadow-xl border-4 border-white hover:scale-105 transition-transform w-full shadow-${categoryColor.split('-')[1]}-500/50`}>
                يلا بينا!
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && questions[currentIndex] && (
            <motion.div key="identify" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="flex flex-col items-center w-full">
              <div className="bg-white/95 px-8 py-6 rounded-[32px] shadow-xl border-4 border-white mb-10 flex flex-col md:flex-row items-center gap-6 cursor-pointer w-full max-w-2xl" onClick={() => playInstruction(questions[currentIndex])}>
                <div className={`p-4 rounded-full ${categoryColor.replace('text-', 'bg-').replace('-600', '-100')}`}>
                  <Volume2 className={categoryColor} size={40} />
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-slate-800 text-center md:text-right leading-tight">
                  {questions[currentIndex].questionText}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
                {questions[currentIndex].options.map((opt, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => opt.id === questions[currentIndex].correctOptionId ? handleCorrect() : handleWrong()}
                    className="bg-white p-6 rounded-[32px] shadow-xl border-4 border-white flex flex-col items-center justify-center gap-4 hover:shadow-2xl transition-shadow aspect-square"
                  >
                    <span className="text-[90px] drop-shadow-md block leading-none">{opt.icon}</span>
                    {opt.text && (
                      <span className="text-2xl font-black text-slate-700 bg-slate-100 px-4 py-2 rounded-full w-full line-clamp-1">{opt.text}</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {gameState === 'success' && (
            <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center bg-white/95 backdrop-blur-sm px-10 py-8 rounded-[36px] shadow-2xl border-4 border-amber-300">
              {isMannersCategory && (
                <CelebratoryHeartsAndStars
                  show={true}
                  duration={2500}
                  message="ما شاء الله! تحية طيبة وأدب رفيع! 💖✨"
                  subMessage="أحسنت يا بطل الذوق والأخلاق! 🌟"
                />
              )}
              <Star size={100} fill="#f59e0b" className="text-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.6)] mb-4 animate-bounce" />
              <h3 className="text-3xl md:text-5xl font-black text-amber-600 mb-2">
                {isMannersCategory ? 'ذوق وأخلاق رفيعة!' : 'إجابة صحيحة!'}
              </h3>
            </motion.div>
          )}

          {gameState === 'wrong' && (
            <motion.div key="wrong" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center bg-white/90 px-10 py-8 rounded-[36px] shadow-2xl border-4 border-rose-300">
              <span className="text-7xl mb-4">🤔</span>
              <h3 className="text-3xl md:text-4xl font-black text-rose-600">فكر تاني يا بطل!</h3>
            </motion.div>
          )}

          {gameState === 'finished' && (
            <motion.div key="finished" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center text-center bg-white/95 p-8 rounded-[40px] shadow-2xl max-w-lg border-4 border-amber-300">
              <Trophy size={100} className="text-amber-500 mb-4 animate-bounce" />
              <h2 className="text-4xl font-black text-slate-800 mb-2">ألف مبروك! 🎉</h2>
              <p className="text-xl text-slate-600 mb-6 font-bold">
                أكملت تحدي {categoryTitle} وحصلت على {currentConfig?.rewardStars || 20} نجمة!
              </p>
              
              {earnedReward && (
                <RewardCelebration
                  starsEarned={currentConfig?.rewardStars || 20}
                  reward={earnedReward}
                  playerName={activePlayer?.name || 'البطل'}
                  onReplay={() => {
                    setEarnedReward(null);
                    setCurrentIndex(0);
                    setGameState('playing');
                    if (questions.length > 0) {
                      playInstruction(questions[0]);
                    }
                  }}
                  onHome={onBack}
                  onInventory={() => onNavigate('inventory')}
                />
              )}

              <div className="flex gap-4 w-full">
                <button onClick={() => { setCurrentIndex(0); setGameState('intro'); }} className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-full font-black text-xl hover:bg-slate-200 transition-colors">
                  العب تاني
                </button>
                <button onClick={onBack} className="flex-1 bg-indigo-600 text-white py-4 rounded-full font-black text-xl shadow-lg hover:bg-indigo-700 transition-colors">
                  الخريطة 🗺️
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
