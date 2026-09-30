# WinkBench — Cloud Firestore Database Schema Documentation

This schema documents the 19 collections for WinkBench, designed for scale, auditability, least-privilege security, and low Firestore read/write costs.

---

## 1. Collections Architecture

### 1. `users`
- **Doc ID**: Firebase Auth UID (`request.auth.uid`)
- **Fields**:
  - `email`: string (required)
  - `displayName`: string (required)
  - `role`: enum ('guest', 'registered', 'business_owner', 'moderator', 'admin')
  - `avatarUrl`: string (optional)
  - `country`: string (optional)
  - `bio`: string (optional, max 300 chars)
  - `createdAt`: serverTimestamp
  - `updatedAt`: serverTimestamp
- **Permissions**: Read public profile fields; write only self (`request.auth.uid == userId`); role cannot be changed by user (server-admin only).

### 2. `companies`
- **Doc ID**: Normalized slug (e.g. `aurora-payments-global`)
- **Fields**:
  - `name`: string
  - `slug`: string (unique)
  - `tagline`: string
  - `description`: string
  - `website`: string
  - `logoUrl`: string
  - `category`: string
  - `categorySlug`: string
  - `country`: string
  - `countryCode`: string (ISO 3166-1 alpha-2)
  - `city`: string
  - `address`: string
  - `phone`: string
  - `isClaimed`: boolean
  - `isVerified`: boolean
  - `claimedByUserId`: string (optional)
  - `customerRating`: number (1.00 - 5.00)
  - `reviewCount`: number
  - `trustScore`: number (0 - 100)
  - `trustScoreRating`: enum ('High', 'Good', 'Fair', 'Developing', 'Caution')
  - `ratingDistribution`: map `{ "5": int, "4": int, "3": int, "2": int, "1": int }`
  - `responseRate`: number (percentage)
  - `responseTime`: string
  - `createdAt`: serverTimestamp
  - `updatedAt`: serverTimestamp
- **Permissions**: Public read; updates only by verified company owner (permitted fields only) or admin.

### 3. `companyClaims`
- **Doc ID**: Auto-generated ID (`claim_xxx`)
- **Fields**:
  - `companyId`: string
  - `companyName`: string
  - `applicantUserId`: string
  - `applicantName`: string
  - `workEmail`: string
  - `roleInCompany`: string
  - `docType`: string
  - `notes`: string
  - `status`: enum ('pending_review', 'approved', 'rejected', 'more_info_needed')
  - `reviewedByAdminId`: string (optional)
  - `reviewedAt`: timestamp (optional)
  - `submittedAt`: serverTimestamp

### 4. `companyOwners`
- **Doc ID**: `companyId_userId`
- **Fields**:
  - `companyId`: string
  - `userId`: string
  - `role`: enum ('primary_owner', 'manager', 'responder')
  - `assignedAt`: serverTimestamp

### 5. `reviews`
- **Doc ID**: Auto-generated ID
- **Fields**:
  - `companyId`: string
  - `companySlug`: string
  - `userId`: string (author)
  - `userDisplayName`: string
  - `userCountry`: string
  - `rating`: number (1 to 5)
  - `title`: string (min 5, max 100 chars)
  - `content`: string (min 30, max 3000 chars)
  - `experienceDate`: string
  - `isVerifiedCustomer`: boolean
  - `helpfulCount`: number
  - `flaggedCount`: number
  - `status`: enum ('published', 'pending_moderation', 'flagged', 'removed')
  - `createdAt`: serverTimestamp
  - `updatedAt`: serverTimestamp

### 6. `businessReplies`
- **Doc ID**: `reply_reviewId`
- **Fields**:
  - `reviewId`: string
  - `companyId`: string
  - `responderUserId`: string
  - `responderName`: string
  - `responderRole`: string
  - `content`: string (max 2000 chars)
  - `createdAt`: serverTimestamp

### 7. `companyUpdates`
- **Doc ID**: Auto-generated ID
- **Fields**:
  - `companyId`: string
  - `title`: string
  - `content`: string
  - `summary`: string
  - `tag`: string
  - `publishedAt`: serverTimestamp
  - `authorUserId`: string

### 8. `articles`
- **Doc ID**: URL slug
- **Fields**:
  - `title`: string
  - `slug`: string
  - `content`: markdown/HTML
  - `category`: string
  - `authorId`: string
  - `publishedAt`: timestamp

### 9. `communityPosts`
- **Doc ID**: Auto-generated ID
- **Fields**:
  - `title`: string
  - `content`: string
  - `authorId`: string
  - `authorName`: string
  - `authorCountry`: string
  - `category`: string
  - `likesCount`: number
  - `commentsCount`: number
  - `createdAt`: serverTimestamp

### 10. `comments`
- **Doc ID**: Auto-generated ID
- **Fields**:
  - `postId`: string
  - `authorId`: string
  - `authorName`: string
  - `content`: string
  - `createdAt`: serverTimestamp

### 11. `reports`
- **Doc ID**: Auto-generated ID
- **Fields**:
  - `targetType`: enum ('review', 'company', 'post', 'comment')
  - `targetId`: string
  - `reporterUserId`: string
  - `reason`: string
  - `notes`: string
  - `status`: enum ('open', 'investigating', 'resolved', 'dismissed')
  - `createdAt`: serverTimestamp

### 12. `notifications`
- **Doc ID**: Auto-generated ID
- **Fields**:
  - `recipientUserId`: string
  - `title`: string
  - `body`: string
  - `link`: string
  - `isRead`: boolean
  - `createdAt`: serverTimestamp

### 13. `savedCompanies`
- **Doc ID**: `userId_companyId`
- **Fields**:
  - `userId`: string
  - `companyId`: string
  - `savedAt`: serverTimestamp

### 14. `moderationCases`
- **Doc ID**: Auto-generated ID
- **Fields**:
  - `itemType`: string
  - `itemId`: string
  - `assignedModeratorId`: string
  - `status`: string
  - `decision`: string
  - `updatedAt`: serverTimestamp

### 15. `appeals`
- **Doc ID**: Auto-generated ID
- **Fields**:
  - `moderationCaseId`: string
  - `submittedByUserId`: string
  - `statement`: string
  - `status`: string

### 16. `trustScoreHistory`
- **Doc ID**: Auto-generated ID
- **Fields**:
  - `companyId`: string
  - `previousScore`: number
  - `newScore`: number
  - `reason`: string
  - `changedAt`: serverTimestamp

### 17. `categories`
- **Doc ID**: slug
- **Fields**:
  - `name`: string
  - `slug`: string
  - `iconName`: string
  - `description`: string
  - `companyCount`: number

### 18. `auditLogs`
- **Doc ID**: Auto-generated ID
- **Fields**:
  - `actorUserId`: string
  - `actorRole`: string
  - `action`: string
  - `targetType`: string
  - `targetId`: string
  - `metadata`: map
  - `timestamp`: serverTimestamp

### 19. `platformSettings`
- **Doc ID**: `general_config`
- **Fields**:
  - `maintenanceMode`: boolean
  - `minimumReviewCharacters`: number
  - `rateLimitPerHour`: number
