import { Router, Response } from 'express';
import { db } from '../data/store.ts';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/notifications
router.get('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const notifications = db.getNotificationsByUser(userId);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    return res.json({ notifications, unreadCount });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get notifications.';
    return res.status(500).json({ error: message });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    db.markNotificationRead(id);
    return res.json({ message: 'Marked notification as read.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update notification.';
    return res.status(500).json({ error: message });
  }
});

// PATCH /api/notifications/read-all
router.patch('/read-all', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    db.markAllNotificationsRead(userId);
    return res.json({ message: 'All notifications marked as read.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update notifications.';
    return res.status(500).json({ error: message });
  }
});

export default router;
