import UserStats from '../models/UserStats.js';

export const updateUserStats = async (userId: string, score: number): Promise<void> => {
  try {
    let userStats = await UserStats.findOne({ user: userId });

    if (!userStats) {
      userStats = new UserStats({ user: userId, scores: [] });
    }

    const now = new Date();
    // This line is for testing to insert a date + is future, - is past
    now.setDate(now.getDate() + 2)

    const todayString = now.toISOString().split('T')[0]; //"2025-04-09"

    // Check if there's already a score for today
    const existingTodayIndex = userStats.scores.findIndex((s) => {
      const scoreDateString = new Date(s.date).toISOString().split('T')[0];
      return scoreDateString === todayString;
    });

    if (existingTodayIndex !== -1) {
      // If a score already exists for today, replace it if the new one is higher
      if (score > userStats.scores[existingTodayIndex].value) {
        userStats.scores[existingTodayIndex].value = score;
        userStats.scores[existingTodayIndex].date = now;
      }
    } else {
      // No score today yet, add new score at the beginning
      userStats.scores.unshift({ value: score, date: now });
    }

    // Remove scores older than 30 days to reduce DB bloat
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const filtered = userStats.scores
    .filter((s) => new Date(s.date) > thirtyDaysAgo)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 30);

    // Clear the array in-place and push in updated values
    userStats.scores.splice(0, userStats.scores.length, ...filtered);


    await userStats.save();
    console.log('User stats updated:', userStats);
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw new Error('Failed to update user stats');
  }
};
