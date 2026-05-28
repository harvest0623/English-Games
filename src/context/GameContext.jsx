import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { words, levels, cardRarity, playerClasses, achievements, shopItems, equipment, pets, skillTree, dailyTasks, wordCategories } from '../data/gameData';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const getDefaultPlayerData = () => ({
  name: '冒险者',
  class: 'scholar',
  level: 1,
  exp: 0,
  gold: 100,
  gems: 0,
  hp: 100,
  maxHp: 100,
  attack: 10,
  defense: 5,
  currentHp: 100,
  cards: [],
  unlockedLevels: [1],
  completedLevels: [],
  defeatedBosses: [],
  totalBattles: 0,
  bossKills: 0,
  perfectBattles: 0,
  maxCombo: 0,
  totalCards: 0,
  achievements: [],
  // 新增系统
  equipment: {
    weapon: null,
    armor: null,
    accessory: null
  },
  inventory: [],
  pets: [],
  activePet: null,
  skills: [],
  unlockedSkills: [],
  // 每日系统
  dailyCheckIn: {
    lastCheckIn: null,
    streak: 0,
    totalDays: 0,
    rewards: [50, 100, 150, 200, 250, 300, 500]
  },
  dailyTasks: [],
  // 学习记录
  learnedWords: [],
  wrongWords: [],
  favoriteWords: [],
  wordMastery: {},
  // 统计
  studyStats: {
    totalStudyTime: 0,
    totalCorrect: 0,
    totalWrong: 0,
    todayCorrect: 0,
    todayWrong: 0,
    todayStudyTime: 0,
    lastStudyDate: null,
    streakDays: 0,
    longestStreak: 0,
    dailyRecords: {}
  },
  // 设置
  settings: {
    sound: true,
    music: true,
    notifications: true,
    difficulty: 'normal',
    theme: 'dark'
  },
  // 词库选择
  selectedCategory: 'cet6',
  // 排行榜
  rankPoints: 0,
  // 用户账户
  user: {
    isLoggedIn: false,
    email: '',
    phone: '',
    avatar: '',
    createdAt: null
  },
  // 扩展设置
  userSettings: {
    profileVisibility: 'public',
    dataSharing: false,
    emailNotifications: true,
    pushNotifications: true,
    twoFactorAuth: false
  }
});

const initializeDailyTasks = () => {
  return dailyTasks.map(task => ({
    ...task,
    completed: false,
    progress: 0,
    claimed: false
  }));
};

