import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { GameEngine } from '../../components/game/GameEngine';

const quranQuestions = [
  {
    q: 'ما اسم كتاب المسلمين؟',
    ans: 'القرآن الكريم',
    options: ['القرآن الكريم', 'القصص']
  },
  {
    q: 'من أنزل القرآن؟',
    ans: 'الله سبحانه وتعالى',
    options: ['الله سبحانه وتعالى', 'الناس']
  },
  {
    q: 'على من نزل القرآن؟',
    ans: 'النبي محمد ﷺ',
    options: ['النبي محمد ﷺ', 'الصحابة']
  },
  {
    q: 'سورة تبدأ بـ "الحمد لله رب العالمين"؟',
    ans: 'سورة الفاتحة',
    options: ['سورة الفاتحة', 'سورة الإخلاص']
  },
  {
    q: 'سورة نقرأها قبل النوم للحفظ؟',
    ans: 'المعوذتين والإخلاص',
    options: ['المعوذتين والإخلاص', 'سورة البقرة']
  },
  {
    q: 'ما هو فضل قراءة القرآن؟',
    ans: 'حسنات كتير وراحة بال',
    options: ['حسنات كتير وراحة بال', 'لعب بس']
  },
  {
    q: 'كيف نمسك المصحف؟',
    ans: 'نكون متوضيين وإيدينا نظيفة',
    options: ['نكون متوضيين وإيدينا نظيفة', 'بإيدينا وهي مش نظيفة']
  },
  {
    q: 'فين بنصلي وندعي ربنا؟',
    ans: 'المسجد / البيت',
    options: ['المسجد / البيت', 'الشارع وقت اللعب']
  },
  {
    q: 'سورة نقولها عشان ربنا يحفظنا من الشر؟',
    ans: 'سورة الفلق',
    options: ['سورة الفلق', 'سورة النصر']
  },
  {
    q: 'سورة صغيرة بنقرأها كتير في الصلاة قل هو الله أحد؟',
    ans: 'سورة الإخلاص',
    options: ['سورة الإخلاص', 'سورة الكوثر']
  }
];

export const QuranGarden: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const questions = useMemo(() => {
    return quranQuestions.map(q => {
      const opts = [...q.options].sort(() => Math.random() - 0.5);
      return { ...q, options: opts };
    });
  }, []);

  const renderQuestion = (index: number, onCorrect: () => void, onIncorrect: () => void) => {
    const q = questions[index];

    return (
      <div className="bg-white/95 backdrop-blur-sm p-6 md:p-10 rounded-[40px] shadow-2xl border-8 border-white text-center w-full max-w-4xl">
        <div className="mb-6">
          <span className="text-6xl text-emerald-600">📖</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-emerald-900 mb-10 leading-tight drop-shadow-sm">
          {q.q}
        </h2>
        
        <div className="flex flex-col gap-4 max-w-xl mx-auto">
          {q.options.map(opt => (
            <motion.button
              key={opt}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (opt === q.ans) onCorrect();
                else onIncorrect();
              }}
              className="w-full bg-emerald-50 text-emerald-800 p-6 rounded-2xl border-4 border-emerald-200 shadow-md font-bold text-xl md:text-2xl hover:bg-emerald-100 hover:border-emerald-300 transition-colors"
            >
              {opt}
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <GameEngine 
      gameId="quran"
      gameTitle="حديقة القرآن"
      themeColor="from-emerald-400 to-emerald-600"
      onBack={onBack}
      renderQuestion={renderQuestion}
    />
  );
};
