import React from 'react';
import { Home, Compass, PlusCircle, Inbox, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface MobileBottomNavProps {
  currentTab: string;
  onNavigate: (tab: string, params?: Record<string, string>) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, onNavigate }) => {
  const { user } = useAuth();
  const { language } = useLanguage();

  const navItems = [
    {
      id: 'home',
      label: language === 'ta' ? 'முகப்பு' : 'Home',
      icon: Home
    },
    {
      id: 'browse',
      label: language === 'ta' ? 'பொருட்கள்' : 'Browse',
      icon: Compass
    },
    {
      id: 'post',
      label: language === 'ta' ? 'பதிவு' : 'Post',
      icon: PlusCircle,
      isSpecial: true
    },
    {
      id: 'requests',
      label: language === 'ta' ? 'கோரிக்கைகள்' : 'Requests',
      icon: Inbox,
      targetTab: user ? 'dashboard' : 'login',
      params: { tab: 'requests-received' }
    },
    {
      id: 'profile',
      label: language === 'ta' ? 'சுயவிவரம்' : 'Profile',
      icon: User,
      targetTab: user ? 'dashboard' : 'login',
      params: { tab: 'profile' }
    }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg flex items-center justify-around">
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive =
          currentTab === item.id ||
          (item.id === 'requests' && currentTab === 'dashboard') ||
          (item.id === 'profile' && currentTab === 'dashboard');

        if (item.isSpecial) {
          return (
            <button
              key={item.id}
              onClick={() => onNavigate('post')}
              className="flex flex-col items-center justify-center -mt-5"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white shadow-lg flex items-center justify-center border-4 border-white active:scale-95 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-emerald-800 mt-0.5">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.targetTab || item.id, item.params)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors ${
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
