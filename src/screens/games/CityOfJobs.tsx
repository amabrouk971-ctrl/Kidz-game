import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { GameEngine } from '../../components/game/GameEngine';

const jobsQuestions = [
  { 
    question: "مين بيكشف علينا لما نكون تعبانين؟", 
    correct: { text: "الدكتور", icon: "👨‍⚕️" },
    wrong: [{ text: "النجار", icon: "🪚" }, { text: "الرسام", icon: "🎨" }]
  },
  { 
    question: "مين بيعلمنا في المدرسة؟", 
    correct: { text: "المدرس", icon: "👨‍🏫" },
    wrong: [{ text: "الطباخ", icon: "👨‍🍳" }, { text: "الظابط", icon: "👮" }]
  },
  { 
    question: "مين بيبني العمارات والبيوت؟", 
    correct: { text: "المهندس", icon: "👷" },
    wrong: [{ text: "الدكتور", icon: "👨‍⚕️" }, { text: "الخباز", icon: "🥖" }]
  },
  { 
    question: "مين بيعملنا أكل لذيذ في المطعم؟", 
    correct: { text: "الطباخ", icon: "👨‍🍳" },
    wrong: [{ text: "الطيار", icon: "👨‍✈️" }, { text: "الميكانيكي", icon: "🔧" }]
  },
  { 
    question: "مين بيسوق الطيارة في السما؟", 
    correct: { text: "الطيار", icon: "👨‍✈️" },
    wrong: [{ text: "الفلاح", icon: "👨‍🌾" }, { text: "الدكتور", icon: "👨‍⚕️" }]
  },
  { 
    question: "مين بيساعد الطيار والركاب في الطيارة؟", 
    correct: { text: "المضيفة", icon: "✈️" },
    wrong: [{ text: "المدرس", icon: "👨‍🏫" }, { text: "النجار", icon: "🪚" }]
  },
  { 
    question: "مين بيطفي الحريقة؟", 
    correct: { text: "رجل المطافي", icon: "🚒" },
    wrong: [{ text: "الرسام", icon: "🎨" }, { text: "الفلاح", icon: "👨‍🌾" }]
  },
  { 
    question: "مين بيحمينا ويقبض على الحرامية؟", 
    correct: { text: "الظابط", icon: "👮" },
    wrong: [{ text: "الخباز", icon: "🥖" }, { text: "المهندس", icon: "👷" }]
  },
  { 
    question: "مين بيزرع لنا الخضار والفاكهة؟", 
    correct: { text: "الفلاح", icon: "👨‍🌾" },
    wrong: [{ text: "الطيار", icon: "👨‍✈️" }, { text: "الميكانيكي", icon: "🔧" }]
  },
  { 
    question: "مين بيعالج الحيوانات التعبانة؟", 
    correct: { text: "الدكتور البيطري", icon: "🐶" },
    wrong: [{ text: "المهندس", icon: "👷" }, { text: "رجل المطافي", icon: "🚒" }]
  }
];

export const CityOfJobs: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const questions = useMemo(() => {
    return jobsQuestions.map(q => {
      const options = [q.correct, ...q.wrong].sort(() => Math.random() - 0.5);
      return { ...q, options };
    });
  }, []);

  const renderQuestion = (index: number, onCorrect: () => void, onIncorrect: () => void) => {
    const q = questions[index];

    return (
      <div className="bg-white/95 backdrop-blur-sm p-6 md:p-10 rounded-[40px] shadow-2xl border-8 border-white text-center w-full max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-black text-pink-900 mb-10 leading-tight drop-shadow-sm">
          {q.question}
        </h2>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {q.options.map(opt => (
            <motion.button
              key={opt.text}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (opt.text === q.correct.text) onCorrect();
                else onIncorrect();
              }}
              className="w-40 h-48 md:w-56 md:h-64 bg-pink-50 rounded-[32px] border-[6px] border-pink-200 shadow-xl flex flex-col items-center justify-center p-4 active:scale-95 transition-all hover:bg-pink-100 hover:border-pink-300 gap-4"
            >
              <span className="text-7xl md:text-8xl drop-shadow-md">{opt.icon}</span>
              <span className="text-xl md:text-2xl font-black text-pink-800">{opt.text}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <GameEngine 
      gameId="jobs"
      gameTitle="مدينة المهن"
      themeColor="from-pink-400 to-pink-600"
      onBack={onBack}
      renderQuestion={renderQuestion}
    />
  );
};
