import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { GameEngine } from '../../components/game/GameEngine';

const swimmingQuestions = [
  { 
    question: "ننزل حمام السباحة مع مين؟", 
    correct: { text: "مع ماما أو بابا", icon: "👨‍👩‍👧" },
    wrong: [{ text: "لوحدي", icon: "🧍" }, { text: "مع أصحابي بس", icon: "👶" }]
  },
  { 
    question: "إيه اللي نلبسه عشان نعوم بأمان؟", 
    correct: { text: "عوامة / جاكيت السباحة", icon: "🛟" },
    wrong: [{ text: "كاب بس", icon: "🧢" }, { text: "نضارة شمس", icon: "🕶️" }]
  },
  { 
    question: "ننط في المية منين؟", 
    correct: { text: "من المكان المخصص", icon: "✅" },
    wrong: [{ text: "من أي حتة", icon: "❌" }, { text: "فوق راس حد", icon: "🤕" }]
  },
  { 
    question: "لما نعوم بنحرك إيه؟", 
    correct: { text: "إيدينا ورجلينا", icon: "🏊‍♀️" },
    wrong: [{ text: "ودننا", icon: "👂" }, { text: "مناخيرنا", icon: "👃" }]
  },
  { 
    question: "لو شربنا مية من حمام السباحة، ده صح؟", 
    correct: { text: "غلط، مية مش نظيفة", icon: "🤢" },
    wrong: [{ text: "صح، مية مفيدة", icon: "💧" }, { text: "عادي طعمها حلو", icon: "😋" }]
  },
  { 
    question: "إزاي ناخد نفس وإحنا بنعوم؟", 
    correct: { text: "نرفع راسنا بره المية", icon: "😮" },
    wrong: [{ text: "نفتح بقنا تحت المية", icon: "🫧" }, { text: "نكتم نفسنا خالص", icon: "😶" }]
  },
  { 
    question: "نلبس إيه في عنينا وإحنا بنعوم؟", 
    correct: { text: "نضارة سباحة", icon: "🥽" },
    wrong: [{ text: "نضارة قراية", icon: "👓" }, { text: "مفيش حاجة", icon: "👁️" }]
  },
  { 
    question: "نعمل إيه لو تعبنا في المية؟", 
    correct: { text: "نطلع نرتاح بره", icon: "🏖️" },
    wrong: [{ text: "نكمل عوم", icon: "🏊" }, { text: "ننام في المية", icon: "😴" }]
  },
  { 
    question: "لما نخلص سباحة، نعمل إيه؟", 
    correct: { text: "نستحمى بمية نظيفة", icon: "🚿" },
    wrong: [{ text: "نلبس هدومنا على طول", icon: "👕" }, { text: "ننام", icon: "🛌" }]
  },
  { 
    question: "المكان المخصص للسباحة إسمه إيه؟", 
    correct: { text: "حمام السباحة / البحر", icon: "🌊" },
    wrong: [{ text: "الشارع", icon: "🛣️" }, { text: "البانيو الصغير", icon: "🛁" }]
  }
];

export const SwimmingSchool: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const questions = useMemo(() => {
    return swimmingQuestions.map(q => {
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
      gameId="swimming"
      gameTitle="مدرسة السباحة"
      themeColor="from-sky-400 to-sky-600"
      onBack={onBack}
      renderQuestion={renderQuestion}
    />
  );
};
