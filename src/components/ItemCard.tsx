import React, { useState } from 'react';
import { MapPin, Heart, Sparkles, Star, Tag } from 'lucide-react';
import { Item } from '../types';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { api } from '../services/api.ts';

interface ItemCardProps {
  item: Item;
  onClick?: () => void;
  onSaveToggle?: (itemId: string, saved: boolean) => void;
  isSavedInitial?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onClick,
  onSaveToggle,
  isSavedInitial = false
}) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [isSaved, setIsSaved] = useState<boolean>(isSavedInitial);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      alert('Please log in to save items to your Tamil Nadu collection.');
      return;
    }
    try {
      setIsSaving(true);
      const res = await api.toggleSaveItem(item.id);
      setIsSaved(res.saved);
      onSaveToggle?.(item.id, res.saved);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const getExchangeTypeBadge = (type: string) => {
    switch (type) {
      case 'Give Away':
        return 'bg-emerald-600 text-white';
      case 'Exchange':
        return 'bg-blue-600 text-white';
      case 'Donate':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  const getConditionColor = (cond: string) => {
    switch (cond) {
      case 'Like New':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Gently Used':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Good':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Fair':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Check proximity to user location
  const isSameCity = user && user.city.toLowerCase() === item.city.toLowerCase();
  const isSameDistrict = user && !isSameCity && user.district.toLowerCase() === item.district.toLowerCase();

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Top Image & badges */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={item.images[0] || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

        {/* Exchange Type Badge */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide uppercase shadow-sm ${getExchangeTypeBadge(item.exchangeType)}`}>
            {language === 'ta' ? (t.types[item.exchangeType] || item.exchangeType) : item.exchangeType}
          </span>

          {/* Smart Location match chip */}
          {isSameCity && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-400 text-amber-950 shadow-sm">
              <Sparkles className="w-3 h-3" />
              {language === 'ta' ? 'அதே ஊர்' : 'Same Town'}
            </span>
          )}
          {isSameDistrict && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm">
              {language === 'ta' ? 'அதே மாவட்டம்' : 'Same District'}
            </span>
          )}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          title={isSaved ? 'Remove from saved' : 'Save item'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
            isSaved
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Condition pill at bottom right of image */}
        <div className="absolute bottom-2.5 right-2.5">
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium border shadow-xs backdrop-blur-xs ${getConditionColor(item.condition)}`}>
            {language === 'ta' ? (t.conditions[item.condition] || item.condition) : item.condition}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Status */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
              <Tag className="w-3 h-3" />
              {language === 'ta' ? (t.categories[item.category as keyof typeof t.categories] || item.category) : item.category}
            </span>
            {item.status === 'in_negotiation' && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                In Negotiation
              </span>
            )}
          </div>

          {/* Title */}
          <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {item.title}
          </h4>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Location & Owner Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {/* Safe Tamil Nadu Location */}
          <div className="flex items-center gap-1 text-slate-700 font-medium truncate max-w-[65%]">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">
              {item.city}, <span className="font-bold text-slate-900">{item.district}</span>
            </span>
          </div>

          {/* Owner rating */}
          <div className="flex items-center gap-1 text-amber-600 font-bold shrink-0 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{item.ownerRating ? item.ownerRating.toFixed(1) : '5.0'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
