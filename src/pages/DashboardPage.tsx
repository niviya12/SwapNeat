import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Package,
  Inbox,
  Send,
  Heart,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  User as UserIcon,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Item, RequestItem, ExchangeRecord, ChatMessage, SavedItemRecord } from '../types';
import { ALL_38_DISTRICTS, getCitiesForDistrict } from '../data/tamilNaduLocations.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { api } from '../services/api.ts';
import { ChatModal } from '../components/ChatModal.tsx';
import { ReviewModal } from '../components/ReviewModal.tsx';
import { LocationRestrictionAlert } from '../components/LocationRestrictionAlert.tsx';

interface DashboardPageProps {
  initialTab?: string;
  onSelectItem: (item: Item) => void;
  onNavigatePost: () => void;
  onNavigateBrowse: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  initialTab = 'items',
  onSelectItem,
  onNavigatePost,
  onNavigateBrowse
}) => {
  const { user, updateProfile } = useAuth();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [requestsReceived, setRequestsReceived] = useState<RequestItem[]>([]);
  const [requestsSent, setRequestsSent] = useState<RequestItem[]>([]);
  const [exchanges, setExchanges] = useState<ExchangeRecord[]>([]);
  const [savedItems, setSavedItems] = useState<{ id: string; itemId: string; item?: Item }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Chat modal state
  const [chatThread, setChatThread] = useState<{
    threadId: string;
    itemTitle: string;
    counterpartName: string;
    counterpartDistrict: string;
    counterpartCity: string;
    recipientId: string;
  } | null>(null);

  // Review modal state
  const [reviewExchange, setReviewExchange] = useState<ExchangeRecord | null>(null);

  // Profile edit state
  const [editName, setEditName] = useState<string>(user?.name || '');
  const [editPhone, setEditPhone] = useState<string>(user?.phone || '');
  const [editDistrict, setEditDistrict] = useState<string>(user?.district || 'Virudhunagar');
  const [editCity, setEditCity] = useState<string>(user?.city || 'Sivakasi');
  const [editBio, setEditBio] = useState<string>(user?.bio || '');
  const [profileMessage, setProfileMessage] = useState<string>('');

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const [itemsRes, recRes, sentRes, exRes, savRes] = await Promise.all([
        api.getItems({}),
        api.getReceivedRequests(),
        api.getSentRequests(),
        api.getExchanges(),
        api.getSavedItems()
      ]);

      setMyItems(itemsRes.items.filter(i => i.ownerId === user.id));
      setRequestsReceived(recRes.requests);
      setRequestsSent(sentRes.requests);
      setExchanges(exRes.exchanges);
      setSavedItems(savRes.savedItems);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  const handleRequestStatus = async (requestId: string, status: RequestItem['status']) => {
    try {
      await api.updateRequestStatus(requestId, status);
      await loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExchangeStatus = async (exchangeId: string, status: ExchangeRecord['status']) => {
    try {
      await api.updateExchangeStatus(exchangeId, status);
      await loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to remove this listing from Tamil Nadu directory?')) return;
    try {
      await api.deleteItem(itemId);
      setMyItems(prev => prev.filter(i => i.id !== itemId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileMessage('');
      await updateProfile({
        name: editName,
        phone: editPhone,
        district: editDistrict,
        city: editCity,
        bio: editBio
      });
      setProfileMessage('Profile updated successfully with verified Tamil Nadu location!');
      setTimeout(() => setProfileMessage(''), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      alert(msg);
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border text-center space-y-4">
        <h2 className="text-xl font-bold">Please Log In</h2>
        <p className="text-xs text-slate-500">Sign in to access your Tamil Nadu exchange dashboard.</p>
      </div>
    );
  }

  const editCities = getCitiesForDistrict(editDistrict);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Notice */}
      <LocationRestrictionAlert />

      {/* User Welcome Header with Tamil Nadu Location display */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{user.name}</h1>
              {user.role === 'admin' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500 text-white">
                  Admin
                </span>
              )}
            </div>
            {/* Exact Location Requirement: Location: Sivakasi, Virudhunagar, Tamil Nadu */}
            <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mt-1">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Location: <strong>{user.city}, {user.district}, Tamil Nadu</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-200/80 mt-1">
              <span className="flex items-center gap-1 text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span>{user.rating.toFixed(1)}</span>
              </span>
              <span>•</span>
              <span>{user.ratingCount} reviews</span>
              <span>•</span>
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onNavigatePost}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            + Post New Item
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors border border-white/20"
          >
            Edit Profile & Location
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 pb-1 text-xs font-bold text-slate-600">
        {[
          { id: 'items', label: `My Items (${myItems.length})`, icon: Package },
          { id: 'requests-received', label: `Requests Received (${requestsReceived.length})`, icon: Inbox },
          { id: 'requests-sent', label: `Requests Sent (${requestsSent.length})`, icon: Send },
          { id: 'exchanges', label: `Active Exchanges (${exchanges.length})`, icon: CheckCircle2 },
          { id: 'saved', label: `Saved Items (${savedItems.length})`, icon: Heart },
          { id: 'profile', label: 'Location & Profile', icon: UserIcon }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: My Items */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Your Active Tamil Nadu Listings</h3>
            <button
              onClick={onNavigatePost}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              + Add another item
            </button>
          </div>

          {myItems.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-700">You haven’t posted any items yet.</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Got books, furniture, study tables, or electronics you don’t need in {user.city}? Share them with neighbors!
              </p>
              <button
                onClick={onNavigatePost}
                className="px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl"
              >
                Post an Item Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myItems.map(item => (
                <div key={item.id} className="bg-white rounded-2xl border p-4 flex gap-4 shadow-xs">
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[10px] uppercase text-emerald-700">
                          {item.exchangeType}
                        </span>
                        <span className="text-[10px] text-slate-400">{item.views} views</span>
                      </div>
                      <h4 className="font-bold text-slate-900 line-clamp-1 mt-0.5">{item.title}</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">{item.city}, {item.district}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t mt-2">
                      <button
                        onClick={() => onSelectItem(item)}
                        className="text-emerald-700 font-bold hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-rose-600 hover:text-rose-700 flex items-center gap-1 ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Requests Received */}
      {activeTab === 'requests-received' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Requests Received for Your Items</h3>

          {requestsReceived.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border text-center text-slate-400 text-xs">
              No requests received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {requestsReceived.map(req => (
                <div key={req.id} className="p-4 bg-white rounded-2xl border shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img src={req.itemImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{req.itemTitle}</h4>
                        <p className="text-[11px] text-slate-500">
                          From: <strong>{req.requesterName}</strong> ({req.requesterCity}, {req.requesterDistrict})
                        </p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                      req.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Status: {req.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl italic">
                    “{req.message}”
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t">
                    {req.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleRequestStatus(req.id, 'Rejected')}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-bold"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleRequestStatus(req.id, 'Accepted')}
                          className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                        >
                          Accept Request
                        </button>
                      </>
                    )}

                    {req.status === 'Accepted' && (
                      <button
                        onClick={() => {
                          setChatThread({
                            threadId: req.id,
                            itemTitle: req.itemTitle,
                            counterpartName: req.requesterName,
                            counterpartDistrict: req.requesterDistrict,
                            counterpartCity: req.requesterCity,
                            recipientId: req.requesterId
                          });
                        }}
                        className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat with Requester</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Requests Sent */}
      {activeTab === 'requests-sent' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Requests You Have Sent</h3>

          {requestsSent.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border text-center text-slate-400 text-xs">
              You have not sent any item requests yet.
            </div>
          ) : (
            <div className="space-y-3">
              {requestsSent.map(req => (
                <div key={req.id} className="p-4 bg-white rounded-2xl border shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <img src={req.itemImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{req.itemTitle}</h4>
                        <p className="text-[11px] text-slate-500">
                          Owner: <strong>{req.ownerName}</strong> in {req.itemCity}, {req.itemDistrict}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                      req.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'Rejected' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Status: {req.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl italic">
                    “{req.message}”
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t">
                    {req.status === 'Pending' && (
                      <button
                        onClick={() => handleRequestStatus(req.id, 'Cancelled')}
                        className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                      >
                        Cancel Request
                      </button>
                    )}

                    {req.status === 'Accepted' && (
                      <button
                        onClick={() => {
                          setChatThread({
                            threadId: req.id,
                            itemTitle: req.itemTitle,
                            counterpartName: req.ownerName,
                            counterpartDistrict: req.itemDistrict,
                            counterpartCity: req.itemCity,
                            recipientId: req.ownerId
                          });
                        }}
                        className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat with Owner</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Active Exchanges */}
      {activeTab === 'exchanges' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Exchange Management & Public Meetups</h3>

          {exchanges.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border text-center text-slate-400 text-xs">
              No active or completed exchanges yet.
            </div>
          ) : (
            <div className="space-y-4">
              {exchanges.map(exc => {
                const isOwner = exc.ownerId === user.id;
                const counterpartName = isOwner ? exc.requesterName : exc.ownerName;
                const counterpartDistrict = isOwner ? exc.requesterDistrict : exc.ownerDistrict;
                const counterpartCity = isOwner ? exc.requesterCity : exc.ownerCity;
                const counterpartId = isOwner ? exc.requesterId : exc.ownerId;

                return (
                  <div key={exc.id} className="p-5 bg-white rounded-2xl border shadow-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <img src={exc.itemImage} alt="" className="w-14 h-14 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{exc.itemTitle}</h4>
                          <p className="text-xs text-slate-600">
                            Partner: <strong>{counterpartName}</strong> ({counterpartCity}, {counterpartDistrict}, Tamil Nadu)
                          </p>
                          <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 mt-1">
                            {exc.exchangeType}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
                        exc.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        Status: {exc.status}
                      </span>
                    </div>

                    {exc.meetingNotes && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                        <strong>Public Meetup Notes:</strong> {exc.meetingNotes}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t">
                      <button
                        onClick={() => {
                          setChatThread({
                            threadId: exc.id,
                            itemTitle: exc.itemTitle,
                            counterpartName,
                            counterpartDistrict,
                            counterpartCity,
                            recipientId: counterpartId
                          });
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat & Coordinate Meetup</span>
                      </button>

                      {exc.status !== 'Completed' && (
                        <button
                          onClick={() => handleExchangeStatus(exc.id, 'Completed')}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                        >
                          Mark Completed
                        </button>
                      )}

                      {exc.status === 'Completed' && (
                        <button
                          onClick={() => setReviewExchange(exc)}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1"
                        >
                          <Star className="w-3.5 h-3.5 fill-slate-950" />
                          <span>Rate {counterpartName}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Saved Items */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">My Saved Items (Tamil Nadu)</h3>

          {savedItems.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border text-center text-slate-400 text-xs">
              No saved items yet. Browse listings and tap the heart icon to save items.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {savedItems.map(saved => {
                if (!saved.item) return null;
                return (
                  <div
                    key={saved.id}
                    onClick={() => onSelectItem(saved.item!)}
                    className="p-3 bg-white rounded-2xl border shadow-xs hover:border-emerald-500 cursor-pointer flex gap-3"
                  >
                    <img
                      src={saved.item.images[0]}
                      alt=""
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="text-xs flex-1">
                      <span className="font-bold text-emerald-700 text-[10px]">
                        {saved.item.exchangeType}
                      </span>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{saved.item.title}</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        {saved.item.city}, {saved.item.district}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Profile & Location Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border p-6 sm:p-8 max-w-2xl shadow-xs">
          <div className="border-b pb-4 mb-6">
            <h3 className="text-lg font-bold text-slate-900">Profile & Tamil Nadu Location</h3>
            <p className="text-xs text-slate-500">
              Your registered location is used to sort listings and smart-match reuse items nearest to you.
            </p>
          </div>

          {profileMessage && (
            <div className="p-3 mb-6 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{profileMessage}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                required
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-800"
              />
            </div>

            {/* State (LOCKED to Tamil Nadu) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                State (Mandatory & Fixed)
              </label>
              <input
                type="text"
                disabled
                value="Tamil Nadu"
                className="w-full p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-950 cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                SwapNeat is strictly available in Tamil Nadu only.
              </span>
            </div>

            {/* District & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                <select
                  value={editDistrict}
                  onChange={(e) => {
                    setEditDistrict(e.target.value);
                    const cities = getCitiesForDistrict(e.target.value);
                    if (cities.length > 0) setEditCity(cities[0]);
                  }}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-800"
                >
                  {ALL_38_DISTRICTS.map(d => (
                    <option key={d.id} value={d.name}>{d.name} ({d.tamilName})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Town</label>
                <select
                  value={editCity}
                  onChange={(e) => setEditCity(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-800"
                >
                  {editCities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bio / About Me</label>
              <textarea
                rows={3}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Share a bit about yourself or what items you frequently give away..."
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs text-slate-800"
              />
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Chat Modal */}
      {chatThread && (
        <ChatModal
          isOpen={true}
          onClose={() => setChatThread(null)}
          threadId={chatThread.threadId}
          itemTitle={chatThread.itemTitle}
          counterpartName={chatThread.counterpartName}
          counterpartDistrict={chatThread.counterpartDistrict}
          counterpartCity={chatThread.counterpartCity}
          recipientId={chatThread.recipientId}
        />
      )}

      {/* Review Modal */}
      {reviewExchange && (
        <ReviewModal
          isOpen={true}
          exchange={reviewExchange}
          onClose={() => setReviewExchange(null)}
          onSuccess={() => {
            setReviewExchange(null);
            alert('Rating submitted successfully! Thank you for supporting zero-waste in Tamil Nadu.');
            loadDashboardData();
          }}
        />
      )}
    </div>
  );
};
