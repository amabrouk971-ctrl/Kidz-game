import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { GameEngine } from '../../components/game/GameEngine';

const politenessQuestions = [
  { 
    question: "لما تقابل حد من أصحابك أو قرايبك، تسلم عليه وتقول إيه؟", 
    correct: "السلام عليكم ورحمة الله 🤝", 
    wrong: ["أمشي ومنطقش", "أقوله ابعد عني"] 
  },
  { 
    question: "لما حد يقولك 'السلام عليكم'، ترد عليه وتقول إيه؟", 
    correct: "وعليكم السلام ورحمة الله وبركاته 😊", 
    wrong: ["ألف وشي الناحية التانية", "أقوله باي"] 
  },
  { 
    question: "لما تشوف جدو أو تيتا أو حد كبير، تعمل إيه؟", 
    correct: "أسلم عليه باحترام وحب وأبوس إيده ❤️", 
    wrong: ["أجري من غير ما أسلم", "أعمل دوشة وأزعق"] 
  },
  { 
    question: "لو دخلت مكان وفيه ناس قاعدين، تعمل إيه؟", 
    correct: "أدخل وألقي السلام بأدب 🌸", 
    wrong: ["أدخل ساكت ومبصش لحد", "أجري وأخبط في الكراسي"] 
  },
  { 
    question: "عايز تطلب حاجة من حد، تقول إيه؟", 
    correct: "لو سمحت من فضلك 🙏", 
    wrong: ["هات دي بسرعة", "اديني غصب عنك"] 
  },
  { 
    question: "حد جابلك هدية أو ساعدك، تقول إيه؟", 
    correct: "شكراً جزيلاً وجزاك الله خيراً 🎁", 
    wrong: ["عادي مش فارقة", "لا مش عايزها"] 
  },
  { 
    question: "خبطت في حد من غير قصد، تقول إيه؟", 
    correct: "أنا آسف وحقك عليا 🥺", 
    wrong: ["وسع كده", "أنت اللي خبطتني"] 
  },
  { 
    question: "لما تشوف حد الصبح تقول إيه؟", 
    correct: "صباح الخير والورد ☀️", 
    wrong: ["تصبح على خير", "أنا همشي"] 
  },
  { 
    question: "لما حد كبير يتكلم معاك، تعمل إيه؟", 
    correct: "أسمعه باحترام ومن غير ما أقاطعه 👂", 
    wrong: ["ألعب في الموبايل وأطنشه", "أعلي صوتي عليه"] 
  },
  { 
    question: "لو معاك لعبة وزميلك نفسه يلعب بيها معاك؟", 
    correct: "أشاركه اللعبة ونلعب سوا بمحبة 🧸", 
    wrong: ["أخبيها في الشنطة", "أقوله دي بتاعتي لوحدي"] 
  }
];

export const PolitenessGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const questions = useMemo(() => {
    return politenessQuestions.map(q => {
      const options = [q.correct, ...q.wrong].sort(() => Math.random() - 0.5);
      return { ...q, options };
    });
  }, []);

  const renderQuestion = (index: number, onCorrect: () => void, onIncorrect: () => void) => {
    const q = questions[index];

    return (
      <div className="bg-white/95 backdrop-blur-sm p-6 md:p-10 rounded-[40px] shadow-2xl border-8 border-white text-center w-full max-w-3xl">
        <div className="mb-6">
          <span className="text-6xl">❤️</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-rose-900 mb-10 leading-tight">
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
              className="w-full bg-rose-50 text-rose-800 p-6 rounded-2xl border-4 border-rose-200 shadow-md font-bold text-2xl hover:bg-rose-100 hover:border-rose-300 transition-colors"
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
      gameId="politeness"
      gameTitle="عالم الأدب واللطف"
      themeColor="from-rose-400 to-rose-600"
      celebrationTheme="politeness"
      onBack={onBack}
      renderQuestion={renderQuestion}
    />
  );
};
