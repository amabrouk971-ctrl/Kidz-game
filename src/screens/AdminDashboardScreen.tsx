import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  Users,
  LogIn,
  Gamepad2,
  Star,
  RefreshCw,
  Search,
  ArrowRight,
  KeyRound,
  Download,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  FileSpreadsheet,
  UserPlus,
  PlusCircle,
  SlidersHorizontal,
  Sparkles,
  Award
} from 'lucide-react';
import { useAuth } from '../store/AuthContext';
import { useGame } from '../store/GameContext';
import { ADMIN_EMAIL } from '../lib/firebase/firebase';
import {
  fetchAllUsers,
  fetchAllSignInLogs,
  fetchAllPlayers,
  updateUserRoleInFirestore,
  adminCreateUserInFirestore,
  adminCreatePlayerInFirestore,
  saveGameConfigToFirestore,
  fetchAllGameConfigs
} from '../lib/firebase/dbService';
import { UserProfile, SignInLog, Player, UserRole, GameConfig } from '../types';
import {
  exportFullDatabaseToExcel,
  exportUsersToExcel,
  exportPlayersToExcel,
  exportSignInLogsToExcel
} from '../utils/excelExport';
import { GameEditorModal } from '../components/admin/GameEditorModal';
import { AddUserModal } from '../components/admin/AddUserModal';
import { AddPlayerModal } from '../components/admin/AddPlayerModal';

