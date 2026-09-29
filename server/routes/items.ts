import { Router, Response } from 'express';
import { db } from '../data/store.ts';
import { validateLocationBackend } from '../utils/locationValidator.ts';
import { authMiddleware, optionalAuthMiddleware, AuthenticatedRequest } from '../middleware/auth.ts';

const router = Router();

// GET /api/items/match - Smart Matching System
router.get('/match', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query, category, district, city, exchangeType } = req.query as Record<string, string>;

    const userDistrict = district || req.user?.district || '';
    const userCity = city || req.user?.city || '';
    const targetCategory = category || '';
    const searchWord = (query || '').toLowerCase().trim();

    let allItems = db.getItems().filter(i => i.status === 'active');

    // Filter by category if supplied
    if (targetCategory && targetCategory !== 'All Categories') {
      allItems = allItems.filter(i => i.category.toLowerCase() === targetCategory.toLowerCase());
    }

    // Filter by exchange type if supplied
    if (exchangeType && exchangeType !== 'All') {
      allItems = allItems.filter(i => i.exchangeType === exchangeType);
    }

    // Filter by keyword if supplied
    if (searchWord) {
      allItems = allItems.filter(i =>
        i.title.toLowerCase().includes(searchWord) ||
        i.description.toLowerCase().includes(searchWord) ||
        i.category.toLowerCase().includes(searchWord)
      );
    }

    // Tier 1: High Match (Same City in Tamil Nadu)
    const highMatch = allItems.filter(item =>
      userCity && item.city.toLowerCase() === userCity.toLowerCase()
    );

    // Tier 2: Medium Match (Same District, different city)
    const highMatchIds = new Set(highMatch.map(i => i.id));
    const mediumMatch = allItems.filter(item =>
      !highMatchIds.has(item.id) &&
      userDistrict && item.district.toLowerCase() === userDistrict.toLowerCase()
    );

    // Tier 3: Other Tamil Nadu districts
    const mediumMatchIds = new Set([...highMatchIds, ...mediumMatch.map(i => i.id)]);
    const otherMatch = allItems.filter(item => !mediumMatchIds.has(item.id));

    return res.json({
      location: {
        state: 'Tamil Nadu',
        district: userDistrict,
        city: userCity
      },
      tiers: {
        highMatch,
        mediumMatch,
        otherMatch
      },
      totalMatches: allItems.length
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Matching failed.';
    return res.status(500).json({ error: message });
  }
});

