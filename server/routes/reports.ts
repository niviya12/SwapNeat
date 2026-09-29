import { Router, Response } from 'express';
import { db } from '../data/store.ts';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// POST /api/reports - Report an item
router.post('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { itemId, reason, details } = req.body;

    if (!itemId || !reason) {
      return res.status(400).json({ error: 'Item ID and reason for reporting are required.' });
    }

    const item = db.getItemById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    const report = db.createReport({
      itemId,
      itemTitle: item.title,
      reportedByUserId: user.id,
      reportedByName: user.name,
      reason,
      details: details || ''
    });

    return res.status(201).json({
      message: 'Report submitted. Our moderation team will review this listing shortly.',
      report
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit report.';
    return res.status(500).json({ error: message });
  }
});

export default router;
