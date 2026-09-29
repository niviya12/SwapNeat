import { Router, Response } from 'express';
import { db } from '../data/store.ts';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/saved - Get all saved items for current user
router.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const savedRecords = db.getSavedItemsByUser(userId);
    const allItems = db.getItems();

    const populatedSaved = savedRecords.map(record => {
      const item = allItems.find(i => i.id === record.itemId);
      return {
        ...record,
        item
      };
    }).filter(record => record.item !== undefined);

    return res.json({ savedItems: populatedSaved });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve saved items.';
    return res.status(500).json({ error: message });
  }
});

// POST /api/saved/:itemId - Toggle save/unsave
router.post('/:itemId', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { itemId } = req.params;

    const result = db.toggleSaveItem(userId, itemId);
    return res.json({
      saved: result.saved,
      message: result.saved ? 'Item saved to your Tamil Nadu collection.' : 'Item removed from saved items.'
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to toggle saved item.';
    return res.status(500).json({ error: message });
  }
});

export default router;
