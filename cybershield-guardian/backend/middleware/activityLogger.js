import UserActivityLog from '../models/UserActivityLog.js';

const activityLogger = (action) => {
  return async (req, res, next) => {
    try {
      const userId = req.user ? req.user._id : null;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      const userAgent = req.headers['user-agent'] || '';

      if (userId) {
        const log = new UserActivityLog({
          userId,
          action,
          ipAddress,
          userAgent,
        });
        await log.save();
      }
    } catch (error) {
      console.error('Error logging user activity:', error);
    }
    next();
  };
};

export default activityLogger;
