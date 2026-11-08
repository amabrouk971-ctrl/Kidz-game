import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db, ADMIN_EMAIL } from './firebase';
import { UserProfile, UserRole, SignInLog, Player, GameConfig, GameQuestionCustom } from '../../types';
import { DEFAULT_GAME_CONFIGS } from '../../data/defaultGameConfigs';

export const isUserAdmin = (email?: string | null, role?: UserRole): boolean => {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase() || role === 'admin';
};

/**
 * Syncs the user's profile in Firestore and enforces admin role for amabrouk971@gmail.com
 */
export const syncUserProfile = async (
  user: User,
  preferredRole: UserRole = 'parent'
): Promise<UserProfile> => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  const email = user.email || '';
  const isAdmin = isUserAdmin(email);
  const now = Date.now();

  if (userSnap.exists()) {
    const existing = userSnap.data() as UserProfile;
    const finalRole: UserRole = isAdmin ? 'admin' : (existing.role || preferredRole);

    const updatedProfile: UserProfile = {
      ...existing,
      uid: user.uid,
      email: email,
      displayName: user.displayName || existing.displayName || email.split('@')[0] || 'مستخدم',
      photoURL: user.photoURL || existing.photoURL || null,
      role: finalRole,
      lastLoginAt: now,
      provider: user.providerData?.[0]?.providerId || existing.provider || 'password',
    };

    await setDoc(userRef, updatedProfile, { merge: true });
    return updatedProfile;
  } else {
    const finalRole: UserRole = isAdmin ? 'admin' : preferredRole;

    const newProfile: UserProfile = {
      uid: user.uid,
      email: email,
      displayName: user.displayName || email.split('@')[0] || 'مستخدم جديد',
      photoURL: user.photoURL || null,
      role: finalRole,
      createdAt: now,
      lastLoginAt: now,
      provider: user.providerData?.[0]?.providerId || 'password',
    };

    await setDoc(userRef, newProfile);
    return newProfile;
  }
};

/**
 * Logs a sign-in event into the `sign_ins` collection
 */
export const recordSignInLog = async (profile: UserProfile): Promise<void> => {
  try {
    const logRef = doc(collection(db, 'sign_ins'));
    const logData: SignInLog = {
      id: logRef.id,
      userId: profile.uid,
      email: profile.email,
      displayName: profile.displayName,
      role: profile.role,
      timestamp: Date.now(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    };
    await setDoc(logRef, logData);
  } catch (error) {
    console.warn('Failed to record sign-in log:', error);
  }
};

/**
 * Saves or updates a player's profile in Firestore
 */
export const savePlayerToFirestore = async (player: Player, ownerUid: string): Promise<void> => {
  try {
    const playerRef = doc(db, 'players', player.id);
    const dataToSave = {
      ...player,
      ownerUid,
      updatedAt: Date.now(),
    };
    await setDoc(playerRef, dataToSave, { merge: true });
  } catch (error) {
    console.error('Error saving player to Firestore:', error);
    throw error;
  }
};

/**
 * Deletes a player profile from Firestore
 */
export const deletePlayerFromFirestore = async (playerId: string): Promise<void> => {
  try {
    const playerRef = doc(db, 'players', playerId);
    await deleteDoc(playerRef);
  } catch (error) {
    console.error('Error deleting player from Firestore:', error);
    throw error;
  }
};

/**
 * Subscribes to the authenticated user's children/players
 */
export const subscribeUserPlayers = (
  ownerUid: string,
  onUpdate: (players: Player[]) => void,
  onError?: (err: any) => void
) => {
  const playersQuery = query(
    collection(db, 'players'),
    where('ownerUid', '==', ownerUid)
  );

  return onSnapshot(
    playersQuery,
    (snapshot) => {
      const players: Player[] = [];
      snapshot.forEach((docSnap) => {
        players.push(docSnap.data() as Player);
      });
      // Sort by creation date
      players.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      onUpdate(players);
    },
    (error) => {
      console.warn('Subscription error for user players:', error);
      if (onError) onError(error);
    }
  );
};

// ==========================================
// ADMIN DASHBOARD QUERIES
// ==========================================

/**
 * Admin: Get all registered users
 */
export const fetchAllUsers = async (): Promise<UserProfile[]> => {
  const usersColl = collection(db, 'users');
  const snap = await getDocs(usersColl);
  const list: UserProfile[] = [];
  snap.forEach((docSnap) => {
    list.push(docSnap.data() as UserProfile);
  });
  list.sort((a, b) => (b.lastLoginAt || 0) - (a.lastLoginAt || 0));
  return list;
};

/**
 * Admin: Get all sign-in logs
 */
export const fetchAllSignInLogs = async (max: number = 100): Promise<SignInLog[]> => {
  try {
    const logsQuery = query(
      collection(db, 'sign_ins'),
      orderBy('timestamp', 'desc'),
      limit(max)
    );
    const snap = await getDocs(logsQuery);
    const logs: SignInLog[] = [];
    snap.forEach((docSnap) => {
      logs.push(docSnap.data() as SignInLog);
    });
    return logs;
  } catch (err) {
    // If index is building or orderBy fails, fallback to simple fetch and client sort
    const snap = await getDocs(collection(db, 'sign_ins'));
    const logs: SignInLog[] = [];
    snap.forEach((docSnap) => {
      logs.push(docSnap.data() as SignInLog);
    });
    logs.sort((a, b) => b.timestamp - a.timestamp);
    return logs.slice(0, max);
  }
};

/**
 * Admin: Get all players across all users
 */
export const fetchAllPlayers = async (): Promise<Player[]> => {
  const playersColl = collection(db, 'players');
  const snap = await getDocs(playersColl);
  const list: Player[] = [];
  snap.forEach((docSnap) => {
    list.push(docSnap.data() as Player);
  });
  list.sort((a, b) => (b.stars || 0) - (a.stars || 0));
  return list;
};

/**
 * Admin: Update user role
 */
export const updateUserRoleInFirestore = async (uid: string, newRole: UserRole): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { role: newRole });
};

