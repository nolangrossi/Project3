import UserStats from '../models/UserStats.js';

export const updateUserStats = async (userId: string, score: number): Promise<void> => {
    try {
    let userStats = await UserStats.findOne({ user: userId });

    if (!userStats) {
      userStats = new UserStats({ user: userId, scores: [] });
    }

    // Add new score with timestamp
    userStats.scores.unshift({ value: score, date: new Date() });

    // Optionally: clean up old scores (e.g., > 60 days old) to reduce DB bloat
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    userStats.scores.splice(
        0,
        userStats.scores.length,
        ...userStats.scores.filter((s) => new Date(s.date) > sixtyDaysAgo)
      );
      
    await userStats.save();
    console.log('User stats updated:', userStats);
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw new Error('Failed to update user stats');
  }
};
