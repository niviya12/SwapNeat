import React, { useState, useEffect } from 'react';
import { Sparkles, MapPin, Search, ArrowRight } from 'lucide-react';
import { Item } from '../types';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { api } from '../services/api.ts';
import { ItemCard } from './ItemCard.tsx';

interface SmartMatchingSectionProps {
  onSelectItem: (item: Item) => void;
}

export const SmartMatchingSection: React.FC<SmartMatchingSectionProps> = ({ onSelectItem }) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [query, setQuery] = useState<string>('study table');
  const [category, setCategory] = useState<string>('All Categories');
  const [exchangeType, setExchangeType] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [highMatches, setHighMatches] = useState<Item[]>([]);
  const [mediumMatches, setMediumMatches] = useState<Item[]>([]);
  const [otherMatches, setOtherMatches] = useState<Item[]>([]);

  // Default to Sivakasi, Virudhunagar if no user logged in
  const userDistrict = user?.district || 'Virudhunagar';
  const userCity = user?.city || 'Sivakasi';

  const runSmartMatch = async (keyword = query, cat = category, type = exchangeType) => {
    try {
      setIsLoading(true);
      const res = await api.getSmartMatches({
        query: keyword,
        category: cat === 'All Categories' ? '' : cat,
        exchangeType: type === 'All' ? '' : type,
        district: userDistrict,
        city: userCity
      });

      setHighMatches(res.tiers.highMatch);
      setMediumMatches(res.tiers.mediumMatch);
      setOtherMatches(res.tiers.otherMatch);
    } catch (err) {
      console.error('Smart match error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runSmartMatch('table');
  }, [userDistrict, userCity]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSmartMatch(query, category, exchangeType);
  };

  return (
    <section className="bg-gradient-to-b from-emerald-50/50 via-white to-slate-50 border border-emerald-100 rounded-3xl p-6 lg:p-8 shadow-xs my-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-emerald-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>{language === 'ta' ? 'ஸ்மார்ட் இருப்பிடப் பொருத்தம்' : 'Location-Based Smart Matching'}</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            {language === 'ta' ? 'உங்களுக்கான சிறந்த பரிந்துரைகள்' : 'Hyper-Local Tamil Nadu Match Engine'}
          </h3>
          <p className="text-slate-600 text-sm mt-1">
            {language === 'ta'
              ? `உங்கள் இருப்பிடம்: ${userCity}, ${userDistrict}, தமிழ்நாடு. அருகில் உள்ளவற்றை முதலில் காண்கிறோம்.`
              : `Matching for your location: ${userCity}, ${userDistrict}, Tamil Nadu. Prioritizing nearest items first.`}
          </p>
        </div>

        {/* User location chip */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-emerald-200 shadow-xs text-xs font-semibold text-emerald-900 shrink-0">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>{userCity}, {userDistrict} (TN)</span>
        </div>
      </div>

      {/* Query Bar */}
      <form onSubmit={handleSearchSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === 'ta' ? 'தேவைப்படும் பொருள் (எ.கா. study table, books)...' : 'What are you looking for? (e.g., study table, cycle, books)...'}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            runSmartMatch(query, e.target.value, exchangeType);
          }}
          className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="All Categories">{t.allCategories}</option>
          {Object.keys(t.categories).map(cat => (
            <option key={cat} value={cat}>
              {language === 'ta' ? t.categories[cat as keyof typeof t.categories] : cat}
            </option>
          ))}
        </select>

        <select
          value={exchangeType}
          onChange={(e) => {
            setExchangeType(e.target.value);
            runSmartMatch(query, category, e.target.value);
          }}
          className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="All">{t.allTypes}</option>
          <option value="Give Away">{t.types['Give Away']}</option>
          <option value="Exchange">{t.types['Exchange']}</option>
          <option value="Donate">{t.types['Donate']}</option>
        </select>

        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>{language === 'ta' ? 'பொருத்துக' : 'Match Now'}</span>
        </button>
      </form>

      {/* Results Tiers */}
      <div className="mt-8 space-y-8">
        {/* Tier 1: High Match (Same City) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
              {t.highMatch} ({userCity})
            </span>
            <span className="text-xs text-slate-500">
              {highMatches.length} {language === 'ta' ? 'பொருட்கள்' : 'items nearby'}
            </span>
          </div>

          {highMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {highMatches.map(item => (
                <ItemCard key={item.id} item={item} onClick={() => onSelectItem(item)} />
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-dashed border-emerald-200 text-xs text-emerald-800 text-center">
              No matching listings in {userCity} right now. Showing items in {userDistrict} below.
            </div>
          )}
        </div>

        {/* Tier 2: Medium Match (Same District) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-900 border border-blue-300">
              {t.mediumMatch} ({userDistrict})
            </span>
            <span className="text-xs text-slate-500">
              {mediumMatches.length} {language === 'ta' ? 'பொருட்கள்' : 'items'}
            </span>
          </div>

          {mediumMatches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mediumMatches.map(item => (
                <ItemCard key={item.id} item={item} onClick={() => onSelectItem(item)} />
              ))}
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-600 text-center">
              No items in {userDistrict} for this search. See other Tamil Nadu districts below.
            </div>
          )}
        </div>

        {/* Tier 3: Other Tamil Nadu districts */}
        {otherMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-300">
                {t.otherMatch} (Across Tamil Nadu)
              </span>
              <span className="text-xs text-slate-500">
                {otherMatches.length} {language === 'ta' ? 'பொருட்கள்' : 'items'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {otherMatches.slice(0, 4).map(item => (
                <ItemCard key={item.id} item={item} onClick={() => onSelectItem(item)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
