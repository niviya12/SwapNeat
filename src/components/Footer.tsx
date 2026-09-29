import React from 'react';
import { Recycle, ShieldCheck, MapPin, Heart, Trees } from 'lucide-react';
import { ALL_38_DISTRICTS } from '../data/tamilNaduLocations.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface FooterProps {
  onNavigate: (tab: string, params?: Record<string, string>) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 lg:pb-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Purpose */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Recycle className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">
                SWAP<span className="text-emerald-400">NEAT</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                Tamil Nadu
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              “{t.tagline}”
            </p>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>State Exclusivity</span>
              </div>
              <p className="text-[11px] text-slate-400">
                SwapNeat operates strictly within Tamil Nadu, India. Registrations and item postings outside Tamil Nadu are rejected.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Explore Platform</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('browse')} className="hover:text-white transition-colors">
                  {t.exploreItems}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('post')} className="hover:text-white transition-colors">
                  {t.postAnItem}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('analytics')} className="hover:text-white transition-colors">
                  {t.tamilNaduReuseActivity}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('analytics')} className="hover:text-white transition-colors">
                  {t.sustainabilityImpact}
                </button>
              </li>
            </ul>
          </div>

          {/* Exchange Categories */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Popular Categories</h4>
            <div className="flex flex-wrap gap-1.5">
              {['Books', 'Furniture', 'Electronics', 'Kitchen Items', 'Sports Items', 'Toys', 'Study Materials'].map(cat => (
                <button
                  key={cat}
                  onClick={() => onNavigate('browse', { category: cat })}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Safety & Community */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Safe Tamil Nadu Reuse</h4>
            <p className="text-slate-400 leading-relaxed mb-3">
              Always arrange pickups at popular public landmarks in your town (bus stands, railway stations, tea shops) during daylight hours.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Trees className="w-4 h-4" />
              <span>Zero-Waste Tamil Nadu Initiative</span>
            </div>
          </div>
        </div>

        {/* 38 Districts Directory Bar */}
        <div className="py-6 border-b border-slate-800">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            38 Districts of Tamil Nadu:
          </p>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-500">
            {ALL_38_DISTRICTS.map((d, index) => (
              <span key={d.id} className="inline-flex items-center">
                <button
                  onClick={() => onNavigate('browse', { district: d.name })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {d.name} ({d.tamilName})
                </button>
                {index < ALL_38_DISTRICTS.length - 1 && <span className="ml-2 text-slate-700">•</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} SWAPNEAT. Built for the people of Tamil Nadu.</p>
          <p className="flex items-center gap-1">
            <span>Give what you don’t need. Find what you need.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
