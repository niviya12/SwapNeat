import { DistrictInfo } from '../types';

export const TAMIL_NADU_STATE = 'Tamil Nadu';

export const NON_TN_BLOCKED_MESSAGE = 'SwapNeat is currently available only in Tamil Nadu.';

export const ALL_38_DISTRICTS: DistrictInfo[] = [
  {
    id: 'ariyalur',
    name: 'Ariyalur',
    tamilName: 'அரியலூர்',
    region: 'Central',
    cities: ['Ariyalur', 'Jayankondam', 'Sendurai', 'Andimadam', 'Udayarpalayam', 'Varadarajanpettai']
  },
  {
    id: 'chengalpattu',
    name: 'Chengalpattu',
    tamilName: 'செங்கல்பட்டு',
    region: 'North',
    cities: ['Chengalpattu', 'Tambaram South', 'Maraimalai Nagar', 'Mahabalipuram', 'Madurantakam', 'Cheyyur', 'Guduvanchery', 'Kelambakkam', 'Thiruporur', 'Vandalur']
  },
  {
    id: 'chennai',
    name: 'Chennai',
    tamilName: 'சென்னை',
    region: 'North',
    cities: ['T. Nagar', 'Anna Nagar', 'Velachery', 'Adyar', 'Mylapore', 'Tambaram', 'Guindy', 'Porur', 'Thiruvanmiyur', 'Besant Nagar', 'Nungambakkam', 'Egmore', 'Royapettah', 'Saidapet', 'Perambur', 'Kilpauk', 'Ambattur', 'Vadapalani', 'Chromepet', 'Sholinganallur']
  },
  {
    id: 'coimbatore',
    name: 'Coimbatore',
    tamilName: 'கோயம்புத்தூர்',
    region: 'West',
    cities: ['Gandhipuram', 'RS Puram', 'Peelamedu', 'Saravanampatti', 'Pollachi', 'Mettupalayam', 'Sulur', 'Singanallur', 'Kuniyamuthur', 'Thudiyalur', 'Vadavalli', 'Ukkadam', 'Kovaipudur', 'Annur']
  },
  {
    id: 'cuddalore',
    name: 'Cuddalore',
    tamilName: 'கடலூர்',
    region: 'Cauvery Delta',
    cities: ['Cuddalore', 'Chidambaram', 'Panruti', 'Vridhachalam', 'Neyveli', 'Kattumannarkoil', 'Tittakudi', 'Kurinjipadi', 'Bhuvanagiri']
  },
  {
    id: 'dharmapuri',
    name: 'Dharmapuri',
    tamilName: 'தருமபுரி',
    region: 'West',
    cities: ['Dharmapuri', 'Harur', 'Palakkodu', 'Pennagaram', 'Pappireddipatti', 'Karimangalam', 'Nallampalli', 'Hogenakkal']
  },
  {
    id: 'dindigul',
    name: 'Dindigul',
    tamilName: 'திண்டுக்கல்',
    region: 'South',
    cities: ['Dindigul', 'Palani', 'Kodaikanal', 'Oddanchatram', 'Natham', 'Nilakottai', 'Vedasandur', 'Batlagundu', 'Athoor']
  },
  {
    id: 'erode',
    name: 'Erode',
    tamilName: 'ஈரோடு',
    region: 'West',
    cities: ['Erode Central', 'Gobichettipalayam', 'Bhavani', 'Perundurai', 'Sathyamangalam', 'Anthiyur', 'Kodumudi', 'Modakkurichi', 'Chithode']
  },
  {
    id: 'kallakurichi',
    name: 'Kallakurichi',
    tamilName: 'கள்ளக்குறிச்சி',
    region: 'Central',
    cities: ['Kallakurichi', 'Chinnasalem', 'Sankarapuram', 'Tirukkoyilur', 'Ulundurpet', 'Kalvarayan Hills', 'Rishivandiyam']
  },
  {
    id: 'kancheepuram',
    name: 'Kancheepuram',
    tamilName: 'காஞ்சிபுரம்',
    region: 'North',
    cities: ['Kancheepuram Town', 'Sriperumbudur', 'Walajabad', 'Uthiramerur', 'Kundrathur', 'Pillayarpalayam', 'Sunguvarchatram']
  },
  {
    id: 'karur',
    name: 'Karur',
    tamilName: 'கரூர்',
    region: 'Central',
    cities: ['Karur City', 'Kulithalai', 'Aravakurichi', 'Pugalur', 'Krishnarayapuram', 'Pallapatti', 'Thanthoni']
  },
  {
    id: 'krishnagiri',
    name: 'Krishnagiri',
    tamilName: 'கிருஷ்ணகிரி',
    region: 'West',
    cities: ['Krishnagiri Town', 'Hosur', 'Pochampalli', 'Uthangarai', 'Denkanikottai', 'Bargur', 'Shoolagiri', 'Kelamangalam']
  },
  {
    id: 'madurai',
    name: 'Madurai',
    tamilName: 'மதுரை',
    region: 'South',
    cities: ['Madurai City', 'Anna Nagar Madurai', 'KK Nagar Madurai', 'Melur', 'Thirumangalam', 'Usilampatti', 'Vadipatti', 'Sholavandan', 'Alanganallur', 'Tiruparankundram', 'Othakadai']
  },
  {
    id: 'mayiladuthurai',
    name: 'Mayiladuthurai',
    tamilName: 'மயிலாடுதுறை',
    region: 'Cauvery Delta',
    cities: ['Mayiladuthurai Town', 'Sirkazhi', 'Tharangambadi', 'Kuthalam', 'Poompuhar', 'Vaitheeswarankoil']
  },
  {
    id: 'nagapattinam',
    name: 'Nagapattinam',
    tamilName: 'நாகப்பட்டினம்',
    region: 'Cauvery Delta',
    cities: ['Nagapattinam Port', 'Velankanni', 'Vedaranyam', 'Kilvelur', 'Thirukuvalai', 'Nagore']
  },
  {
    id: 'kanniyakumari',
    name: 'Kanniyakumari',
    tamilName: 'கன்னியாகுமரி',
    region: 'South',
    cities: ['Nagercoil', 'Kanniyakumari Town', 'Thuckalay', 'Kuzhithurai', 'Colachel', 'Padmanabhapuram', 'Marthandam', 'Killiyoor']
  },
  {
    id: 'namakkal',
    name: 'Namakkal',
    tamilName: 'நாமக்கல்',
    region: 'West',
    cities: ['Namakkal Town', 'Tiruchengode', 'Rasipuram', 'Paramathi Velur', 'Kolli Hills', 'Kumarapalayam', 'Mohanur', 'Sendamangalam']
  },
  {
    id: 'perambalur',
    name: 'Perambalur',
    tamilName: 'பெரம்பலூர்',
    region: 'Central',
    cities: ['Perambalur Town', 'Veppanthattai', 'Kunnam', 'Alathur', 'Padalur', 'Poolambadi']
  },
  {
    id: 'pudukottai',
    name: 'Pudukottai',
    tamilName: 'புதுக்கோட்டை',
    region: 'Central',
    cities: ['Pudukottai Town', 'Aranthangi', 'Alangudi', 'Illuppur', 'Karambakudi', 'Kulathur', 'Ponnamaravathi', 'Avudaiyarkoil']
  },
  {
    id: 'ramanathapuram',
    name: 'Ramanathapuram',
    tamilName: 'இராமநாதபுரம்',
    region: 'South',
    cities: ['Ramanathapuram Town', 'Rameswaram', 'Paramakudi', 'Kilakarai', 'Mudukulathur', 'Kamuthi', 'Tiruvadanai', 'Mandapam']
  },
  {
    id: 'ranipet',
    name: 'Ranipet',
    tamilName: 'இராணிப்பேட்டை',
    region: 'North',
    cities: ['Ranipet Industrial', 'Walajah', 'Arcot', 'Arakkonam', 'Nemili', 'Sholinghur', 'Thakkolam']
  },
  {
    id: 'salem',
    name: 'Salem',
    tamilName: 'சேலம்',
    region: 'West',
    cities: ['Salem City', 'Attur', 'Mettur', 'Omalur', 'Edappadi', 'Sankagiri', 'Yercaud', 'Valapady', 'Mecheri', 'Kadayampatti']
  },
  {
    id: 'sivaganga',
    name: 'Sivaganga',
    tamilName: 'சிவகங்கை',
    region: 'South',
    cities: ['Sivaganga Town', 'Karaikudi', 'Devakottai', 'Manamadurai', 'Tiruppuvanam', 'Ilayangudi', 'Kalayarkoil', 'Singampunari']
  },
  {
    id: 'tenkasi',
    name: 'Tenkasi',
    tamilName: 'தென்காசி',
    region: 'South',
    cities: ['Tenkasi Town', 'Courtallam', 'Sankarankovil', 'Kadayanallur', 'Shenkottai', 'Alangulam', 'Sivagiri', 'Pavoorchatram']
  },
  {
    id: 'thanjavur',
    name: 'Thanjavur',
    tamilName: 'தஞ்சாவூர்',
    region: 'Cauvery Delta',
    cities: ['Thanjavur City', 'Kumbakonam', 'Pattukkottai', 'Peravurani', 'Orathanadu', 'Thiruvaiyaru', 'Papanasam', 'Budalur']
  },
  {
    id: 'theni',
    name: 'Theni',
    tamilName: 'தேனி',
    region: 'South',
    cities: ['Theni Allinagaram', 'Periyakulam', 'Bodinayakanur', 'Cumbum', 'Uthamapalayam', 'Chinnamanur', 'Andipatti', 'Megamalai']
  },
  {
    id: 'thoothukudi',
    name: 'Thoothukudi',
    tamilName: 'தூத்துக்குடி',
    region: 'South',
    cities: ['Thoothukudi Port City', 'Kovilpatti', 'Tiruchendur', 'Kayalpattinam', 'Sathankulam', 'Ottapidaram', 'Vilathikulam', 'Ettayapuram']
  },
  {
    id: 'tiruchirappalli',
    name: 'Tiruchirappalli',
    tamilName: 'திருச்சிராப்பள்ளி',
    region: 'Central',
    cities: ['Trichy Central', 'Srirangam', 'Thillai Nagar', 'Thuvakudi', 'Manapparai', 'Lalgudi', 'Musiri', 'Thuraiyur', 'Ponmalai', 'K.K. Nagar Trichy']
  },
  {
    id: 'tirunelveli',
    name: 'Tirunelveli',
    tamilName: 'திருநெல்வேலி',
    region: 'South',
    cities: ['Tirunelveli Town', 'Palayamkottai', 'Ambasamudram', 'Cheranmahadevi', 'Nanguneri', 'Radhapuram', 'Valliyur', 'Kalakkad']
  },
  {
    id: 'tirupathur',
    name: 'Tirupathur',
    tamilName: 'திருப்பத்தூர்',
    region: 'North',
    cities: ['Tirupathur Town', 'Vaniyambadi', 'Ambur', 'Natrampalli', 'Yelagiri Hills', 'Jolarpet']
  },
  {
    id: 'tiruppur',
    name: 'Tiruppur',
    tamilName: 'திருப்பூர்',
    region: 'West',
    cities: ['Tiruppur City', 'Avinashi', 'Dharapuram', 'Kangeyam', 'Palladam', 'Udumalaipettai', 'Madathukulam', 'Uthukuli']
  },
  {
    id: 'tiruvallur',
    name: 'Tiruvallur',
    tamilName: 'திருவள்ளூர்',
    region: 'North',
    cities: ['Tiruvallur Town', 'Avadi', 'Poonamallee', 'Tiruttani', 'Gummidipoondi', 'Ponneri', 'Redhills', 'Thirunindravur', 'Minjur']
  },
  {
    id: 'tiruvannamalai',
    name: 'Tiruvannamalai',
    tamilName: 'திருவண்ணாமலை',
    region: 'North',
    cities: ['Tiruvannamalai Town', 'Arani', 'Cheyyar', 'Polur', 'Chengam', 'Vandavasi', 'Kalasapakkam', 'Kilpennathur']
  },
  {
    id: 'tiruvarur',
    name: 'Tiruvarur',
    tamilName: 'திருவாரூர்',
    region: 'Cauvery Delta',
    cities: ['Tiruvarur Town', 'Mannargudi', 'Thiruthuraipoondi', 'Koothanallur', 'Nannilam', 'Kudavasal', 'Valangaiman', 'Muthupet']
  },
  {
    id: 'vellore',
    name: 'Vellore',
    tamilName: 'வேலூர்',
    region: 'North',
    cities: ['Vellore Fort City', 'Katpadi', 'Gudiyatham', 'Anaicut', 'K.V. Kuppam', 'Pernambut', 'Bagayam', 'Sathuvachari']
  },
  {
    id: 'viluppuram',
    name: 'Viluppuram',
    tamilName: 'விழுப்புரம்',
    region: 'North',
    cities: ['Viluppuram Town', 'Tindivanam', 'Gingee', 'Marakkanam', 'Vikravandi', 'Vanur', 'Kandachipuram']
  },
  {
    id: 'virudhunagar',
    name: 'Virudhunagar',
    tamilName: 'விருதுநகர்',
    region: 'South',
    cities: ['Sivakasi', 'Virudhunagar Town', 'Rajapalayam', 'Aruppukottai', 'Srivilliputhur', 'Sattur', 'Watrap', 'Kariapatti', 'Tiruchuli']
  },
  {
    id: 'the_nilgiris',
    name: 'The Nilgiris',
    tamilName: 'நீலகிரி',
    region: 'West',
    cities: ['Udhagamandalam (Ooty)', 'Coonoor', 'Kotagiri', 'Gudalur', 'Wellington', 'Pandalur', 'Aruvankadu']
  }
];

