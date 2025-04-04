// services/userStats.js
import UserStats from '../models/UserStats.js';

export const updateUserStats = async (userId: string, score: number) => {
  try {
    // Find or create user stats
    let userStats = await UserStats.findOne({ user: userId });
    if (!userStats) {
      userStats = new UserStats({ user: userId, scores_last_7_days: [], scores_last_30_days: [] });
    }

    // Update scores for the last 7 days
    userStats.scores_last_7_days.unshift(score);
    if (userStats.scores_last_7_days.length > 7) {
      userStats.scores_last_7_days.pop(); // Keep only the last 7 scores
    }

    // Update scores for the last 30 days
    userStats.scores_last_30_days.unshift(score);
    if (userStats.scores_last_30_days.length > 30) {
      userStats.scores_last_30_days.pop(); // Keep only the last 30 scores
    }

    // Save the updated stats
    await userStats.save();
    console.log('User stats updated:', userStats);
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw new Error('Failed to update user stats');
  }
};
