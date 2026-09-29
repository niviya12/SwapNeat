import { Router, Response } from 'express';
import { db } from '../data/store.ts';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// POST /api/reviews - Submit review and rating (1-5 stars)
router.post('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const { exchangeId, revieweeId, rating, comment } = req.body;

    if (!exchangeId || !revieweeId || !rating) {
      return res.status(400).json({ error: 'Exchange ID, recipient, and star rating (1-5) are required.' });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5 stars.' });
    }

    const exchange = db.getExchangeById(exchangeId);
    if (!exchange) {
      return res.status(404).json({ error: 'Associated exchange record not found.' });
    }

    const newReview = db.createReview({
      exchangeId,
      itemId: exchange.itemId,
      itemTitle: exchange.itemTitle,
      reviewerId: user.id,
      reviewerName: user.name,
      revieweeId,
      rating: numRating,
      comment: comment || ''
    });

    return res.status(201).json({
      message: 'Thank you for your rating! It strengthens the Tamil Nadu reuse trust network.',
      review: newReview
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit review.';
    return res.status(500).json({ error: message });
  }
});

// GET /api/reviews/user/:userId - Get reviews received by a user
router.get('/user/:userId', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const reviews = db.getReviewsByReviewee(userId);
    return res.json({ reviews });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get reviews.';
    return res.status(500).json({ error: message });
  }
});

export default router;
