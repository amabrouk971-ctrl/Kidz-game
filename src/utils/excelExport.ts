import * as XLSX from 'xlsx';
import { UserProfile, Player, SignInLog, GameConfig } from '../types';

/**
 * Helper to format timestamp into Arabic local date time
 */
const formatDate = (ts?: number) => {
  if (!ts) return '-';
  try {
    return new Date(ts).toLocaleString('ar-EG', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return new Date(ts).toISOString();
  }
};

/**
 * Helper to download an XLSX workbook in the browser
 */
const downloadWorkbook = (workbook: XLSX.WorkBook, filename: string) => {
  const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Export Users to Excel
 */
export const exportUsersToExcel = (users: UserProfile[]) => {
  const data = users.map((u, idx) => ({
    '#': idx + 1,
    'معرف المستخدم': u.uid,
    'البريد الإلكتروني': u.email,
    'اسم الحساب': u.displayName,
    'الصلاحية': u.role === 'admin' ? 'مدير نظام (Admin)' : 'ولي أمر (Parent)',
    'تاريخ التسجيل': formatDate(u.createdAt),
    'آخر تسجيل دخول': formatDate(u.lastLoginAt),
    'طريقة الدخول': u.provider || 'كلمة المرور',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'المستخدمين');
  downloadWorkbook(workbook, `smarttech_users_${Date.now()}.xlsx`);
};

/**
 * Export Players to Excel
 */
export const exportPlayersToExcel = (players: Player[]) => {
  const data = players.map((p, idx) => ({
    '#': idx + 1,
    'معرف اللاعب': p.id,
    'اسم الطفل': p.name,
    'الشخصية / اللقب': p.characterTitle || p.characterId || 'بطل سمارت تك',
    'الرمز': p.avatar,
    'المستوى': p.level,
    'النجوم ⭐': p.stars,
    'الجواهر 💎': p.gems,
    'عدد الأنشطة المكتملة': p.completedLevels?.length || 0,
    'وقت اللعب (دقائق)': Math.round((p.timePlayedSeconds || 0) / 60),
    'معرف حساب ولي الأمر': p.ownerUid || '-',
    'تاريخ الإنشاء': formatDate(p.createdAt),
    'آخر تحديث': formatDate(p.updatedAt),
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'اللاعبين');
  downloadWorkbook(workbook, `smarttech_players_${Date.now()}.xlsx`);
};

/**
 * Export Sign-in logs to Excel
 */
export const exportSignInLogsToExcel = (logs: SignInLog[]) => {
  const data = logs.map((l, idx) => ({
    '#': idx + 1,
    'توقيت الدخول': formatDate(l.timestamp),
    'البريد الإلكتروني': l.email,
    'الاسم': l.displayName,
    'الصلاحية': l.role,
    'معرف المستخدم': l.userId,
    'المتصفح / الجهاز': l.userAgent || '-',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'سجلات الدخول');
  downloadWorkbook(workbook, `smarttech_signin_logs_${Date.now()}.xlsx`);
};

/**
 * Full Complete Database Export to multi-sheet Excel (.xlsx)
 */
export const exportFullDatabaseToExcel = (
  users: UserProfile[],
  players: Player[],
  logs: SignInLog[],
  configs?: GameConfig[]
) => {
  const workbook = XLSX.utils.book_new();

  // 1. Users Sheet
  const usersData = users.map((u, idx) => ({
    '#': idx + 1,
    'معرف المستخدم': u.uid,
    'البريد الإلكتروني': u.email,
    'اسم الحساب': u.displayName,
    'الصلاحية': u.role === 'admin' ? 'مدير نظام (Admin)' : 'ولي أمر (Parent)',
    'تاريخ التسجيل': formatDate(u.createdAt),
    'آخر تسجيل دخول': formatDate(u.lastLoginAt),
    'طريقة الدخول': u.provider || 'كلمة المرور',
  }));
  const wsUsers = XLSX.utils.json_to_sheet(usersData);
  XLSX.utils.book_append_sheet(workbook, wsUsers, 'المستخدمون');

  // 2. Players Sheet
  const playersData = players.map((p, idx) => ({
    '#': idx + 1,
    'معرف اللاعب': p.id,
    'اسم الطفل': p.name,
    'الشخصية': p.characterTitle || p.characterId || 'افتراضي',
    'الرمز': p.avatar,
    'المستوى': p.level,
    'النجوم': p.stars,
    'الجواهر': p.gems,
    'الأنشطة المكتملة': p.completedLevels?.length || 0,
    'وقت اللعب (بالدقائق)': Math.round((p.timePlayedSeconds || 0) / 60),
    'حساب ولي الأمر': p.ownerUid || '-',
    'تاريخ الإنشاء': formatDate(p.createdAt),
  }));
  const wsPlayers = XLSX.utils.json_to_sheet(playersData);
  XLSX.utils.book_append_sheet(workbook, wsPlayers, 'بيانات اللاعبين');

  // 3. Logs Sheet
  const logsData = logs.map((l, idx) => ({
    '#': idx + 1,
    'التوقيت': formatDate(l.timestamp),
    'البريد الإلكتروني': l.email,
    'الاسم': l.displayName,
    'الصلاحية': l.role,
    'معرف المستخدم': l.userId,
    'الجهاز / المتصفح': l.userAgent || '-',
  }));
  const wsLogs = XLSX.utils.json_to_sheet(logsData);
  XLSX.utils.book_append_sheet(workbook, wsLogs, 'سجلات تسجيل الدخول');

  // 4. Game Configs Sheet
  if (configs && configs.length > 0) {
    const configsData = configs.map((c, idx) => ({
      '#': idx + 1,
      'معرف اللعبة': c.id,
      'عنوان اللعبة': c.title,
      'الوصف': c.desc,
      'الحالة': c.isEnabled ? 'مفعلة' : 'معطلة',
      'مستوى الصعوبة': c.difficulty,
      'مكافأة النجوم': c.rewardStars,
      'عدد الأسئلة المخصصة': c.customQuestions?.length || 0,
    }));
    const wsConfigs = XLSX.utils.json_to_sheet(configsData);
    XLSX.utils.book_append_sheet(workbook, wsConfigs, 'إعدادات الألعاب');
  }

  const filename = `smarttech_full_database_${new Date().toISOString().slice(0, 10)}.xlsx`;
  downloadWorkbook(workbook, filename);
};
