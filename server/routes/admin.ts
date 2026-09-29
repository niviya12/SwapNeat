import { Router, Response } from 'express';
import { db } from '../data/store.ts';
import { authMiddleware, adminOnlyMiddleware, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// Apply auth and admin check to all admin routes
router.use(authMiddleware);
router.use(adminOnlyMiddleware);

// GET /api/admin/overview - Overall admin statistics
router.get('/overview', (_req: AuthenticatedRequest, res: Response) => {
  try {
    const users = db.getUsers();
    const items = db.getItems();
    const requests = db.getRequests();
    const exchanges = db.getExchanges();
    const reports = db.getReports();

    // District-wise breakdown
    const districtUserCounts: Record<string, number> = {};
    users.forEach(u => {
      districtUserCounts[u.district] = (districtUserCounts[u.district] || 0) + 1;
    });

    const districtItemCounts: Record<string, number> = {};
    items.forEach(i => {
      districtItemCounts[i.district] = (districtItemCounts[i.district] || 0) + 1;
    });

    return res.json({
      metrics: {
        totalUsers: users.length,
        totalItems: items.length,
        activeListings: items.filter(i => i.status === 'active').length,
        completedExchanges: exchanges.filter(e => e.status === 'Completed').length,
        pendingRequests: requests.filter(r => r.status === 'Pending').length,
        totalReports: reports.length,
        pendingReports: reports.filter(r => r.status === 'Pending').length
      },
      districtStats: {
        usersByDistrict: districtUserCounts,
        itemsByDistrict: districtItemCounts
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Admin overview failed.';
    return res.status(500).json({ error: message });
  }
});

// GET /api/admin/reports - Get all reports
router.get('/reports', (_req: AuthenticatedRequest, res: Response) => {
  try {
    const reports = db.getReports();
    return res.json({ reports });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve reports.';
    return res.status(500).json({ error: message });
  }
});

// PATCH /api/admin/reports/:id - Moderate report (Action_Taken, Dismissed, Reviewed)
router.patch('/reports/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, action } = req.body;

    const report = db.updateReportStatus(id, status);
    if (!report) {
      return res.status(404).json({ error: 'Report not found.' });
    }

    // If action is remove_item, delete the reported item
    if (action === 'remove_item') {
      db.deleteItem(report.itemId);
    }

    return res.json({ message: 'Report status updated.', report });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update report.';
    return res.status(500).json({ error: message });
  }
});

// GET /api/admin/users - List users
router.get('/users', (_req: AuthenticatedRequest, res: Response) => {
  try {
    const users = db.getUsers();
    return res.json({ users });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get users.';
    return res.status(500).json({ error: message });
  }
});

// DELETE /api/admin/items/:id - Remove inappropriate listing
router.delete('/items/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteItem(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Item not found.' });
    }
    return res.json({ message: 'Item listing removed by administrator.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to remove item.';
    return res.status(500).json({ error: message });
  }
});

export default router;
