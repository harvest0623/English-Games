export const loadProgress = () => {
  try {
    const data = localStorage.getItem('wordGameProgress');
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }
  return null;
};

export const saveProgress = (progress) => {
  try {
    localStorage.setItem('wordGameProgress', JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const getDefaultProgress = () => {
  return {
    totalLearned: 0,
    correctCount: 0,
    wrongCount: 0,
    streakDays: 0,
    lastStudyDate: null,
    wrongWords: [],
    achievements: [],
    totalGames: 0,
    perfectRounds: 0,
    maxCombo: 0,
    todayCorrect: 0,
    todayTotal: 0,
    todayDate: null
  };
};

export const updateStreak = (progress) => {
  const today = new Date().toDateString();
  const lastStudy = progress.lastStudyDate;

  if (!lastStudy) {
    progress.streakDays = 1;
  } else {
    const lastDate = new Date(lastStudy);
    const todayDate = new Date(today);
    const diffTime = Math.abs(todayDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
    } else if (diffDays === 1) {
      progress.streakDays += 1;
    } else {
      progress.streakDays = 1;
    }
  }

  progress.lastStudyDate = today;
  return progress;
};

export const resetDailyProgress = (progress) => {
  const today = new Date().toDateString();
  if (progress.todayDate !== today) {
    progress.todayCorrect = 0;
    progress.todayTotal = 0;
    progress.todayDate = today;
  }
  return progress;
};
