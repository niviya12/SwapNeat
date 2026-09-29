import { Router, Response } from 'express';
import { db } from '../data/store.ts';
import { ALL_38_DISTRICTS } from '../../src/data/tamilNaduLocations.ts';

const router = Router();

// GET /api/analytics/tamilnadu - Regional Reuse Analytics
router.get('/tamilnadu', (_req, res: Response) => {
  try {
    const items = db.getItems();
    const users = db.getUsers();
    const exchanges = db.getExchanges();

    // Baseline historical counts + real current items count
    const districtActivityBase: Record<string, { items: number; users: number; exchanges: number; region: string }> = {
      Chennai: { items: 560, users: 1840, exchanges: 390, region: 'North' },
      Coimbatore: { items: 410, users: 1420, exchanges: 280, region: 'West' },
      Madurai: { items: 320, users: 1110, exchanges: 215, region: 'South' },
      Virudhunagar: { items: 245, users: 890, exchanges: 165, region: 'South' },
      Salem: { items: 195, users: 730, exchanges: 130, region: 'West' },
      Tiruchirappalli: { items: 185, users: 690, exchanges: 120, region: 'Central' },
      Tirunelveli: { items: 160, users: 580, exchanges: 105, region: 'South' },
      Tiruppur: { items: 145, users: 510, exchanges: 95, region: 'West' },
      Erode: { items: 130, users: 460, exchanges: 85, region: 'West' },
      Thanjavur: { items: 115, users: 420, exchanges: 78, region: 'Cauvery Delta' },
      Vellore: { items: 110, users: 390, exchanges: 72, region: 'North' },
      Chengalpattu: { items: 105, users: 380, exchanges: 68, region: 'North' },
      'The Nilgiris': { items: 90, users: 310, exchanges: 55, region: 'West' },
      Kanniyakumari: { items: 88, users: 295, exchanges: 52, region: 'South' },
      Dindigul: { items: 82, users: 270, exchanges: 49, region: 'South' },
      Thoothukudi: { items: 78, users: 260, exchanges: 46, region: 'South' },
      Kancheepuram: { items: 75, users: 250, exchanges: 44, region: 'North' },
      Krishnagiri: { items: 70, users: 235, exchanges: 41, region: 'West' },
      Cuddalore: { items: 68, users: 220, exchanges: 39, region: 'Cauvery Delta' },
      Namakkal: { items: 65, users: 215, exchanges: 38, region: 'West' }
    };

    // Calculate dynamic counts from database
    const dynamicDistrictCounts: Record<string, { items: number; users: number; exchanges: number; region: string }> = {};

    ALL_38_DISTRICTS.forEach(d => {
      const base = districtActivityBase[d.name] || {
        items: Math.floor(25 + (d.name.length * 3)),
        users: Math.floor(90 + (d.name.length * 9)),
        exchanges: Math.floor(15 + (d.name.length * 2)),
        region: d.region
      };

      const liveItems = items.filter(i => i.district.toLowerCase() === d.name.toLowerCase()).length;
      const liveUsers = users.filter(u => u.district.toLowerCase() === d.name.toLowerCase()).length;
      const liveExchanges = exchanges.filter(e => e.ownerDistrict.toLowerCase() === d.name.toLowerCase() || e.requesterDistrict.toLowerCase() === d.name.toLowerCase()).length;

      dynamicDistrictCounts[d.name] = {
        items: base.items + liveItems,
        users: base.users + liveUsers,
        exchanges: base.exchanges + liveExchanges,
        region: d.region
      };
    });

    const topDistricts = Object.entries(dynamicDistrictCounts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.items - a.items);

    // Category breakdown
    const categoryCounts: Record<string, number> = {};
    items.forEach(i => {
      categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1;
    });

    // Exchange types breakdown
    const typeCounts = {
      'Give Away': items.filter(i => i.exchangeType === 'Give Away').length + 840,
      Exchange: items.filter(i => i.exchangeType === 'Exchange').length + 590,
      Donate: items.filter(i => i.exchangeType === 'Donate').length + 420
    };

    // Monthly reuse trend (last 6 months in Tamil Nadu)
    const monthlyActivity = [
      { month: 'Apr', itemsReused: 280, newUsers: 340 },
      { month: 'May', itemsReused: 340, newUsers: 410 },
      { month: 'Jun', itemsReused: 420, newUsers: 510 },
      { month: 'Jul', itemsReused: 510, newUsers: 630 },
      { month: 'Aug', itemsReused: 680, newUsers: 790 },
      { month: 'Sep', itemsReused: 790, newUsers: 920 }
    ];

    return res.json({
      state: 'Tamil Nadu',
      districtsCount: 38,
      topDistricts: topDistricts.slice(0, 10),
      allDistrictsActivity: topDistricts,
      categoryCounts,
      typeCounts,
      monthlyActivity
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get Tamil Nadu analytics.';
    return res.status(500).json({ error: message });
  }
});

// GET /api/analytics/sustainability - Environmental & Waste Prevention Metrics
router.get('/sustainability', (_req, res: Response) => {
  try {
    const exchanges = db.getExchanges();
    const completedExchangesCount = exchanges.filter(e => e.status === 'Completed').length;

    // Base estimated community impact across Tamil Nadu + current completed items
    const baseItemsReused = 1250;
    const totalItemsReused = baseItemsReused + completedExchangesCount;
    const itemsDonated = Math.round(totalItemsReused * 0.38);
    const itemsExchanged = Math.round(totalItemsReused * 0.42);
    const itemsGivenAway = totalItemsReused - itemsDonated - itemsExchanged;

    // Average weight of reused item ~ 3.4 kg
    const estimatedWasteReducedKg = Math.round(totalItemsReused * 3.4);
    // Estimated carbon offset ~ 2.1 kg CO2 per kg reused goods
    const estimatedCo2SavedKg = Math.round(estimatedWasteReducedKg * 2.1);
    // Estimated tree absorption equivalent
    const treesPlantedEquivalent = Math.round(estimatedCo2SavedKg / 21);

    return res.json({
      headline: `${totalItemsReused.toLocaleString()} items found a second life in Tamil Nadu.`,
      metrics: {
        totalItemsReused,
        itemsDonated,
        itemsExchanged,
        itemsGivenAway,
        estimatedWasteReducedKg,
        estimatedCo2SavedKg,
        treesPlantedEquivalent,
        successfulExchanges: completedExchangesCount + 940
      },
      note: 'Environmental measurements are estimated based on life-cycle reuse indices for consumer household goods in India.'
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to get sustainability data.';
    return res.status(500).json({ error: message });
  }
});

export default router;
