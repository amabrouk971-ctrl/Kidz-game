import { Question } from './types';

export const STATIC_QUESTIONS: Record<string, Question[]> = {
  manners: [
    {
      id: 'manners_1', categoryId: 'manners', type: 'scenario', difficulty: 1,
      questionText: 'لما حد يدينا هدية، بنقول إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'شكراً', icon: '🙏' },
        { id: 'opt_2', text: 'باي', icon: '👋' },
        { id: 'opt_3', text: 'لا', icon: '🙅' }
      ]
    },
    {
      id: 'manners_2', categoryId: 'manners', type: 'scenario', difficulty: 1,
      questionText: 'لما نغلط، بنعمل إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'نقول آسف', icon: '😔' },
        { id: 'opt_2', text: 'نضحك', icon: '😂' },
        { id: 'opt_3', text: 'نجري', icon: '🏃' }
      ]
    },
    {
      id: 'manners_3', categoryId: 'manners', type: 'scenario', difficulty: 1,
      questionText: 'لما نصحى من النوم، نقول إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'صباح الخير', icon: '☀️' },
        { id: 'opt_2', text: 'تصبح على خير', icon: '🌙' },
        { id: 'opt_3', text: 'مع السلامة', icon: '👋' }
      ]
    },
    {
      id: 'manners_4', categoryId: 'manners', type: 'scenario', difficulty: 1,
      questionText: 'لما نعطس، نقول إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'الحمد لله', icon: '🤲' },
        { id: 'opt_2', text: 'شكراً', icon: '🙏' },
        { id: 'opt_3', text: 'معلش', icon: '🤷' }
      ]
    },
    {
      id: 'manners_5', categoryId: 'manners', type: 'scenario', difficulty: 1,
      questionText: 'إيه التصرف الصح مع اللعب؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'نشاركها مع أصحابنا', icon: '🤝' },
        { id: 'opt_2', text: 'نكسرها', icon: '💥' },
        { id: 'opt_3', text: 'نخبيها', icon: '🙈' }
      ]
    },
    {
      id: 'manners_6', categoryId: 'manners', type: 'scenario', difficulty: 1,
      questionText: 'قبل ما ناكل، بنعمل إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'نغسل إيدينا', icon: '🧼' },
        { id: 'opt_2', text: 'نلعب', icon: '🎮' },
        { id: 'opt_3', text: 'ننام', icon: '😴' }
      ]
    },
    {
      id: 'manners_7', categoryId: 'manners', type: 'scenario', difficulty: 1,
      questionText: 'لما نشوف حد كبير، بنعمل إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'نحترمه ونساعده', icon: '👵' },
        { id: 'opt_2', text: 'نزعق', icon: '😠' },
        { id: 'opt_3', text: 'نتجاهله', icon: '🙈' }
      ]
    },
    {
      id: 'manners_8', categoryId: 'manners', type: 'scenario', difficulty: 1,
      questionText: 'في المكتبة، لازم نكون...',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'هاديين', icon: '🤫' },
        { id: 'opt_2', text: 'صوتنا عالي', icon: '🗣️' },
        { id: 'opt_3', text: 'بنجري', icon: '🏃' }
      ]
    },
    {
      id: 'manners_9', categoryId: 'manners', type: 'scenario', difficulty: 1,
      questionText: 'لما نخلص لعب، بنعمل إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'نلم اللعب', icon: '🧸' },
        { id: 'opt_2', text: 'نسيبها متبهدلة', icon: '🌪️' },
        { id: 'opt_3', text: 'نرميها', icon: '🗑️' }
      ]
    },
    {
      id: 'manners_10', categoryId: 'manners', type: 'scenario', difficulty: 1,
      questionText: 'لما نعوز حاجة من حد، نقول إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'لو سمحت', icon: '🥺' },
        { id: 'opt_2', text: 'هات', icon: '😡' },
        { id: 'opt_3', text: 'بسرعة', icon: '⏱️' }
      ]
    },
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
    }
  ],
  religion: [
    {
      id: 'rel_1', categoryId: 'religion', type: 'scenario', difficulty: 1,
      questionText: 'إيه اسم كتابنا المقدس؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'القرآن الكريم', icon: '📖' },
        { id: 'opt_2', text: 'كتاب القصص', icon: '📚' },
        { id: 'opt_3', text: 'كتاب الرسم', icon: '🎨' }
      ]
    },
    {
      id: 'rel_2', categoryId: 'religion', type: 'scenario', difficulty: 1,
      questionText: 'إيه ديننا؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'الإسلام', icon: '🕌' },
        { id: 'opt_2', text: 'السلام', icon: '🕊️' },
        { id: 'opt_3', text: 'المحبة', icon: '❤️' }
      ]
    },
    {
      id: 'rel_3', categoryId: 'religion', type: 'scenario', difficulty: 1,
      questionText: 'من هو نبينا؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'سيدنا محمد (ص)', icon: '✨' },
        { id: 'opt_2', text: 'عمو', icon: '👨' },
        { id: 'opt_3', text: 'صاحبي', icon: '👦' }
      ]
    },
    {
      id: 'rel_4', categoryId: 'religion', type: 'scenario', difficulty: 1,
      questionText: 'بصلي كام مرة في اليوم؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: '5 مرات', icon: '5️⃣' },
        { id: 'opt_2', text: 'مرتين', icon: '2️⃣' },
        { id: 'opt_3', text: 'مرة واحدة', icon: '1️⃣' }
      ]
    },
    {
      id: 'rel_5', categoryId: 'religion', type: 'scenario', difficulty: 1,
      questionText: 'بنصوم في شهر إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'رمضان', icon: '🌙' },
        { id: 'opt_2', text: 'العيد', icon: '🎉' },
        { id: 'opt_3', text: 'الصيف', icon: '☀️' }
      ]
    },
    {
      id: 'rel_6', categoryId: 'religion', type: 'scenario', difficulty: 1,
      questionText: 'بنقول إيه قبل ما ناكل؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'بسم الله', icon: '🍽️' },
        { id: 'opt_2', text: 'الحمد لله', icon: '🤲' },
        { id: 'opt_3', text: 'شكراً', icon: '🙏' }
      ]
    },
    {
      id: 'rel_7', categoryId: 'religion', type: 'scenario', difficulty: 1,
      questionText: 'بنقول إيه بعد ما ناكل؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'الحمد لله', icon: '🤲' },
        { id: 'opt_2', text: 'بسم الله', icon: '🍽️' },
        { id: 'opt_3', text: 'باي', icon: '👋' }
      ]
    },
    {
      id: 'rel_8', categoryId: 'religion', type: 'scenario', difficulty: 1,
      questionText: 'لما نعوز ندعي ربنا، بنعمل إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'نرفع إيدينا', icon: '🤲' },
        { id: 'opt_2', text: 'ننام', icon: '😴' },
        { id: 'opt_3', text: 'نلعب', icon: '⚽' }
      ]
    },
    {
      id: 'rel_9', categoryId: 'religion', type: 'scenario', difficulty: 1,
      questionText: 'بنعيد امتى؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'في العيد', icon: '🎈' },
        { id: 'opt_2', text: 'كل يوم', icon: '📅' },
        { id: 'opt_3', text: 'في المدرسة', icon: '🏫' }
      ]
    },
    {
      id: 'rel_10', categoryId: 'religion', type: 'scenario', difficulty: 1,
      questionText: 'مين اللي خلقنا؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'الله', icon: '✨' },
        { id: 'opt_2', text: 'ماما', icon: '👩' },
        { id: 'opt_3', text: 'بابا', icon: '👨' }
      ]
    }
  ],
  quran: [
    {
      id: 'quran_1', categoryId: 'quran', type: 'identify', difficulty: 1,
      questionText: 'إحنا بنقرأ إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'القرآن الكريم', icon: '📖' },
        { id: 'opt_2', text: 'قصة', icon: '📕' },
        { id: 'opt_3', text: 'لعبة', icon: '🧸' }
      ]
    },
    {
      id: 'quran_2', categoryId: 'quran', type: 'identify', difficulty: 1,
      questionText: 'مكان القرآن فين؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'في مكان عالي ونضيف', icon: '✨' },
        { id: 'opt_2', text: 'على الأرض', icon: '⬇️' },
        { id: 'opt_3', text: 'مع اللعب', icon: '🧸' }
      ]
    },
    {
      id: 'quran_3', categoryId: 'quran', type: 'identify', difficulty: 1,
      questionText: 'قبل ما نمسك القرآن لازم نكون...',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'متوضيين', icon: '💧' },
        { id: 'opt_2', text: 'بنجري', icon: '🏃' },
        { id: 'opt_3', text: 'بناكل', icon: '🍎' }
      ]
    },
    {
      id: 'quran_4', categoryId: 'quran', type: 'identify', difficulty: 1,
      questionText: 'أول سورة في القرآن هي...',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'الفاتحة', icon: '📖' },
        { id: 'opt_2', text: 'الناس', icon: '🌙' },
        { id: 'opt_3', text: 'الفلق', icon: '☀️' }
      ]
    },
    {
      id: 'quran_5', categoryId: 'quran', type: 'identify', difficulty: 1,
      questionText: 'القرآن كلام مين؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'كلام الله', icon: '✨' },
        { id: 'opt_2', text: 'كلام الناس', icon: '🗣️' },
        { id: 'opt_3', text: 'قصص', icon: '📚' }
      ]
    },
    {
      id: 'quran_6', categoryId: 'quran', type: 'identify', difficulty: 1,
      questionText: 'لما نسمع القرآن بنعمل إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'نسكت ونسمع', icon: '🤫' },
        { id: 'opt_2', text: 'نلعب', icon: '🎮' },
        { id: 'opt_3', text: 'نغني', icon: '🎵' }
      ]
    },
    {
      id: 'quran_7', categoryId: 'quran', type: 'identify', difficulty: 1,
      questionText: 'سورة (قل هو الله أحد) هي سورة...',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'الإخلاص', icon: '🤍' },
        { id: 'opt_2', text: 'الفلق', icon: '🌅' },
        { id: 'opt_3', text: 'الناس', icon: '👥' }
      ]
    },
    {
      id: 'quran_8', categoryId: 'quran', type: 'identify', difficulty: 1,
      questionText: 'حفظ القرآن بيخلينا...',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'أشطر وندخل الجنة', icon: '🌟' },
        { id: 'opt_2', text: 'تعبانين', icon: '😴' },
        { id: 'opt_3', text: 'زعلانين', icon: '😢' }
      ]
    },
    {
      id: 'quran_9', categoryId: 'quran', type: 'identify', difficulty: 1,
      questionText: 'اللي بيقرأ القرآن بياخد...',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'حسنات كتير', icon: '⭐' },
        { id: 'opt_2', text: 'سيئات', icon: '❌' },
        { id: 'opt_3', text: 'فلوس', icon: '💰' }
      ]
    },
    {
      id: 'quran_10', categoryId: 'quran', type: 'identify', difficulty: 1,
      questionText: 'بنبدأ قراءة القرآن بكلمة إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'بسم الله', icon: '✨' },
        { id: 'opt_2', text: 'يلا بينا', icon: '🏃' },
        { id: 'opt_3', text: 'أهلاً', icon: '👋' }
      ]
    }
  ],
  swimming: [
    {
      id: 'swim_1', categoryId: 'swimming', type: 'identify', difficulty: 1,
      questionText: 'إيه التصرف الصح في حمام السباحة؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'نعوم مع شخص كبير', icon: '👨‍👦' },
        { id: 'opt_2', text: 'ننط لوحدنا', icon: '🏊' },
        { id: 'opt_3', text: 'نجري على الحرف', icon: '🏃' }
      ]
    },
    {
      id: 'swim_2', categoryId: 'swimming', type: 'identify', difficulty: 1,
      questionText: 'عشان منعرقش في المية، بنلبس إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'مايوه السباحة', icon: '🩱' },
        { id: 'opt_2', text: 'جاكت', icon: '🧥' },
        { id: 'opt_3', text: 'جزمة', icon: '👟' }
      ]
    },
    {
      id: 'swim_3', categoryId: 'swimming', type: 'identify', difficulty: 1,
      questionText: 'عشان عينينا متوجعناش من المية بنلبس...',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'نضارة سباحة', icon: '🥽' },
        { id: 'opt_2', text: 'كاب', icon: '🧢' },
        { id: 'opt_3', text: 'نضارة شمس', icon: '🕶️' }
      ]
    },
    {
      id: 'swim_4', categoryId: 'swimming', type: 'identify', difficulty: 1,
      questionText: 'لو مش بنعرف نعوم كويس، نلبس إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'عوامة', icon: '🛟' },
        { id: 'opt_2', text: 'طاقية', icon: '🎩' },
        { id: 'opt_3', text: 'ساعة', icon: '⌚' }
      ]
    },
    {
      id: 'swim_5', categoryId: 'swimming', type: 'identify', difficulty: 1,
      questionText: 'بنعمل إيه برجلينا واحنا بنعوم؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'نحركها عشان نمشي', icon: '🦵' },
        { id: 'opt_2', text: 'نوقفها', icon: '🛑' },
        { id: 'opt_3', text: 'نرفعها فوق', icon: '⬆️' }
      ]
    },
    {
      id: 'swim_6', categoryId: 'swimming', type: 'identify', difficulty: 1,
      questionText: 'مين بيعلمنا السباحة؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'المدرب', icon: '🏊‍♂️' },
        { id: 'opt_2', text: 'الدكتور', icon: '👨‍⚕️' },
        { id: 'opt_3', text: 'المهندس', icon: '👷' }
      ]
    },
    {
      id: 'swim_7', categoryId: 'swimming', type: 'identify', difficulty: 1,
      questionText: 'قبل ما ننزل المية لازم...',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'نستأذن ماما أو بابا', icon: '👨‍👩‍👧' },
        { id: 'opt_2', text: 'ناكل كتير', icon: '🍔' },
        { id: 'opt_3', text: 'ننام', icon: '😴' }
      ]
    },
    {
      id: 'swim_8', categoryId: 'swimming', type: 'identify', difficulty: 1,
      questionText: 'عشان ناخد نفس واحنا بنعوم بنعمل إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'نطلع راسنا برة المية', icon: '😌' },
        { id: 'opt_2', text: 'نفتح بقنا جوه المية', icon: '😲' },
        { id: 'opt_3', text: 'نعيط', icon: '😭' }
      ]
    },
    {
      id: 'swim_9', categoryId: 'swimming', type: 'identify', difficulty: 1,
      questionText: 'لو تعبنا واحنا بنعوم، نعمل إيه؟',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'نمسك في حرف الحمام ونرتاح', icon: '🧱' },
        { id: 'opt_2', text: 'نكمل عوم', icon: '🏊' },
        { id: 'opt_3', text: 'ننزل تحت المية', icon: '⬇️' }
      ]
    },
    {
      id: 'swim_10', categoryId: 'swimming', type: 'identify', difficulty: 1,
      questionText: 'بعد ما نخلص سباحة لازم...',
      correctOptionId: 'opt_1',
      options: [
        { id: 'opt_1', text: 'نستحمى بمية نضيفة', icon: '🚿' },
        { id: 'opt_2', text: 'ننام بهدومنا', icon: '🛏️' },
        { id: 'opt_3', text: 'نلعب في التراب', icon: '🌪️' }
      ]
    }
  ],
  colors: [
    {
      id: 'col_1', categoryId: 'colors', type: 'identify', difficulty: 1,
      questionText: 'فين اللون الأحمر؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🔴', text: 'أحمر' }, { id: 'opt_2', icon: '🔵', text: 'أزرق' }, { id: 'opt_3', icon: '🟢', text: 'أخضر' }]
    },
    {
      id: 'col_2', categoryId: 'colors', type: 'identify', difficulty: 1,
      questionText: 'مين لونه أصفر؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🟡', text: 'أصفر' }, { id: 'opt_2', icon: '🟣', text: 'بنفسجي' }, { id: 'opt_3', icon: '🟤', text: 'بني' }]
    },
    {
      id: 'col_3', categoryId: 'colors', type: 'identify', difficulty: 1,
      questionText: 'اختار اللون الأزرق.', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🔵', text: 'أزرق' }, { id: 'opt_2', icon: '🔴', text: 'أحمر' }, { id: 'opt_3', icon: '🟠', text: 'برتقالي' }]
    },
    {
      id: 'col_4', categoryId: 'colors', type: 'identify', difficulty: 1,
      questionText: 'إيه لون التفاحة؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🔴', text: 'أحمر' }, { id: 'opt_2', icon: '⚫', text: 'أسود' }, { id: 'opt_3', icon: '⚪', text: 'أبيض' }]
    },
    {
      id: 'col_5', categoryId: 'colors', type: 'identify', difficulty: 1,
      questionText: 'إيه لون الموزة؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🟡', text: 'أصفر' }, { id: 'opt_2', icon: '🔵', text: 'أزرق' }, { id: 'opt_3', icon: '🟢', text: 'أخضر' }]
    },
    {
      id: 'col_6', categoryId: 'colors', type: 'identify', difficulty: 1,
      questionText: 'إيه لون العشب والشجر؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🟢', text: 'أخضر' }, { id: 'opt_2', icon: '🔴', text: 'أحمر' }, { id: 'opt_3', icon: '🟡', text: 'أصفر' }]
    },
    {
      id: 'col_7', categoryId: 'colors', type: 'identify', difficulty: 1,
      questionText: 'إيه لون البحر؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🔵', text: 'أزرق' }, { id: 'opt_2', icon: '🟠', text: 'برتقالي' }, { id: 'opt_3', icon: '🟤', text: 'بني' }]
    },
    {
      id: 'col_8', categoryId: 'colors', type: 'identify', difficulty: 1,
      questionText: 'فين اللون الأسود؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '⚫', text: 'أسود' }, { id: 'opt_2', icon: '⚪', text: 'أبيض' }, { id: 'opt_3', icon: '🔴', text: 'أحمر' }]
    },
    {
      id: 'col_9', categoryId: 'colors', type: 'identify', difficulty: 1,
      questionText: 'فين اللون البرتقالي؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🟠', text: 'برتقالي' }, { id: 'opt_2', icon: '🟣', text: 'بنفسجي' }, { id: 'opt_3', icon: '🟢', text: 'أخضر' }]
    },
    {
      id: 'col_10', categoryId: 'colors', type: 'identify', difficulty: 1,
      questionText: 'فين اللون الأبيض؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '⚪', text: 'أبيض' }, { id: 'opt_2', icon: '⚫', text: 'أسود' }, { id: 'opt_3', icon: '🔵', text: 'أزرق' }]
    }
  ],
  shapes: [
    {
      id: 'shape_1', categoryId: 'shapes', type: 'identify', difficulty: 1,
      questionText: 'فين الدايرة؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🔴', text: 'دايرة' }, { id: 'opt_2', icon: '🟦', text: 'مربع' }, { id: 'opt_3', icon: '🔺', text: 'مثلث' }]
    },
    {
      id: 'shape_2', categoryId: 'shapes', type: 'identify', difficulty: 1,
      questionText: 'اختار المربع.', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🟦', text: 'مربع' }, { id: 'opt_2', icon: '🔴', text: 'دايرة' }, { id: 'opt_3', icon: '⭐', text: 'نجمة' }]
    },
    {
      id: 'shape_3', categoryId: 'shapes', type: 'identify', difficulty: 1,
      questionText: 'فين المثلث؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🔺', text: 'مثلث' }, { id: 'opt_2', icon: '🟦', text: 'مربع' }, { id: 'opt_3', icon: '❤️', text: 'قلب' }]
    },
    {
      id: 'shape_4', categoryId: 'shapes', type: 'identify', difficulty: 1,
      questionText: 'فين النجمة؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '⭐', text: 'نجمة' }, { id: 'opt_2', icon: '🔴', text: 'دايرة' }, { id: 'opt_3', icon: '🔺', text: 'مثلث' }]
    },
    {
      id: 'shape_5', categoryId: 'shapes', type: 'identify', difficulty: 1,
      questionText: 'فين القلب؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '❤️', text: 'قلب' }, { id: 'opt_2', icon: '🟦', text: 'مربع' }, { id: 'opt_3', icon: '⭐', text: 'نجمة' }]
    },
    {
      id: 'shape_6', categoryId: 'shapes', type: 'identify', difficulty: 1,
      questionText: 'الكورة شكلها إيه؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🔴', text: 'دايرة' }, { id: 'opt_2', icon: '🔺', text: 'مثلث' }, { id: 'opt_3', icon: '🟦', text: 'مربع' }]
    },
    {
      id: 'shape_7', categoryId: 'shapes', type: 'identify', difficulty: 1,
      questionText: 'الشباك شكله إيه؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🟦', text: 'مربع' }, { id: 'opt_2', icon: '🔴', text: 'دايرة' }, { id: 'opt_3', icon: '⭐', text: 'نجمة' }]
    },
    {
      id: 'shape_8', categoryId: 'shapes', type: 'identify', difficulty: 1,
      questionText: 'قطعة البيتزا شكلها إيه؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🔺', text: 'مثلث' }, { id: 'opt_2', icon: '🔴', text: 'دايرة' }, { id: 'opt_3', icon: '🟦', text: 'مربع' }]
    },
    {
      id: 'shape_9', categoryId: 'shapes', type: 'identify', difficulty: 1,
      questionText: 'إيه الشكل اللي في السما بالليل؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '⭐', text: 'نجمة' }, { id: 'opt_2', icon: '🟦', text: 'مربع' }, { id: 'opt_3', icon: '❤️', text: 'قلب' }]
    },
    {
      id: 'shape_10', categoryId: 'shapes', type: 'identify', difficulty: 1,
      questionText: 'إيه شكل الحب؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '❤️', text: 'قلب' }, { id: 'opt_2', icon: '🔺', text: 'مثلث' }, { id: 'opt_3', icon: '🔴', text: 'دايرة' }]
    }
  ],
  numbers: [
    {
      id: 'num_1', categoryId: 'numbers', type: 'identify', difficulty: 1,
      questionText: 'فين رقم 1؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '1️⃣', text: '1' }, { id: 'opt_2', icon: '2️⃣', text: '2' }, { id: 'opt_3', icon: '3️⃣', text: '3' }]
    },
    {
      id: 'num_2', categoryId: 'numbers', type: 'identify', difficulty: 1,
      questionText: 'فين رقم 2؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '2️⃣', text: '2' }, { id: 'opt_2', icon: '4️⃣', text: '4' }, { id: 'opt_3', icon: '1️⃣', text: '1' }]
    },
    {
      id: 'num_3', categoryId: 'numbers', type: 'identify', difficulty: 1,
      questionText: 'فين رقم 3؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '3️⃣', text: '3' }, { id: 'opt_2', icon: '5️⃣', text: '5' }, { id: 'opt_3', icon: '2️⃣', text: '2' }]
    },
    {
      id: 'num_4', categoryId: 'numbers', type: 'count', difficulty: 1,
      questionText: 'عدي التفاحات... كام تفاحة؟ (🍎)', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '1️⃣', text: '1' }, { id: 'opt_2', icon: '3️⃣', text: '3' }, { id: 'opt_3', icon: '4️⃣', text: '4' }]
    },
    {
      id: 'num_5', categoryId: 'numbers', type: 'count', difficulty: 1,
      questionText: 'عدي القطط... كام قطة؟ (🐱 🐱)', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '2️⃣', text: '2' }, { id: 'opt_2', icon: '1️⃣', text: '1' }, { id: 'opt_3', icon: '5️⃣', text: '5' }]
    },
    {
      id: 'num_6', categoryId: 'numbers', type: 'count', difficulty: 1,
      questionText: 'عدي النجوم... كام نجمة؟ (⭐ ⭐ ⭐)', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '3️⃣', text: '3' }, { id: 'opt_2', icon: '4️⃣', text: '4' }, { id: 'opt_3', icon: '2️⃣', text: '2' }]
    },
    {
      id: 'num_7', categoryId: 'numbers', type: 'identify', difficulty: 1,
      questionText: 'فين رقم 4؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '4️⃣', text: '4' }, { id: 'opt_2', icon: '1️⃣', text: '1' }, { id: 'opt_3', icon: '5️⃣', text: '5' }]
    },
    {
      id: 'num_8', categoryId: 'numbers', type: 'identify', difficulty: 1,
      questionText: 'فين رقم 5؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '5️⃣', text: '5' }, { id: 'opt_2', icon: '3️⃣', text: '3' }, { id: 'opt_3', icon: '2️⃣', text: '2' }]
    },
    {
      id: 'num_9', categoryId: 'numbers', type: 'count', difficulty: 1,
      questionText: 'عندنا كام إيد؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '2️⃣', text: '2' }, { id: 'opt_2', icon: '1️⃣', text: '1' }, { id: 'opt_3', icon: '4️⃣', text: '4' }]
    },
    {
      id: 'num_10', categoryId: 'numbers', type: 'count', difficulty: 1,
      questionText: 'الكلب عنده كام رجل؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '4️⃣', text: '4' }, { id: 'opt_2', icon: '2️⃣', text: '2' }, { id: 'opt_3', icon: '5️⃣', text: '5' }]
    }
  ],
  letters: [
    {
      id: 'let_1', categoryId: 'letters', type: 'identify', difficulty: 1,
      questionText: 'فين حرف أ؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: 'أ', text: 'أ' }, { id: 'opt_2', icon: 'ب', text: 'ب' }, { id: 'opt_3', icon: 'ت', text: 'ت' }]
    },
    {
      id: 'let_2', categoryId: 'letters', type: 'identify', difficulty: 1,
      questionText: 'أ زي إيه؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🦁', text: 'أسد' }, { id: 'opt_2', icon: '🦆', text: 'بطة' }, { id: 'opt_3', icon: '🍎', text: 'تفاح' }]
    },
    {
      id: 'let_3', categoryId: 'letters', type: 'identify', difficulty: 1,
      questionText: 'فين حرف ب؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: 'ب', text: 'ب' }, { id: 'opt_2', icon: 'أ', text: 'أ' }, { id: 'opt_3', icon: 'ث', text: 'ث' }]
    },
    {
      id: 'let_4', categoryId: 'letters', type: 'identify', difficulty: 1,
      questionText: 'ب زي إيه؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🦆', text: 'بطة' }, { id: 'opt_2', icon: '🦁', text: 'أسد' }, { id: 'opt_3', icon: '🦊', text: 'ثعلب' }]
    },
    {
      id: 'let_5', categoryId: 'letters', type: 'identify', difficulty: 1,
      questionText: 'فين حرف ت؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: 'ت', text: 'ت' }, { id: 'opt_2', icon: 'ج', text: 'ج' }, { id: 'opt_3', icon: 'ب', text: 'ب' }]
    },
    {
      id: 'let_6', categoryId: 'letters', type: 'identify', difficulty: 1,
      questionText: 'ت زي إيه؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🍎', text: 'تفاحة' }, { id: 'opt_2', icon: '🦆', text: 'بطة' }, { id: 'opt_3', icon: '🐫', text: 'جمل' }]
    },
    {
      id: 'let_7', categoryId: 'letters', type: 'identify', difficulty: 1,
      questionText: 'فين حرف ج؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: 'ج', text: 'ج' }, { id: 'opt_2', icon: 'ح', text: 'ح' }, { id: 'opt_3', icon: 'خ', text: 'خ' }]
    },
    {
      id: 'let_8', categoryId: 'letters', type: 'identify', difficulty: 1,
      questionText: 'ج زي إيه؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🐫', text: 'جمل' }, { id: 'opt_2', icon: '🍎', text: 'تفاحة' }, { id: 'opt_3', icon: '🦁', text: 'أسد' }]
    },
    {
      id: 'let_9', categoryId: 'letters', type: 'identify', difficulty: 1,
      questionText: 'مين بيبدأ بحرف الـ س؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🐟', text: 'سمكة' }, { id: 'opt_2', icon: '🦆', text: 'بطة' }, { id: 'opt_3', icon: '🐫', text: 'جمل' }]
    },
    {
      id: 'let_10', categoryId: 'letters', type: 'identify', difficulty: 1,
      questionText: 'مين بيبدأ بحرف الـ م؟', correctOptionId: 'opt_1',
      options: [{ id: 'opt_1', icon: '🍌', text: 'موز' }, { id: 'opt_2', icon: '🍎', text: 'تفاح' }, { id: 'opt_3', icon: '🐟', text: 'سمكة' }]
    }
  ]
};