export const GameProvider = ({ children }) => {
  const [player, setPlayer] = useState(() => {
    const saved = localStorage.getItem('wordGamePlayer');
    if (saved) {
      const parsed = JSON.parse(saved);
      // 合并新字段
      const defaults = getDefaultPlayerData();
      return { ...defaults, ...parsed };
    }
    const defaults = getDefaultPlayerData();
    defaults.dailyTasks = initializeDailyTasks();
    return defaults;
  });

  const [currentLevel, setCurrentLevel] = useState(null);
  const [battleState, setBattleState] = useState({
    isInBattle: false,
    enemy: null,
    questions: [],
    currentIndex: 0,
    correctCount: 0,
    wrongCount: 0,
    combo: 0,
    damage: 0,
    expGained: 0,
    goldGained: 0,
    isBoss: false,
    isVictory: false,
    isDefeat: false,
    perfectBattle: true,
    battleStartTime: null
  });

  const [cardRewards, setCardRewards] = useState([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpData, setLevelUpData] = useState(null);

  // 保存到本地存储
  useEffect(() => {
    localStorage.setItem('wordGamePlayer', JSON.stringify(player));
  }, [player]);

  // 检查每日任务刷新
  useEffect(() => {
    const today = getTodayKey();
    const lastTaskDate = player.studyStats.lastStudyDate;
    
    if (lastTaskDate !== today) {
      setPlayer(prev => ({
        ...prev,
        dailyTasks: initializeDailyTasks(),
        studyStats: {
          ...prev.studyStats,
          todayCorrect: 0,
          todayWrong: 0,
          todayStudyTime: 0,
          lastStudyDate: today
        }
      }));
    }
  }, []);

  const calculateLevelExp = (level) => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  };

  const addExp = (amount) => {
    let newExp = player.exp + amount;
    let newLevel = player.level;
    let levelUps = 0;

    while (newExp >= calculateLevelExp(newLevel)) {
      newExp -= calculateLevelExp(newLevel);
      newLevel++;
      levelUps++;
    }

    const levelUp = newLevel > player.level;
    
    if (levelUp) {
      setLevelUpData({
        oldLevel: player.level,
        newLevel: newLevel,
        hpIncrease: levelUps * 20,
        attackIncrease: levelUps * 5,
        defenseIncrease: levelUps * 2
      });
      setShowLevelUp(true);
    }
    
    setPlayer(prev => ({
      ...prev,
      exp: newExp,
      level: newLevel,
      maxHp: prev.maxHp + levelUps * 20,
      hp: levelUp ? prev.maxHp + levelUps * 20 : prev.hp,
      currentHp: levelUp ? prev.maxHp + levelUps * 20 : prev.currentHp,
      attack: prev.attack + levelUps * 5,
      defense: prev.defense + levelUps * 2
    }));

    return levelUp;
  };

  const generateCard = () => {
    const rand = Math.random();
    let rarity = 'N';
    if (rand > 0.95) rarity = 'SSR';
    else if (rand > 0.8) rarity = 'SR';
    else if (rand > 0.5) rarity = 'R';

    const rarityData = cardRarity[rarity];
    const availableWords = words.filter(w => 
      !player.cards.some(c => c.wordId === w.id && c.rarity === rarity)
    );

    const word = availableWords.length > 0 
      ? availableWords[Math.floor(Math.random() * availableWords.length)]
      : words[Math.floor(Math.random() * words.length)];

    return {
      id: Date.now() + Math.random(),
      wordId: word.id,
      word: word.word,
      meaning: word.meaning,
      phonetic: word.phonetic,
      rarity: rarity,
      power: Math.floor(Math.random() * (rarityData.maxStats - 40)) + 40,
      obtainedAt: new Date().toISOString()
    };
  };

  const startBattle = (levelId) => {
    const level = levels.find(l => l.id === levelId);
    if (!level) return;

    if (player.level < level.requiredLevel) {
      alert(`需要等级 ${level.requiredLevel} 才能进入此关卡！`);
      return;
    }

    setCurrentLevel(level);

    const levelWords = words
      .filter(w => w.difficulty <= level.difficulty + 1)
      .sort(() => Math.random() - 0.5)
      .slice(0, level.wordsPerLevel);

    const questions = levelWords.map(word => {
      const wrongOptions = words
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.meaning);

      const options = [...wrongOptions, word.meaning].sort(() => Math.random() - 0.5);

      return {
        id: word.id,
        word: word.word,
        phonetic: word.phonetic,
        meaning: word.meaning,
        options: options,
        correctAnswer: word.meaning
      };
    });

    setBattleState({
      isInBattle: true,
      enemy: { ...level.enemy },
      questions: questions,
      currentIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      combo: 0,
      damage: 0,
      expGained: 0,
      goldGained: 0,
      isBoss: level.boss,
      isVictory: false,
      isDefeat: false,
      perfectBattle: true,
      battleStartTime: Date.now()
    });
  };

  const attackDamage = () => {
    let baseDamage = player.attack + Math.floor(Math.random() * 10);
    // 装备加成
    if (player.equipment.weapon) {
      baseDamage += player.equipment.weapon.attackBonus;
    }
    // 宠物加成
    if (player.activePet) {
      const pet = pets.find(p => p.id === player.activePet);
      if (pet) baseDamage += pet.attackBonus;
    }
    return Math.max(1, baseDamage);
  };

  const submitAnswer = (answer) => {
    if (!battleState.isInBattle || battleState.isVictory || battleState.isDefeat) {
      return null;
    }

    const currentQuestion = battleState.questions[battleState.currentIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;

    let newDamage = battleState.damage;
    let newCombo = battleState.combo;

    // 更新学习记录
    if (isCorrect) {
      newCombo += 1;
      const comboBonus = newCombo >= 5 ? 2 : newCombo >= 3 ? 1.5 : 1;
      newDamage += Math.floor(attackDamage() * comboBonus);

      setPlayer(prev => {
        const wordId = currentQuestion.id;
        const newWordMastery = { ...prev.wordMastery };
        newWordMastery[wordId] = (newWordMastery[wordId] || 0) + 1;

        return {
          ...prev,
          learnedWords: prev.learnedWords.includes(wordId) 
            ? prev.learnedWords 
            : [...prev.learnedWords, wordId],
          wordMastery: newWordMastery,
          studyStats: {
            ...prev.studyStats,
            totalCorrect: prev.studyStats.totalCorrect + 1,
            todayCorrect: prev.studyStats.todayCorrect + 1
          }
        };
      });
    } else {
      newCombo = 0;
      setBattleState(prev => ({ ...prev, perfectBattle: false }));
      
      const enemyDamage = Math.max(5, Math.floor(currentLevel.enemy.hp * 0.05));
      const actualDamage = Math.max(1, enemyDamage - player.defense);
      
      setPlayer(prev => {
        const wordId = currentQuestion.id;
        return {
          ...prev,
          wrongWords: prev.wrongWords.includes(wordId)
            ? prev.wrongWords
            : [...prev.wrongWords, wordId],
          currentHp: Math.max(0, prev.currentHp - actualDamage),
          studyStats: {
            ...prev.studyStats,
            totalWrong: prev.studyStats.totalWrong + 1,
            todayWrong: prev.studyStats.todayWrong + 1
          }
        };
      });
    }

    setBattleState(prev => ({
      ...prev,
      correctCount: prev.correctCount + (isCorrect ? 1 : 0),
      wrongCount: prev.wrongCount + (isCorrect ? 0 : 1),
      combo: newCombo,
      damage: newDamage
    }));

    const newEnemyHp = Math.max(0, battleState.enemy.hp - (isCorrect ? newDamage : 0));

    setBattleState(prev => ({
      ...prev,
      enemy: { ...prev.enemy, hp: newEnemyHp }
    }));

    if (newEnemyHp <= 0) {
      finishBattle(true);
    } else if (player.currentHp <= 0) {
      finishBattle(false);
    }

    // 更新任务进度
    updateTaskProgress('answer_questions', 1);
    if (isCorrect && newCombo >= 5) {
      updateTaskProgress('reach_combo', 5);
    }

    return isCorrect;
  };

  const nextQuestion = () => {
    if (battleState.currentIndex + 1 >= battleState.questions.length) {
      const remainingHp = battleState.enemy.hp;
      if (remainingHp > 0) {
        finishBattle(false);
      } else {
        finishBattle(true);
      }
      return;
    }

    setBattleState(prev => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
      damage: 0
    }));
  };

  const finishBattle = (victory) => {
    const battleTime = Math.floor((Date.now() - battleState.battleStartTime) / 1000);

    if (victory) {
      const expReward = currentLevel.reward.exp;
      const goldReward = currentLevel.reward.gold;

      const levelUp = addExp(expReward);

      setBattleState(prev => ({
        ...prev,
        isVictory: true,
        isInBattle: false,
        expGained: expReward,
        goldGained: goldReward
      }));

      setPlayer(prev => ({
        ...prev,
        gold: prev.gold + goldReward,
        totalBattles: prev.totalBattles + 1,
        perfectBattles: prev.perfectBattles + (battleState.perfectBattle ? 1 : 0),
        maxCombo: Math.max(prev.maxCombo, battleState.combo),
        completedLevels: prev.completedLevels.includes(currentLevel.id) 
          ? prev.completedLevels 
          : [...prev.completedLevels, currentLevel.id],
        defeatedBosses: currentLevel.boss 
          ? [...prev.defeatedBosses, currentLevel.id]
          : prev.defeatedBosses,
        bossKills: currentLevel.boss 
          ? prev.bossKills + 1 
          : prev.bossKills,
        unlockedLevels: currentLevel.id < levels.length
          ? prev.unlockedLevels.includes(currentLevel.id + 1)
            ? prev.unlockedLevels
            : [...prev.unlockedLevels, currentLevel.id + 1]
          : prev.unlockedLevels,
        studyStats: {
          ...prev.studyStats,
          totalStudyTime: prev.studyStats.totalStudyTime + battleTime,
          todayStudyTime: prev.studyStats.todayStudyTime + battleTime
        },
        rankPoints: prev.rankPoints + (currentLevel.boss ? 100 : 50)
      }));

      const cards = [];
      const cardCount = currentLevel.boss ? 3 : 1;
      for (let i = 0; i < cardCount; i++) {
        cards.push(generateCard());
      }
      setCardRewards(cards);

      // 更新任务进度
      updateTaskProgress('complete_battles', 1);
      if (currentLevel.boss) {
        updateTaskProgress('defeat_bosses', 1);
      }

    } else {
      setBattleState(prev => ({
        ...prev,
        isDefeat: true,
        isInBattle: false
      }));

      setPlayer(prev => ({
        ...prev,
        totalBattles: prev.totalBattles + 1,
        currentHp: Math.floor(prev.maxHp * 0.5),
        studyStats: {
          ...prev.studyStats,
          totalStudyTime: prev.studyStats.totalStudyTime + battleTime,
          todayStudyTime: prev.studyStats.todayStudyTime + battleTime
        }
      }));
    }
  };

  const collectCards = () => {
    const newCards = cardRewards.map(card => ({
      ...card,
      playerId: player.id
    }));

    setPlayer(prev => ({
      ...prev,
      cards: [...prev.cards, ...newCards],
      totalCards: prev.totalCards + cardRewards.length
    }));

    setCardRewards([]);
    setBattleState({
      isInBattle: false,
      enemy: null,
      questions: [],
      currentIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      combo: 0,
      damage: 0,
      expGained: 0,
      goldGained: 0,
      isBoss: false,
      isVictory: false,
      isDefeat: false,
      perfectBattle: true,
      battleStartTime: null
    });
    setCurrentLevel(null);
  };

  const skipCards = () => {
    setCardRewards([]);
  };

  // 每日签到
  const checkIn = () => {
    const today = getTodayKey();
    if (player.dailyCheckIn.lastCheckIn === today) {
      return false;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    const newStreak = player.dailyCheckIn.lastCheckIn === yesterdayKey 
      ? player.dailyCheckIn.streak + 1 
      : 1;

    const rewardIndex = Math.min(newStreak - 1, player.dailyCheckIn.rewards.length - 1);
    const reward = player.dailyCheckIn.rewards[rewardIndex];

    setPlayer(prev => ({
      ...prev,
      gold: prev.gold + reward,
      dailyCheckIn: {
        ...prev.dailyCheckIn,
        lastCheckIn: today,
        streak: newStreak,
        totalDays: prev.dailyCheckIn.totalDays + 1
      }
    }));

    return { success: true, reward, streak: newStreak };
  };

  // 更新任务进度
  const updateTaskProgress = (taskType, amount) => {
    setPlayer(prev => ({
      ...prev,
      dailyTasks: prev.dailyTasks.map(task => {
        if (task.type === taskType && !task.completed) {
          const newProgress = Math.min(task.progress + amount, task.target);
          return {
            ...task,
            progress: newProgress,
            completed: newProgress >= task.target
          };
        }
        return task;
      })
    }));
  };

  // 领取任务奖励
  const claimTaskReward = (taskId) => {
    const task = player.dailyTasks.find(t => t.id === taskId);
    if (!task || !task.completed || task.claimed) return false;

    setPlayer(prev => ({
      ...prev,
      gold: prev.gold + task.reward.gold,
      exp: prev.exp + task.reward.exp,
      dailyTasks: prev.dailyTasks.map(t => 
        t.id === taskId ? { ...t, claimed: true } : t
      )
    }));

    return true;
  };

  // 商店购买
  const buyItem = (item) => {
    if (player.gold < item.price) return false;

    setPlayer(prev => ({
      ...prev,
      gold: prev.gold - item.price,
      inventory: [...prev.inventory, { ...item, obtainedAt: new Date().toISOString() }]
    }));

    return true;
  };

  const buyEquipment = (equip) => {
    if (player.gold < equip.price) return false;

    setPlayer(prev => ({
      ...prev,
      gold: prev.gold - equip.price,
      equipment: {
        ...prev.equipment,
        [equip.slot]: equip
      }
    }));

    return true;
  };

  // 使用道具
  const useItem = (itemId) => {
    const item = player.inventory.find(i => i.id === itemId);
    if (!item) return false;

    if (item.type === 'potion') {
      setPlayer(prev => ({
        ...prev,
        currentHp: Math.min(prev.maxHp, prev.currentHp + item.healAmount),
        inventory: prev.inventory.filter(i => i.id !== itemId)
      }));
      return true;
    }

    return false;
  };

  // 宠物系统
  const unlockPet = (petId) => {
    const pet = pets.find(p => p.id === petId);
    if (!pet || player.pets.includes(petId)) return false;

    setPlayer(prev => ({
      ...prev,
      pets: [...prev.pets, petId],
      activePet: prev.activePet || petId
    }));

    return true;
  };

  const setActivePet = (petId) => {
    if (!player.pets.includes(petId)) return false;
    setPlayer(prev => ({ ...prev, activePet: petId }));
    return true;
  };

  // 技能系统
  const unlockSkill = (skillId) => {
    const skill = skillTree.find(s => s.id === skillId);
    if (!skill || player.unlockedSkills.includes(skillId)) return false;
    if (player.level < skill.requiredLevel) return false;

    setPlayer(prev => ({
      ...prev,
      unlockedSkills: [...prev.unlockedSkills, skillId],
      skills: [...prev.skills, skill]
    }));

    return true;
  };

  // 单词本操作
  const toggleFavorite = (wordId) => {
    setPlayer(prev => ({
      ...prev,
      favoriteWords: prev.favoriteWords.includes(wordId)
        ? prev.favoriteWords.filter(id => id !== wordId)
        : [...prev.favoriteWords, wordId]
    }));
  };

  const removeWrongWord = (wordId) => {
    setPlayer(prev => ({
      ...prev,
      wrongWords: prev.wrongWords.filter(id => id !== wordId)
    }));
  };

  // 选择词库
  const selectCategory = (categoryId) => {
    setPlayer(prev => ({ ...prev, selectedCategory: categoryId }));
  };

  // 用户登录
  const login = (name, password) => {
    setPlayer(prev => ({
      ...prev,
      name: name || prev.name,
      user: {
        ...prev.user,
        isLoggedIn: true,
        createdAt: prev.user.createdAt || new Date().toISOString()
      }
    }));
    return true;
  };

  // 用户注册
  const register = (name, email, password) => {
    setPlayer(prev => ({
      ...prev,
      name: name || prev.name,
      user: {
        isLoggedIn: true,
        email: email || '',
        phone: '',
        avatar: '',
        createdAt: new Date().toISOString()
      }
    }));
    return true;
  };

  // 用户退出
  const logout = () => {
    setPlayer(prev => ({
      ...prev,
      user: {
        ...prev.user,
        isLoggedIn: false
      }
    }));
  };

  // 更新个人信息
  const updateProfile = (profileData) => {
    setPlayer(prev => ({
      ...prev,
      name: profileData.name || prev.name,
      user: {
        ...prev.user,
        email: profileData.email ?? prev.user.email,
        phone: profileData.phone ?? prev.user.phone
      }
    }));
  };

  // 修改密码
  const changePassword = (oldPassword, newPassword) => {
    return true;
  };

  // 更新用户设置
  const updateUserSettings = (newSettings) => {
    setPlayer(prev => ({
      ...prev,
      userSettings: {
        ...prev.userSettings,
        ...newSettings
      }
    }));
  };

  // 重置游戏
  const resetGame = () => {
    const defaults = getDefaultPlayerData();
    defaults.dailyTasks = initializeDailyTasks();
    setPlayer(defaults);
    setCurrentLevel(null);
    setBattleState({
      isInBattle: false,
      enemy: null,
      questions: [],
      currentIndex: 0,
      correctCount: 0,
      wrongCount: 0,
      combo: 0,
      damage: 0,
      expGained: 0,
      goldGained: 0,
      isBoss: false,
      isVictory: false,
      isDefeat: false,
      perfectBattle: true,
      battleStartTime: null
    });
    setCardRewards([]);
  };

  // 检查成就
  const checkAchievements = () => {
    const newAchievements = [];
    achievements.forEach(achievement => {
      if (!player.achievements.includes(achievement.id)) {
        const stats = {
          totalBattles: player.totalBattles,
          bossKills: player.bossKills,
          totalCards: player.totalCards,
          level: player.level,
          maxCombo: player.maxCombo,
          perfectBattles: player.perfectBattles
        };
        if (achievement.condition(stats)) {
          newAchievements.push(achievement.id);
        }
      }
    });

    if (newAchievements.length > 0) {
      setPlayer(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...newAchievements]
      }));
    }

    return newAchievements;
  };

  const value = {
    player,
    currentLevel,
    battleState,
    cardRewards,
    showLevelUp,
    levelUpData,
    levels,
    cardRarity,
    playerClasses,
    achievements,
    shopItems,
    equipment,
    pets,
    skillTree,
    wordCategories,
    words,
    startBattle,
    submitAnswer,
    nextQuestion,
    collectCards,
    skipCards,
    resetGame,
    calculateLevelExp,
    checkIn,
    claimTaskReward,
    buyItem,
    buyEquipment,
    useItem,
    unlockPet,
    setActivePet,
    unlockSkill,
    toggleFavorite,
    removeWrongWord,
    selectCategory,
    checkAchievements,
    setShowLevelUp,
    updateTaskProgress,
    getTodayKey,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    updateUserSettings
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
