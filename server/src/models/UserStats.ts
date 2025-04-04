// models/UserStats.js
import mongoose from 'mongoose';

const UserStatsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scores_last_7_days: { type: [Number], default: [] },
  scores_last_30_days: { type: [Number], default: [] },
});

const UserStats = mongoose.model('UserStats', UserStatsSchema);

export default UserStats;
