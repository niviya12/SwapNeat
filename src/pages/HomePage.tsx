import React, { useState, useEffect } from 'react';
import {
  Recycle,
  ArrowRight,
  PlusCircle,
  MapPin,
  Sparkles,
  Heart,
  ShieldCheck,
  TrendingUp,
  BookOpen,
  Armchair,
  Laptop,
  Shirt,
  UtensilsCrossed,
  Trophy,
  Gamepad2,
  Package,
  Layers,
  Trees
} from 'lucide-react';
import { Item } from '../types';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { api } from '../services/api.ts';
import { ItemCard } from '../components/ItemCard.tsx';
import { TamilNaduMapVisual } from '../components/TamilNaduMapVisual.tsx';
import { SmartMatchingSection } from '../components/SmartMatchingSection.tsx';
import { LocationRestrictionAlert } from '../components/LocationRestrictionAlert.tsx';

interface HomePageProps {
  onNavigate: (tab: string, params?: Record<string, string>) => void;
  onSelectItem: (item: Item) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectItem }) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [featuredItems, setFeaturedItems] = useState<Item[]>([]);
  const [impactStats, setImpactStats] = useState<{
    totalItemsReused: number;
    wasteReducedKg: number;
    headline: string;
  }>({
    totalItemsReused: 1250,
    wasteReducedKg: 4250,
    headline: '1,250 items found a second life in Tamil Nadu.'
  });

  useEffect(() => {
    // Fetch latest items
    api.getItems({ sort: 'nearest', userDistrict: user?.district || 'Virudhunagar' })
      .then(res => setFeaturedItems(res.items.slice(0, 8)))
      .catch(console.error);

    // Fetch sustainability metrics
    api.getSustainabilityImpact()
      .then(res => {
        setImpactStats({
          totalItemsReused: res.metrics.totalItemsReused,
          wasteReducedKg: res.metrics.estimatedWasteReducedKg,
          headline: res.headline
        });
      })
      .catch(console.error);
  }, [user?.district]);

  const categoryIcons = [
    { name: 'Furniture', icon: Armchair, count: '140+' },
    { name: 'Study Materials', icon: BookOpen, count: '280+' },
    { name: 'Books', icon: BookOpen, count: '320+' },
    { name: 'Electronics', icon: Laptop, count: '190+' },
    { name: 'Kitchen Items', icon: UtensilsCrossed, count: '110+' },
    { name: 'Sports Items', icon: Trophy, count: '85+' },
    { name: 'Toys', icon: Gamepad2, count: '95+' },
    { name: 'Household Items', icon: Package, count: '170+' }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Location Notice Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <LocationRestrictionAlert />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 pt-8 pb-16 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 mb-6 shadow-xs animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <span>Tamil Nadu Exclusive Platform • All 38 Districts</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              “Give What You Don’t Need. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                Find What You Need.
              </span>”
            </h1>

            {/* Subtext */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {language === 'ta'
                ? 'பயனுள்ள பொருட்களைத் தூக்கி எறியாமல் மறுபயன்பாடு செய்யவும், பரிமாறிக்கொள்ளவும் தமிழ்நாடு முழுவதும் உள்ள மக்களை ஸ்வாப்நீட் இணைக்கிறது.'
                : 'SwapNeat connects people across Tamil Nadu to reuse, exchange, and give away useful items instead of throwing them away.'}
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate('browse')}
                className="px-6 sm:px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2"
              >
                <span>{t.exploreItems}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => onNavigate('post')}
                className="px-6 sm:px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-emerald-500 font-bold text-sm sm:text-base rounded-2xl shadow-sm transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <span>{t.postAnItem}</span>
              </button>
            </div>

            {/* Quick 5-Key Highlights */}
            <div className="mt-10 pt-8 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-bold text-slate-700">
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center">
                <span className="text-emerald-600 text-base font-black">Tamil Nadu</span>
                <span className="text-slate-500 text-[11px] font-medium">Exclusively</span>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center">
                <span className="text-slate-900 text-base font-black">38 Districts</span>
                <span className="text-slate-500 text-[11px] font-medium">Towns & Cities</span>
              </div>
              <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200 shadow-xs flex flex-col items-center justify-center text-emerald-950">
                <span className="text-emerald-700 text-base font-black">Reuse</span>
                <span className="text-emerald-800 text-[11px] font-medium">Pre-loved Goods</span>
              </div>
              <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200 shadow-xs flex flex-col items-center justify-center text-blue-950">
                <span className="text-blue-700 text-base font-black">Exchange</span>
                <span className="text-blue-800 text-[11px] font-medium">Barter Trade</span>
              </div>
              <div className="p-3 bg-purple-50/80 rounded-2xl border border-purple-200 shadow-xs flex flex-col items-center justify-center text-purple-950 col-span-2 sm:col-span-1">
                <span className="text-purple-700 text-base font-black">Give Away</span>
                <span className="text-purple-800 text-[11px] font-medium">100% Free Items</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Visual Tamil Nadu Map Section */}
        <section>
          <TamilNaduMapVisual
            onSelectDistrict={(dist) => {
              if (dist) {
                onNavigate('browse', { district: dist });
              }
            }}
          />
        </section>

        {/* Categories Bar */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                {language === 'ta' ? 'பிரபலமான பிரிவுகள்' : 'Browse by Category'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'ta' ? 'அனைத்து வகையிலும் பயன்படுத்திய பொருட்களை கண்டறியுங்கள்' : 'Explore reusable items across essential everyday categories'}
              </p>
            </div>
            <button
              onClick={() => onNavigate('browse')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categoryIcons.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => onNavigate('browse', { category: cat.name })}
                  className="p-3.5 bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl shadow-xs transition-all flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 flex items-center justify-center transition-colors mb-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">
                    {language === 'ta' ? (t.categories[cat.name as keyof typeof t.categories] || cat.name) : cat.name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{cat.count}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Smart Matching Section */}
        <SmartMatchingSection onSelectItem={onSelectItem} />

        {/* Recent Tamil Nadu Listings */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Across Tamil Nadu Districts</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                {language === 'ta' ? 'சமீபத்திய பொருட்கள்' : 'Fresh Community Listings'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real items listed by residents of Sivakasi, Madurai, Chennai, Coimbatore, and more.
              </p>
            </div>

            <button
              onClick={() => onNavigate('browse')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>{t.exploreItems}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => onSelectItem(item)}
              />
            ))}
          </div>
        </section>

        {/* Sustainability Impact Callout */}
        <section className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white rounded-3xl p-8 lg:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-3">
              <Trees className="w-4 h-4 text-emerald-400" />
              <span>Tamil Nadu Zero-Waste Circular Mission</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              “{impactStats.headline}”
            </h2>
            <p className="mt-3 text-emerald-200/80 text-sm sm:text-base leading-relaxed">
              Every item you give away or exchange keeps valuable raw materials out of landfills, cuts carbon emissions, and supports fellow families in Tamil Nadu.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('analytics')}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                View Full Impact Report
              </button>
              <button
                onClick={() => onNavigate('post')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl transition-colors"
              >
                Post an Unused Item
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
