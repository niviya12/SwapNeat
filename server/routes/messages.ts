import { Router, Response } from 'express';
import { db } from '../data/store.ts';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/messages/:threadId - Retrieve chat history for a request or exchange
router.get('/:threadId', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { threadId } = req.params;
    const messages = db.getMessagesByThread(threadId);
    return res.json({ messages });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get messages.';
    return res.status(500).json({ error: message });
  }
});

// POST /api/messages - Send a message
router.post('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { requestId, exchangeId, recipientId, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content cannot be empty.' });
    }

    if (!recipientId) {
      return res.status(400).json({ error: 'Recipient is required.' });
    }

    const message = db.createMessage({
      requestId,
      exchangeId,
      senderId: user.id,
      senderName: user.name,
      recipientId,
      content: content.trim()
    });

    return res.status(201).json({ message });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send message.';
    return res.status(500).json({ error: message });
  }
});

export default router;
