export type UserRole = 'guest' | 'registered' | 'business_owner' | 'moderator' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  country?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  companyCount: number;
  featured?: boolean;
}

export interface RatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

export interface BusinessReply {
  id: string;
  reviewId: string;
  companyId: string;
  responderName: string;
  responderRole: string; // e.g. "Customer Care Lead", "Owner"
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  companyId: string;
  companyName: string;
  companySlug: string;
  userId: string;
  userDisplayName: string;
  userAvatarUrl?: string;
  userCountry?: string;
  rating: number; // 1 to 5
  title: string;
  content: string;
  experienceDate?: string;
  isVerifiedCustomer?: boolean;
  helpfulCount: number;
  status: 'published' | 'pending_moderation' | 'reported' | 'removed';
  reply?: BusinessReply;
  createdAt: string;
  updatedAt?: string;
}

export interface CompanyUpdate {
  id: string;
  companyId: string;
  title: string;
  summary?: string;
  content: string;
  publishedAt: string;
  authorName: string;
  tag?: string;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  website: string;
  logoUrl?: string;
  category: string;
  categorySlug: string;
  country: string;
  countryCode: string;
  city: string;
  address?: string;
  phone?: string;
  email?: string;
  isClaimed: boolean;
  isVerified: boolean;
  claimedByUserId?: string;
  
  // Rating & Trust
  customerRating: number; // 1.00 to 5.00
  reviewCount: number;
  trustScore: number; // 0 to 100 platform indicator
  trustScoreRating: 'High' | 'Good' | 'Fair' | 'Developing' | 'Caution';
  ratingDistribution: RatingDistribution;
  
  // Response stats
  responseRate?: number; // e.g. 94%
  responseTime?: string; // e.g. "< 24 hours"
  
  createdAt: string;
  updatedAt: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorAvatar?: string;
  authorCountry?: string;
  category: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export interface ClaimRequest {
  id: string;
  companyId: string;
  companyName: string;
  applicantName: string;
  workEmail: string;
  roleInCompany: string;
  phone: string;
  officialIdDocType?: string;
  additionalNotes?: string;
  status: 'pending_review' | 'approved' | 'rejected' | 'more_info_needed';
  submittedAt: string;
}