// GET /api/items - Browse & Filter Items
router.get('/', optionalAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      search,
      district,
      city,
      category,
      condition,
      exchangeType,
      sort,
      userDistrict
    } = req.query as Record<string, string>;

    let items = db.getItems().filter(i => i.status === 'active');

    // 1. Search filter
    if (search) {
      const q = search.toLowerCase().trim();
      items = items.filter(i =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.city.toLowerCase().includes(q) ||
        i.district.toLowerCase().includes(q)
      );
    }

    // 2. District filter
    if (district && district !== 'All' && district !== 'All Districts') {
      items = items.filter(i => i.district.toLowerCase() === district.toLowerCase());
    }

    // 3. City filter
    if (city && city !== 'All') {
      items = items.filter(i => i.city.toLowerCase() === city.toLowerCase());
    }

    // 4. Category filter
    if (category && category !== 'All' && category !== 'All Categories') {
      items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
    }

    // 5. Condition filter
    if (condition && condition !== 'All' && condition !== 'All Conditions') {
      items = items.filter(i => i.condition === condition);
    }

    // 6. Exchange Type filter
    if (exchangeType && exchangeType !== 'All' && exchangeType !== 'All Types') {
      items = items.filter(i => i.exchangeType === exchangeType);
    }

    // 7. Sorting & Location prioritization (Tamil Nadu District first)
    const preferredDistrict = district || userDistrict || req.user?.district;

    items.sort((a, b) => {
      // Prioritize items in the user's district if requested
      if (sort === 'nearest' && preferredDistrict) {
        const aSameDist = a.district.toLowerCase() === preferredDistrict.toLowerCase() ? 1 : 0;
        const bSameDist = b.district.toLowerCase() === preferredDistrict.toLowerCase() ? 1 : 0;
        if (aSameDist !== bSameDist) {
          return bSameDist - aSameDist;
        }
      }

      if (sort === 'views') {
        return (b.views || 0) - (a.views || 0);
      }

      // Default: newest first
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return res.json({
      items,
      count: items.length,
      filteredByDistrict: district || 'All Tamil Nadu'
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch items.';
    return res.status(500).json({ error: message });
  }
});

// GET /api/items/:id - Item Details
router.get('/:id', (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const item = db.getItemById(id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found in Tamil Nadu directory.' });
    }

    // Increment views
    db.incrementItemViews(id);

    // Find similar items in the same district or category
    const similarItems = db.getItems()
      .filter(i => i.id !== id && i.status === 'active' && (i.district === item.district || i.category === item.category))
      .slice(0, 4);

    const owner = db.getUserById(item.ownerId);

    return res.json({
      item,
      owner: owner ? {
        id: owner.id,
        name: owner.name,
        district: owner.district,
        city: owner.city,
        rating: owner.rating,
        ratingCount: owner.ratingCount,
        profileImage: owner.profileImage,
        createdAt: owner.createdAt
      } : null,
      similarItems
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to retrieve item.';
    return res.status(500).json({ error: message });
  }
});

// POST /api/items - Post an Item (Strictly within Tamil Nadu)
router.post('/', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const {
      title,
      description,
      category,
      condition,
      images,
      exchangeType,
      state,
      district,
      city,
      approximateArea,
      quantity
    } = req.body;

    if (!title || !description || !category || !condition || !exchangeType) {
      return res.status(400).json({ error: 'Please provide all mandatory item details.' });
    }

    // Use user's registered district/city as default if not explicitly chosen
    const finalDistrict = district || user.district;
    const finalCity = city || user.city;
    const finalState = state || 'Tamil Nadu';

    // STRICT LOCATION VALIDATION: Must belong to Tamil Nadu!
    const locationVal = validateLocationBackend(finalState, finalDistrict, finalCity);
    if (!locationVal.valid) {
      return res.status(400).json({ error: locationVal.error });
    }

    const itemImages = Array.isArray(images) && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'];

    const newItem = db.createItem({
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      condition,
      images: itemImages,
      exchangeType,
      state: 'Tamil Nadu',
      district: finalDistrict,
      city: finalCity,
      approximateArea: approximateArea || `Near ${finalCity}, ${finalDistrict}`,
      quantity: Number(quantity) || 1,
      ownerId: user.id,
      ownerName: user.name,
      ownerPhone: user.phone,
      ownerRating: user.rating,
      ownerRatingCount: user.ratingCount,
      status: 'active'
    });

    return res.status(201).json({
      message: 'Item listed successfully in Tamil Nadu directory.',
      item: newItem
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to post item.';
    return res.status(400).json({ error: message });
  }
});

// PUT /api/items/:id - Update Item
router.put('/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const item = db.getItemById(id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    if (item.ownerId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to edit this item.' });
    }

    const { title, description, category, condition, exchangeType, district, city, approximateArea, quantity, status, images } = req.body;

    if (district || city) {
      const val = validateLocationBackend('Tamil Nadu', district || item.district, city || item.city);
      if (!val.valid) return res.status(400).json({ error: val.error });
    }

    const updated = db.updateItem(id, {
      title,
      description,
      category,
      condition,
      exchangeType,
      district,
      city,
      approximateArea,
      quantity,
      status,
      images
    });

    return res.json({ message: 'Item updated successfully.', item: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update item.';
    return res.status(400).json({ error: message });
  }
});

// DELETE /api/items/:id - Delete Item
router.delete('/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const item = db.getItemById(id);

    if (!item) {
      return res.status(404).json({ error: 'Item not found.' });
    }

    if (item.ownerId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete this item.' });
    }

    db.deleteItem(id);
    return res.json({ message: 'Item removed successfully from directory.' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete item.';
    return res.status(500).json({ error: message });
  }
});

export default router;