// Helper dictionaries for fast lookup
export const DISTRICT_MAP = new Map<string, DistrictInfo>();
ALL_38_DISTRICTS.forEach(d => {
  DISTRICT_MAP.set(d.name.toLowerCase(), d);
});

export const ALL_DISTRICT_NAMES = ALL_38_DISTRICTS.map(d => d.name);

export function getCitiesForDistrict(districtName: string): string[] {
  if (!districtName) return [];
  const found = DISTRICT_MAP.get(districtName.trim().toLowerCase());
  return found ? found.cities : [];
}

export function isValidTamilNaduDistrict(districtName: string): boolean {
  if (!districtName) return false;
  return DISTRICT_MAP.has(districtName.trim().toLowerCase());
}

export function isValidTamilNaduCity(districtName: string, cityName: string): boolean {
  if (!isValidTamilNaduDistrict(districtName) || !cityName) return false;
  const cities = getCitiesForDistrict(districtName);
  const target = cityName.trim().toLowerCase();
  // Check exact or partial match or inclusion
  return cities.some(c => c.toLowerCase() === target || c.toLowerCase().includes(target) || target.includes(c.toLowerCase()));
}

export function validateTamilNaduLocation(state: string, district: string, city?: string): { valid: boolean; error?: string } {
  if (!state || state.trim().toLowerCase() !== 'tamil nadu') {
    return {
      valid: false,
      error: NON_TN_BLOCKED_MESSAGE
    };
  }

  if (!district || !isValidTamilNaduDistrict(district)) {
    return {
      valid: false,
      error: `Invalid district: "${district}". Please choose one of the 38 districts of Tamil Nadu.`
    };
  }

  if (city) {
    const validCity = isValidTamilNaduCity(district, city);
    if (!validCity) {
      return {
        valid: false,
        error: `Location "${city}" does not match the selected Tamil Nadu district "${district}".`
      };
    }
  }

  return { valid: true };
}

// Other states list for mock validation when a user tries to choose another state
export const OTHER_INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry'
];
