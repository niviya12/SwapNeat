import React, { useState } from 'react';
import { MapPin, ArrowRight, Sparkles, Building2, Trees } from 'lucide-react';
import { ALL_38_DISTRICTS } from '../data/tamilNaduLocations.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface TamilNaduMapVisualProps {
  onSelectDistrict?: (districtName: string) => void;
  selectedDistrict?: string;
}

export const TamilNaduMapVisual: React.FC<TamilNaduMapVisualProps> = ({
  onSelectDistrict,
  selectedDistrict = ''
}) => {
  const { language } = useLanguage();
  const [activeZone, setActiveZone] = useState<string>('All');
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const zones = [
    { id: 'All', name: language === 'ta' ? 'அனைத்து 38 மாவட்டங்கள்' : 'All 38 Districts', count: 38 },
    { id: 'North', name: language === 'ta' ? 'வடக்கு மண்டலம்' : 'Northern Zone', count: 9 },
    { id: 'West', name: language === 'ta' ? 'மேற்கு கொங்கு' : 'Western Kongu', count: 8 },
    { id: 'Central', name: language === 'ta' ? 'மத்திய & காவிரி' : 'Central & Delta', count: 11 },
    { id: 'South', name: language === 'ta' ? 'தெற்கு மண்டலம்' : 'Southern Pandiya', count: 10 }
  ];

  const filteredDistricts = ALL_38_DISTRICTS.filter(d => {
    if (activeZone === 'All') return true;
    if (activeZone === 'Central') return d.region === 'Central' || d.region === 'Cauvery Delta';
    return d.region === activeZone;
  });

  // Major hubs with coordinates on a stylized TN outline
  const keyHubs = [
    { name: 'Chennai', x: 78, y: 18, count: '560+', tag: 'North Hub' },
    { name: 'Coimbatore', x: 28, y: 52, count: '410+', tag: 'Kongu Hub' },
    { name: 'Madurai', x: 45, y: 68, count: '320+', tag: 'Pandiya Hub' },
    { name: 'Virudhunagar', x: 40, y: 76, count: '245+', tag: 'Sivakasi / Reuse' },
    { name: 'Salem', x: 48, y: 40, count: '195+', tag: 'Steel & Textile' },
    { name: 'Tiruchirappalli', x: 56, y: 54, count: '185+', tag: 'Central Delta' },
    { name: 'Tirunelveli', x: 38, y: 86, count: '160+', tag: 'Tirunelveli / Halwa' },
    { name: 'The Nilgiris', x: 20, y: 44, count: '90+', tag: 'Ooty Hills' },
    { name: 'Kanniyakumari', x: 34, y: 95, count: '88+', tag: 'Cape Hub' }
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-6 lg:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-800/40">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'தமிழ்நாடு எல்லை மட்டுமே' : 'Tamil Nadu Exclusive Platform'}</span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              {language === 'ta' ? 'தமிழ்நாடு மறுபயன்பாட்டு வரைபடம்' : 'Tamil Nadu Reuse Network'}
            </h3>
            <p className="text-emerald-200/80 text-sm mt-1 max-w-xl">
              {language === 'ta'
                ? 'சென்னை முதல் கன்னியாகுமரி வரை 38 மாவட்டங்களிலும் பொதுமக்கள் பயனுள்ள பொருட்களைப் பரிமாறிக்கொள்கிறார்கள்.'
                : 'Zero items outside Tamil Nadu. Select any of the 38 districts to instantly explore community reuse in that area.'}
            </p>
          </div>

          {/* Quick zone tabs */}
          <div className="flex flex-wrap gap-1.5 bg-black/30 p-1.5 rounded-2xl border border-white/10">
            {zones.map(z => (
              <button
                key={z.id}
                onClick={() => setActiveZone(z.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeZone === z.id
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'text-emerald-100/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {z.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visual stylized map illustration */}
          <div className="lg:col-span-6 bg-black/40 rounded-2xl p-5 border border-emerald-500/20 relative min-h-[360px] flex items-center justify-center">
            {/* Background SVG shape resembling Tamil Nadu triangle boundary */}
            <svg
              viewBox="0 0 100 110"
              className="w-full h-80 max-h-84 select-none"
              style={{ filter: 'drop-shadow(0 4px 14px rgba(16, 185, 129, 0.2))' }}
            >
              <defs>
                <linearGradient id="tnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#065f46" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#047857" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0f766e" stopOpacity="0.5" />
                </linearGradient>
              </defs>

              {/* Approximate geographical contour of Tamil Nadu */}
              <polygon
                points="75,10 88,24 82,42 86,60 78,72 65,82 52,94 38,105 32,100 24,84 32,70 18,52 24,38 42,30 60,18"
                fill="url(#tnGradient)"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                strokeLinejoin="round"
              />

              {/* Connecting community corridors */}
              <path
                d="M78,18 Q56,54 45,68 T40,76 T38,86 T34,95"
                fill="none"
                stroke="#34d399"
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />
              <path
                d="M28,52 Q48,40 56,54 T45,68"
                fill="none"
                stroke="#34d399"
                strokeWidth="0.8"
                strokeOpacity="0.4"
              />

              {/* District Node Markers */}
              {keyHubs.map(hub => {
                const isSelected = selectedDistrict.toLowerCase() === hub.name.toLowerCase();
                const isHovered = hoveredDistrict === hub.name;
                return (
                  <g
                    key={hub.name}
                    className="cursor-pointer transition-transform duration-200"
                    onClick={() => onSelectDistrict?.(hub.name)}
                    onMouseEnter={() => setHoveredDistrict(hub.name)}
                    onMouseLeave={() => setHoveredDistrict(null)}
                  >
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={isSelected || isHovered ? 5.5 : 3.8}
                      fill={isSelected ? '#f59e0b' : '#10b981'}
                      stroke="#ffffff"
                      strokeWidth="1.2"
                      className="animate-pulse"
                    />
                    <text
                      x={hub.x + 4.5}
                      y={hub.y + 2.5}
                      fontSize="4.2"
                      fontWeight="bold"
                      fill="#ffffff"
                      className="select-none pointer-events-none shadow-xs font-sans"
                    >
                      {hub.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover tooltip / Active district spotlight */}
            <div className="absolute bottom-3 left-3 right-3 bg-emerald-900/90 backdrop-blur-md border border-emerald-400/30 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-white">
                    {hoveredDistrict || selectedDistrict || 'Tamil Nadu'}
                  </span>
                  <span className="text-emerald-300 ml-1.5">
                    {hoveredDistrict
                      ? ALL_38_DISTRICTS.find(d => d.name === hoveredDistrict)?.tamilName
                      : 'தமிழ்நாடு'}
                  </span>
                  <p className="text-[11px] text-emerald-200/80">
                    Click any district to view local reuse listings
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 font-semibold text-[10px]">
                Active Network
              </span>
            </div>
          </div>

          {/* District Selector Grid */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  {language === 'ta' ? 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும்' : 'Explore by District'} ({filteredDistricts.length})
                </span>
                {selectedDistrict && (
                  <button
                    onClick={() => onSelectDistrict?.('')}
                    className="text-xs text-amber-300 hover:underline"
                  >
                    {language === 'ta' ? 'அனைத்தும் காட்டுக' : 'Clear selection'}
                  </button>
                )}
              </div>

              {/* Scrollable districts list */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-72 overflow-y-auto pr-1 text-xs">
                {filteredDistricts.map(dist => {
                  const isSelected = selectedDistrict.toLowerCase() === dist.name.toLowerCase();
                  return (
                    <button
                      key={dist.id}
                      onClick={() => onSelectDistrict?.(dist.name)}
                      className={`text-left p-2 rounded-xl transition-all border flex flex-col ${
                        isSelected
                          ? 'bg-emerald-500 text-white border-emerald-300 shadow-md scale-102'
                          : 'bg-white/5 hover:bg-white/10 text-emerald-100 border-white/5 hover:border-emerald-400/30'
                      }`}
                    >
                      <span className="font-semibold truncate">{dist.name}</span>
                      <span className={`text-[10px] truncate ${isSelected ? 'text-emerald-100' : 'text-emerald-400/80'}`}>
                        {dist.tamilName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Micro Stats Banner */}
            <div className="mt-5 pt-4 border-t border-emerald-800/40 grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/5 rounded-xl p-2.5">
                <span className="block text-xl font-black text-emerald-400">38</span>
                <span className="text-[11px] text-emerald-200/70">
                  {language === 'ta' ? 'மாவட்டங்கள்' : 'Districts'}
                </span>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5">
                <span className="block text-xl font-black text-amber-400">1,250+</span>
                <span className="text-[11px] text-emerald-200/70">
                  {language === 'ta' ? 'பொருட்கள் பரிமாற்றம்' : 'Items Reused'}
                </span>
              </div>
              <div className="bg-white/5 rounded-xl p-2.5">
                <span className="block text-xl font-black text-teal-300">100%</span>
                <span className="text-[11px] text-emerald-200/70">
                  {language === 'ta' ? 'தமிழ்நாடு மட்டும்' : 'Tamil Nadu Only'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
