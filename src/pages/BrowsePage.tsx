import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  MapPin,
  RefreshCw,
  Sparkles,
  SlidersHorizontal,
  X,
  Building2,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { Item } from '../types';
import { ALL_38_DISTRICTS, getCitiesForDistrict } from '../data/tamilNaduLocations.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { api } from '../services/api.ts';
import { ItemCard } from '../components/ItemCard.tsx';
import { LocationRestrictionAlert } from '../components/LocationRestrictionAlert.tsx';

interface BrowsePageProps {
  initialDistrict?: string;
  initialCategory?: string;
  initialSearch?: string;
  onSelectItem: (item: Item) => void;
}

export const BrowsePage: React.FC<BrowsePageProps> = ({
  initialDistrict = '',
  initialCategory = '',
  initialSearch = '',
  onSelectItem
}) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  // If user is from a district, default to that district unless initialDistrict was passed
  const [district, setDistrict] = useState<string>(initialDistrict || user?.district || 'All Districts');
  const [city, setCity] = useState<string>('All');
  const [category, setCategory] = useState<string>(initialCategory || 'All Categories');
  const [condition, setCondition] = useState<string>('All Conditions');
  const [exchangeType, setExchangeType] = useState<string>('All Types');
  const [sort, setSort] = useState<string>('nearest');
  const [search, setSearch] = useState<string>(initialSearch);
  const [selectedZone, setSelectedZone] = useState<string>('All');

  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Update available cities when district changes
  useEffect(() => {
    if (district && district !== 'All' && district !== 'All Districts') {
      const cities = getCitiesForDistrict(district);
      setAvailableCities(cities);
      setCity('All');
    } else {
      setAvailableCities([]);
      setCity('All');
    }
  }, [district]);

  // Sync initial props if changed
  useEffect(() => {
    if (initialDistrict) setDistrict(initialDistrict);
    if (initialCategory) setCategory(initialCategory);
    if (initialSearch) setSearch(initialSearch);
  }, [initialDistrict, initialCategory, initialSearch]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const params: Record<string, string> = {};
      if (search.trim()) params.search = search.trim();
      if (district && district !== 'All' && district !== 'All Districts') params.district = district;
      if (city && city !== 'All') params.city = city;
      if (category && category !== 'All' && category !== 'All Categories') params.category = category;
      if (condition && condition !== 'All' && condition !== 'All Conditions') params.condition = condition;
      if (exchangeType && exchangeType !== 'All' && exchangeType !== 'All Types') params.exchangeType = exchangeType;
      params.sort = sort;
      if (user?.district) params.userDistrict = user.district;

      const res = await api.getItems(params);
      setItems(res.items);
    } catch (err) {
      console.error('Failed to load items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [district, city, category, condition, exchangeType, sort]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchItems();
  };

  const handleResetFilters = () => {
    setDistrict('All Districts');
    setCity('All');
    setCategory('All Categories');
    setCondition('All Conditions');
    setExchangeType('All Types');
    setSearch('');
    setSort('nearest');
    setSelectedZone('All');
  };

  const hasActiveFilters =
    (district && district !== 'All Districts') ||
    city !== 'All' ||
    (category && category !== 'All Categories') ||
    (condition && condition !== 'All Conditions') ||
    (exchangeType && exchangeType !== 'All Types') ||
    search !== '';

  const zoneFilters = [
    { id: 'All', name: language === 'ta' ? 'அனைத்து 38 மாவட்டங்கள்' : 'All 38 Districts' },
    { id: 'North', name: language === 'ta' ? 'வடக்கு' : 'North Zone' },
    { id: 'West', name: language === 'ta' ? 'கொங்கு' : 'West Zone' },
    { id: 'Central', name: language === 'ta' ? 'காவிரி & மத்திய' : 'Central & Delta' },
    { id: 'South', name: language === 'ta' ? 'பாண்டிய' : 'South Zone' }
  ];

  const filteredDistrictsList = ALL_38_DISTRICTS.filter(d => {
    if (selectedZone === 'All') return true;
    if (selectedZone === 'Central') return d.region === 'Central' || d.region === 'Cauvery Delta';
    return d.region === selectedZone;
  });

  const currentDistrictInfo = ALL_38_DISTRICTS.find(d => d.name.toLowerCase() === district.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner Notice */}
      <LocationRestrictionAlert />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>Tamil Nadu Directory • All 38 Districts Active</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {language === 'ta' ? 'பொருட்களைத் தேடுங்கள்' : 'Browse Tamil Nadu Listings'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {district && district !== 'All Districts' ? (
              <span>
                Viewing products in <strong className="text-emerald-800 font-bold">{district}</strong> ({currentDistrictInfo?.tamilName}), Tamil Nadu.
              </span>
            ) : user ? (
              <span>
                Defaulting to your region: <strong className="text-slate-800">{user.district}</strong>. Click any of the 38 districts below to see products.
              </span>
            ) : (
              'Discover items to reuse, exchange, or receive as giveaways across all 38 districts of Tamil Nadu.'
            )}
          </p>
        </div>

        {/* Mobile filter toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex-1 py-2.5 px-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{showMobileFilters ? 'Hide Filters' : 'Filters'}</span>
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
          </button>
        </div>
      </div>

      {/* DISTRICT QUICK SELECT BAR (38 Districts of Tamil Nadu) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-100 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-800">
              {language === 'ta' ? 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும் (38 மாவட்டங்கள்):' : 'Select Any Tamil Nadu District (38 Districts):'}
            </span>
          </div>

          {/* Zone filter tabs */}
          <div className="flex flex-wrap gap-1">
            {zoneFilters.map(z => (
              <button
                key={z.id}
                onClick={() => setSelectedZone(z.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                  selectedZone === z.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {z.name}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable / Clickable Pills for Districts */}
        <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
          <button
            onClick={() => setDistrict('All Districts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              district === 'All Districts'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300'
            }`}
          >
            All Tamil Nadu (38)
          </button>

          {filteredDistrictsList.map(d => {
            const isSelected = district.toLowerCase() === d.name.toLowerCase();
            return (
              <button
                key={d.id}
                onClick={() => setDistrict(d.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-sm scale-102'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/60'
                }`}
              >
                <span>{d.name}</span>
                <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-emerald-700 font-medium'}`}>
                  {d.tamilName}
                </span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => { setSearch(''); fetchItems(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl transition-colors shadow-sm"
        >
          {language === 'ta' ? 'தேடுக' : 'Search'}
        </button>
      </form>

      {/* Filters Container */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs ${showMobileFilters ? 'block' : 'hidden lg:grid'}`}>
        {/* District Filter Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            {t.district}
          </label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All Districts">{t.allDistricts}</option>
            {ALL_38_DISTRICTS.map(d => (
              <option key={d.id} value={d.name}>
                {d.name} ({d.tamilName})
              </option>
            ))}
          </select>
        </div>

        {/* City Filter (Filtered by District) */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            {t.cityTown}
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={availableCities.length === 0}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            <option value="All">{availableCities.length === 0 ? 'Select District First' : 'All Towns / Cities'}</option>
            {availableCities.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            {t.category}
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All Categories">{t.allCategories}</option>
            {Object.keys(t.categories).map(cat => (
              <option key={cat} value={cat}>
                {language === 'ta' ? t.categories[cat as keyof typeof t.categories] : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Exchange Type */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            Exchange Type
          </label>
          <select
            value={exchangeType}
            onChange={(e) => setExchangeType(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All Types">{t.allTypes}</option>
            <option value="Give Away">{t.types['Give Away']}</option>
            <option value="Exchange">{t.types['Exchange']}</option>
            <option value="Donate">{t.types['Donate']}</option>
          </select>
        </div>

        {/* Condition Filter */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            {t.condition}
          </label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All Conditions">{t.allConditions}</option>
            <option value="Like New">{t.conditions['Like New']}</option>
            <option value="Gently Used">{t.conditions['Gently Used']}</option>
            <option value="Good">{t.conditions['Good']}</option>
            <option value="Fair">{t.conditions['Fair']}</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            {t.sortBy}
          </label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="nearest">{t.nearMe}</option>
            <option value="newest">{t.newest}</option>
            <option value="views">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Active filter summary bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 py-1 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span>
            {district && district !== 'All Districts' ? (
              <span>
                Showing products in <strong className="text-emerald-900 font-extrabold text-sm">{district}</strong> ({currentDistrictInfo?.tamilName}) • <strong className="text-slate-900">{items.length}</strong> items available
              </span>
            ) : (
              <span>
                Showing <strong className="text-slate-900">{items.length}</strong> items across all 38 districts of Tamil Nadu
              </span>
            )}
          </span>

          {district && district !== 'All Districts' && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold flex items-center gap-1">
              <span>{district}</span>
              <button onClick={() => setDistrict('All Districts')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {category && category !== 'All Categories' && (
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center gap-1">
              <span>{category}</span>
              <button onClick={() => setCategory('All Categories')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {exchangeType && exchangeType !== 'All Types' && (
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 font-bold flex items-center gap-1">
              <span>{exchangeType}</span>
              <button onClick={() => setExchangeType('All Types')}><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 underline shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Items Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-semibold">Loading listings for {district}...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-md mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-lg text-slate-900">No items match your specific filters</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
            No items in {district !== 'All Districts' ? district : 'Tamil Nadu'} with current category/condition filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer"
          >
            View All Tamil Nadu Listings
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => onSelectItem(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
