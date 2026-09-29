import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Heart,
  Share2,
  Flag,
  ShieldCheck,
  Star,
  Calendar,
  Layers,
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Package,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Item, User } from '../types';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { api } from '../services/api.ts';
import { ItemCard } from '../components/ItemCard.tsx';
import { RequestItemModal } from '../components/RequestItemModal.tsx';
import { ReportModal } from '../components/ReportModal.tsx';
import { ChatModal } from '../components/ChatModal.tsx';
import { LocationRestrictionAlert } from '../components/LocationRestrictionAlert.tsx';

interface ItemDetailPageProps {
  itemId: string;
  onBack: () => void;
  onSelectItem: (item: Item) => void;
  onNavigateLogin: () => void;
}

export const ItemDetailPage: React.FC<ItemDetailPageProps> = ({
  itemId,
  onBack,
  onSelectItem,
  onNavigateLogin
}) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [item, setItem] = useState<Item | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [similarItems, setSimilarItems] = useState<Item[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState<boolean>(false);
  const [requestSuccessMessage, setRequestSuccessMessage] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);
    api.getItemById(itemId)
      .then(res => {
        setItem(res.item);
        setOwner(res.owner);
        setSimilarItems(res.similarItems);
        setActiveImageIndex(0);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [itemId]);

  const handleToggleSave = async () => {
    if (!user) {
      onNavigateLogin();
      return;
    }
    if (!item) return;

    try {
      const res = await api.toggleSaveItem(item.id);
      setIsSaved(res.saved);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item?.title || 'SwapNeat Item',
        text: `Check out "${item?.title}" available in ${item?.city}, ${item?.district}, Tamil Nadu on SwapNeat!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold">Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border text-center space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Item Not Found</h2>
        <p className="text-xs text-slate-500">
          This item may have been completed, expired, or removed from Tamil Nadu directory.
        </p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          Return to Browse
        </button>
      </div>
    );
  }

  const isOwner = user && user.id === item.ownerId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Banner Notice */}
      <LocationRestrictionAlert />

      {/* Back button */}
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Listings</span>
        </button>
      </div>

      {requestSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>{requestSuccessMessage}</span>
          </div>
          <button
            onClick={() => setRequestSuccessMessage('')}
            className="text-xs font-bold text-emerald-800 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Item Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Images Gallery (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image */}
          <div className="aspect-4/3 w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 relative shadow-sm">
            <img
              src={item.images[activeImageIndex] || item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {/* Exchange Type Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-600 text-white shadow-md">
                {item.exchangeType}
              </span>
            </div>
            {/* Condition Badge */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-xs text-white font-semibold">
              Condition: {item.condition}
            </div>
          </div>

          {/* Thumbnails list */}
          {item.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx ? 'border-emerald-600 scale-102 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Safe Meeting Location Box */}
          <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldCheck className="w-5 h-5 text-amber-700" />
              <span>Public Landmark & Safe Meeting Zone</span>
            </div>
            <p className="leading-relaxed">
              <strong>Location:</strong> {item.approximateArea || `${item.city}, ${item.district}, Tamil Nadu`}.
            </p>
            <p className="text-[11px] text-amber-800/80">
              SwapNeat does not publish residential home addresses. Please coordinate exchange meetups at well-lit, public locations such as the local bus terminal, town clock tower, or railway junction.
            </p>
          </div>
        </div>

        {/* Right: Info & Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            {/* Category & Date */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                {item.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Listed {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              {item.title}
            </h1>

            {/* Tamil Nadu Location Badge */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {item.city}, <strong className="text-slate-900">{item.district}</strong>, Tamil Nadu
              </span>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                About this item
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 text-xs py-3 border-y border-slate-100">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Quantity</span>
                <span className="font-bold text-slate-900">{item.quantity} available</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Condition</span>
                <span className="font-bold text-slate-900">{item.condition}</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Views</span>
                <span className="font-bold text-slate-900">{item.views} interested</span>
              </div>
            </div>

            {/* Owner Profile Card */}
            {owner && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={owner.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(owner.name)}`}
                    alt={owner.name}
                    className="w-12 h-12 rounded-xl object-cover border border-emerald-500"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{owner.name}</h5>
                    <p className="text-[11px] text-slate-500">{owner.city}, {owner.district} (TN)</p>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{owner.rating.toFixed(1)}</span>
                      <span className="text-slate-400 text-[10px]">({owner.ratingCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Actions CTA */}
            <div className="space-y-3 pt-2">
              {isOwner ? (
                <div className="p-3 bg-slate-100 rounded-2xl text-center text-xs font-semibold text-slate-600">
                  This is your listing. View requests in your Dashboard.
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!user) {
                      onNavigateLogin();
                    } else {
                      setIsRequestModalOpen(true);
                    }
                  }}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Package className="w-5 h-5" />
                  <span>Request Item ({item.exchangeType})</span>
                </button>
              )}

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleToggleSave}
                  className={`py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                    isSaved
                      ? 'bg-rose-50 border-rose-200 text-rose-600'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => {
                    if (!user) {
                      onNavigateLogin();
                    } else {
                      setIsReportModalOpen(true);
                    }
                  }}
                  className="py-2.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Flag className="w-4 h-4" />
                  <span>Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Tamil Nadu Items */}
      {similarItems.length > 0 && (
        <section className="pt-10 border-t border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900">
                Similar Items in {item.district} & Tamil Nadu
              </h3>
              <p className="text-xs text-slate-500">Other items in this category or local region</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {similarItems.map(sim => (
              <ItemCard
                key={sim.id}
                item={sim}
                onClick={() => onSelectItem(sim)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <RequestItemModal
        item={item}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={() => {
          setIsRequestModalOpen(false);
          setRequestSuccessMessage('Request sent to the owner! You can track status and chat in your Dashboard.');
        }}
      />

      <ReportModal
        item={item}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSuccess={() => {
          setIsReportModalOpen(false);
          alert('Listing report has been submitted to the Tamil Nadu moderation team.');
        }}
      />
    </div>
  );
};
