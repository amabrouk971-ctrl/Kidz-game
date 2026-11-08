import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Save, Plus, Trash2, HelpCircle, Check, Sparkles, Sliders } from 'lucide-react';
import { GameConfig, GameQuestionCustom } from '../../types';

interface Props {
  isOpen: boolean;
  game: GameConfig | null;
  onClose: () => void;
  onSave: (updated: GameConfig) => Promise<void>;
}

export const GameEditorModal: React.FC<Props> = ({ isOpen, game, onClose, onSave }) => {
  if (!isOpen || !game) return null;

  const [title, setTitle] = useState(game.title);
  const [desc, setDesc] = useState(game.desc);
  const [isEnabled, setIsEnabled] = useState(game.isEnabled);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(game.difficulty);
  const [rewardStars, setRewardStars] = useState(game.rewardStars || 5);
  const [questions, setQuestions] = useState<GameQuestionCustom[]>(game.customQuestions || []);
  const [saving, setSaving] = useState(false);

  // New Question Form state
  const [showAddQ, setShowAddQ] = useState(false);
  const [newQText, setNewQText] = useState('');
  const [newQOptions, setNewQOptions] = useState(['', '', '', '']);
  const [newQCorrectIdx, setNewQCorrectIdx] = useState(0);
  const [newQExplanation, setNewQExplanation] = useState('');

  const handleAddQuestion = () => {
    if (!newQText.trim() || newQOptions.some((o) => !o.trim())) {
      alert('يرجى كتابة نص السؤال وكافة الخيارات الأربعة.');
      return;
    }

    const newQuestion: GameQuestionCustom = {
      id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      question: newQText.trim(),
      options: newQOptions.map((o) => o.trim()),
      correctIndex: newQCorrectIdx,
      explanation: newQExplanation.trim() || undefined,
    };

    setQuestions([...questions, newQuestion]);
    setNewQText('');
    setNewQOptions(['', '', '', '']);
    setNewQCorrectIdx(0);
    setNewQExplanation('');
    setShowAddQ(false);
  };

  const handleRemoveQuestion = (qId: string) => {
    setQuestions(questions.filter((q) => q.id !== qId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated: GameConfig = {
        ...game,
        title: title.trim(),
        desc: desc.trim(),
        isEnabled,
        difficulty,
        rewardStars: Number(rewardStars),
        customQuestions: questions,
        updatedAt: Date.now(),
      };
      await onSave(updated);
      onClose();
    } catch (err) {
      console.error('Failed to save game config:', err);
      alert('حدث خطأ أثناء حفظ تعديلات اللعبة.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col text-slate-100 shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{game.icon}</span>
              <div>
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <span>تعديل اللعبة: {game.title}</span>
                  <Sliders size={18} className="text-indigo-400" />
                </h2>
                <p className="text-xs text-slate-400 font-mono">معرف اللعبة: {game.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Active Toggle & Basic Settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <label className="text-xs font-bold text-slate-400 block mb-2">حالة اللعبة للطفل</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEnabled(!isEnabled)}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                      isEnabled ? 'bg-emerald-600' : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        isEnabled ? 'translate-x-1' : 'translate-x-8'
                      }`}
                    />
                  </button>
                  <span className={`text-sm font-bold ${isEnabled ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {isEnabled ? 'مفعلة وتظهر في البوابة' : 'معطلة ومخفية'}
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                <label className="text-xs font-bold text-slate-400 block mb-2">مستوى الصعوبة</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-indigo-500"
                >
                  <option value="easy">سهل (للأطفال الصغار) 🌟</option>
                  <option value="medium">متوسط (تحدي ذكي) ⚡</option>
                  <option value="hard">متقدم (أذكياء المنصة) 🔥</option>
                </select>
              </div>
            </div>

            {/* Title & Desc */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">اسم اللعبة</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">الوصف المختصر</label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">مكافأة النجوم عند الفوز</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={rewardStars}
                    onChange={(e) => setRewardStars(Number(e.target.value))}
                    className="w-24 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-amber-400 font-bold focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-xs text-slate-400">نجمة ⭐ تُمنح للطفل بعد إتمام التحدي</span>
                </div>
              </div>
            </div>

            {/* Custom Questions Section */}
            <div className="pt-4 border-t border-slate-700/80">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <HelpCircle size={16} className="text-indigo-400" />
                    <span>الأسئلة والتحديات المخصصة داخل اللعبة ({questions.length})</span>
                  </h3>
                  <p className="text-xs text-slate-400">تقدر تضيف أو تعدل أسئلة وتظهر فوراً للأطفال</p>
                </div>
                {!showAddQ && (
                  <button
                    type="button"
                    onClick={() => setShowAddQ(true)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Plus size={14} />
                    <span>إضافة سؤال جديد</span>
                  </button>
                )}
              </div>

              {/* Add Question Inline Form */}
              {showAddQ && (
                <div className="bg-slate-800/90 border border-indigo-500/50 rounded-2xl p-4 mb-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-indigo-300">سؤال جديد:</span>
                    <button
                      type="button"
                      onClick={() => setShowAddQ(false)}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      إلغاء
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="اكتب نص السؤال هنا..."
                    value={newQText}
                    onChange={(e) => setNewQText(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 block">
                      خيارات الإجابة (حدد الدائرة بجانب الإجابة الصحيحة):
                    </span>
                    {newQOptions.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={newQCorrectIdx === i}
                          onChange={() => setNewQCorrectIdx(i)}
                          className="w-4 h-4 text-indigo-600 focus:ring-0 cursor-pointer"
                        />
                        <input
                          type="text"
                          placeholder={`الخيار ${i + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const copy = [...newQOptions];
                            copy[i] = e.target.value;
                            setNewQOptions(copy);
                          }}
                          className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none"
                        />
                        {newQCorrectIdx === i && (
                          <span className="text-[10px] text-emerald-400 font-bold whitespace-nowrap">
                            (الإجابة الصحيحة ✓)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="شرح توضيحي أو معلومة تشجيعية عند الإجابة (اختياري)"
                    value={newQExplanation}
                    onChange={(e) => setNewQExplanation(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none"
                  />

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
                  >
                    حفظ السؤال في القائمة
                  </button>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex-1">
                      <div className="font-bold text-white mb-1">
                        {idx + 1}. {q.question}
                      </div>
                      <div className="flex flex-wrap gap-2 text-[11px] text-slate-400">
                        {q.options.map((opt, oIdx) => (
                          <span
                            key={oIdx}
                            className={`px-2 py-0.5 rounded ${
                              oIdx === q.correctIndex
                                ? 'bg-emerald-950 text-emerald-300 font-bold border border-emerald-700/50'
                                : 'bg-slate-700/60 text-slate-300'
                            }`}
                          >
                            {opt} {oIdx === q.correctIndex && '✓'}
                          </span>
                        ))}
                      </div>
                      {q.explanation && (
                        <p className="text-[10px] text-indigo-300 mt-1 italic">💡 {q.explanation}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-950/40 transition"
                      title="حذف السؤال"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}

                {questions.length === 0 && !showAddQ && (
                  <div className="py-6 text-center text-slate-500 text-xs bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
                    لا توجد أسئلة مخصصة بعد. تعتمد اللعبة على الأسئلة التلقائية، ويمكنك إضافة أسئلتك الخاصة في أي وقت.
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-700 flex justify-end gap-3 sticky bottom-0 bg-slate-900 py-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-lg transition flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={16} />
                <span>{saving ? 'جاري الحفظ...' : 'حفظ التغييرات في السحابة'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
