# WinkBench — Draft Firebase Security Rules (Phase 2 Preparation)

This document provides the blueprint and restrictive rules for Cloud Firestore and Firebase Storage before live deployment in Phase 2.

---

## 1. Cloud Firestore Rules Draft (`firestore.rules`)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    function getUserRole() {
      return request.auth.token.role;
    }
    
    function isAdmin() {
      return isAuthenticated() && (getUserRole() == 'admin' || request.auth.token.admin == true);
    }
    
    function isModerator() {
      return isAuthenticated() && (getUserRole() == 'moderator' || isAdmin());
    }

    // 1. Users collection
    match /users/{userId} {
      allow read: if true;
      allow create: if isAuthenticated() && request.auth.uid == userId 
                    && (!request.resource.data.keys().hasAny(['role']));
      allow update: if isOwner(userId) 
                    && (!request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'email']));
      allow delete: if isAdmin();
    }

    // 2. Companies collection
    match /companies/{companySlug} {
      allow read: if true; // Public directory
      allow create: if isAdmin();
      // Only admin or verified company owner can update permitted fields
      allow update: if isAdmin() || (
        isAuthenticated() && 
        resource.data.claimedByUserId == request.auth.uid &&
        !request.resource.data.diff(resource.data).affectedKeys().hasAny(['customerRating', 'reviewCount', 'trustScore', 'isVerified', 'isClaimed'])
      );
      allow delete: if isAdmin();
    }

    // 3. Reviews collection
    match /reviews/{reviewId} {
      allow read: if resource.data.status == 'published' || isOwner(resource.data.userId) || isModerator();
      allow create: if isAuthenticated() 
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.rating >= 1 && request.resource.data.rating <= 5
                    && request.resource.data.content.size() >= 30;
      allow update: if isOwner(resource.data.userId) 
                    && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['content', 'title', 'rating', 'updatedAt']);
      allow delete: if isOwner(resource.data.userId) || isModerator();
    }

    // 4. Business Replies
    match /businessReplies/{replyId} {
      allow read: if true;
      allow write: if isAuthenticated() && (
        get(/databases/$(database)/documents/companies/$(request.resource.data.companyId)).data.claimedByUserId == request.auth.uid ||
        isAdmin()
      );
    }

    // 5. Company Claims
    match /companyClaims/{claimId} {
      allow read: if isAuthenticated() && (resource.data.applicantUserId == request.auth.uid || isAdmin());
      allow create: if isAuthenticated() && request.resource.data.applicantUserId == request.auth.uid;
      allow update, delete: if isAdmin();
    }

    // 6. Community Posts
    match /communityPosts/{postId} {
      allow read: if true;
      allow create: if isAuthenticated() && request.resource.data.authorId == request.auth.uid;
      allow update: if isAuthenticated() && (resource.data.authorId == request.auth.uid || isModerator());
      allow delete: if isAuthenticated() && (resource.data.authorId == request.auth.uid || isModerator());
    }

    // 7. Audit Logs (Server Admin only)
    match /auditLogs/{logId} {
      allow read, write: if false; // Only accessible via Firebase Admin SDK
    }
  }
}
```

---

## 2. Firebase Storage Rules Draft (`storage.rules`)

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // User avatars
    match /avatars/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 2 * 1024 * 1024
                   && request.resource.contentType.matches('image/(jpeg|png|webp)');
    }

    // Company logos & documents
    match /company-uploads/{companyId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/(jpeg|png|webp|svg\\+xml)');
    }
  }
}
```
