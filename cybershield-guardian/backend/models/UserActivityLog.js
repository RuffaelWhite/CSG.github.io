import mongoose from 'mongoose';

const userActivityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  ipAddress: { type: String },
  userAgent: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const UserActivityLog = mongoose.model('UserActivityLog', userActivityLogSchema);

export default UserActivityLog;
