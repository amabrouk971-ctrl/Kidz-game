import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Gamepad2, Star, Sparkles } from 'lucide-react';
import { Player } from '../../types';
import { CHARACTERS } from '../../data/characters';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (playerData: Partial<Player>) => Promise<void>;
  existingUsers: { uid: string; displayName: string; email: string }[];
}

export const AddPlayerModal: React.FC<Props> = ({ isOpen, onClose, onAdd, existingUsers }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Player['gender']>('boy');
  const [characterId, setCharacterId] = useState('swimmer');
  const [stars, setStars] = useState(10);
  const [gems, setGems] = useState(5);
  const [ownerUid, setOwnerUid] = useState(existingUsers[0]?.uid || 'admin_assigned');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const selectedChar = CHARACTERS.find((c) => c.id === characterId) || CHARACTERS[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('يرجى كتابة اسم الطفل.');
      return;
    }
    setLoading(true);
    try {
      await onAdd({
        name: name.trim(),
        gender,
        avatar: selectedChar.avatar,
        characterId: selectedChar.id,
        characterTitle: selectedChar.title,
        stars: Number(stars),
        gems: Number(gems),
        ownerUid,
      });
      setName('');
      onClose();
    } catch (err) {
      console.error('Error creating player in DB:', err);
      alert('حدث خطأ أثناء إضافة ملف اللاعب.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 text-slate-100 shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Gamepad2 size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">إضافة ملف لاعب / طفل جديد</h3>
                <p className="text-xs text-slate-400">حفظ في قاعدة بيانات Firestore مباشرة</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-300"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">اسم الطفل / اللاعب *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: يوسف، مريم..."
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">الجنس</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none font-bold"
                >
                  <option value="boy">ولد 👦</option>
                  <option value="girl">بنت 👧</option>
                  <option value="prefer_not_to_say">عام</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">الشخصية المفضلة</label>
                <select
                  value={characterId}
                  onChange={(e) => setCharacterId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none font-bold"
                >
                  {CHARACTERS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.avatar} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-amber-400 block mb-1">نجوم أولية ⭐</label>
                <input
                  type="number"
                  min="0"
                  max="1000"
                  value={stars}
                  onChange={(e) => setStars(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-amber-400 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-cyan-400 block mb-1">مجوهرات 💎</label>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={gems}
                  onChange={(e) => setGems(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-cyan-400 font-bold focus:outline-none"
                />
              </div>
            </div>

            {existingUsers.length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">ربط بحساب ولي الأمر</label>
                <select
                  value={ownerUid}
                  onChange={(e) => setOwnerUid(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="admin_assigned">تخصيص عام للمشرف</option>
                  {existingUsers.map((u) => (
                    <option key={u.uid} value={u.uid}>
                      {u.displayName} ({u.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-3 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-lg disabled:opacity-50"
              >
                {loading ? 'جاري الإضافة...' : 'حفظ ملف اللاعب'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
