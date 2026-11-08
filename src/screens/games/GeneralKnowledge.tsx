import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { GameEngine } from '../../components/game/GameEngine';

const generalQuestions = [
  { 
    question: "إيه الحيوان اللي بنشرب منه اللبن؟", 
    correct: { text: "البقرة", icon: "🐄" },
    wrong: [{ text: "القطة", icon: "🐈" }, { text: "الكلب", icon: "🐕" }]
  },
  { 
    question: "السما لونها إيه في النهار؟", 
    correct: { text: "أزرق", icon: "💙" },
    wrong: [{ text: "أخضر", icon: "💚" }, { text: "أحمر", icon: "❤️" }]
  },
  { 
    question: "بنشوف إيه بالليل في السما؟", 
    correct: { text: "القمر والنجوم", icon: "🌙" },
    wrong: [{ text: "الشمس", icon: "☀️" }, { text: "قوس قزح", icon: "🌈" }]
  },
  { 
    question: "بناكل إيه مفيد ومسكر؟", 
    correct: { text: "الفاكهة", icon: "🍎" },
    wrong: [{ text: "الحلويات", icon: "🍬" }, { text: "الورق", icon: "📄" }]
  },
  { 
    question: "مين ملك الغابة؟", 
    correct: { text: "الأسد", icon: "🦁" },
    wrong: [{ text: "القرد", icon: "🐒" }, { text: "الفيل", icon: "🐘" }]
  },
  { 
    question: "السمك بيعيش فين؟", 
    correct: { text: "في الماية", icon: "🌊" },
    wrong: [{ text: "في الشجرة", icon: "🌳" }, { text: "في الرمل", icon: "🏜️" }]
  },
  { 
    question: "بنسمع بإيه؟", 
    correct: { text: "ودننا", icon: "👂" },
    wrong: [{ text: "عنينا", icon: "👁️" }, { text: "مناخيرنا", icon: "👃" }]
  },
  { 
    question: "بنشم بإيه؟", 
    correct: { text: "مناخيرنا", icon: "👃" },
    wrong: [{ text: "بقنا", icon: "👄" }, { text: "إيدنا", icon: "✋" }]
  },
  { 
    question: "إيه اللي بيدينا نور وحرارة الصبح؟", 
    correct: { text: "الشمس", icon: "☀️" },
    wrong: [{ text: "القمر", icon: "🌙" }, { text: "اللمبة", icon: "💡" }]
  },
  { 
    question: "الشجرة لون ورقها إيه؟", 
    correct: { text: "أخضر", icon: "🌿" },
    wrong: [{ text: "أزرق", icon: "🔵" }, { text: "أسود", icon: "⚫" }]
  }
];

export const GeneralKnowledge: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const questions = useMemo(() => {
    return generalQuestions.map(q => {
      const options = [q.correct, ...q.wrong].sort(() => Math.random() - 0.5);
      return { ...q, options };
    });
  }, []);

  const renderQuestion = (index: number, onCorrect: () => void, onIncorrect: () => void) => {
    const q = questions[index];

    return (
      <div className="bg-white/95 backdrop-blur-sm p-6 md:p-10 rounded-[40px] shadow-2xl border-8 border-white text-center w-full max-w-4xl">
        <h2 className="text-3xl md:text-5xl font-black text-lime-900 mb-10 leading-tight drop-shadow-sm">
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
              className="w-40 h-48 md:w-56 md:h-64 bg-lime-50 rounded-[32px] border-[6px] border-lime-200 shadow-xl flex flex-col items-center justify-center p-4 active:scale-95 transition-all hover:bg-lime-100 hover:border-lime-300 gap-4"
            >
              <span className="text-7xl md:text-8xl drop-shadow-md">{opt.icon}</span>
              <span className="text-xl md:text-2xl font-black text-lime-800">{opt.text}</span>
            </motion.button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <GameEngine 
      gameId="general"
      gameTitle="عالم المعرفة"
      themeColor="from-lime-400 to-lime-600"
      onBack={onBack}
      renderQuestion={renderQuestion}
    />
  );
};
