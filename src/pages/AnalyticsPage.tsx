import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  MapPin,
  Trees,
  Recycle,
  HeartHandshake,
  Gift,
  Building2,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../services/api.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import { LocationRestrictionAlert } from '../components/LocationRestrictionAlert.tsx';

export const AnalyticsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [tnData, setTnData] = useState<{
    topDistricts: { name: string; items: number; users: number; exchanges: number; region: string }[];
    allDistrictsActivity: { name: string; items: number; users: number; exchanges: number; region: string }[];
    categoryCounts: Record<string, number>;
    typeCounts: Record<string, number>;
    monthlyActivity: { month: string; itemsReused: number; newUsers: number }[];
  } | null>(null);

  const [sustainability, setSustainability] = useState<{
    headline: string;
    metrics: {
      totalItemsReused: number;
      itemsDonated: number;
      itemsExchanged: number;
      itemsGivenAway: number;
      estimatedWasteReducedKg: number;
      estimatedCo2SavedKg: number;
      treesPlantedEquivalent: number;
      successfulExchanges: number;
    };
    note: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    Promise.all([
      api.getTamilNaduAnalytics(),
      api.getSustainabilityImpact()
    ])
      .then(([tnRes, sustRes]) => {
        setTnData(tnRes);
        setSustainability(sustRes);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold">Loading Tamil Nadu reuse analytics...</p>
      </div>
    );
  }

  const topDistricts = tnData?.topDistricts || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Top Banner Notice */}
      <LocationRestrictionAlert />

      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 mb-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tamil Nadu Community Reuse Report • 38 Districts</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {language === 'ta' ? 'தமிழ்நாடு மறுபயன்பாட்டுச் செயல்பாடு' : 'Tamil Nadu Reuse Activity & Sustainability'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          Tracking circular exchange, waste diversion, and community generosity across all 38 districts of Tamil Nadu.
        </p>
      </div>

      {/* Sustainability Impact Spotlight */}
      {sustainability && (
        <section className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <Trees className="w-4 h-4" />
              <span>SUSTAINABILITY DASHBOARD</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              “{sustainability.headline}”
            </h2>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <span className="text-slate-300 text-xs font-medium block">Total Items Reused</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">
                  {sustainability.metrics.totalItemsReused.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-200/70 mt-0.5 block">Tamil Nadu Community</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <span className="text-slate-300 text-xs font-medium block">Estimated Waste Diverted</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-300 mt-1 block">
                  {sustainability.metrics.estimatedWasteReducedKg.toLocaleString()} kg
                </span>
                <span className="text-[11px] text-amber-200/70 mt-0.5 block">Solid waste prevented</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <span className="text-slate-300 text-xs font-medium block">CO₂ Emissions Saved</span>
                <span className="text-2xl sm:text-3xl font-black text-teal-300 mt-1 block">
                  {sustainability.metrics.estimatedCo2SavedKg.toLocaleString()} kg
                </span>
                <span className="text-[11px] text-teal-200/70 mt-0.5 block">Carbon footprint offset</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <span className="text-slate-300 text-xs font-medium block">Successful Exchanges</span>
                <span className="text-2xl sm:text-3xl font-black text-purple-300 mt-1 block">
                  {sustainability.metrics.successfulExchanges.toLocaleString()}
                </span>
                <span className="text-[11px] text-purple-200/70 mt-0.5 block">Zero-waste handovers</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-emerald-200/70 pt-2 border-t border-white/10">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>{sustainability.note}</span>
            </div>
          </div>
        </section>
      )}

      {/* Most Active Districts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Most Active Tamil Nadu Districts
            </h3>
            <p className="text-xs text-slate-500">
              Items listed and exchanged across top participating regions
            </p>
          </div>
        </div>

        {/* District Activity Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topDistricts.slice(0, 8).map((d, index) => (
            <div key={d.name} className="bg-white rounded-2xl border p-4 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-bold text-slate-900">#{index + 1} Ranking</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {d.region} Zone
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-900">{d.name}</h4>
                <p className="text-xs text-emerald-700 font-bold mt-1">
                  {d.items} Items Shared
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{d.users} Registered Users</span>
                <span className="text-slate-800 font-bold">{d.exchanges} completed</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Exchange Types & Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Exchange Modality breakdown */}
        <div className="bg-white rounded-3xl border p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-black text-slate-900 text-base">Exchange Types Distribution</h3>
          <p className="text-xs text-slate-500">
            How Tamil Nadu citizens share resources on SwapNeat
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>1. Give Away (Free community sharing)</span>
                <span className="text-emerald-700">46%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '46%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>2. Exchange (Mutual Barter)</span>
                <span className="text-blue-700">32%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: '32%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>3. Donate (For Students & NGOs)</span>
                <span className="text-purple-700">22%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '22%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white rounded-3xl border p-6 sm:p-8 shadow-xs space-y-4">
          <h3 className="font-black text-slate-900 text-base">Monthly Reuse Growth (Tamil Nadu)</h3>
          <p className="text-xs text-slate-500">
            Rapid adoption of circular economy across districts
          </p>

          <div className="grid grid-cols-6 gap-2 items-end h-44 pt-6">
            {tnData?.monthlyActivity.map(m => (
              <div key={m.month} className="flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-bold text-emerald-800">{m.itemsReused}</span>
                <div
                  className="w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-lg transition-all hover:opacity-90"
                  style={{ height: `${Math.min(100, (m.itemsReused / 800) * 100)}%` }}
                />
                <span className="text-[10px] font-bold text-slate-600">{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
