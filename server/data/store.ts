import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, Item, RequestItem, ExchangeRecord, ChatMessage, NotificationItem, ReviewItem, ReportItem, SavedItemRecord } from '../../src/types';
import { validateLocationBackend, ALL_38_DISTRICTS } from '../utils/locationValidator.ts';
import { generateItemsForAll38Districts } from './allDistrictsSeed.ts';

interface DatabaseSchema {
  users: User[];
  items: Item[];
  requests: RequestItem[];
  exchanges: ExchangeRecord[];
  messages: ChatMessage[];
  notifications: NotificationItem[];
  reviews: ReviewItem[];
  reports: ReportItem[];
  savedItems: SavedItemRecord[];
}

const DB_DIR = path.resolve(process.cwd(), 'database');
const DB_FILE = path.join(DB_DIR, 'swapneat_db.json');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Global in-memory cache of the database
let dbData: DatabaseSchema = {
  users: [],
  items: [],
  requests: [],
  exchanges: [],
  messages: [],
  notifications: [],
  reviews: [],
  reports: [],
  savedItems: []
};

// Password hashes map: userId -> bcrypt hash
export const passwordHashMap = new Map<string, string>();

function saveToDisk() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist database to disk:', err);
  }
}

export function initDatabase() {
  // If file exists, load it
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      dbData = JSON.parse(content);
      console.log(`[Database] Loaded ${dbData.users?.length || 0} users, ${dbData.items?.length || 0} items from disk.`);

      // Ensure all 38 districts have listings available
      const districtSet = new Set((dbData.items || []).map(i => i.district.toLowerCase()));
      const missingDistricts = ALL_38_DISTRICTS.filter(d => !districtSet.has(d.name.toLowerCase()));

      if (!dbData.items || dbData.items.length < 50 || missingDistricts.length > 0) {
        console.log(`[Database] Populating authentic listings for all 38 Tamil Nadu districts (${missingDistricts.length} missing)...`);
        const all38Items = generateItemsForAll38Districts();
        const existingIds = new Set((dbData.items || []).map(i => i.id));
        const newItems = all38Items.filter(i => !existingIds.has(i.id));
        dbData.items = [...(dbData.items || []), ...newItems];
        saveToDisk();
      }
    } catch (e) {
      console.error('[Database] Failed to read db file, re-seeding...', e);
      seedDatabase();
      saveToDisk();
    }
  } else {
    seedDatabase();
    saveToDisk();
  }

  // Pre-seed password hashes for default accounts
  const salt = bcrypt.genSaltSync(10);
  const defaultHash = bcrypt.hashSync('password123', salt);
  dbData.users.forEach(u => {
    passwordHashMap.set(u.id, defaultHash);
  });
}

