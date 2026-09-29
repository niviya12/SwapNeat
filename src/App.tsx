import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { LanguageProvider, useLanguage } from './context/LanguageContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { Footer } from './components/Footer.tsx';
import { NotificationDrawer } from './components/NotificationDrawer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { BrowsePage } from './pages/BrowsePage.tsx';
import { PostItemPage } from './pages/PostItemPage.tsx';
import { ItemDetailPage } from './pages/ItemDetailPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { AnalyticsPage } from './pages/AnalyticsPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { Item } from './types';
import { api } from './services/api.ts';

function MainApp() {
  const { user } = useAuth();
  const { language } = useLanguage();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [browseParams, setBrowseParams] = useState<Record<string, string>>({});
  const [dashboardTab, setDashboardTab] = useState<string>('items');
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState<boolean>(false);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState<number>(0);

  // Poll notifications
  useEffect(() => {
    if (user) {
      api.getNotifications()
        .then(res => setUnreadNotifsCount(res.unreadCount))
        .catch(() => {});
    }
  }, [user, currentTab]);

  const handleNavigate = (tab: string, params?: Record<string, string>) => {
    if (tab === 'browse') {
      if (params) setBrowseParams(params);
      setCurrentTab('browse');
    } else if (tab === 'dashboard') {
      if (params?.tab) setDashboardTab(params.tab);
      setCurrentTab('dashboard');
    } else if (tab === 'item-detail' && params?.id) {
      setSelectedItemId(params.id);
      setCurrentTab('item-detail');
    } else {
      setCurrentTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectItem = (item: Item) => {
    setSelectedItemId(item.id);
    setCurrentTab('item-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        unreadCount={unreadNotifsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onSelectItem={handleSelectItem}
          />
        )}

        {currentTab === 'browse' && (
          <BrowsePage
            initialDistrict={browseParams.district}
            initialCategory={browseParams.category}
            initialSearch={browseParams.search}
            onSelectItem={handleSelectItem}
          />
        )}

        {currentTab === 'post' && (
          <PostItemPage
            onSuccess={(newId) => {
              setSelectedItemId(newId);
              setCurrentTab('item-detail');
            }}
            onNavigateLogin={() => setCurrentTab('login')}
          />
        )}

        {currentTab === 'item-detail' && (
          <ItemDetailPage
            itemId={selectedItemId || 'item_1'}
            onBack={() => setCurrentTab('browse')}
            onSelectItem={handleSelectItem}
            onNavigateLogin={() => setCurrentTab('login')}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            initialTab={dashboardTab}
            onSelectItem={handleSelectItem}
            onNavigatePost={() => setCurrentTab('post')}
            onNavigateBrowse={() => setCurrentTab('browse')}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsPage />
        )}

        {currentTab === 'admin' && (
          <AdminPage onSelectItem={handleSelectItem} />
        )}

        {currentTab === 'login' && (
          <LoginPage
            onSuccess={() => setCurrentTab('dashboard')}
            onNavigateRegister={() => setCurrentTab('register')}
          />
        )}

        {currentTab === 'register' && (
          <RegisterPage
            onSuccess={() => setCurrentTab('dashboard')}
            onNavigateLogin={() => setCurrentTab('login')}
          />
        )}
      </main>

      {/* Slide-over Notifications */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        onNavigate={(link) => {
          if (link.includes('dashboard')) {
            const match = link.match(/tab=([^&]+)/);
            if (match) setDashboardTab(match[1]);
            setCurrentTab('dashboard');
          } else if (link.includes('browse')) {
            setCurrentTab('browse');
          }
        }}
      />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
}
