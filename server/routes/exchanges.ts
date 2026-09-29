import { Router, Response } from 'express';
import { db } from '../data/store.ts';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/exchanges - User's active and completed exchanges
router.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const exchanges = db.getExchanges().filter(
      e => e.ownerId === userId || e.requesterId === userId
    );
    return res.json({ exchanges });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve exchanges.';
    return res.status(500).json({ error: message });
  }
});

// GET /api/exchanges/:id
router.get('/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const exchange = db.getExchangeById(id);

    if (!exchange) {
      return res.status(404).json({ error: 'Exchange record not found.' });
    }

    if (exchange.ownerId !== userId && exchange.requesterId !== userId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to view this exchange.' });
    }

    return res.json({ exchange });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve exchange.';
    return res.status(500).json({ error: message });
  }
});

// PATCH /api/exchanges/:id/status - Update exchange status (Confirmed, Completed, Cancelled)
router.patch('/:id/status', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, meetingNotes } = req.body;
    const userId = req.user!.id;

    const exchange = db.getExchangeById(id);
    if (!exchange) {
      return res.status(404).json({ error: 'Exchange not found.' });
    }

    if (exchange.ownerId !== userId && exchange.requesterId !== userId && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to update this exchange.' });
    }

    if (meetingNotes) {
      exchange.meetingNotes = meetingNotes;
    }

    const updated = db.updateExchangeStatus(id, status);
    return res.json({ message: `Exchange status updated to ${status}.`, exchange: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update exchange status.';
    return res.status(500).json({ error: message });
  }
});

export default router;
