import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { GameEngine } from '../../components/game/GameEngine';

const religiousQuestions = [
  { 
    question: "إيه هو كتاب المسلمين؟", 
    correct: "القرآن الكريم", 
    wrong: ["القصص", "المجلة"] 
  },
  { 
    question: "مين هو نبينا؟", 
    correct: "سيدنا محمد (ﷺ)", 
    wrong: ["الملك", "الرئيس"] 
  },
  { 
    question: "إيه هو ديننا؟", 
    correct: "الإسلام", 
    wrong: ["السلام", "الرياضة"] 
  },
  { 
    question: "بُصلي كام مرة في اليوم؟", 
    correct: "5 مرات", 
    wrong: ["3 مرات", "مرة واحدة"] 
  },
  { 
    question: "بنصوم في شهر إيه؟", 
    correct: "رمضان", 
    wrong: ["شوال", "شعبان"] 
  },
  { 
    question: "إيه هي قبلة المسلمين؟", 
    correct: "الكعبة في مكة", 
    wrong: ["المسجد", "البيت"] 
  },
  { 
    question: "بنقول إيه قبل ما ناكل؟", 
    correct: "بسم الله", 
    wrong: ["الحمد لله", "أهلاً"] 
  },
  { 
    question: "بنقول إيه بعد ما ناكل؟", 
    correct: "الحمد لله", 
    wrong: ["بسم الله", "مع السلامة"] 
  },
  { 
    question: "بنقول إيه لما حد يساعدنا؟", 
    correct: "جزاك الله خيراً / شكراً", 
    wrong: ["أنا آسف", "لو سمحت"] 
  },
  { 
    question: "بنقول إيه لما نعطس؟", 
    correct: "الحمد لله", 
    wrong: ["الله أكبر", "بسم الله"] 
  }
];

export const ReligiousKnowledge: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const questions = useMemo(() => {
    return religiousQuestions.map(q => {
      const options = [q.correct, ...q.wrong].sort(() => Math.random() - 0.5);
      return { ...q, options };
    });
  }, []);

  const renderQuestion = (index: number, onCorrect: () => void, onIncorrect: () => void) => {
    const q = questions[index];

    return (
      <div className="bg-white/95 backdrop-blur-sm p-6 md:p-10 rounded-[40px] shadow-2xl border-8 border-white text-center w-full max-w-3xl">
        <div className="mb-6">
          <span className="text-6xl">🕌</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-teal-900 mb-10 leading-tight">
          {q.question}
        </h2>
        
        <div className="flex flex-col gap-4 max-w-xl mx-auto">
          {q.options.map(opt => (
            <motion.button
              key={opt}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (opt === q.correct) onCorrect();
                else onIncorrect();
              }}
              className="w-full bg-teal-50 text-teal-800 p-6 rounded-2xl border-4 border-teal-200 shadow-md font-bold text-2xl hover:bg-teal-100 hover:border-teal-300 transition-colors"
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
      gameId="religion"
      gameTitle="معلومات دينية"
      themeColor="from-teal-400 to-teal-600"
      onBack={onBack}
      renderQuestion={renderQuestion}
    />
  );
};
