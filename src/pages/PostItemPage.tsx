import React, { useState } from 'react';
import {
  Upload,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Plus,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ALL_38_DISTRICTS, getCitiesForDistrict, OTHER_INDIAN_STATES } from '../data/tamilNaduLocations.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { api } from '../services/api.ts';
import { ItemCondition, ExchangeType } from '../types';
import { LocationRestrictionAlert } from '../components/LocationRestrictionAlert.tsx';

interface PostItemPageProps {
  onSuccess: (itemId: string) => void;
  onNavigateLogin: () => void;
}

export const PostItemPage: React.FC<PostItemPageProps> = ({
  onSuccess,
  onNavigateLogin
}) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  // Auto-default to user's registered Tamil Nadu location
  const [district, setDistrict] = useState<string>(user?.district || 'Virudhunagar');
  const [city, setCity] = useState<string>(user?.city || 'Sivakasi');
  const [approximateArea, setApproximateArea] = useState<string>('');

  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<string>('Furniture');
  const [description, setDescription] = useState<string>('');
  const [condition, setCondition] = useState<ItemCondition>('Gently Used');
  const [exchangeType, setExchangeType] = useState<ExchangeType>('Give Away');
  const [quantity, setQuantity] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80'
  ]);

  const [attemptedOtherState, setAttemptedOtherState] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const availableCities = getCitiesForDistrict(district);

  const handleDistrictChange = (newDistrict: string) => {
    setDistrict(newDistrict);
    const cities = getCitiesForDistrict(newDistrict);
    if (cities.length > 0) {
      setCity(cities[0]);
    }
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setImages(prev => [...prev, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to post items on SwapNeat.');
      return;
    }

    if (!title.trim() || !description.trim()) {
      setError('Please fill in title and description.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const res = await api.createItem({
        title: title.trim(),
        description: description.trim(),
        category,
        condition,
        exchangeType,
        quantity: Number(quantity) || 1,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'],
        state: 'Tamil Nadu', // Strictly forced
        district,
        city,
        approximateArea: approximateArea.trim() || `Near ${city}, ${district}`
      });

      onSuccess(res.item.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to post item.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Upload className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Sign in to Post Items</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Posting items on SwapNeat is completely free for Tamil Nadu residents. Sign in or register in under 1 minute.
        </p>
        <button
          onClick={onNavigateLogin}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner Notice */}
      <LocationRestrictionAlert />

      {attemptedOtherState && (
        <LocationRestrictionAlert
          attemptedState={attemptedOtherState}
          onDismiss={() => setAttemptedOtherState('')}
        />
      )}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-6">
        {/* Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-emerald-800 to-teal-900 text-white">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 border border-white/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Tamil Nadu Reuse Community</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {language === 'ta' ? 'பயன்படுத்தாத பொருளைப் பதிவு செய்க' : 'Post an Unused Item'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            Give away or exchange items with friendly neighbors across your district.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Section: Basic Details */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2">
              1. Item Information
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Item Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Teak Wood Study Table with Drawer"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Category & Exchange Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {Object.keys(t.categories).map(cat => (
                    <option key={cat} value={cat}>
                      {language === 'ta' ? t.categories[cat as keyof typeof t.categories] : cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Exchange Type *
                </label>
                <select
                  value={exchangeType}
                  onChange={(e) => setExchangeType(e.target.value as ExchangeType)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Give Away">1. Give Away (100% Free)</option>
                  <option value="Exchange">2. Exchange (Barter for another item)</option>
                  <option value="Donate">3. Donate (For NGOs/Students in need)</option>
                </select>
              </div>
            </div>

            {/* Condition & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Item Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ItemCondition)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Like New">Like New (Mint condition)</option>
                  <option value="Gently Used">Gently Used (Minor signs of use)</option>
                  <option value="Good">Good (Fully functional)</option>
                  <option value="Fair">Fair (Noticeable wear but works)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description *
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe features, dimensions, age, why you are passing it on, and any exchange preferences..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Section: Photos */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-2">
              2. Photos
            </h3>

            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Paste an image URL (e.g. Unsplash or hosted photo link)..."
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
              >
                Add Image
              </button>
            </div>

            {/* Image Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200 group">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-rose-600 text-white opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Tamil Nadu Location (STRICT RESTRICTION) */}
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>3. Location (Strictly Tamil Nadu Only)</span>
              </h3>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Auto-defaulted to your district
              </span>
            </div>

            {/* State (LOCKED to Tamil Nadu) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                State (Fixed)
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  value="Tamil Nadu"
                  className="w-full p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-black text-emerald-950 cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  LOCKED TO TN
                </span>
              </div>
            </div>

            {/* District & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  District (38 Districts of Tamil Nadu) *
                </label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {ALL_38_DISTRICTS.map(d => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.tamilName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City / Town *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {availableCities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Approximate Landmark (Safe Public Location) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Approximate Landmark / Public Area (Optional)
              </label>
              <input
                type="text"
                value={approximateArea}
                onChange={(e) => setApproximateArea(e.target.value)}
                placeholder="e.g. Near Sivakasi Main Bus Stand or Railway Road (Never enter home door address)"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                For safety, enter only a nearby bus stand, college, or market landmark. Your exact address is never displayed.
              </p>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Free community circular reuse across Tamil Nadu</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Posting Item...' : 'Publish Listing'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