interface AdminDashboardScreenProps {
  onBack: () => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ onBack }) => {
  const { user, isAdmin, openAuthModal } = useAuth();
  const { gameConfigs, updateGameConfig } = useGame();

  const [activeTab, setActiveTab] = useState<'overview' | 'games' | 'users' | 'signins' | 'players'>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [signInLogs, setSignInLogs] = useState<SignInLog[]>([]);
  const [playersList, setPlayersList] = useState<Player[]>([]);
  const [localGameConfigs, setLocalGameConfigs] = useState<GameConfig[]>(gameConfigs);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleUpdatingUid, setRoleUpdatingUid] = useState<string | null>(null);

  // Modals state
  const [selectedGameToEdit, setSelectedGameToEdit] = useState<GameConfig | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [users, logs, players, configs] = await Promise.all([
        fetchAllUsers().catch(() => []),
        fetchAllSignInLogs(200).catch(() => []),
        fetchAllPlayers().catch(() => []),
        fetchAllGameConfigs().catch(() => gameConfigs)
      ]);
      setUsersList(users);
      setSignInLogs(logs);
      setPlayersList(players);
      if (configs && configs.length > 0) {
        setLocalGameConfigs(configs);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  // Synchronize when gameConfigs from context change
  useEffect(() => {
    if (gameConfigs && gameConfigs.length > 0) {
      setLocalGameConfigs(gameConfigs);
    }
  }, [gameConfigs]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadAllData();
  };

  const handleRoleChange = async (targetUid: string, newRole: UserRole) => {
    setRoleUpdatingUid(targetUid);
    try {
      await updateUserRoleInFirestore(targetUid, newRole);
      setUsersList((prev) => prev.map((u) => (u.uid === targetUid ? { ...u, role: newRole } : u)));
      showToast(`تم تحديث صلاحية المستخدم إلى ${newRole} بنجاح ✓`);
    } catch (e) {
      console.error('Failed to change role:', e);
      alert('حدث خطأ أثناء تعديل الصلاحية.');
    } finally {
      setRoleUpdatingUid(null);
    }
  };

  // Add User directly into Firestore
  const handleAdminAddUser = async (userData: { email: string; displayName: string; role: UserRole }) => {
    const created = await adminCreateUserInFirestore(userData);
    setUsersList((prev) => [created, ...prev]);
    showToast(`تمت إضافة المستخدم ${created.displayName} إلى قاعدة البيانات مباشرة ✓`);
  };

  // Add Player directly into Firestore
  const handleAdminAddPlayer = async (playerData: Partial<Player>) => {
    const created = await adminCreatePlayerInFirestore(playerData);
    setPlayersList((prev) => [created, ...prev]);
    showToast(`تمت إضافة ملف الطفل ${created.name} إلى قاعدة البيانات مباشرة ✓`);
  };

  // Save edited Game Configuration
  const handleSaveGameConfig = async (updated: GameConfig) => {
    await updateGameConfig(updated);
    setLocalGameConfigs((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    showToast(`تم حفظ وتحديث إعدادات لعبة "${updated.title}" بنجاح ✓`);
  };

  // EXCEL EXPORT HANDLERS
  const handleExportFullExcel = () => {
    exportFullDatabaseToExcel(usersList, playersList, signInLogs, localGameConfigs);
    showToast('تم تصدير قاعدة البيانات بالكامل إلى ملف Excel (.xlsx) بنجاح 📊');
  };

  const handleExportUsersExcel = () => {
    exportUsersToExcel(usersList);
    showToast('تم تصدير جدول المستخدمين إلى Excel 📊');
  };

  const handleExportPlayersExcel = () => {
    exportPlayersToExcel(playersList);
    showToast('تم تصدير جدول اللاعبين إلى Excel 📊');
  };

  const handleExportLogsExcel = () => {
    exportSignInLogsToExcel(signInLogs);
    showToast('تم تصدير سجلات الدخول إلى Excel 📊');
  };

  // If not admin, show restricted view
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center" dir="rtl">
        <div className="w-20 h-20 rounded-3xl bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400 mb-6 shadow-xl">
          <AlertTriangle size={40} />
        </div>
        <h1 className="text-3xl font-black mb-3">منطقة المشرفين فقط</h1>
        <p className="text-slate-400 max-w-md mb-6 leading-relaxed">
          هذه الشاشة مخصصة لمدير النظام (<b>{ADMIN_EMAIL}</b>) للاطلاع على قاعدة البيانات الكاملة، تعديل الألعاب، إدارة المستخدمين، وتصدير التقارير إلى إكسيل فوراً.
        </p>
        <div className="flex gap-4">
          <button
            onClick={openAuthModal}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold transition shadow-lg flex items-center gap-2"
          >
            <KeyRound size={18} />
            <span>تسجيل الدخول بحساب المشرف</span>
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 font-bold transition text-slate-300"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalStarsEarned = playersList.reduce((acc, p) => acc + (p.stars || 0), 0);
  const totalGemsEarned = playersList.reduce((acc, p) => acc + (p.gems || 0), 0);
  const activeGamesCount = localGameConfigs.filter((g) => g.isEnabled).length;

  // Filter lists based on search
  const filteredUsers = usersList.filter(
    (u) =>
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.displayName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLogs = signInLogs.filter(
    (l) =>
      (l.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.displayName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPlayers = playersList.filter((p) =>
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGames = localGameConfigs.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col" dir="rtl">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 border border-emerald-400"
          >
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Admin Header */}
      <header className="bg-slate-800/90 backdrop-blur border-b border-slate-700 px-6 py-4 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 transition text-slate-200"
            title="العودة للبوابة"
          >
            <ArrowRight size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
              <Shield size={22} className="text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white">لوحة تحكم المشرف والتحكم الكامل</h1>
                <span className="px-2 py-0.5 rounded-md bg-purple-900/60 border border-purple-500/50 text-purple-300 text-xs font-bold font-mono">
                  {ADMIN_EMAIL}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                تعديل كل لعبة، إضافة المستخدمين لقاعدة البيانات، وتصدير إكسيل فوري
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Excel Export & Refresh */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportFullExcel}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-lg transition"
            title="تصدير قاعدة البيانات كاملة إلى Excel"
          >
            <FileSpreadsheet size={16} />
            <span>تصدير قاعدة البيانات إكسيل (Excel)</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>تحديث</span>
          </button>
        </div>
      </header>

      {/* Tabs Bar */}
      <div className="bg-slate-800/40 border-b border-slate-800 px-6 pt-3 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-t-xl font-bold text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-indigo-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield size={16} />
          <span>نظرة عامة وإحصائيات</span>
        </button>

        <button
          onClick={() => setActiveTab('games')}
          className={`px-4 py-2.5 rounded-t-xl font-bold text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'games'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-indigo-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <SlidersHorizontal size={16} />
          <span>تعديل وتحكم الألعاب ({localGameConfigs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-t-xl font-bold text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-indigo-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users size={16} />
          <span>المستخدمون والمسجلون ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('players')}
          className={`px-4 py-2.5 rounded-t-xl font-bold text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'players'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-indigo-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Gamepad2 size={16} />
          <span>ملفات اللاعبين ({playersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('signins')}
          className={`px-4 py-2.5 rounded-t-xl font-bold text-sm transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'signins'
              ? 'bg-slate-800 text-indigo-400 border-t-2 border-indigo-500'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LogIn size={16} />
          <span>سجل تسجيلات الدخول ({signInLogs.length})</span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 font-medium">جاري مزامنة قاعدة البيانات والتحكم السحابي...</p>
          </div>
        ) : (
          <>
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400">إجمالي المستخدمين</span>
                      <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                        <Users size={20} />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-white">{usersList.length}</div>
                    <div className="text-xs text-slate-400 mt-1">حسابات مسجلة وموثقة</div>
                  </div>

                  <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400">الألعاب النشطة</span>
                      <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                        <SlidersHorizontal size={20} />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-white">
                      {activeGamesCount} / {localGameConfigs.length}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">يمكنك تفعيل وتعطيل أي لعبة</div>
                  </div>

                  <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400">ملفات الأطفال / اللاعبين</span>
                      <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                        <Gamepad2 size={20} />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-white">{playersList.length}</div>
                    <div className="text-xs text-slate-400 mt-1">شخصيات وملفات نشطة</div>
                  </div>

                  <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400">مجموع النجوم المكتسبة</span>
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                        <Star size={20} />
                      </div>
                    </div>
                    <div className="text-3xl font-black text-amber-400">{totalStarsEarned} ⭐</div>
                    <div className="text-xs text-slate-400 mt-1">{totalGemsEarned} 💎 مجوهرات عبر المنصة</div>
                  </div>
                </div>

                {/* Instant Excel Export Banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-l from-emerald-950/70 via-teal-950/50 to-slate-900 border-2 border-emerald-600/40 shadow-xl flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center">
                      <FileSpreadsheet size={32} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">تصدير فوري لقاعدة البيانات إلى ملف Excel (.xlsx)</h3>
                      <p className="text-xs text-emerald-200/80 mt-1">
                        بضغطة واحدة، يمكنك تحميل مصنف إكسيل متكامل يحتوي على أوراق مستقلة للمستخدمين، ملفات اللاعبين، وسجلات الدخول، وإعدادات الألعاب.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      onClick={handleExportFullExcel}
                      className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg shadow-emerald-950 transition flex items-center gap-2"
                    >
                      <Download size={18} />
                      <span>تصدير الآن (Excel)</span>
                    </button>
                  </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('games')}
                    className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-indigo-500/80 text-right transition flex items-center justify-between group shadow-md"
                  >
                    <div>
                      <div className="font-black text-white text-base mb-1 group-hover:text-indigo-400 transition">
                        تعديل وإدارة الألعاب
                      </div>
                      <p className="text-xs text-slate-400">تغيير الصعوبة، الجوائز، وتعديل أسئلة كل لعبة</p>
                    </div>
                    <Sliders size={24} className="text-indigo-400" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('users');
                      setIsAddUserOpen(true);
                    }}
                    className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-emerald-500/80 text-right transition flex items-center justify-between group shadow-md"
                  >
                    <div>
                      <div className="font-black text-white text-base mb-1 group-hover:text-emerald-400 transition">
                        إضافة مستخدم لقاعدة البيانات
                      </div>
                      <p className="text-xs text-slate-400">تسجيل مستخدمين أو أولياء أمور مباشرة من الداخل</p>
                    </div>
                    <UserPlus size={24} className="text-emerald-400" />
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab('players');
                      setIsAddPlayerOpen(true);
                    }}
                    className="p-5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-purple-500/80 text-right transition flex items-center justify-between group shadow-md"
                  >
                    <div>
                      <div className="font-black text-white text-base mb-1 group-hover:text-purple-400 transition">
                        إضافة ملف لاعب جديد
                      </div>
                      <p className="text-xs text-slate-400">تخصيص شخصية، رصيد نجوم، وجواهر للطفل</p>
                    </div>
                    <Gamepad2 size={24} className="text-purple-400" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. GAME MANAGEMENT & EDITING TAB */}
            {activeTab === 'games' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute right-3.5 top-3 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث عن لعبة لتعديلها..."
                      className="w-full pr-11 pl-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-bold">
                    إجمالي الألعاب: {localGameConfigs.length} ({activeGamesCount} مفعلة)
                  </span>
                </div>

                {/* Game Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredGames.map((game) => (
                    <motion.div
                      key={game.id}
                      whileHover={{ y: -3 }}
                      className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between shadow-md"
                    >
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl p-2 rounded-2xl bg-slate-700/60 shadow-inner">
                              {game.icon}
                            </span>
                            <div>
                              <h3 className="font-black text-base text-white">{game.title}</h3>
                              <span className="text-[11px] font-mono text-slate-400">{game.id}</span>
                            </div>
                          </div>

                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${
                              game.isEnabled
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}
                          >
                            {game.isEnabled ? 'مفعلة ✓' : 'معطلة ✕'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mb-4 line-clamp-2">{game.desc}</p>

                        <div className="flex flex-wrap gap-2 text-xs mb-4">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-700/70 text-slate-300 font-bold">
                            صعوبة: {game.difficulty === 'easy' ? 'سهل' : game.difficulty === 'medium' ? 'متوسط' : 'متقدم'}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-amber-900/40 text-amber-300 font-bold border border-amber-600/30">
                            {game.rewardStars || 5} ⭐ نجوم
                          </span>
                          {game.customQuestions && game.customQuestions.length > 0 && (
                            <span className="px-2.5 py-1 rounded-lg bg-indigo-900/40 text-indigo-300 font-bold border border-indigo-600/30">
                              {game.customQuestions.length} أسئلة مخصصة
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedGameToEdit(game)}
                        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow transition flex items-center justify-center gap-2"
                      >
                        <Sliders size={14} />
                        <span>تعديل اللعبة والأسئلة</span>
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. USERS MANAGEMENT TAB */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute right-3.5 top-3 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                      className="w-full pr-11 pl-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddUserOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow transition flex items-center gap-1.5"
                    >
                      <UserPlus size={16} />
                      <span>إضافة مستخدم جديد</span>
                    </button>
                    <button
                      onClick={handleExportUsersExcel}
                      className="px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <FileSpreadsheet size={15} />
                      <span>تصدير إكسيل</span>
                    </button>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-md">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                      <thead className="bg-slate-700/60 text-slate-300 text-xs font-bold border-b border-slate-700">
                        <tr>
                          <th className="py-3.5 px-4">المستخدم</th>
                          <th className="py-3.5 px-4">البريد الإلكتروني</th>
                          <th className="py-3.5 px-4">الرتبة</th>
                          <th className="py-3.5 px-4">تاريخ التسجيل</th>
                          <th className="py-3.5 px-4">طريقة التسجيل</th>
                          <th className="py-3.5 px-4 text-center">إدارة الصلاحية</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700 text-slate-300">
                        {filteredUsers.map((u) => (
                          <tr key={u.uid} className="hover:bg-slate-750 transition text-xs">
                            <td className="py-3 px-4 flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold text-xs">
                                {u.photoURL ? (
                                  <img src={u.photoURL} alt="" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  u.displayName?.[0] || '👤'
                                )}
                              </div>
                              <span className="font-bold text-white">{u.displayName || 'بدون اسم'}</span>
                              {u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && (
                                <span className="text-xs" title="المشرف الدائم">👑</span>
                              )}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-300 dir-ltr text-right">
                              {u.email}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                  u.role === 'admin'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                                }`}
                              >
                                {u.role === 'admin' ? 'مشرف (Admin)' : 'ولي أمر (Parent)'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-400">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString('ar-SA') : '-'}
                            </td>
                            <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                              {u.provider === 'admin_created' ? 'إدخال المشرف 🛡️' : u.provider || 'كلمة المرور'}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {u.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? (
                                <span className="text-[11px] text-amber-400 font-bold">المشرف الدائم</span>
                              ) : (
                                <select
                                  value={u.role}
                                  disabled={roleUpdatingUid === u.uid}
                                  onChange={(e) => handleRoleChange(u.uid, e.target.value as UserRole)}
                                  className="bg-slate-700 border border-slate-600 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                                >
                                  <option value="parent">ولي أمر (parent)</option>
                                  <option value="admin">مشرف (admin)</option>
                                  <option value="user">مستخدم (user)</option>
                                </select>
                              )}
                            </td>
                          </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                              لا يوجد مستخدمون مطابقون
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PLAYERS TAB */}
            {activeTab === 'players' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute right-3.5 top-3 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث باسم الطفل أو اللاعب..."
                      className="w-full pr-11 pl-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddPlayerOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow transition flex items-center gap-1.5"
                    >
                      <PlusCircle size={16} />
                      <span>إضافة ملف لاعب جديد</span>
                    </button>
                    <button
                      onClick={handleExportPlayersExcel}
                      className="px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <FileSpreadsheet size={15} />
                      <span>تصدير إكسيل</span>
                    </button>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-md">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                      <thead className="bg-slate-700/60 text-slate-300 text-xs font-bold border-b border-slate-700">
                        <tr>
                          <th className="py-3.5 px-4">اللاعب</th>
                          <th className="py-3.5 px-4">الشخصية / اللقب</th>
                          <th className="py-3.5 px-4">المستوى</th>
                          <th className="py-3.5 px-4">النجوم ⭐</th>
                          <th className="py-3.5 px-4">الجواهر 💎</th>
                          <th className="py-3.5 px-4">وقت اللعب</th>
                          <th className="py-3.5 px-4">حساب ولي الأمر</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700 text-slate-300">
                        {filteredPlayers.map((player) => (
                          <tr key={player.id} className="hover:bg-slate-750 transition text-xs">
                            <td className="py-3 px-4 flex items-center gap-2">
                              <span className="text-xl">{player.avatar || '⭐'}</span>
                              <div>
                                <span className="font-black text-white text-sm block">{player.name}</span>
                                <span className="text-[10px] text-slate-400">
                                  {player.gender === 'boy' ? 'ولد 👦' : 'بنت 👧'}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-indigo-300 font-bold">
                              {player.characterTitle || player.characterId || 'بطل سمارت تك'}
                            </td>
                            <td className="py-3 px-4 font-bold text-white">
                              مستوى {player.level || 1}
                            </td>
                            <td className="py-3 px-4 font-bold text-amber-400">
                              {player.stars || 0} ⭐
                            </td>
                            <td className="py-3 px-4 font-bold text-cyan-400">
                              {player.gems || 0} 💎
                            </td>
                            <td className="py-3 px-4 text-slate-400">
                              {Math.round((player.timePlayedSeconds || 0) / 60)} دقيقة
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-400 max-w-[140px] truncate">
                              {player.ownerUid || 'محلي'}
                            </td>
                          </tr>
                        ))}
                        {filteredPlayers.length === 0 && (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                              لا توجد ملفات لاعبين محفوظة حتى الآن
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 5. SIGN-IN LOGS TAB */}
            {activeTab === 'signins' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="relative flex-1 min-w-[240px]">
                    <Search className="absolute right-3.5 top-3 text-slate-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="ابحث في سجل الدخول بالبريد أو الاسم..."
                      className="w-full pr-11 pl-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    onClick={handleExportLogsExcel}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <FileSpreadsheet size={15} />
                    <span>تصدير السجلات إكسيل</span>
                  </button>
                </div>

                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-md">
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-sm">
                      <thead className="bg-slate-700/60 text-slate-300 text-xs font-bold border-b border-slate-700">
                        <tr>
                          <th className="py-3.5 px-4">الوقت والتاريخ</th>
                          <th className="py-3.5 px-4">المستخدم</th>
                          <th className="py-3.5 px-4">البريد الإلكتروني</th>
                          <th className="py-3.5 px-4">الرتبة</th>
                          <th className="py-3.5 px-4">الجهاز / المتصفح</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700 text-slate-300">
                        {filteredLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-750 transition text-xs">
                            <td className="py-3 px-4 font-mono text-slate-300 whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString('ar-SA')}
                            </td>
                            <td className="py-3 px-4 font-bold text-white">
                              {log.displayName || 'مستخدم'}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-300 dir-ltr text-right">
                              {log.email}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  log.role === 'admin'
                                    ? 'bg-amber-900/60 text-amber-300 border border-amber-500/30'
                                    : 'bg-slate-700 text-slate-300'
                                }`}
                              >
                                {log.role}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-400 truncate max-w-xs" title={log.userAgent}>
                              {log.userAgent || 'متصفح ويب'}
                            </td>
                          </tr>
                        ))}
                        {filteredLogs.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                              لا توجد سجلات دخول
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Game Editor Modal */}
      <GameEditorModal
        isOpen={!!selectedGameToEdit}
        game={selectedGameToEdit}
        onClose={() => setSelectedGameToEdit(null)}
        onSave={handleSaveGameConfig}
      />

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAdd={handleAdminAddUser}
      />

      {/* Add Player Modal */}
      <AddPlayerModal
        isOpen={isAddPlayerOpen}
        onClose={() => setIsAddPlayerOpen(false)}
        onAdd={handleAdminAddPlayer}
        existingUsers={usersList.map((u) => ({
          uid: u.uid,
          displayName: u.displayName,
          email: u.email,
        }))}
      />
    </div>
  );
};
