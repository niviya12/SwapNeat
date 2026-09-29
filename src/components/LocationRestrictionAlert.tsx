import React from 'react';
import { MapPin, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface LocationRestrictionAlertProps {
  attemptedState?: string;
  onDismiss?: () => void;
  compact?: boolean;
}

export const LocationRestrictionAlert: React.FC<LocationRestrictionAlertProps> = ({
  attemptedState,
  onDismiss,
  compact = false
}) => {
  const { language } = useLanguage();

  if (attemptedState && attemptedState.toLowerCase() !== 'tamil nadu') {
    return (
      <div className="bg-amber-50 border-2 border-amber-500/80 rounded-xl p-4 shadow-sm flex items-start gap-3 my-3 text-amber-900 animate-fadeIn">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-sm text-amber-950">
            {language === 'ta' ? 'தமிழ்நாட்டில் மட்டுமே கிடைக்கிறது' : 'Location Not Supported'}
          </h4>
          <p className="text-sm font-medium mt-0.5">
            SwapNeat is currently available only in Tamil Nadu.
          </p>
          <p className="text-xs text-amber-800/80 mt-1">
            {language === 'ta'
              ? 'ஸ்வாப்நீட் தமிழ்நாட்டின் 38 மாவட்டங்களுக்கு மட்டுமே உருவாக்கப்பட்டுள்ளது. பிற மாநிலங்களுக்கு தற்போது சேவை வழங்கப்படாது.'
              : `You tried to enter or select "${attemptedState}". All items, exchanges, and accounts must be located within Tamil Nadu.`}
          </p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-amber-700 hover:text-amber-900 text-xs font-semibold px-2 py-1 rounded bg-amber-100"
          >
            OK
          </button>
        )}
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Tamil Nadu Only (38 Districts)</span>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3 text-emerald-900 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
          TN
        </div>
        <div className="text-xs">
          <p className="font-semibold text-emerald-950">
            {language === 'ta' ? 'தமிழ்நாட்டிற்கு மட்டுமே பிரத்தியேகமானது' : 'Exclusive to Tamil Nadu, India'}
          </p>
          <p className="text-emerald-700">
            {language === 'ta'
              ? '38 மாவட்டங்கள் • மறுபயன்பாடு • பரிமாற்றம் • இலவச தானம்'
              : 'All 38 districts supported. Zero-waste circular living from Chennai to Kanniyakumari.'}
          </p>
        </div>
      </div>
      <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-600 text-white shrink-0">
        38 Districts
      </span>
    </div>
  );
};
