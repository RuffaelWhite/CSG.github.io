import express from 'express';
import Analytics from '../models/Analytics.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';
import roleCheck from '../middleware/roleCheck.js';

const router = express.Router();

// Get analytics summary - admin only
router.get('/summary', verifyAdmin, roleCheck(['admin']), async (req, res) => {
  try {
    // Example: count events by type
    const counts = await Analytics.aggregate([
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(counts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics summary', error });
  }
});

export default router;