function seedDatabase() {
  const now = new Date().toISOString();
  const pastDay = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

  const users: User[] = [
    {
      id: 'usr_karthik',
      name: 'Karthik Subramanian',
      email: 'karthik@swapneat.in',
      phone: '9842100001',
      state: 'Tamil Nadu',
      district: 'Virudhunagar',
      city: 'Sivakasi',
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      rating: 4.9,
      ratingCount: 14,
      role: 'user',
      bio: 'Lifelong resident of Sivakasi. Passionate about zero-waste education and book exchanges.',
      createdAt: pastDay(60)
    },
    {
      id: 'usr_priya',
      name: 'Priya Soundar',
      email: 'priya@swapneat.in',
      phone: '9842100002',
      state: 'Tamil Nadu',
      district: 'Chennai',
      city: 'T. Nagar',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      rating: 4.8,
      ratingCount: 22,
      role: 'user',
      bio: 'Software engineer living in T. Nagar, Chennai. Big supporter of urban reuse and community giving.',
      createdAt: pastDay(45)
    },
    {
      id: 'usr_anand',
      name: 'Anand Natarajan',
      email: 'anand@swapneat.in',
      phone: '9842100003',
      state: 'Tamil Nadu',
      district: 'Coimbatore',
      city: 'Gandhipuram',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      rating: 5.0,
      ratingCount: 19,
      role: 'user',
      bio: 'Coimbatore green enthusiast. Electronics hobbyist and fitness lover.',
      createdAt: pastDay(30)
    },
    {
      id: 'usr_selvi',
      name: 'Selvi Ramasamy',
      email: 'selvi@swapneat.in',
      phone: '9842100004',
      state: 'Tamil Nadu',
      district: 'Madurai',
      city: 'Madurai City',
      profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
      rating: 4.7,
      ratingCount: 8,
      role: 'user',
      bio: 'College professor in Madurai. Dedicated to redistributing student textbooks and study furniture.',
      createdAt: pastDay(20)
    },
    {
      id: 'usr_admin',
      name: 'SwapNeat Tamil Nadu Admin',
      email: 'admin@swapneat.in',
      phone: '9842109999',
      state: 'Tamil Nadu',
      district: 'Chennai',
      city: 'Anna Nagar',
      profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
      rating: 5.0,
      ratingCount: 50,
      role: 'admin',
      bio: 'SwapNeat State Administration & Moderation Team. Protecting Tamil Nadu community circularity.',
      createdAt: pastDay(90)
    }
  ];

  const items: Item[] = [
    {
      id: 'item_1',
      title: 'Used Study Table – Solid Teak Wood with Drawer',
      description: 'Sturdy wooden student study desk in great condition. Has a smooth writing surface and sliding storage drawer. Perfect for school or college students in Sivakasi area.',
      category: 'Furniture',
      condition: 'Gently Used',
      images: [
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
      ],
      exchangeType: 'Give Away',
      state: 'Tamil Nadu',
      district: 'Virudhunagar',
      city: 'Sivakasi',
      approximateArea: 'Near Sivakasi Bus Stand & Coronation Colony',
      quantity: 1,
      ownerId: 'usr_karthik',
      ownerName: 'Karthik Subramanian',
      ownerRating: 4.9,
      ownerRatingCount: 14,
      status: 'active',
      views: 148,
      savesCount: 18,
      createdAt: pastDay(2)
    },
    {
      id: 'item_2',
      title: 'Engineering Books – Anna Univ CSE Semester 3 to 6',
      description: 'Complete set of authentic textbooks for Computer Science Engineering including Data Structures, Operating Systems, Computer Networks, and DBMS. All unmarked and clean.',
      category: 'Study Materials',
      condition: 'Good',
      images: [
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80'
      ],
      exchangeType: 'Donate',
      state: 'Tamil Nadu',
      district: 'Madurai',
      city: 'Madurai City',
      approximateArea: 'Near Goripalayam & Anna Bus Stand',
      quantity: 8,
      ownerId: 'usr_selvi',
      ownerName: 'Selvi Ramasamy',
      ownerRating: 4.7,
      ownerRatingCount: 8,
      status: 'active',
      views: 95,
      savesCount: 12,
      createdAt: pastDay(3)
    },
    {
      id: 'item_3',
      title: 'Hero Sprint 26T Mountain Gear Bicycle',
      description: 'Well-maintained geared bicycle with dual disc brakes, front suspension, and water bottle cage. Bought 8 months ago, serviced recently. Ready to exchange for fitness gear or sports equipment.',
      category: 'Sports Items',
      condition: 'Like New',
      images: [
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80'
      ],
      exchangeType: 'Exchange',
      state: 'Tamil Nadu',
      district: 'Coimbatore',
      city: 'Gandhipuram',
      approximateArea: 'Near Gandhipuram Central Bus Stand',
      quantity: 1,
      ownerId: 'usr_anand',
      ownerName: 'Anand Natarajan',
      ownerRating: 5.0,
      ownerRatingCount: 19,
      status: 'active',
      views: 210,
      savesCount: 31,
      createdAt: pastDay(1)
    },
    {
      id: 'item_4',
      title: 'Ergonomic Mesh Office Chair with Lumbar Support',
      description: 'High quality breathable mesh chair with adjustable height, tilt lock mechanism, and smooth rolling nylon casters. Clean and sanitized. Looking to exchange for bookshelf or desk lamp.',
      category: 'Furniture',
      condition: 'Good',
      images: [
        'https://images.unsplash.com/photo-1580481077195-c3a821a506cb?auto=format&fit=crop&w=800&q=80'
      ],
      exchangeType: 'Exchange',
      state: 'Tamil Nadu',
      district: 'Chennai',
      city: 'T. Nagar',
      approximateArea: 'Near Panagal Park, T. Nagar',
      quantity: 1,
      ownerId: 'usr_priya',
      ownerName: 'Priya Soundar',
      ownerRating: 4.8,
      ownerRatingCount: 22,
      status: 'active',
      views: 180,
      savesCount: 25,
      createdAt: pastDay(4)
    },
    {
      id: 'item_5',
      title: '10th & 12th Samacheer Kalvi School Books Bundle',
      description: 'Standard Tamil Nadu state board curriculum books including Mathematics, Science, Social Science, and English guides. Offering free for students in need in Salem district.',
      category: 'Books',
      condition: 'Good',
      images: [
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80'
      ],
      exchangeType: 'Donate',
      state: 'Tamil Nadu',
      district: 'Salem',
      city: 'Salem City',
      approximateArea: 'Near New Bus Stand, Salem',
      quantity: 6,
      ownerId: 'usr_karthik',
      ownerName: 'Karthik Subramanian',
      ownerRating: 4.9,
      ownerRatingCount: 14,
      status: 'active',
      views: 88,
      savesCount: 14,
      createdAt: pastDay(5)
    },
    {
      id: 'item_6',
      title: 'Preethi Zodiac Mixer Grinder with 3 Stainless Steel Jars',
      description: '750W heavy duty copper motor mixer grinder. Jars for wet chutney, dry spice grinding, and liquidizing. Completely working, upgraded to food processor.',
      category: 'Kitchen Items',
      condition: 'Good',
      images: [
        'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80'
      ],
      exchangeType: 'Give Away',
      state: 'Tamil Nadu',
      district: 'Tirunelveli',
      city: 'Tirunelveli Town',
      approximateArea: 'Near Nellai Junction & Town Arch',
      quantity: 1,
      ownerId: 'usr_selvi',
      ownerName: 'Selvi Ramasamy',
      ownerRating: 4.7,
      ownerRatingCount: 8,
      status: 'active',
      views: 130,
      savesCount: 19,
      createdAt: pastDay(6)
    },
    {
      id: 'item_7',
      title: 'Yonex Carbonex Badminton Racquet Set with Cover',
      description: 'Set of two genuine badminton racquets with newly strung gut and grip wrap. Comes with half tube of nylon shuttlecocks. Open for exchange with yoga mat or dumbbells.',
      category: 'Sports Items',
      condition: 'Like New',
      images: [
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'
      ],
      exchangeType: 'Exchange',
      state: 'Tamil Nadu',
      district: 'Tiruppur',
      city: 'Tiruppur City',
      approximateArea: 'Near Old Bus Stand & Avinashi Road',
      quantity: 2,
      ownerId: 'usr_anand',
      ownerName: 'Anand Natarajan',
      ownerRating: 5.0,
      ownerRatingCount: 19,
      status: 'active',
      views: 92,
      savesCount: 11,
      createdAt: pastDay(4)
    },
    {
      id: 'item_8',
      title: 'Solid Rosewood Dining Chairs (Pair)',
      description: 'Pair of handcrafted traditional dining chairs with cane woven backrest. Sturdy frame. Donating to any NGO or family setting up home.',
      category: 'Furniture',
      condition: 'Good',
      images: [
        'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80'
      ],
      exchangeType: 'Give Away',
      state: 'Tamil Nadu',
      district: 'Tiruchirappalli',
      city: 'Trichy Central',
      approximateArea: 'Near Central Bus Stand, Trichy',
      quantity: 2,
      ownerId: 'usr_priya',
      ownerName: 'Priya Soundar',
      ownerRating: 4.8,
      ownerRatingCount: 22,
      status: 'active',
      views: 115,
      savesCount: 16,
      createdAt: pastDay(3)
    },
    {
      id: 'item_9',
      title: 'Kids Wooden Building Blocks & Board Games Set',
      description: 'Non-toxic colorful wooden blocks set, Scrabble junior, and Snakes & Ladders in wooden box. Excellent for ages 4-10. Free giveaway to kids.',
      category: 'Toys',
      condition: 'Like New',
      images: [
        'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80'
      ],
      exchangeType: 'Give Away',
      state: 'Tamil Nadu',
      district: 'The Nilgiris',
      city: 'Udhagamandalam (Ooty)',
      approximateArea: 'Near Commercial Road & Botanical Garden',
      quantity: 1,
      ownerId: 'usr_anand',
      ownerName: 'Anand Natarajan',
      ownerRating: 5.0,
      ownerRatingCount: 19,
      status: 'active',
      views: 74,
      savesCount: 9,
      createdAt: pastDay(7)
    },
    {
      id: 'item_10',
      title: 'HP 24-inch Full HD IPS Computer Monitor',
      description: 'Slim bezel 1080p 75Hz display with HDMI and VGA ports. Excellent color accuracy for work from home or online learning. Want to exchange for Android tablet or wireless headphones.',
      category: 'Electronics',
      condition: 'Good',
      images: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'
      ],
      exchangeType: 'Exchange',
      state: 'Tamil Nadu',
      district: 'Chennai',
      city: 'Velachery',
      approximateArea: 'Near Velachery MRTS & Phoenix Marketcity',
      quantity: 1,
      ownerId: 'usr_priya',
      ownerName: 'Priya Soundar',
      ownerRating: 4.8,
      ownerRatingCount: 22,
      status: 'active',
      views: 260,
      savesCount: 42,
      createdAt: pastDay(1)
    },
    {
      id: 'item_11',
      title: 'Traditional Handcrafted Brass Kuthu Vilakku (Pair)',
      description: 'Two pure brass 5-tier traditional oil lamps (18 inches height). Pristine shine, ideal for temple trust or traditional community ceremonies.',
      category: 'Household Items',
      condition: 'Like New',
      images: [
        'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80'
      ],
      exchangeType: 'Donate',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      city: 'Kumbakonam',
      approximateArea: 'Near Mahamaham Tank, Kumbakonam',
      quantity: 2,
      ownerId: 'usr_karthik',
      ownerName: 'Karthik Subramanian',
      ownerRating: 4.9,
      ownerRatingCount: 14,
      status: 'active',
      views: 142,
      savesCount: 27,
      createdAt: pastDay(8)
    },
    {
      id: 'item_12',
      title: 'Philips ComfortTouch Garment Steamer',
      description: 'Vertical fabric steamer with 1.8L detachable water tank and hanger accessory. Great for silk sarees and formal shirts. Fully functional.',
      category: 'Household Items',
      condition: 'Gently Used',
      images: [
        'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80'
      ],
      exchangeType: 'Exchange',
      state: 'Tamil Nadu',
      district: 'Erode',
      city: 'Erode Central',
      approximateArea: 'Near Brough Road, Erode',
      quantity: 1,
      ownerId: 'usr_anand',
      ownerName: 'Anand Natarajan',
      ownerRating: 5.0,
      ownerRatingCount: 19,
      status: 'active',
      views: 110,
      savesCount: 15,
      createdAt: pastDay(6)
    },
    ...generateItemsForAll38Districts()
  ];

  const requests: RequestItem[] = [
    {
      id: 'req_1',
      itemId: 'item_1',
      itemTitle: 'Used Study Table – Solid Teak Wood with Drawer',
      itemImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      itemCategory: 'Furniture',
      itemDistrict: 'Virudhunagar',
      itemCity: 'Sivakasi',
      requesterId: 'usr_priya',
      requesterName: 'Priya Soundar',
      requesterPhone: '9842100002',
      requesterDistrict: 'Virudhunagar',
      requesterCity: 'Rajapalayam',
      ownerId: 'usr_karthik',
      ownerName: 'Karthik Subramanian',
      message: 'Hello! I need this study table for my younger cousin who is preparing for 10th board exams in Rajapalayam. Can collect this Saturday at Sivakasi bus stand.',
      exchangeType: 'Give Away',
      requestedDate: pastDay(1),
      status: 'Accepted',
      createdAt: pastDay(1)
    },
    {
      id: 'req_2',
      itemId: 'item_2',
      itemTitle: 'Engineering Books – Anna Univ CSE Semester 3 to 6',
      itemImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      itemCategory: 'Study Materials',
      itemDistrict: 'Madurai',
      itemCity: 'Madurai City',
      requesterId: 'usr_anand',
      requesterName: 'Anand Natarajan',
      requesterPhone: '9842100003',
      requesterDistrict: 'Madurai',
      requesterCity: 'Melur',
      ownerId: 'usr_selvi',
      ownerName: 'Selvi Ramasamy',
      message: 'Greetings Professor, I run a weekend study circle for engineering students in Melur. These Anna University books would be immensely helpful for them.',
      exchangeType: 'Donate',
      requestedDate: pastDay(2),
      status: 'Pending',
      createdAt: pastDay(2)
    }
  ];

  const exchanges: ExchangeRecord[] = [
    {
      id: 'exc_1',
      requestId: 'req_1',
      itemId: 'item_1',
      itemTitle: 'Used Study Table – Solid Teak Wood with Drawer',
      itemImage: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      requesterId: 'usr_priya',
      requesterName: 'Priya Soundar',
      requesterDistrict: 'Virudhunagar',
      requesterCity: 'Rajapalayam',
      ownerId: 'usr_karthik',
      ownerName: 'Karthik Subramanian',
      ownerDistrict: 'Virudhunagar',
      ownerCity: 'Sivakasi',
      exchangeType: 'Give Away',
      meetingNotes: 'Meeting arranged near Sivakasi Main Bus Stand auto stand, Saturday 11:00 AM.',
      status: 'Confirmed',
      createdAt: pastDay(1)
    },
    {
      id: 'exc_completed_1',
      requestId: 'req_completed_seed',
      itemId: 'item_demo_past',
      itemTitle: 'Pre-owned Casio Scientific Calculator fx-991EX',
      itemImage: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
      requesterId: 'usr_karthik',
      requesterName: 'Karthik Subramanian',
      requesterDistrict: 'Virudhunagar',
      requesterCity: 'Sivakasi',
      ownerId: 'usr_selvi',
      ownerName: 'Selvi Ramasamy',
      ownerDistrict: 'Madurai',
      ownerCity: 'Madurai City',
      exchangeType: 'Give Away',
      meetingNotes: 'Exchanged successfully at Mattuthavani Bus Stand, Madurai.',
      status: 'Completed',
      createdAt: pastDay(15),
      completedAt: pastDay(14)
    }
  ];

  const messages: ChatMessage[] = [
    {
      id: 'msg_1',
      requestId: 'req_1',
      senderId: 'usr_priya',
      senderName: 'Priya Soundar',
      recipientId: 'usr_karthik',
      content: 'Vanakkam Karthik! Is the study table still available for pickup this weekend?',
      createdAt: pastDay(1),
      isRead: true
    },
    {
      id: 'msg_2',
      requestId: 'req_1',
      senderId: 'usr_karthik',
      senderName: 'Karthik Subramanian',
      recipientId: 'usr_priya',
      content: 'Vanakkam Priya! Yes, absolutely. Saturday morning around 11 AM near Sivakasi Main Bus stand works well. It will easily fit in an auto.',
      createdAt: pastDay(1),
      isRead: true
    },
    {
      id: 'msg_3',
      requestId: 'req_1',
      senderId: 'usr_priya',
      senderName: 'Priya Soundar',
      recipientId: 'usr_karthik',
      content: 'Perfect! See you there on Saturday. Thank you so much for giving this away for my cousin.',
      createdAt: pastDay(1),
      isRead: true
    }
  ];

  const reviews: ReviewItem[] = [
    {
      id: 'rev_1',
      exchangeId: 'exc_completed_1',
      itemId: 'item_demo_past',
      itemTitle: 'Pre-owned Casio Scientific Calculator fx-991EX',
      reviewerId: 'usr_karthik',
      reviewerName: 'Karthik Subramanian',
      revieweeId: 'usr_selvi',
      rating: 5,
      comment: 'Very polite and kind professor. The calculator was in top condition. Truly wonderful experience reusing in Tamil Nadu!',
      createdAt: pastDay(14)
    },
    {
      id: 'rev_2',
      exchangeId: 'exc_completed_1',
      itemId: 'item_demo_past',
      itemTitle: 'Pre-owned Casio Scientific Calculator fx-991EX',
      reviewerId: 'usr_selvi',
      reviewerName: 'Selvi Ramasamy',
      revieweeId: 'usr_karthik',
      rating: 5,
      comment: 'Punctual and very respectful. Happy that this calculator is helping another student instead of sitting in a drawer.',
      createdAt: pastDay(14)
    }
  ];

  const notifications: NotificationItem[] = [
    {
      id: 'notif_1',
      userId: 'usr_karthik',
      title: 'New Request Received',
      message: 'Priya Soundar sent a request for your "Used Study Table – Solid Teak Wood with Drawer" in Virudhunagar.',
      type: 'request_new',
      link: '/dashboard?tab=requests-received',
      isRead: true,
      createdAt: pastDay(1)
    },
    {
      id: 'notif_2',
      userId: 'usr_priya',
      title: 'Request Accepted!',
      message: 'Karthik Subramanian accepted your request for "Used Study Table – Solid Teak Wood with Drawer". Chat now to finalize pickup.',
      type: 'request_accepted',
      link: '/dashboard?tab=exchanges',
      isRead: false,
      createdAt: pastDay(1)
    }
  ];

  const reports: ReportItem[] = [
    {
      id: 'rep_1',
      itemId: 'item_10',
      itemTitle: 'HP 24-inch Full HD IPS Computer Monitor',
      reportedByUserId: 'usr_selvi',
      reportedByName: 'Selvi Ramasamy',
      reason: 'Wrong information',
      details: 'Wanted to verify if power adapter is included or only monitor screen.',
      status: 'Reviewed',
      createdAt: pastDay(2)
    }
  ];

  const savedItems: SavedItemRecord[] = [
    {
      id: 'sav_1',
      userId: 'usr_karthik',
      itemId: 'item_3',
      savedAt: pastDay(2)
    },
    {
      id: 'sav_2',
      userId: 'usr_priya',
      itemId: 'item_1',
      savedAt: pastDay(1)
    }
  ];

  dbData = {
    users,
    items,
    requests,
    exchanges,
    messages,
    notifications,
    reviews,
    reports,
    savedItems
  };
}