/**
 * Admin: Add a new user directly into Firestore database
 */
export const adminCreateUserInFirestore = async (userData: {
  email: string;
  displayName: string;
  role: UserRole;
  notes?: string;
}): Promise<UserProfile> => {
  const customUid = 'user_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
  const userRef = doc(db, 'users', customUid);
  const now = Date.now();

  const profile: UserProfile = {
    uid: customUid,
    email: userData.email.trim().toLowerCase(),
    displayName: userData.displayName.trim() || userData.email.split('@')[0],
    photoURL: null,
    role: userData.role,
    createdAt: now,
    lastLoginAt: now,
    provider: 'admin_created',
  };

  await setDoc(userRef, profile);
  return profile;
};

/**
 * Admin: Add a new player profile directly into Firestore
 */
export const adminCreatePlayerInFirestore = async (playerData: Partial<Player>): Promise<Player> => {
  const playerId = playerData.id || 'player_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
  const playerRef = doc(db, 'players', playerId);
  const now = Date.now();

  const fullPlayer: Player = {
    id: playerId,
    name: playerData.name || 'بطل جديد',
    gender: playerData.gender || 'boy',
    avatar: playerData.avatar || '⭐',
    characterId: playerData.characterId,
    characterTitle: playerData.characterTitle,
    level: playerData.level || 1,
    stars: playerData.stars || 0,
    gems: playerData.gems || 0,
    badges: playerData.badges || ['مغامر مبتدئ'],
    completedLevels: playerData.completedLevels || [],
    progress: playerData.progress || {
      swimming: 0,
      colors: 0,
      numbers: 0,
      letters: 0,
      shapes: 0,
      memory: 0,
      politeness: 0,
      flightAcademy: 0,
      quran: 0,
      religiousKnowledge: 0,
      professions: 0,
      generalKnowledge: 0,
    },
    inventory: playerData.inventory || {
      items: {},
      unopenedGifts: 1,
      placedItems: { room: [], aquarium: [] },
    },
    timePlayedSeconds: playerData.timePlayedSeconds || 0,
    createdAt: playerData.createdAt || now,
    ownerUid: playerData.ownerUid || 'admin_assigned',
    updatedAt: now,
  };

  await setDoc(playerRef, fullPlayer, { merge: true });
  return fullPlayer;
};

// ==========================================
// GAME CONFIGURATIONS & CUSTOM CONTENT
// ==========================================

/**
 * Loads all game configs from Firestore. If empty, seeds default configs.
 */
export const fetchAllGameConfigs = async (): Promise<GameConfig[]> => {
  try {
    const configsColl = collection(db, 'game_configs');
    const snap = await getDocs(configsColl);
    
    if (snap.empty) {
      // Seed default configs into memory & return
      return DEFAULT_GAME_CONFIGS;
    }

    const configsMap = new Map<string, GameConfig>();
    snap.forEach((docSnap) => {
      configsMap.set(docSnap.id, docSnap.data() as GameConfig);
    });

    // Merge with DEFAULT_GAME_CONFIGS so newly added games aren't missing
    const merged = DEFAULT_GAME_CONFIGS.map((defaultConf) => {
      return configsMap.get(defaultConf.id) || defaultConf;
    });

    merged.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
    return merged;
  } catch (err) {
    console.warn('Failed to load game_configs from Firestore, using local defaults:', err);
    return DEFAULT_GAME_CONFIGS;
  }
};

/**
 * Saves or updates a GameConfig in Firestore
 */
export const saveGameConfigToFirestore = async (config: GameConfig): Promise<void> => {
  const configRef = doc(db, 'game_configs', config.id);
  const dataToSave = {
    ...config,
    updatedAt: Date.now(),
  };
  await setDoc(configRef, dataToSave, { merge: true });
};

/**
 * Subscribes to game_configs in real time
 */
export const subscribeGameConfigs = (
  onUpdate: (configs: GameConfig[]) => void,
  onError?: (err: any) => void
) => {
  const configsColl = collection(db, 'game_configs');
  return onSnapshot(
    configsColl,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate(DEFAULT_GAME_CONFIGS);
        return;
      }
      const configsMap = new Map<string, GameConfig>();
      snapshot.forEach((docSnap) => {
        configsMap.set(docSnap.id, docSnap.data() as GameConfig);
      });
      const merged = DEFAULT_GAME_CONFIGS.map((defaultConf) => {
        return configsMap.get(defaultConf.id) || defaultConf;
      });
      merged.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      onUpdate(merged);
    },
    (error) => {
      console.warn('Error subscribing to game_configs:', error);
      if (onError) onError(error);
    }
  );
};

