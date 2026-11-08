const fs = require('fs');
const file = 'src/data/questions/static.ts';
let code = fs.readFileSync(file, 'utf-8');

const newQuestions = `
    {
      id: 'manners_11', categoryId: 'manners', type: 'scenario', difficulty: 1,
      questionText: 'لما نقابل صحابنا أو قرايبنا، أول حاجة بنقولها إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'السلام عليكم', icon: '🤝' },
        { id: 'opt_2', text: 'نسكت ومنتكلمش', icon: '😶' },
        { id: 'opt_3', text: 'نقولهم امشوا', icon: '🚶' }
      ]
    },
    {
      id: 'manners_12', categoryId: 'manners', type: 'scenario', difficulty: 1,
      questionText: 'لما حد يقولنا "السلام عليكم"، نرد عليه نقول إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'وعليكم السلام', icon: '😊' },
        { id: 'opt_2', text: 'نلف وشنا', icon: '😒' },
        { id: 'opt_3', text: 'باي', icon: '👋' }
      ]
    },
    {
      id: 'manners_13', categoryId: 'manners', type: 'scenario', difficulty: 1,
      questionText: 'لما ندخل الأوضة وفيها ناس كبار، بنعمل إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'ندخل نسلم عليهم', icon: '👋' },
        { id: 'opt_2', text: 'ندخل من غير ما نسلم', icon: '🏃' },
        { id: 'opt_3', text: 'نعمل دوشة', icon: '🔊' }
      ]
    },
    {
      id: 'manners_14', categoryId: 'manners', type: 'scenario', difficulty: 1,
      questionText: 'لما حد كبير يتكلم، المفروض نعمل إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'نسمعه باحترام', icon: '👂' },
        { id: 'opt_2', text: 'نقاطعه', icon: '🗣️' },
        { id: 'opt_3', text: 'نلعب في الموبايل', icon: '📱' }
      ]
    },
    {
      id: 'manners_15', categoryId: 'manners', type: 'scenario', difficulty: 1,
      questionText: 'لو راكبين الباص وفي حد كبير مش لاقي مكان يقعد، نعمل إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'نقوم ونخليه يقعد', icon: '🪑' },
        { id: 'opt_2', text: 'نعمل نفسنا مش شايفينه', icon: '🙈' },
        { id: 'opt_3', text: 'نضحك', icon: '😂' }
      ]
    },`;

code = code.replace(/id: 'manners_10'[\s\S]*?\]\n    \}\n  \],/m, match => match + newQuestions);

// Wait, the regex might not match exactly. Let's just find the end of the manners array.
// The array ends with `\n  ],\n  religion: [`
code = code.replace(/\n  \],\n  religion: \[/, ",\n" + newQuestions + "\n  ],\n  religion: [");

fs.writeFileSync(file, code);
