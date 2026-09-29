import React, { useState } from 'react';
import {
  Recycle,
  PlusCircle,
  Bell,
  User,
  LogOut,
  MapPin,
  Globe,
  LayoutDashboard,
  BarChart3,
  Shield,
  Search,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, params?: Record<string, string>) => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenNotifications,
  unreadCount = 0
}) => {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [quickSearch, setQuickSearch] = useState<string>('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      onNavigate('browse', { search: quickSearch.trim() });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-emerald-800 text-white text-[11px] py-1 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>
          {language === 'ta'
            ? 'ஸ்வாப்நீட் தமிழ்நாட்டில் மட்டுமே பிரத்தியேகமாக இயங்குகிறது • 38 மாவட்டங்கள்'
            : 'SWAPNEAT is exclusively available across all 38 districts of Tamil Nadu, India'}
        </span>
        <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-emerald-700 font-bold text-[10px]">
          TN ONLY
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  SWAP<span className="text-emerald-600">NEAT</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  TN
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 leading-none truncate max-w-[170px] sm:max-w-xs">
                {language === 'ta' ? 'தமிழ்நாடு மறுபயன்பாட்டு தளம்' : 'Tamil Nadu Reuse Platform'}
              </p>
            </div>
          </div>

          {/* Quick Search (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-md mx-4 relative"
          >
            <Search className="w-4 h-4 absolute left-3.5 text-slate-400" />
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-transparent focus:border-emerald-400 rounded-full text-xs font-medium text-slate-800 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-600">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                currentTab === 'home' ? 'text-emerald-700 bg-emerald-50' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('browse')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                currentTab === 'browse' ? 'text-emerald-700 bg-emerald-50' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'ta' ? 'பொருட்கள்' : 'Browse Items'}
            </button>
            <button
              onClick={() => onNavigate('analytics')}
              className={`px-3 py-2 rounded-xl transition-colors ${
                currentTab === 'analytics' ? 'text-emerald-700 bg-emerald-50' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {language === 'ta' ? 'செயல்பாடு' : 'TN Analytics'}
            </button>
            {user?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3 py-2 rounded-xl transition-colors flex items-center gap-1 ${
                  currentTab === 'admin' ? 'text-purple-700 bg-purple-50' : 'hover:text-purple-900 hover:bg-purple-50/50'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Action CTAs & User Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              title="Toggle English / தமிழ்"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* Post Item Button */}
            <button
              onClick={() => onNavigate('post')}
              className="px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t.postAnItem}</span>
              <span className="sm:hidden">{language === 'ta' ? 'பதிவு' : 'Post'}</span>
            </button>

            {/* Notifications Button */}
            {user && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* User Account / Auth */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-2xl hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-medium truncate max-w-[100px]">
                      {user.district}
                    </p>
                  </div>
                  <img
                    src={user.profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-xl object-cover border border-emerald-500"
                  />
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-xs text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold mt-1">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{user.city}, {user.district}, TN</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{t.myDashboard}</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('dashboard', { tab: 'saved' });
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{t.mySavedItems}</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('analytics');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>{t.tamilNaduReuseActivity}</span>
                    </button>

                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        <span>{t.adminDashboard}</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-emerald-700 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  {t.login}
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="hidden sm:inline-block px-3.5 py-1.5 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs transition-colors"
                >
                  {t.register}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
