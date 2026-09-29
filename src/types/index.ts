export type ExchangeType = 'Give Away' | 'Exchange' | 'Donate';
export type ItemCondition = 'Like New' | 'Gently Used' | 'Good' | 'Fair';
export type ItemStatus = 'active' | 'in_negotiation' | 'completed' | 'removed';
export type RequestStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Completed' | 'Cancelled';
export type ExchangeStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
export type ReportReason = 'Fake listing' | 'Wrong information' | 'Spam' | 'Inappropriate content' | 'Suspicious activity';
export type ReportStatus = 'Pending' | 'Reviewed' | 'Dismissed' | 'Action_Taken';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: 'Tamil Nadu';
  district: string;
  city: string;
  profileImage?: string;
  rating: number;
  ratingCount: number;
  role: 'user' | 'admin';
  bio?: string;
  createdAt: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  condition: ItemCondition;
  images: string[];
  exchangeType: ExchangeType;
  state: 'Tamil Nadu';
  district: string;
  city: string;
  approximateArea?: string;
  quantity: number;
  ownerId: string;
  ownerName: string;
  ownerPhone?: string;
  ownerRating: number;
  ownerRatingCount: number;
  status: ItemStatus;
  views: number;
  savesCount: number;
  createdAt: string;
}

export interface RequestItem {
  id: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  itemCategory: string;
  itemDistrict: string;
  itemCity: string;
  requesterId: string;
  requesterName: string;
  requesterPhone: string;
  requesterCity: string;
  requesterDistrict: string;
  ownerId: string;
  ownerName: string;
  message: string;
  exchangeType: ExchangeType;
  requestedDate: string;
  status: RequestStatus;
  createdAt: string;
}

export interface ExchangeRecord {
  id: string;
  requestId: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  requesterId: string;
  requesterName: string;
  requesterDistrict: string;
  requesterCity: string;
  ownerId: string;
  ownerName: string;
  ownerDistrict: string;
  ownerCity: string;
  exchangeType: ExchangeType;
  meetingNotes?: string;
  status: ExchangeStatus;
  createdAt: string;
  completedAt?: string;
}

export interface ChatMessage {
  id: string;
  exchangeId?: string;
  requestId?: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request_new' | 'request_accepted' | 'request_rejected' | 'exchange_confirmed' | 'exchange_completed' | 'message' | 'item_match';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  exchangeId: string;
  itemId: string;
  itemTitle: string;
  reviewerId: string;
  reviewerName: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  itemId: string;
  itemTitle: string;
  reportedByUserId: string;
  reportedByName: string;
  reason: ReportReason;
  details: string;
  status: ReportStatus;
  createdAt: string;
}

export interface SavedItemRecord {
  id: string;
  userId: string;
  itemId: string;
  savedAt: string;
  item?: Item;
}

export interface DistrictInfo {
  id: string;
  name: string;
  tamilName: string;
  region: 'North' | 'Central' | 'West' | 'South' | 'Cauvery Delta';
  cities: string[];
}
