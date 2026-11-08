const fs = require('fs');

let typesCode = fs.readFileSync('src/data/universe/types.ts', 'utf-8');
typesCode = typesCode.replace(/\| 'feelings' \| 'general'/, `| 'feelings' | 'professions' | 'general'`);
fs.writeFileSync('src/data/universe/types.ts', typesCode);

let categoriesCode = fs.readFileSync('src/data/universe/categories.ts', 'utf-8');
categoriesCode = categoriesCode.replace(/];/, `  , { id: 'professions', title: 'المهن', icon: '👨‍⚕️', color: 'text-indigo-600', bgGradient: 'from-indigo-300 to-indigo-500' }\n];`);
fs.writeFileSync('src/data/universe/categories.ts', categoriesCode);

let objectsCode = fs.readFileSync('src/data/universe/objects.ts', 'utf-8');
const newObjects = `
  { id: 'prof_1', categoryId: 'professions', arabicName: 'دكتور', englishName: 'Doctor', icon: '👨‍⚕️', difficulty: 1 },
  { id: 'prof_2', categoryId: 'professions', arabicName: 'ممرضة', englishName: 'Nurse', icon: '👩‍⚕️', difficulty: 1 },
  { id: 'prof_3', categoryId: 'professions', arabicName: 'مدرس', englishName: 'Teacher', icon: '👨‍🏫', difficulty: 1 },
  { id: 'prof_4', categoryId: 'professions', arabicName: 'مهندس', englishName: 'Engineer', icon: '👷‍♂️', difficulty: 1 },
  { id: 'prof_5', categoryId: 'professions', arabicName: 'طباخ', englishName: 'Chef', icon: '👨‍🍳', difficulty: 1 },
  { id: 'prof_6', categoryId: 'professions', arabicName: 'طيار', englishName: 'Pilot', icon: '👨‍✈️', difficulty: 1 },
  { id: 'prof_7', categoryId: 'professions', arabicName: 'ظابط شرطة', englishName: 'Police Officer', icon: '👮‍♂️', difficulty: 1 },
  { id: 'prof_8', categoryId: 'professions', arabicName: 'رجل إطفاء', englishName: 'Firefighter', icon: '👨‍🚒', difficulty: 1 },
  { id: 'prof_9', categoryId: 'professions', arabicName: 'فلاح', englishName: 'Farmer', icon: '👨‍🌾', difficulty: 1 },
  { id: 'prof_10', categoryId: 'professions', arabicName: 'رسام', englishName: 'Artist', icon: '👨‍🎨', difficulty: 1 }
];`;
objectsCode = objectsCode.replace(/];/, newObjects);
fs.writeFileSync('src/data/universe/objects.ts', objectsCode);