// Database helper functions enforcing Tamil Nadu rules
export const db = {
  // --- USERS ---
  getUsers: () => dbData.users,
  getUserById: (id: string) => dbData.users.find(u => u.id === id),
  getUserByEmail: (email: string) => dbData.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  getUserByPhone: (phone: string) => dbData.users.find(u => u.phone === phone),
  
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'rating' | 'ratingCount' | 'state'> & { password?: string; state?: string }) => {
    // ENFORCE STATE === "Tamil Nadu"
    const validation = validateLocationBackend(userData.state || 'Tamil Nadu', userData.district, userData.city);
    if (!validation.valid) {
      throw new Error(validation.error || 'Registration failed: Location must be within Tamil Nadu.');
    }

    const id = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newUser: User = {
      id,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      phone: userData.phone.trim(),
      state: 'Tamil Nadu', // Strictly forced
      district: userData.district.trim(),
      city: userData.city.trim(),
      profileImage: userData.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userData.name)}`,
      rating: 5.0,
      ratingCount: 0,
      role: userData.role || 'user',
      bio: userData.bio || '',
      createdAt: new Date().toISOString()
    };

    if (userData.password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(userData.password, salt);
      passwordHashMap.set(id, hash);
    }

    dbData.users.push(newUser);
    saveToDisk();
    return newUser;
  },

  updateUser: (id: string, updates: Partial<User>) => {
    const user = dbData.users.find(u => u.id === id);
    if (!user) return null;

    if (updates.district || updates.city) {
      const district = updates.district || user.district;
      const city = updates.city || user.city;
      const val = validateLocationBackend('Tamil Nadu', district, city);
      if (!val.valid) {
        throw new Error(val.error);
      }
      user.district = district;
      user.city = city;
    }

    if (updates.name) user.name = updates.name;
    if (updates.phone) user.phone = updates.phone;
    if (updates.bio !== undefined) user.bio = updates.bio;
    if (updates.profileImage) user.profileImage = updates.profileImage;

    saveToDisk();
    return user;
  },

  updateUserRating: (userId: string, newRating: number) => {
    const user = dbData.users.find(u => u.id === userId);
    if (!user) return;
    const total = user.rating * user.ratingCount + newRating;
    user.ratingCount += 1;
    user.rating = Math.round((total / user.ratingCount) * 10) / 10;
    saveToDisk();
  },

  // --- ITEMS ---
  getItems: () => dbData.items,
  getItemById: (id: string) => dbData.items.find(i => i.id === id),
  
  createItem: (itemData: Omit<Item, 'id' | 'createdAt' | 'views' | 'savesCount' | 'state'> & { state?: string }) => {
    // ENFORCE STRICT TAMIL NADU RULE
    const validation = validateLocationBackend(itemData.state || 'Tamil Nadu', itemData.district, itemData.city);
    if (!validation.valid) {
      throw new Error(validation.error || 'Posting failed: Items can only be listed inside Tamil Nadu.');
    }

    const id = 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newItem: Item = {
      ...itemData,
      id,
      state: 'Tamil Nadu', // Strictly enforced
      views: 0,
      savesCount: 0,
      createdAt: new Date().toISOString()
    };

    dbData.items.unshift(newItem);
    saveToDisk();
    return newItem;
  },

  updateItem: (id: string, updates: Partial<Item>) => {
    const item = dbData.items.find(i => i.id === id);
    if (!item) return null;

    if (updates.district || updates.city) {
      const dist = updates.district || item.district;
      const city = updates.city || item.city;
      const val = validateLocationBackend('Tamil Nadu', dist, city);
      if (!val.valid) throw new Error(val.error);
      item.district = dist;
      item.city = city;
    }

    Object.assign(item, updates);
    // Never allow changing state from Tamil Nadu
    item.state = 'Tamil Nadu';
    saveToDisk();
    return item;
  },

  deleteItem: (id: string) => {
    const idx = dbData.items.findIndex(i => i.id === id);
    if (idx !== -1) {
      dbData.items.splice(idx, 1);
      saveToDisk();
      return true;
    }
    return false;
  },

  incrementItemViews: (id: string) => {
    const item = dbData.items.find(i => i.id === id);
    if (item) {
      item.views = (item.views || 0) + 1;
      saveToDisk();
    }
  },

  // --- REQUESTS ---
  getRequests: () => dbData.requests,
  getRequestById: (id: string) => dbData.requests.find(r => r.id === id),
  createRequest: (reqData: Omit<RequestItem, 'id' | 'createdAt' | 'status'>) => {
    const id = 'req_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newReq: RequestItem = {
      ...reqData,
      id,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    dbData.requests.unshift(newReq);

    // Auto create notification for item owner
    db.createNotification({
      userId: newReq.ownerId,
      title: 'New Item Request',
      message: `${newReq.requesterName} from ${newReq.requesterCity}, ${newReq.requesterDistrict} requested "${newReq.itemTitle}".`,
      type: 'request_new',
      link: '/dashboard?tab=requests-received'
    });

    saveToDisk();
    return newReq;
  },

  updateRequestStatus: (id: string, status: RequestItem['status']) => {
    const req = dbData.requests.find(r => r.id === id);
    if (!req) return null;
    req.status = status;

    // Send notification to requester
    if (status === 'Accepted') {
      db.createNotification({
        userId: req.requesterId,
        title: 'Request Accepted!',
        message: `${req.ownerName} accepted your request for "${req.itemTitle}". Go to Exchanges to chat and arrange pickup.`,
        type: 'request_accepted',
        link: '/dashboard?tab=exchanges'
      });

      // Auto-create or verify Exchange record
      const existing = dbData.exchanges.find(e => e.requestId === req.id);
      if (!existing) {
        db.createExchange({
          requestId: req.id,
          itemId: req.itemId,
          itemTitle: req.itemTitle,
          itemImage: req.itemImage,
          requesterId: req.requesterId,
          requesterName: req.requesterName,
          requesterDistrict: req.requesterDistrict,
          requesterCity: req.requesterCity,
          ownerId: req.ownerId,
          ownerName: req.ownerName,
          ownerDistrict: req.itemDistrict,
          ownerCity: req.itemCity,
          exchangeType: req.exchangeType,
          meetingNotes: `Safe meetup in ${req.itemCity}, ${req.itemDistrict}, Tamil Nadu.`
        });
      }
    } else if (status === 'Rejected') {
      db.createNotification({
        userId: req.requesterId,
        title: 'Request Update',
        message: `Your request for "${req.itemTitle}" was not accepted. Browse other listings in your district!`,
        type: 'request_rejected',
        link: '/browse'
      });
    }

    saveToDisk();
    return req;
  },

  // --- EXCHANGES ---
  getExchanges: () => dbData.exchanges,
  getExchangeById: (id: string) => dbData.exchanges.find(e => e.id === id),
  createExchange: (exData: Omit<ExchangeRecord, 'id' | 'createdAt' | 'status'>) => {
    const id = 'exc_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newExc: ExchangeRecord = {
      ...exData,
      id,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
    dbData.exchanges.unshift(newExc);

    // Update item status to 'in_negotiation'
    const item = dbData.items.find(i => i.id === exData.itemId);
    if (item && item.status === 'active') {
      item.status = 'in_negotiation';
    }

    saveToDisk();
    return newExc;
  },

  updateExchangeStatus: (id: string, status: ExchangeRecord['status']) => {
    const exc = dbData.exchanges.find(e => e.id === id);
    if (!exc) return null;
    exc.status = status;
    if (status === 'Completed') {
      exc.completedAt = new Date().toISOString();

      // Update item to 'completed'
      const item = dbData.items.find(i => i.id === exc.itemId);
      if (item) item.status = 'completed';

      // Send completion notifications prompting review
      db.createNotification({
        userId: exc.ownerId,
        title: 'Exchange Completed! 🎉',
        message: `Your exchange with ${exc.requesterName} is marked complete. Please share your rating!`,
        type: 'exchange_completed',
        link: '/dashboard?tab=exchanges'
      });
      db.createNotification({
        userId: exc.requesterId,
        title: 'Exchange Completed! 🎉',
        message: `Your exchange with ${exc.ownerName} is marked complete. Please share your rating!`,
        type: 'exchange_completed',
        link: '/dashboard?tab=exchanges'
      });
    }

    saveToDisk();
    return exc;
  },

  // --- MESSAGES ---
  getMessagesByThread: (threadId: string) => {
    return dbData.messages.filter(m => m.requestId === threadId || m.exchangeId === threadId);
  },
  createMessage: (msgData: Omit<ChatMessage, 'id' | 'createdAt' | 'isRead'>) => {
    const id = 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newMsg: ChatMessage = {
      ...msgData,
      id,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    dbData.messages.push(newMsg);

    // Notify recipient
    db.createNotification({
      userId: newMsg.recipientId,
      title: `New message from ${newMsg.senderName}`,
      message: newMsg.content.length > 60 ? newMsg.content.substring(0, 57) + '...' : newMsg.content,
      type: 'message',
      link: '/dashboard?tab=exchanges'
    });

    saveToDisk();
    return newMsg;
  },

  // --- NOTIFICATIONS ---
  getNotificationsByUser: (userId: string) => {
    return dbData.notifications.filter(n => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  createNotification: (notifData: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead'>) => {
    const id = 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newNotif: NotificationItem = {
      ...notifData,
      id,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    dbData.notifications.unshift(newNotif);
    // Keep max 100 notifications per user
    saveToDisk();
    return newNotif;
  },
  markNotificationRead: (id: string) => {
    const notif = dbData.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      saveToDisk();
    }
  },
  markAllNotificationsRead: (userId: string) => {
    dbData.notifications.filter(n => n.userId === userId).forEach(n => { n.isRead = true; });
    saveToDisk();
  },

  // --- REVIEWS ---
  getReviewsByReviewee: (revieweeId: string) => {
    return dbData.reviews.filter(r => r.revieweeId === revieweeId);
  },
  createReview: (revData: Omit<ReviewItem, 'id' | 'createdAt'>) => {
    const id = 'rev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newRev: ReviewItem = {
      ...revData,
      id,
      createdAt: new Date().toISOString()
    };
    dbData.reviews.unshift(newRev);

    // Recalculate reviewee rating
    db.updateUserRating(newRev.revieweeId, newRev.rating);

    saveToDisk();
    return newRev;
  },

  // --- REPORTS ---
  getReports: () => dbData.reports,
  createReport: (repData: Omit<ReportItem, 'id' | 'createdAt' | 'status'>) => {
    const id = 'rep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newRep: ReportItem = {
      ...repData,
      id,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    dbData.reports.unshift(newRep);
    saveToDisk();
    return newRep;
  },
  updateReportStatus: (id: string, status: ReportItem['status']) => {
    const rep = dbData.reports.find(r => r.id === id);
    if (rep) {
      rep.status = status;
      saveToDisk();
    }
    return rep;
  },

  // --- SAVED ITEMS ---
  getSavedItemsByUser: (userId: string) => {
    return dbData.savedItems.filter(s => s.userId === userId);
  },
  toggleSaveItem: (userId: string, itemId: string) => {
    const idx = dbData.savedItems.findIndex(s => s.userId === userId && s.itemId === itemId);
    const item = dbData.items.find(i => i.id === itemId);

    if (idx !== -1) {
      dbData.savedItems.splice(idx, 1);
      if (item && item.savesCount > 0) item.savesCount -= 1;
      saveToDisk();
      return { saved: false };
    } else {
      const id = 'sav_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
      dbData.savedItems.push({
        id,
        userId,
        itemId,
        savedAt: new Date().toISOString()
      });
      if (item) item.savesCount = (item.savesCount || 0) + 1;
      saveToDisk();
      return { saved: true };
    }
  }
};
