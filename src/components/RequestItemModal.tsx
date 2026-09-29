import React, { useState } from 'react';
import { X, Send, MapPin, ShieldCheck, AlertCircle } from 'lucide-react';
import { Item } from '../types';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { api } from '../services/api.ts';

interface RequestItemModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RequestItemModal: React.FC<RequestItemModalProps> = ({
  item,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [message, setMessage] = useState<string>(
    `Vanakkam ${item.ownerName}! I am interested in your "${item.title}". I am located in ${user?.city || 'Tamil Nadu'}, and can arrange convenient public pickup.`
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please sign in or create an account to request items.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await api.sendRequest({
        itemId: item.id,
        message
      });
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send request';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-200">
              {language === 'ta' ? 'கோரிக்கை அனுப்ப' : 'Send Item Request'}
            </span>
            <h3 className="text-lg font-bold truncate max-w-xs">{item.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Item mini recap */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
              <div className="flex items-center gap-1 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{item.city}, {item.district}, Tamil Nadu</span>
              </div>
              <span className="inline-block px-2 py-0.5 rounded font-semibold text-[10px] bg-emerald-100 text-emerald-800">
                {item.exchangeType}
              </span>
            </div>
          </div>

          {/* Requester Location check */}
          {user && (
            <div className="text-xs bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/60 text-emerald-900">
              <span className="font-semibold">{language === 'ta' ? 'உங்கள் இருப்பிடம்:' : 'Your Location:'} </span>
              <span>{user.city}, {user.district}, Tamil Nadu</span>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                The owner will see your approximate city to coordinate safe pickup.
              </p>
            </div>
          )}

          {/* Message field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {language === 'ta' ? 'உரிமையாளருக்கு செய்தி' : 'Message to Owner'}
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain why you need this item and your preferred pickup timing..."
              className="w-full p-3 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Safety reminder */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              {language === 'ta'
                ? 'பாதுகாப்பு குறிப்பு: எப்போதும் பொது இடங்களிலேயே (பேருந்து நிலையம், மக்கள் கூடும் இடங்கள்) சந்திக்கவும்.'
                : 'Safety rule: Always meet in well-lit public spots (bus stands, college gates, metro). Never disclose private residence details.'}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending...' : 'Send Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
