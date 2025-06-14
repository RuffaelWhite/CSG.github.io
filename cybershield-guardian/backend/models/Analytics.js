import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  metadata: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
