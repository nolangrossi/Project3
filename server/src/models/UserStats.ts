import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const UserStatsSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scores: { type: [scoreSchema], default: [] },
});

const UserStats = mongoose.model('UserStats', UserStatsSchema);

export default UserStats;
