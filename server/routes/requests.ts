import { Router, Response } from 'express';
import { db } from '../data/store.ts';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// POST /api/requests - Create a request for an item
router.post('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { itemId, message } = req.body;

    if (!itemId) {
      return res.status(400).json({ error: 'Item ID is required.' });
    }

    const item = db.getItemById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    if (item.ownerId === user.id) {
      return res.status(400).json({ error: 'You cannot request your own item.' });
    }

    // Check if user already requested this item and it is pending
    const existingReq = db.getRequests().find(
      r => r.itemId === itemId && r.requesterId === user.id && (r.status === 'Pending' || r.status === 'Accepted')
    );
    if (existingReq) {
      return res.status(400).json({ error: 'You already have an active request for this item.' });
    }

    const newRequest = db.createRequest({
      itemId: item.id,
      itemTitle: item.title,
      itemImage: item.images[0] || '',
      itemCategory: item.category,
      itemDistrict: item.district,
      itemCity: item.city,
      requesterId: user.id,
      requesterName: user.name,
      requesterPhone: user.phone,
      requesterCity: user.city,
      requesterDistrict: user.district,
      ownerId: item.ownerId,
      ownerName: item.ownerName,
      message: message || `Hello! I am interested in your ${item.title}. Can we arrange a safe exchange in ${item.city}, ${item.district}?`,
      exchangeType: item.exchangeType,
      requestedDate: new Date().toISOString()
    });

    return res.status(201).json({
      message: 'Request sent successfully to item owner.',
      request: newRequest
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send request.';
    return res.status(500).json({ error: message });
  }
});

// GET /api/requests/sent - Requests sent by the logged-in user
router.get('/sent', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const sent = db.getRequests().filter(r => r.requesterId === userId);
    return res.json({ requests: sent });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load sent requests.';
    return res.status(500).json({ error: message });
  }
});

// GET /api/requests/received - Requests received by the logged-in user
router.get('/received', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const received = db.getRequests().filter(r => r.ownerId === userId);
    return res.json({ requests: received });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load received requests.';
    return res.status(500).json({ error: message });
  }
});

// PATCH /api/requests/:id/status - Update request status (Accepted, Rejected, Cancelled)
router.patch('/:id/status', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user!;

    const request = db.getRequestById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    // Only owner can Accept/Reject; only requester can Cancel
    if (status === 'Accepted' || status === 'Rejected') {
      if (request.ownerId !== user.id && user.role !== 'admin') {
        return res.status(403).json({ error: 'Only the item owner can accept or reject this request.' });
      }
    } else if (status === 'Cancelled') {
      if (request.requesterId !== user.id && request.ownerId !== user.id && user.role !== 'admin') {
        return res.status(403).json({ error: 'Unauthorized to cancel this request.' });
      }
    }

    const updated = db.updateRequestStatus(id, status);
    return res.json({ message: `Request status updated to ${status}.`, request: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update request.';
    return res.status(500).json({ error: message });
  }
});

export default router;
