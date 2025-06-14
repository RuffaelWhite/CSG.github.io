import express from 'express';
import UserActivityLog from '../models/UserActivityLog.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import roleCheck from '../middleware/roleCheck.js';

const router = express.Router();

// Get all user activity logs - admin only
router.get('/', verifyAdmin, roleCheck(['admin']), async (req, res) => {
  try {
    const logs = await UserActivityLog.find()
      .populate('userId', 'username email')
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activity logs', error });
  }
});

export default router;
