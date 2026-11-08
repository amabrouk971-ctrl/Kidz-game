import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { GameEngine } from '../../components/game/GameEngine';

const flightQuestions = [
  { 
    question: "مين بيسوق الطيارة؟", 
    correct: { text: "الطيار", icon: "👨‍✈️" },
    wrong: [{ text: "الدكتور", icon: "👨‍⚕️" }, { text: "المدرس", icon: "👨‍🏫" }]
  },
  { 
    question: "لما تركب الطيارة لازم تربط إيه؟", 
    correct: { text: "حزام الأمان", icon: "💺" },
    wrong: [{ text: "الشنطة", icon: "🎒" }, { text: "البالونة", icon: "🎈" }]
  },
  { 
    question: "الطيارة بتطير فين؟", 
    correct: { text: "في السما", icon: "☁️" },
    wrong: [{ text: "في البحر", icon: "🌊" }, { text: "في الشارع", icon: "🚗" }]
  },
  { 
    question: "مين بيساعد الركاب في الطيارة ويقدم لهم الأكل؟", 
    correct: { text: "المضيفة", icon: "💁‍♀️" },
    wrong: [{ text: "الطيار", icon: "👨‍✈️" }, { text: "المهندس", icon: "👷" }]
  },
  { 
    question: "بنسافر بالطيارة عشان نروح بلاد بعيدة بسرعة؟", 
    correct: { text: "صح", icon: "✅" },
    wrong: [{ text: "غلط", icon: "❌" }, { text: "ممكن العجلة", icon: "🚲" }]
  },
  { 
    question: "الطيارة بتركبها منين؟", 
    correct: { text: "المطار", icon: "🛫" },
    wrong: [{ text: "المحطة", icon: "🚂" }, { text: "المينا", icon: "🚢" }]
  },
  { 
    question: "لما الطيارة تيجي تنزل، بنقعد في مكانا ونربط الحزام؟", 
    correct: { text: "صح", icon: "✅" },
    wrong: [{ text: "غلط نقوم نجري", icon: "🏃" }, { text: "غلط نلعب", icon: "⚽" }]
  },
  { 
    question: "شنطة السفر بنحط فيها إيه؟", 
    correct: { text: "الهدوم", icon: "👕" },
    wrong: [{ text: "الثلاجة", icon: "🧊" }, { text: "التلفزيون", icon: "📺" }]
  },
  { 
    question: "إيه اللي بيشيل الطيارة ويخليها تطير؟", 
    correct: { text: "الأجنحة والمحركات", icon: "✈️" },
    wrong: [{ text: "العجل", icon: "🛞" }, { text: "الشراع", icon: "⛵" }]
  },
  { 
    question: "المضيفة بتوزع إيه على الركاب؟", 
    correct: { text: "أكل وعصير", icon: "🧃" },
    wrong: [{ text: "كتب مدرسة", icon: "📚" }, { text: "كراسي", icon: "🪑" }]
  }
];

export const FlightAcademyGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const questions = useMemo(() => {
    return flightQuestions.map(q => {
      const options = [q.correct, ...q.wrong].sort(() => Math.random() - 0.5);
      return { ...q, options };
    });
  }, []);

  const renderQuestion = (index: number, onCorrect: () => void, onIncorrect: () => void) => {
    const q = questions[index];

    return (
      <div className="bg-white/95 backdrop-blur-sm p-6 md:p-10 rounded-[40px] shadow-2xl border-8 border-white text-center w-full max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-black text-sky-900 mb-10 leading-tight drop-shadow-sm">
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
              className="w-40 h-48 md:w-56 md:h-64 bg-sky-50 rounded-[32px] border-[6px] border-sky-200 shadow-xl flex flex-col items-center justify-center p-4 active:scale-95 transition-all hover:bg-sky-100 hover:border-sky-300 gap-4"
            >
              <span className="text-7xl md:text-8xl drop-shadow-md">{opt.icon}</span>
              <span className="text-xl md:text-2xl font-black text-sky-800">{opt.text}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <GameEngine 
      gameId="flightAcademy"
      gameTitle="أكاديمية الطيران"
      themeColor="from-sky-400 to-sky-600"
      onBack={onBack}
      renderQuestion={renderQuestion}
    />
  );
};
