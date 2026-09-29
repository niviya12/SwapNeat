import { Item } from '../../src/types';
import { ALL_38_DISTRICTS } from '../../src/data/tamilNaduLocations.ts';

// Comprehensive authentic items catalog for all 38 districts of Tamil Nadu
export function generateItemsForAll38Districts(): Item[] {
  const pastDay = (days: number) => new Date(Date.now() - days * 86400000).toISOString();

  const districtSpecificData: Record<string, Array<{
    title: string;
    description: string;
    category: string;
    condition: 'Like New' | 'Gently Used' | 'Good' | 'Fair';
    exchangeType: 'Give Away' | 'Exchange' | 'Donate';
    cityIndex: number;
    area: string;
    image: string;
    quantity: number;
  }>> = {
    Ariyalur: [
      {
        title: 'College Physics & Chemistry Reference Textbooks',
        description: 'Semester 1 to 4 textbooks and practical guides. Completely intact and well preserved. Giving away to any college student in Ariyalur district.',
        category: 'Study Materials',
        condition: 'Good',
        exchangeType: 'Give Away',
        cityIndex: 0,
        area: 'Near Ariyalur Bus Stand & Railway Feeder Road',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
        quantity: 5
      },
      {
        title: 'Heavy Duty Mechanical Hydraulic Jack (2 Ton)',
        description: 'Trolley jack with long handle, ideal for small car maintenance or agricultural equipment. Working condition, exchanging for battery charger or tools.',
        category: 'Household Items',
        condition: 'Gently Used',
        exchangeType: 'Exchange',
        cityIndex: 1,
        area: 'Near Jayankondam Four Roads Junction',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Solid Teak Wood Student Study Desk',
        description: 'Sturdy single-seater desk with book rack underneath. Very solid construction.',
        category: 'Furniture',
        condition: 'Good',
        exchangeType: 'Donate',
        cityIndex: 2,
        area: 'Near Sendurai Panchayat Office',
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Chengalpattu: [
      {
        title: 'Ergonomic Mesh Swivel Chair with Headrest',
        description: 'High back office chair with adjustable armrests and smooth castor wheels. Perfect for work from home or online studies in Chengalpattu area.',
        category: 'Furniture',
        condition: 'Like New',
        exchangeType: 'Exchange',
        cityIndex: 1,
        area: 'Near Tambaram South Sanatorium & Bus Stand',
        image: 'https://images.unsplash.com/photo-1580481077195-c3a821a506cb?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Hero Sprint 20T Kids Bicycle with Training Wheels',
        description: 'Bright red kids bicycle with front basket, bell, and detachable side support wheels. Suitable for ages 5-9. Free giveaway to a good family.',
        category: 'Sports Items',
        condition: 'Gently Used',
        exchangeType: 'Give Away',
        cityIndex: 2,
        area: 'Near Maraimalai Nagar Railway Station',
        image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Mahabalipuram Handcrafted Soapstone Art Coasters',
        description: 'Set of 6 handcrafted stone carved coasters made by local artisans. Decorative and heat resistant.',
        category: 'Household Items',
        condition: 'Like New',
        exchangeType: 'Donate',
        cityIndex: 3,
        area: 'Near Shore Temple Road, Mahabalipuram',
        image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80',
        quantity: 6
      }
    ],
    Chennai: [
      {
        title: 'HP 24-inch Full HD IPS Computer Monitor',
        description: 'Slim bezel 1080p 75Hz display with HDMI and VGA ports. Great color accuracy for office work and coding.',
        category: 'Electronics',
        condition: 'Good',
        exchangeType: 'Exchange',
        cityIndex: 2,
        area: 'Near Velachery MRTS & Phoenix Marketcity',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Ergonomic Mesh Office Chair with Lumbar Support',
        description: 'Breathable mesh chair with pneumatic height adjustment. Fully sanitized.',
        category: 'Furniture',
        condition: 'Good',
        exchangeType: 'Exchange',
        cityIndex: 0,
        area: 'Near Panagal Park, T. Nagar',
        image: 'https://images.unsplash.com/photo-1580481077195-c3a821a506cb?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Acoustic Guitar with Padded Gig Bag & Tuner',
        description: 'Yamaha F310 acoustic guitar in clean rosewood finish. Barely played, new strings installed.',
        category: 'Other',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 4,
        area: 'Near Mylapore Kapaleeshwarar Temple Tank',
        image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'UPSC Civil Services Preparation Books & Atlas',
        description: 'Comprehensive set including NCERT summaries, Laxmikanth Polity, and Oxford Student Atlas. Unmarked.',
        category: 'Study Materials',
        condition: 'Like New',
        exchangeType: 'Donate',
        cityIndex: 1,
        area: 'Near Anna Nagar Tower Park & Metro Station',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
        quantity: 8
      }
    ],
    Coimbatore: [
      {
        title: 'Hero Sprint 26T Mountain Gear Bicycle',
        description: '21-speed geared bicycle with dual disc brakes, front shock absorbers, and water bottle cage. Maintained regularly.',
        category: 'Sports Items',
        condition: 'Like New',
        exchangeType: 'Exchange',
        cityIndex: 0,
        area: 'Near Gandhipuram Central Bus Stand',
        image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Hexagonal Rubber Dumbbells Set (5kg + 7.5kg)',
        description: 'Solid cast iron dumbbells with rubber casing and chrome contoured grips. Open for exchange with yoga gear.',
        category: 'Sports Items',
        condition: 'Like New',
        exchangeType: 'Exchange',
        cityIndex: 2,
        area: 'Near Peelamedu PSG Tech & Fun Mall',
        image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80',
        quantity: 4
      },
      {
        title: 'Stainless Steel Wet Grinder with Atta Kneader Attachment',
        description: '2-litre tabletop wet grinder with tilting drum and stone rollers. Fully working, upgraded to modern mixer.',
        category: 'Kitchen Items',
        condition: 'Good',
        exchangeType: 'Give Away',
        cityIndex: 1,
        area: 'Near RS Puram Post Office & DB Road',
        image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Cuddalore: [
      {
        title: 'Stainless Steel Cooking Vessels & Idli Cooker Set',
        description: 'Heavy gauge stainless steel idli steamer (16 idlis) and two saucepans with lids. Clean and undamaged.',
        category: 'Kitchen Items',
        condition: 'Gently Used',
        exchangeType: 'Give Away',
        cityIndex: 1,
        area: 'Near Chidambaram Natarajar Temple East Car Street',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        quantity: 3
      },
      {
        title: 'Crompton High-Speed 400mm Table Fan',
        description: '3-speed oscillating table fan with wide aerodynamic blades. Perfect for summer breeze.',
        category: 'Household Items',
        condition: 'Good',
        exchangeType: 'Exchange',
        cityIndex: 0,
        area: 'Near Cuddalore Old Town Bus Stand',
        image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Mining & Mechanical Engineering Textbooks',
        description: 'Neyveli training institute reference books on thermodynamics, strength of materials, and CAD design.',
        category: 'Books',
        condition: 'Good',
        exchangeType: 'Donate',
        cityIndex: 4,
        area: 'Near Neyveli Township Block 19',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
        quantity: 4
      }
    ],
    Dharmapuri: [
      {
        title: 'Garden Hand Cultivator & Pruning Shears Tool Set',
        description: 'Ergonomic hand trowel, weeder, and heavy duty tree branch bypass shears. Ideal for terrace gardening.',
        category: 'Household Items',
        condition: 'Good',
        exchangeType: 'Exchange',
        cityIndex: 0,
        area: 'Near Dharmapuri Collectorate & Four Roads',
        image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
        quantity: 3
      },
      {
        title: '10th Standard Samacheer Kalvi Guide Bundle (All Subjects)',
        description: 'Sura guide set for Tamil, English, Maths, Science, and Social Science. Free for needy students in Dharmapuri.',
        category: 'Study Materials',
        condition: 'Like New',
        exchangeType: 'Donate',
        cityIndex: 1,
        area: 'Near Harur Town Bus Stand',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
        quantity: 5
      }
    ],
    Dindigul: [
      {
        title: 'Antique Brass Lock Collector Piece with Dual Keys',
        description: 'Handcrafted traditional Dindigul lever lock. Heavy authentic brass mechanism, functions smoothly.',
        category: 'Household Items',
        condition: 'Good',
        exchangeType: 'Exchange',
        cityIndex: 0,
        area: 'Near Dindigul Clock Tower & Rock Fort Road',
        image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Pure Wool Handloom Blankets from Kodaikanal (Pair)',
        description: 'Warm thick woolen blankets, fresh and sanitized. Donating to students or travelers in need of winter warmth.',
        category: 'Clothes',
        condition: 'Like New',
        exchangeType: 'Donate',
        cityIndex: 2,
        area: 'Near Kodaikanal Lake & Bryant Park',
        image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80',
        quantity: 2
      },
      {
        title: 'Palani Temple Style Bronze Hand Bell with Nandi Finial',
        description: 'Resonant bell used for daily home prayers. Clean and polished bronze casting.',
        category: 'Household Items',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 1,
        area: 'Near Palani Adivaram & Giri Veedhi',
        image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Erode: [
      {
        title: 'Philips ComfortTouch Garment Steamer 1600W',
        description: 'Upright fabric steamer with 1.8L water container and hanger pole. Excellent for formal garments and silk.',
        category: 'Household Items',
        condition: 'Gently Used',
        exchangeType: 'Exchange',
        cityIndex: 0,
        area: 'Near Brough Road & Erode Municipal Office',
        image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Bhavani Jamakkalam Handwoven Floor Carpets (Set of 2)',
        description: 'Traditional durable cotton flat-weave floor mats from Bhavani. Colorful striped pattern, great for yoga or living room.',
        category: 'Household Items',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 2,
        area: 'Near Bhavani Sangameshwarar Temple Entrance',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        quantity: 2
      },
      {
        title: 'Air Tight Ceramic Spice & Turmeric Storage Jars',
        description: 'Set of 4 airtight glazed ceramic containers with wooden lid seals.',
        category: 'Kitchen Items',
        condition: 'Good',
        exchangeType: 'Donate',
        cityIndex: 1,
        area: 'Near Gobichettipalayam Bus Stand',
        image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
        quantity: 4
      }
    ],
    Kallakurichi: [
      {
        title: 'Teak Finish 4-Tier Wooden Bookshelf / Display Rack',
        description: 'Freestanding open shelving unit with solid corner joints. Clean wood grain, perfect for student study rooms.',
        category: 'Furniture',
        condition: 'Good',
        exchangeType: 'Give Away',
        cityIndex: 0,
        area: 'Near Kallakurichi Main Road Four Corners',
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: '12th Standard Biology & Chemistry Question Bank Compilations',
        description: 'Past 10 years solved board examination papers for medical aspirants. Free donation to government school students.',
        category: 'Study Materials',
        condition: 'Like New',
        exchangeType: 'Donate',
        cityIndex: 4,
        area: 'Near Ulundurpet Toll Plaza & Bus Stand',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
        quantity: 3
      }
    ],
    Kancheepuram: [
      {
        title: 'Steel Folding Camping Bed / Cot with Padded Mattress',
        description: 'Space-saving collapsible metal cot with durable springs and folding mechanism. Suitable for guests or student dorms.',
        category: 'Furniture',
        condition: 'Good',
        exchangeType: 'Exchange',
        cityIndex: 0,
        area: 'Near Kancheepuram Bus Terminal & Ekambareswarar Temple',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Electronics Soldering Station & Wire Stripper Kit',
        description: 'Temperature controlled 60W soldering iron, desoldering pump, tweezers, and stand. Barely used in engineering projects.',
        category: 'Electronics',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 1,
        area: 'Near Sriperumbudur Rajiv Gandhi Memorial Highway',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Karur: [
      {
        title: 'Handloom Cotton Mosquito Net (King Size Bed Frame)',
        description: 'Breathable fine mesh cotton bed canopy with brass tie rings. Kept clean and folded in original pouch.',
        category: 'Household Items',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 0,
        area: 'Near Karur Central Bus Stand & Kovai Road',
        image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Traditional Pure Brass Water Kudam (Pot)',
        description: 'Authentic hammered brass water container (12L capacity). Holds cool water naturally, ideal for pooja or home.',
        category: 'Kitchen Items',
        condition: 'Good',
        exchangeType: 'Donate',
        cityIndex: 1,
        area: 'Near Kulithalai Cauvery River Bridge',
        image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Krishnagiri: [
      {
        title: 'Aluminum Laptop Riser Stand & Silent Wireless Mouse',
        description: 'Adjustable folding laptop desk riser for 13 to 17 inch laptops. Ergonomic setup for remote work in Hosur/Krishnagiri.',
        category: 'Electronics',
        condition: 'Like New',
        exchangeType: 'Exchange',
        cityIndex: 1,
        area: 'Near Hosur Ring Road & IT Hub',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Waterproof Camping Tent for 2 Persons with Ground Sheet',
        description: 'Lightweight dome tent with dual fiberglass shock-corded poles and carry bag. Great for weekend treks.',
        category: 'Sports Items',
        condition: 'Gently Used',
        exchangeType: 'Give Away',
        cityIndex: 0,
        area: 'Near Krishnagiri Roundana & Old Bus Stand',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Madurai: [
      {
        title: 'Engineering Books – Anna Univ CSE Semester 3 to 6',
        description: 'Standard curriculum textbooks including Data Structures, OS, and Computer Networks. Complete unmarked set.',
        category: 'Study Materials',
        condition: 'Good',
        exchangeType: 'Donate',
        cityIndex: 0,
        area: 'Near Goripalayam & Anna Bus Stand, Madurai',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
        quantity: 8
      },
      {
        title: 'Casio fx-991EX Classwiz Scientific Calculator',
        description: 'Solar & battery dual power calculator with high resolution LCD screen. Essential for college engineering.',
        category: 'Study Materials',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 3,
        area: 'Near Melur Main Bazaar & Taluk Office',
        image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Madurai Traditional Sungudi Cotton Saree Fabric Length',
        description: 'Hand-tied and dyed authentic cotton fabric length. Vibrant border, ideal for traditional apparel or decor.',
        category: 'Clothes',
        condition: 'Like New',
        exchangeType: 'Exchange',
        cityIndex: 2,
        area: 'Near KK Nagar Arch & Apollo Hospital Road',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        quantity: 2
      }
    ],
    Mayiladuthurai: [
      {
        title: 'Carnatic Music Bamboo Flutes (G and C Pitch Pair)',
        description: 'Finely tuned 8-hole classical bamboo flutes with protective hard case. Donating to passionate young music learners.',
        category: 'Other',
        condition: 'Like New',
        exchangeType: 'Donate',
        cityIndex: 0,
        area: 'Near Mayiladuthurai Mayuranathar Temple Sannathi',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
        quantity: 2
      },
      {
        title: 'Traditional Brass Kumkum & Sandalwood Paste Cup (Pair)',
        description: 'Carved temple style pooja brass artifacts with peacock lid tops.',
        category: 'Household Items',
        condition: 'Good',
        exchangeType: 'Give Away',
        cityIndex: 1,
        area: 'Near Sirkazhi Bus Stand & Old Hospital Road',
        image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80',
        quantity: 2
      }
    ],
    Nagapattinam: [
      {
        title: 'Velankanni Souvenir Brass Wall Clock & Rosary Plate',
        description: 'Decorative brass chiming quartz clock in perfect working order. Donating to a welcoming household.',
        category: 'Household Items',
        condition: 'Good',
        exchangeType: 'Give Away',
        cityIndex: 1,
        area: 'Near Velankanni Shrine Basilica Entrance Road',
        image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Tricycle with Push Handle & Canopy for Toddlers',
        description: 'Safe sturdy 3-wheel cycle for babies aged 18 months to 4 years. Retractable shade canopy and bell.',
        category: 'Toys',
        condition: 'Like New',
        exchangeType: 'Exchange',
        cityIndex: 0,
        area: 'Near Nagapattinam Beach Road & Collectorate',
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Kanniyakumari: [
      {
        title: 'Handcrafted Coconut Shell Teacup & Saucer Set (4 Cups)',
        description: 'Polished eco-friendly natural coconut shell drinkware. Coated with organic beeswax, safe for hot beverages.',
        category: 'Kitchen Items',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 0,
        area: 'Near Nagercoil Vadasery Bus Stand & Tower',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        quantity: 4
      },
      {
        title: 'Seashell Mosaic Table Lamp with Warm LED Bulb',
        description: 'Ornamental coastal night lamp handcrafted in Cape Comorin. Beautiful ambient light for bedrooms.',
        category: 'Household Items',
        condition: 'Like New',
        exchangeType: 'Donate',
        cityIndex: 1,
        area: 'Near Kanniyakumari Sunset View Point & Beach',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Namakkal: [
      {
        title: 'Kolli Hills 45L Waterproof Trekking Rucksack Backpack',
        description: 'High capacity nylon backpack with waist harness, rain cover, and trekking pole loops. Used once for hiking.',
        category: 'Sports Items',
        condition: 'Like New',
        exchangeType: 'Exchange',
        cityIndex: 4,
        area: 'Near Kolli Hills Semmedu Main Junction',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Tiruchengode Handloom Cotton Bath Towels (Pack of 3)',
        description: 'Unused pure cotton honeycomb weave towels. High absorbency and quick drying.',
        category: 'Household Items',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 1,
        area: 'Near Tiruchengode Malai Kovil Footsteps',
        image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80',
        quantity: 3
      }
    ],
    Perambalur: [
      {
        title: 'Kids Wooden Chalkboard & Whiteboard Dual-Sided Easel',
        description: 'Standing wooden art easel with paper roll holder and magnetic numbers. Great for pre-school learning.',
        category: 'Toys',
        condition: 'Good',
        exchangeType: 'Give Away',
        cityIndex: 0,
        area: 'Near Perambalur New Bus Stand & Court Road',
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Inverter Battery Trolley Stand with Wheels',
        description: 'Heavy duty molded polymer trolley cabinet for home inverter and tubular battery. Smooth rolling.',
        category: 'Household Items',
        condition: 'Good',
        exchangeType: 'Donate',
        cityIndex: 1,
        area: 'Near Veppanthattai Taluk Office',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Pudukottai: [
      {
        title: 'Chettinad Carved Teakwood Dressing Mirror Frame',
        description: 'Traditional solid teak wood mirror with ornate pillared crown carving. Sturdy brass hanging hook.',
        category: 'Furniture',
        condition: 'Good',
        exchangeType: 'Exchange',
        cityIndex: 0,
        area: 'Near Pudukottai Old Palace & Town Hall',
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Heavy Pre-Seasoned Cast Iron Kuzhi Paniyaram Pan',
        description: '7-pit traditional cast iron pan. Chemical-free natural oil seasoning, crisp outer crust.',
        category: 'Kitchen Items',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 1,
        area: 'Near Aranthangi Bus Stand',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Ramanathapuram: [
      {
        title: 'Portable Solar Emergency Lantern with USB Mobile Charging',
        description: 'Dual solar panel & AC rechargeable emergency lamp. 12 hours LED illumination with power bank output.',
        category: 'Electronics',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 1,
        area: 'Near Rameswaram Railway Station & Agnitheertham',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Marine Biology & Ocean Sciences Reference Books',
        description: 'Alagappa Univ and Mandapam Central Marine Fisheries research guides and coastal ecosystem atlases.',
        category: 'Books',
        condition: 'Good',
        exchangeType: 'Donate',
        cityIndex: 7,
        area: 'Near Mandapam CMFRI Research Center Road',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
        quantity: 3
      }
    ],
    Ranipet: [
      {
        title: 'Genuine Leather Laptop Briefcase Office Bag',
        description: 'Handcrafted dark brown leather messenger bag with padded 15.6-inch laptop compartment and brass buckles.',
        category: 'Accessories',
        condition: 'Like New',
        exchangeType: 'Exchange',
        cityIndex: 0,
        area: 'Near Ranipet SIPCOT Industrial Complex Gate',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Bosch 500W Electric Impact Drill Machine with Bit Set',
        description: 'Complete home maintenance rotary hammer drill with wall plugs and assorted mason bits in hard case.',
        category: 'Household Items',
        condition: 'Good',
        exchangeType: 'Give Away',
        cityIndex: 2,
        area: 'Near Arcot Bus Stand & Delhi Gate Road',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Salem: [
      {
        title: '10th & 12th Samacheer Kalvi School Books Bundle',
        description: 'Standard Tamil Nadu state board curriculum books including Mathematics, Science, and English guides.',
        category: 'Books',
        condition: 'Good',
        exchangeType: 'Donate',
        cityIndex: 0,
        area: 'Near New Bus Stand, Salem',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
        quantity: 6
      },
      {
        title: 'Yercaud Coffee French Press Plunger (600ml Glass)',
        description: 'Borosilicate heat resistant glass beaker with 4-level stainless steel filter system for rich coffee.',
        category: 'Kitchen Items',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 6,
        area: 'Near Yercaud Lake Boat House & Pagoda Point',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Stainless Steel Water Filter Container with Ceramic Candles',
        description: 'Double chamber gravity water filter with brass tap. Non-electric, completely safe drinking water setup.',
        category: 'Household Items',
        condition: 'Good',
        exchangeType: 'Donate',
        cityIndex: 1,
        area: 'Near Attur Rani Pettai Market',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Sivaganga: [
      {
        title: 'Chettinad Terracotta Natural Water Pot Dispenser with Tap',
        description: 'Hand-thrown earthen clay pot with modern brass tap. Keeps water chilled naturally during hot summers.',
        category: 'Kitchen Items',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 1,
        area: 'Near Karaikudi Alagappa University Campus',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Pure Brass Traditional South Indian Filter Coffee Maker Set',
        description: 'Authentic 4-piece brass drip filter with davara and tumbler. Makes aromatic decoction coffee.',
        category: 'Kitchen Items',
        condition: 'Good',
        exchangeType: 'Exchange',
        cityIndex: 2,
        area: 'Near Devakottai Main Bazaar & Bus Stand',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        quantity: 2
      }
    ],
    Tenkasi: [
      {
        title: 'Courtallam Natural Waffle Cotton Bathrobe & Wrap',
        description: 'Plush unisex organic cotton resort robe. Soft on skin and highly absorbent.',
        category: 'Clothes',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 1,
        area: 'Near Courtallam Main Falls & Tiger Falls Road',
        image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Ayurvedic Herbal Granite Mortar & Pestle (Ammikkal)',
        description: 'Compact granite stone grinder for hand-crushing Ayurvedic leaves, ginger, and home spices.',
        category: 'Household Items',
        condition: 'Good',
        exchangeType: 'Donate',
        cityIndex: 0,
        area: 'Near Tenkasi Kasi Viswanathar Temple Car Street',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Thanjavur: [
      {
        title: 'Traditional Handcrafted Brass Kuthu Vilakku (Pair)',
        description: 'Two pure brass 5-tier traditional oil lamps (18 inches height). Pristine shine, ideal for pooja or temple trust.',
        category: 'Household Items',
        condition: 'Like New',
        exchangeType: 'Donate',
        cityIndex: 1,
        area: 'Near Mahamaham Tank, Kumbakonam',
        image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80',
        quantity: 2
      },
      {
        title: 'Tanjore Art Gold Foil Sample Board & Wooden Framing',
        description: 'Handmade traditional painting base with preliminary artwork. Excellent for art students or collectors.',
        category: 'Other',
        condition: 'Good',
        exchangeType: 'Exchange',
        cityIndex: 0,
        area: 'Near Thanjavur Brihadisvara Big Temple South Gate',
        image: 'https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Theni: [
      {
        title: 'Megamalai Birdwatching High Definition Binoculars 10x50',
        description: 'Multi-coated optics with wide field of view and carrying strap. Great for nature lovers and treks.',
        category: 'Sports Items',
        condition: 'Like New',
        exchangeType: 'Exchange',
        cityIndex: 7,
        area: 'Near Megamalai Tea Estate View Point',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Cardamom & Clove Stainless Steel Airtight Storage Containers',
        description: 'Set of 6 moisture-lock spice canisters. Keeps hillside spices fresh for months.',
        category: 'Kitchen Items',
        condition: 'Good',
        exchangeType: 'Give Away',
        cityIndex: 2,
        area: 'Near Bodinayakanur Spice Market & Cardamom Club',
        image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
        quantity: 6
      }
    ],
    Thoothukudi: [
      {
        title: 'Maritime Brass Vintage Ship Compass Decor',
        description: 'Solid brass compass mounted in gimbaled rosewood box. Functional magnetic needle, wonderful table showpiece.',
        category: 'Household Items',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 0,
        area: 'Near Thoothukudi Old Port & Beach Road',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Stainless Steel Heavy Bottom Halwa Making Kadai (15 Litre)',
        description: 'Commercial grade thick bottom vessel with dual riveted handles. Non-sticking even surface.',
        category: 'Kitchen Items',
        condition: 'Good',
        exchangeType: 'Exchange',
        cityIndex: 1,
        area: 'Near Kovilpatti New Bus Stand & Market',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Tiruchirappalli: [
      {
        title: 'Solid Rosewood Handcrafted Dining Chairs (Pair)',
        description: 'Pair of handcrafted dining chairs with cane woven backrest. Sturdy frame. Donating to any NGO or family.',
        category: 'Furniture',
        condition: 'Good',
        exchangeType: 'Give Away',
        cityIndex: 0,
        area: 'Near Central Bus Stand, Trichy',
        image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
        quantity: 2
      },
      {
        title: 'Mechanical Engineering Reference Handbook & Formulas Chart',
        description: 'BHEL technical library standards and machine design data handbooks.',
        category: 'Study Materials',
        condition: 'Like New',
        exchangeType: 'Donate',
        cityIndex: 3,
        area: 'Near Thuvakudi NIT Trichy Campus Gate',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
        quantity: 4
      }
    ],
    Tirunelveli: [
      {
        title: 'Preethi Zodiac Mixer Grinder with 3 Stainless Steel Jars',
        description: '750W heavy duty motor mixer grinder. Jars for wet chutney, dry spice grinding, and liquidizing.',
        category: 'Kitchen Items',
        condition: 'Good',
        exchangeType: 'Give Away',
        cityIndex: 0,
        area: 'Near Nellai Junction & Town Arch',
        image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Traditional Pure Ghee Melting Brass Uruli / Kadai',
        description: 'Wide rim authentic brass cookware. Enhances taste of festival sweets and payasam.',
        category: 'Kitchen Items',
        condition: 'Good',
        exchangeType: 'Exchange',
        cityIndex: 1,
        area: 'Near Palayamkottai Market & St. Xaviers College',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Tirupathur: [
      {
        title: 'Yelagiri Hills Carbon Fiber Hiking Poles (Pair)',
        description: 'Shock-absorbing telescopic trekking walking sticks with cork grips and mud baskets. Used on 2 trail walks.',
        category: 'Sports Items',
        condition: 'Like New',
        exchangeType: 'Exchange',
        cityIndex: 4,
        area: 'Near Yelagiri Athanavur Center & Boat House',
        image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
        quantity: 2
      },
      {
        title: 'Railway Recruitment Board (RRB) Exam Comprehensive Material',
        description: 'Reasoning, general awareness, and quantitative aptitude practice books with solved mock tests.',
        category: 'Study Materials',
        condition: 'Good',
        exchangeType: 'Give Away',
        cityIndex: 5,
        area: 'Near Jolarpet Railway Junction Roundabout',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
        quantity: 5
      }
    ],
    Tiruppur: [
      {
        title: 'Yonex Carbonex Badminton Racquet Set with Cover',
        description: 'Set of two genuine badminton racquets with newly strung gut and grip wrap. Comes with half tube of shuttles.',
        category: 'Sports Items',
        condition: 'Like New',
        exchangeType: 'Exchange',
        cityIndex: 0,
        area: 'Near Old Bus Stand & Avinashi Road, Tiruppur',
        image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
        quantity: 2
      },
      {
        title: 'Organic Knitted Cotton Baby Rompers & Blankets Bundle',
        description: 'Hypoallergenic soft organic cotton wear for infants 0-12 months. Freshly sanitized and packed.',
        category: 'Clothes',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 1,
        area: 'Near Avinashi Lingeshwarar Temple Car Street',
        image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80',
        quantity: 6
      }
    ],
    Tiruvallur: [
      {
        title: 'Heavy Duty 5-Shelf Industrial Metal Storage Rack',
        description: 'Boltless powder coated steel rack with 150kg per shelf capacity. Dismantles easily for transport.',
        category: 'Furniture',
        condition: 'Good',
        exchangeType: 'Exchange',
        cityIndex: 1,
        area: 'Near Avadi Checkpost & Bus Depot',
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Digital Multimeter & Electrical Diagnostic Tool Kit',
        description: 'Auto-ranging multimeter with test leads, thermocouple probe, and wire crimper.',
        category: 'Household Items',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 0,
        area: 'Near Tiruvallur Veeraraghava Swamy Temple Arch',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Tiruvannamalai: [
      {
        title: 'Arunachala Meditation Floor Cushion & Zabuton Mat Set',
        description: 'Ergonomic buckwheat hull filled meditation seat. Provides comfortable posture alignment for yoga.',
        category: 'Household Items',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 0,
        area: 'Near Ramana Ashram & Girivalam Path, Tiruvannamalai',
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
        quantity: 2
      },
      {
        title: 'Arani Pure Silk Zari Shawl / Angavastram with Gift Box',
        description: 'Unworn ceremonial cream silk shawl with pure gold zari borders. Giving away for wedding pooja.',
        category: 'Clothes',
        condition: 'Like New',
        exchangeType: 'Donate',
        cityIndex: 1,
        area: 'Near Arani Bus Stand & Silk Saree Market',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Tiruvarur: [
      {
        title: 'Carnatic Classical Veena Brass Strings & Rosewood Plectrums',
        description: 'Replacement set of German steel melody strings and tuning peg wax for Saraswati Veena.',
        category: 'Other',
        condition: 'Like New',
        exchangeType: 'Donate',
        cityIndex: 0,
        area: 'Near Tiruvarur Thyagaraja Swamy Temple Kamalalayam Tank',
        image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=800&q=80',
        quantity: 4
      },
      {
        title: 'Delta Paddy Grain Moisture Digital Meter Tester',
        description: 'Portable digital moisture analyzer with sensor probe. Great for agricultural grain storage.',
        category: 'Household Items',
        condition: 'Good',
        exchangeType: 'Exchange',
        cityIndex: 1,
        area: 'Near Mannargudi Rajagopalaswamy Temple Street',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ],
    Vellore: [
      {
        title: 'Vellore Fort & Historical Heritage Books Collection',
        description: 'Hardcover volumes on Vijayanagara architecture and Carnatic wars with high-res photographic plates.',
        category: 'Books',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 0,
        area: 'Near Vellore Fort & Jalakanteswarar Temple',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
        quantity: 3
      },
      {
        title: 'Computer Science Data Structures & Algorithms (C++ / Java)',
        description: 'VIT standard textbook by Cormen and Tanenbaum. Highlighted key sections, perfect condition.',
        category: 'Study Materials',
        condition: 'Good',
        exchangeType: 'Donate',
        cityIndex: 1,
        area: 'Near Katpadi Railway Station & VIT University Road',
        image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
        quantity: 2
      }
    ],
    Viluppuram: [
      {
        title: 'Gingee Fort 50L Waterproof Trekking Rucksack',
        description: 'Durable ripstop nylon travel bag with rain fly, ventilated back panel, and chest strap. Ready for outdoor adventure.',
        category: 'Sports Items',
        condition: 'Good',
        exchangeType: 'Exchange',
        cityIndex: 2,
        area: 'Near Gingee Fort Hill Base & Bus Stop',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Natural Clay Cooking Handi Pots (Set of 3 Sizes)',
        description: 'Traditional terracotta unglazed curry pots. Retains food moisture and imparts traditional earthy aroma.',
        category: 'Kitchen Items',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 0,
        area: 'Near Viluppuram Old Bus Stand & Market',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        quantity: 3
      }
    ],
    Virudhunagar: [
      {
        title: 'Used Study Table – Solid Teak Wood with Drawer',
        description: 'Sturdy wooden student study desk in great condition. Has a smooth writing surface and sliding storage drawer. Perfect for school or college students in Sivakasi area.',
        category: 'Furniture',
        condition: 'Gently Used',
        exchangeType: 'Give Away',
        cityIndex: 0,
        area: 'Near Sivakasi Bus Stand & Coronation Colony',
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Bandage Cotton & Medical Gauze First Aid Bundle',
        description: 'Sterile surgical grade cotton rolls and stretch bandages from Rajapalayam textile mills. Donating to clinic or school.',
        category: 'Household Items',
        condition: 'Like New',
        exchangeType: 'Donate',
        cityIndex: 2,
        area: 'Near Rajapalayam PACR Memorial Hospital Road',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
        quantity: 10
      },
      {
        title: 'High School Chemistry & Physics Lab Glassware Set',
        description: 'Beakers, test tubes with wooden stand, pipettes, and conical flasks. Safe borosilicate glass.',
        category: 'Study Materials',
        condition: 'Good',
        exchangeType: 'Give Away',
        cityIndex: 1,
        area: 'Near Virudhunagar Railway Station & Bazaar',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        quantity: 6
      }
    ],
    'The Nilgiris': [
      {
        title: 'Kids Wooden Building Blocks & Board Games Set',
        description: 'Non-toxic colorful wooden blocks set, Scrabble junior, and Snakes & Ladders in wooden box. Excellent for ages 4-10.',
        category: 'Toys',
        condition: 'Like New',
        exchangeType: 'Give Away',
        cityIndex: 0,
        area: 'Near Commercial Road & Botanical Garden, Ooty',
        image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: 'Nilgiri Orthodox Tea Leaf Metal Caddies & Infuser Set',
        description: 'Vintage airtight decorative tea tins and stainless steel mesh infuser spoon. Kept in pristine condition.',
        category: 'Kitchen Items',
        condition: 'Like New',
        exchangeType: 'Donate',
        cityIndex: 1,
        area: 'Near Coonoor Sim’s Park & Club Road',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        quantity: 2
      },
      {
        title: 'Heavy Winter Fleece Jacket & Thermal Beanie Set',
        description: 'Insulated wind-resistant jacket (Size L) with cozy fleece lining. Clean, dry-cleaned, ready for Ooty cold.',
        category: 'Clothes',
        condition: 'Good',
        exchangeType: 'Exchange',
        cityIndex: 2,
        area: 'Near Kotagiri Johnstone Square',
        image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80',
        quantity: 2
      }
    ]
  };

  const allItems: Item[] = [];
  const owners = [
    { id: 'usr_karthik', name: 'Karthik Subramanian', rating: 4.9, count: 14, phone: '9842100001' },
    { id: 'usr_priya', name: 'Priya Soundar', rating: 4.8, count: 22, phone: '9842100002' },
    { id: 'usr_anand', name: 'Anand Natarajan', rating: 5.0, count: 19, phone: '9842100003' },
    { id: 'usr_selvi', name: 'Selvi Ramasamy', rating: 4.7, count: 8, phone: '9842100004' }
  ];

  let idCounter = 100;

  // Process all 38 districts
  ALL_38_DISTRICTS.forEach((d, distIdx) => {
    const list = districtSpecificData[d.name] || [
      {
        title: `Pre-owned Study Table & Chair Set – ${d.name}`,
        description: `Wooden study desk with book storage shelf and matching chair in solid condition. Clean and sanitized. Available for reuse in ${d.name}.`,
        category: 'Furniture',
        condition: 'Good' as const,
        exchangeType: 'Give Away' as const,
        cityIndex: 0,
        area: `Near ${d.cities[0] || d.name} Central Bus Stand`,
        image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      },
      {
        title: `College Textbooks & Study Materials – ${d.name}`,
        description: `Set of authentic college reference textbooks and exam question papers. Suitable for Tamil Nadu state curriculum.`,
        category: 'Study Materials',
        condition: 'Like New' as const,
        exchangeType: 'Donate' as const,
        cityIndex: Math.min(1, d.cities.length - 1),
        area: `Near ${d.cities[1] || d.cities[0] || d.name} Town Hall`,
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
        quantity: 4
      },
      {
        title: `Philips Stainless Steel Electric Kettle (1.5L) – ${d.name}`,
        description: `Fast boiling water kettle with auto cut-off and 360-degree swivel base. Working flawlessly, ready to exchange.`,
        category: 'Household Items',
        condition: 'Good' as const,
        exchangeType: 'Exchange' as const,
        cityIndex: 0,
        area: `Near ${d.cities[0] || d.name} Bazaar`,
        image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80',
        quantity: 1
      }
    ];

    list.forEach((itemDef, idx) => {
      idCounter += 1;
      const owner = owners[(distIdx + idx) % owners.length];
      const city = d.cities[itemDef.cityIndex] || d.cities[0] || d.name;

      allItems.push({
        id: `item_${d.id}_${idx + 1}_${idCounter}`,
        title: itemDef.title,
        description: itemDef.description,
        category: itemDef.category,
        condition: itemDef.condition,
        images: [itemDef.image],
        exchangeType: itemDef.exchangeType,
        state: 'Tamil Nadu',
        district: d.name,
        city,
        approximateArea: itemDef.area,
        quantity: itemDef.quantity,
        ownerId: owner.id,
        ownerName: owner.name,
        ownerPhone: owner.phone,
        ownerRating: owner.rating,
        ownerRatingCount: owner.count,
        status: 'active',
        views: Math.floor(40 + Math.random() * 220),
        savesCount: Math.floor(5 + Math.random() * 35),
        createdAt: pastDay(Math.floor(1 + (idx * 2) + (distIdx % 7)))
      });
    });
  });

  return allItems;
}
