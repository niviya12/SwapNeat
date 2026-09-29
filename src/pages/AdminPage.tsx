import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Package,
  CheckCircle2,
  AlertTriangle,
  Flag,
  Trash2,
  BarChart2,
  MapPin,
  Check,
  X,
  Search
} from 'lucide-react';
import { User, Item, ReportItem } from '../types';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../services/api.ts';
import { LocationRestrictionAlert } from '../components/LocationRestrictionAlert.tsx';

interface AdminPageProps {
  onSelectItem: (item: Item) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onSelectItem }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<{
    metrics: {
      totalUsers: number;
      totalItems: number;
      activeListings: number;
      completedExchanges: number;
      pendingRequests: number;
      totalReports: number;
      pendingReports: number;
    };
    districtStats: {
      usersByDistrict: Record<string, number>;
      itemsByDistrict: Record<string, number>;
    };
  } | null>(null);

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'users' | 'items'>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      const [overviewRes, repRes, userRes, itemRes] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminReports(),
        api.getAdminUsers(),
        api.getItems({})
      ]);

      setStats(overviewRes);
      setReports(repRes.reports);
      setUsersList(userRes.users);
      setItemsList(itemRes.items);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleModerateReport = async (reportId: string, status: string, action?: string) => {
    try {
      await api.updateAdminReport(reportId, status, action);
      alert('Report updated.');
      loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminDeleteItem = async (itemId: string) => {
    if (!confirm('Permanently remove this listing from Tamil Nadu directory?')) return;
    try {
      await api.adminDeleteItem(itemId);
      setItemsList(prev => prev.filter(i => i.id !== itemId));
      alert('Item removed.');
    } catch (err) {
      console.error(err);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border text-center space-y-4">
        <Shield className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Admin Privileges Required</h2>
        <p className="text-xs text-slate-500">
          This panel is restricted to verified SwapNeat Tamil Nadu state administrators.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-xs font-semibold">Loading Admin Console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Notice */}
      <LocationRestrictionAlert />

      {/* Admin Header */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl border border-purple-800/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>State Moderation & Enforcement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">SwapNeat Tamil Nadu Admin</h1>
          <p className="text-xs text-purple-200/80 mt-1">
            Overseeing all 38 districts, community reports, user trust ratings, and circular activity.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'overview' ? 'bg-purple-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
              activeTab === 'reports' ? 'bg-purple-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <span>Reports</span>
            {reports.filter(r => r.status === 'Pending').length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {reports.filter(r => r.status === 'Pending').length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'users' ? 'bg-purple-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Users ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'items' ? 'bg-purple-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Listings ({itemsList.length})
          </button>
        </div>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border shadow-xs">
              <span className="text-xs font-medium text-slate-500">Total Registered Users</span>
              <span className="text-3xl font-black text-slate-900 block mt-1">{stats.metrics.totalUsers}</span>
              <span className="text-[10px] text-emerald-600 font-bold">100% Tamil Nadu Verified</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border shadow-xs">
              <span className="text-xs font-medium text-slate-500">Total Listed Items</span>
              <span className="text-3xl font-black text-slate-900 block mt-1">{stats.metrics.totalItems}</span>
              <span className="text-[10px] text-blue-600 font-bold">{stats.metrics.activeListings} Active</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border shadow-xs">
              <span className="text-xs font-medium text-slate-500">Completed Exchanges</span>
              <span className="text-3xl font-black text-slate-900 block mt-1">{stats.metrics.completedExchanges}</span>
              <span className="text-[10px] text-emerald-600 font-bold">Verified Zero-Waste</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border shadow-xs">
              <span className="text-xs font-medium text-slate-500">Community Reports</span>
              <span className="text-3xl font-black text-rose-600 block mt-1">{stats.metrics.totalReports}</span>
              <span className="text-[10px] text-rose-500 font-bold">{stats.metrics.pendingReports} Pending Review</span>
            </div>
          </div>

          {/* District Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Users by Tamil Nadu District</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 text-xs">
                {Object.entries(stats.districtStats.usersByDistrict).map(([dist, count]) => (
                  <div key={dist} className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="font-medium text-slate-700">{dist}</span>
                    <span className="font-bold text-slate-900">{count} users</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border shadow-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Items by Tamil Nadu District</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2 text-xs">
                {Object.entries(stats.districtStats.itemsByDistrict).map(([dist, count]) => (
                  <div key={dist} className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="font-medium text-slate-700">{dist}</span>
                    <span className="font-bold text-emerald-700">{count} items</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Reports */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl border p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Community Moderation Reports</h3>

          {reports.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No reports on file.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {reports.map(rep => (
                <div key={rep.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{rep.itemTitle}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        {rep.reason}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rep.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {rep.status}
                      </span>
                    </div>
                    <p className="text-slate-500 mt-1">
                      Reported by: <strong>{rep.reportedByName}</strong> • Details: {rep.details || 'None provided'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {rep.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleModerateReport(rep.id, 'Action_Taken', 'remove_item')}
                          className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                        >
                          Remove Item
                        </button>
                        <button
                          onClick={() => handleModerateReport(rep.id, 'Dismissed')}
                          className="px-3 py-1.5 rounded-xl border hover:bg-slate-50 text-slate-600 font-bold text-xs"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Registered Tamil Nadu Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] border-b">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">District</th>
                  <th className="p-3">City/Town</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="p-3 font-bold text-slate-900">{u.name}</td>
                    <td className="p-3 font-semibold text-emerald-800">{u.district}</td>
                    <td className="p-3 text-slate-600">{u.city}</td>
                    <td className="p-3 text-slate-600">{u.phone}</td>
                    <td className="p-3 font-bold text-amber-600">★ {u.rating.toFixed(1)}</td>
                    <td className="p-3 font-bold uppercase text-[10px] text-slate-500">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Listings */}
      {activeTab === 'items' && (
        <div className="bg-white rounded-3xl border p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Active Directory Listings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {itemsList.map(item => (
              <div key={item.id} className="p-3 border rounded-2xl flex gap-3 text-xs">
                <img src={item.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-500">{item.city}, {item.district}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => onSelectItem(item)}
                      className="text-emerald-700 font-bold hover:underline"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => handleAdminDeleteItem(item.id)}
                      className="text-rose-600 font-bold hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
