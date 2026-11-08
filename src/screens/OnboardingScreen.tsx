import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGame } from '../store/GameContext';
import { BigButton } from '../components/ui/BigButton';
import { ArrowRight, Sparkles, Award } from 'lucide-react';
import { Player } from '../types';
import { playSound } from '../utils/audio';
import { CHARACTERS } from '../data/characters';
import { CharacterDef } from '../types';

interface Props {
  onComplete: () => void;
  onBack?: () => void;
}

export const OnboardingScreen: React.FC<Props> = ({ onComplete, onBack }) => {
  const { addProfile } = useGame();
  const [step, setStep] = useState<'welcome' | 'name' | 'gender' | 'character' | 'ready'>('welcome');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Player['gender']>('prefer_not_to_say');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterDef>(CHARACTERS[0]);

  const handleCreateProfile = () => {
    addProfile(
      name || 'بطل سمارت تك',
      gender,
      selectedCharacter.avatar,
      selectedCharacter.id,
      selectedCharacter.title
    );
    onComplete();
  };

  const getFilteredCharacters = () => {
    if (gender === 'boy') return CHARACTERS.filter((c) => c.gender === 'boy');
    if (gender === 'girl') return CHARACTERS.filter((c) => c.gender === 'girl');
    return CHARACTERS;
  };

  return (
    <div
      className="min-h-screen bg-indigo-50 flex flex-col safe-pt safe-pb safe-px rtl relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #EEF2FF 0%, #C7D2FE 100%)' }}
    >
      {onBack && step === 'welcome' && (
        <button
          onClick={onBack}
          className="absolute top-4 right-4 z-50 bg-white p-4 rounded-full shadow-lg border-4 border-indigo-200 text-indigo-600"
        >
          <ArrowRight size={32} />
        </button>
      )}

      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full z-10">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center w-full"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-indigo-900 mb-6 drop-shadow-sm">
                أهلاً بيك في
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  SmartTech Games!
                </span>
              </h1>
              <p className="text-2xl md:text-3xl font-bold text-indigo-700 mb-12 bg-white/50 py-4 px-8 rounded-3xl inline-block border-2 border-indigo-200">
                يلا نختار شخصيتك ونبدأ المغامرة!
              </p>
              <BigButton
                color="primary"
                onClick={() => {
                  playSound('success');
                  setStep('name');
                }}
                className="text-3xl px-12 py-6 w-full md:w-auto"
                pulse
              >
                يلا نبدأ! 🚀
              </BigButton>
            </motion.div>
          )}

          {step === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full text-center bg-white/90 backdrop-blur-sm p-8 rounded-[40px] shadow-2xl border-8 border-indigo-200"
            >
              <h2 className="text-4xl font-black text-indigo-900 mb-8">اسمك إيه يا بطل؟</h2>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اكتب اسمك هنا"
                className="w-full text-center text-4xl p-6 rounded-3xl border-4 border-indigo-200 bg-indigo-50 focus:border-indigo-500 focus:outline-none mb-8 font-bold text-indigo-800 placeholder-indigo-300"
                maxLength={15}
                autoFocus
              />
              <BigButton
                color="primary"
                disabled={!name.trim()}
                onClick={() => {
                  playSound('click');
                  setStep('gender');
                }}
                className="w-full text-3xl py-4"
              >
                التالي
              </BigButton>
            </motion.div>
          )}

          {step === 'gender' && (
            <motion.div
              key="gender"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full text-center bg-white/90 backdrop-blur-sm p-8 rounded-[40px] shadow-2xl border-8 border-indigo-200"
            >
              <h2 className="text-4xl font-black text-indigo-900 mb-8">إنت ولد ولا بنت؟</h2>
              <div className="flex flex-col md:flex-row gap-6 mb-8 justify-center">
                <button
                  onClick={() => {
                    setGender('boy');
                    setSelectedCharacter(CHARACTERS.find((c) => c.gender === 'boy') || CHARACTERS[0]);
                    playSound('click');
                    setStep('character');
                  }}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 border-4 border-blue-300 rounded-3xl p-8 flex flex-col items-center gap-4 transition-transform active:scale-95"
                >
                  <span className="text-6xl">👦</span>
                  <span className="text-3xl font-black text-blue-700">ولد</span>
                </button>
                <button
                  onClick={() => {
                    setGender('girl');
                    setSelectedCharacter(CHARACTERS.find((c) => c.gender === 'girl') || CHARACTERS[3]);
                    playSound('click');
                    setStep('character');
                  }}
                  className="flex-1 bg-pink-100 hover:bg-pink-200 border-4 border-pink-300 rounded-3xl p-8 flex flex-col items-center gap-4 transition-transform active:scale-95"
                >
                  <span className="text-6xl">👧</span>
                  <span className="text-3xl font-black text-pink-700">بنت</span>
                </button>
              </div>
              <button
                onClick={() => {
                  setGender('prefer_not_to_say');
                  playSound('click');
                  setStep('character');
                }}
                className="text-indigo-500 font-bold text-xl hover:text-indigo-700 underline underline-offset-4"
              >
                تخطي واختيار من كل الأبطال
              </button>
            </motion.div>
          )}

          {step === 'character' && (
            <motion.div
              key="character"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full text-center bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-[40px] shadow-2xl border-8 border-indigo-200 max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="text-amber-500" size={28} />
                <h2 className="text-3xl sm:text-4xl font-black text-indigo-900">اختار شخصيتك المفضلة!</h2>
              </div>
              <p className="text-sm font-bold text-indigo-600 mb-4">
                كل شخصية ليها اسم وقوة خاصة هترافقك في الألعاب
              </p>

              <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3 p-2 mb-4">
                {getFilteredCharacters().map((char) => {
                  const isChosen = selectedCharacter.id === char.id;
                  return (
                    <button
                      key={char.id}
                      onClick={() => {
                        setSelectedCharacter(char);
                        playSound('click');
                      }}
                      className={`p-3 rounded-2xl border-4 flex flex-col items-center text-center transition-all ${
                        isChosen
                          ? 'border-indigo-600 bg-indigo-50 scale-105 shadow-md ring-2 ring-indigo-400'
                          : 'border-slate-200 bg-white hover:border-indigo-300'
                      }`}
                    >
                      <span className="text-4xl mb-1">{char.avatar}</span>
                      <span className="font-black text-slate-800 text-sm leading-tight">{char.name}</span>
                      <span className="text-[11px] text-indigo-600 font-bold mt-0.5">{char.title}</span>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                        <Award size={10} />
                        <span>{char.badge}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <BigButton
                color="primary"
                onClick={() => {
                  playSound('success');
                  setStep('ready');
                }}
                className="w-full text-2xl py-3"
              >
                اخترت شخصية "{selectedCharacter.name}" 🚀
              </BigButton>
            </motion.div>
          )}

          {step === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full text-center"
            >
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-8xl mb-6 drop-shadow-xl inline-block bg-white p-8 rounded-full border-8 border-indigo-300 shadow-2xl"
              >
                {selectedCharacter.avatar}
              </motion.div>
              <h2 className="text-4xl sm:text-5xl font-black text-indigo-900 mb-2 drop-shadow-sm">
                جاهز يا {name}؟
              </h2>
              <p className="text-xl font-bold text-indigo-700 mb-1">
                شخصيتك: <b>{selectedCharacter.name}</b> ({selectedCharacter.title})
              </p>
              <p className="text-sm text-indigo-500 font-medium mb-8">"{selectedCharacter.tagline}"</p>

              <BigButton
                color="success"
                onClick={() => {
                  playSound('reward');
                  handleCreateProfile();
                }}
                className="text-3xl px-12 py-6 w-full md:w-auto"
                pulse
              >
                يلا ندخل عالم الألعاب! 🎮
              </BigButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
