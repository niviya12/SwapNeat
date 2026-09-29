import { Item, User, RequestItem, ExchangeRecord, ChatMessage, NotificationItem, ReviewItem, ReportItem } from '../types';

const TOKEN_KEY = 'swapneat_jwt_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`/api${endpoint}`, {
    ...options,
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data as T;
}

export const api = {
  // Auth
  register: (payload: { name: string; email: string; phone: string; password: string; confirmPassword: string; state: string; district: string; city: string; profileImage?: string }) =>
    request<{ message: string; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  login: (payload: { identifier: string; password: string }) =>
    request<{ message: string; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getCurrentUser: () =>
    request<{ user: User }>('/auth/me'),

  updateProfile: (payload: Partial<User>) =>
    request<{ message: string; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  // Items
  getItems: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{ items: Item[]; count: number; filteredByDistrict: string }>(`/items?${query}`);
  },

  getSmartMatches: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    return request<{
      location: { state: string; district: string; city: string };
      tiers: {
        highMatch: Item[];
        mediumMatch: Item[];
        otherMatch: Item[];
      };
      totalMatches: number;
    }>(`/items/match?${query}`);
  },

  getItemById: (id: string) =>
    request<{ item: Item; owner: User | null; similarItems: Item[] }>(`/items/${id}`),

  createItem: (payload: Partial<Item>) =>
    request<{ message: string; item: Item }>('/items', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  updateItem: (id: string, payload: Partial<Item>) =>
    request<{ message: string; item: Item }>(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  deleteItem: (id: string) =>
    request<{ message: string }>(`/items/${id}`, {
      method: 'DELETE'
    }),

  // Requests
  sendRequest: (payload: { itemId: string; message: string }) =>
    request<{ message: string; request: RequestItem }>('/requests', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getSentRequests: () =>
    request<{ requests: RequestItem[] }>('/requests/sent'),

  getReceivedRequests: () =>
    request<{ requests: RequestItem[] }>('/requests/received'),

  updateRequestStatus: (id: string, status: RequestItem['status']) =>
    request<{ message: string; request: RequestItem }>(`/requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),

  // Exchanges
  getExchanges: () =>
    request<{ exchanges: ExchangeRecord[] }>('/exchanges'),

  getExchangeById: (id: string) =>
    request<{ exchange: ExchangeRecord }>(`/exchanges/${id}`),

  updateExchangeStatus: (id: string, status: ExchangeRecord['status'], meetingNotes?: string) =>
    request<{ message: string; exchange: ExchangeRecord }>(`/exchanges/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, meetingNotes })
    }),

  // Messages
  getMessages: (threadId: string) =>
    request<{ messages: ChatMessage[] }>(`/messages/${threadId}`),

  sendMessage: (payload: { requestId?: string; exchangeId?: string; recipientId: string; content: string }) =>
    request<{ message: ChatMessage }>('/messages', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Saved
  getSavedItems: () =>
    request<{ savedItems: { id: string; userId: string; itemId: string; savedAt: string; item?: Item }[] }>('/saved'),

  toggleSaveItem: (itemId: string) =>
    request<{ saved: boolean; message: string }>(`/saved/${itemId}`, {
      method: 'POST'
    }),

  // Reviews
  createReview: (payload: { exchangeId: string; revieweeId: string; rating: number; comment?: string }) =>
    request<{ message: string; review: ReviewItem }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getUserReviews: (userId: string) =>
    request<{ reviews: ReviewItem[] }>(`/reviews/user/${userId}`),

  // Reports
  submitReport: (payload: { itemId: string; reason: string; details?: string }) =>
    request<{ message: string; report: ReportItem }>('/reports', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Notifications
  getNotifications: () =>
    request<{ notifications: NotificationItem[]; unreadCount: number }>('/notifications'),

  markNotificationRead: (id: string) =>
    request<{ message: string }>(`/notifications/${id}/read`, {
      method: 'PATCH'
    }),

  markAllNotificationsRead: () =>
    request<{ message: string }>('/notifications/read-all', {
      method: 'PATCH'
    }),

  // Analytics & Sustainability
  getTamilNaduAnalytics: () =>
    request<{
      state: string;
      districtsCount: number;
      topDistricts: { name: string; items: number; users: number; exchanges: number; region: string }[];
      allDistrictsActivity: { name: string; items: number; users: number; exchanges: number; region: string }[];
      categoryCounts: Record<string, number>;
      typeCounts: Record<string, number>;
      monthlyActivity: { month: string; itemsReused: number; newUsers: number }[];
    }>('/analytics/tamilnadu'),

  getSustainabilityImpact: () =>
    request<{
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
    }>('/analytics/sustainability'),

  // Admin
  getAdminOverview: () =>
    request<{
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
    }>('/admin/overview'),

  getAdminReports: () =>
    request<{ reports: ReportItem[] }>('/admin/reports'),

  updateAdminReport: (id: string, status: string, action?: string) =>
    request<{ message: string; report: ReportItem }>(`/admin/reports/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, action })
    }),

  getAdminUsers: () =>
    request<{ users: User[] }>('/admin/users'),

  adminDeleteItem: (id: string) =>
    request<{ message: string }>(`/admin/items/${id}`, {
      method: 'DELETE'
    })
};
