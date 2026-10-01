# WinkBench — Hostinger Native Architecture & Runbook (No Firebase Dependency)

WinkBench is built to run 100% self-hosted on **Hostinger Cloud Hosting** or **Hostinger KVM VPS** with a persistent Node.js runtime and local database persistence.

---

## 1. Zero Firebase Lock-In Guarantee

Per project instructions, **all Firebase dependencies have been completely removed**.
- **Database Engine**: Persistent Local Storage Engine (`lib/storage/db.ts`) with JSON/SQLite file backing (`data/winkbench.json`).
- **Data Portability**: Easily connectable to Hostinger MySQL or PostgreSQL via Prisma or standard PDO/ORM.
- **Dynamic Domain Indexing (Trustpilot-Style)**: Any searched domain (e.g. `example.com`, `www.example.com`) automatically generates a permanent, indexed company profile ready for customer reviews.

---

## 2. Server Specifications

| Component | Specification |
|---|---|
| **Platform** | Hostinger Cloud Hosting or KVM VPS (Ubuntu 22.04 / 24.04 LTS) |
| **Node.js Runtime** | Node.js `v20.x LTS` or `v22.x LTS` |
| **Process Manager** | `pm2` (`pm2 start npm --name "winkbench" -- run start`) |
| **Port** | `3000` (Nginx reverse-proxies to `http://127.0.0.1:3000`) |
| **Storage Directory** | `/var/www/winkbench/data/` (write permissions for node user) |

---

## 3. Features Implemented

1. **Official WinkBench Logo & Icon**: Integrated across desktop/mobile navigation, headers, and footer using the user's custom brand identity.
2. **Dynamic Domain Auto-Creation**:
   - `winkbench.com/company/example.com`
   - `winkbench.com/company/www.example.com`
   - Automatic normalization, SEO canonical tags, and permanent persistence.
3. **Dashboards**:
   - **Company Owner Dashboard** (`/dashboard/company`) with 4 required tabs:
     1. Reviews & Public Responses
     2. Company Announcements
     3. Company Blog & Articles
     4. Company Details & Credentials
   - **User Dashboard** (`/dashboard/user`): My Reviews, Saved Companies, Notifications, Account Settings.
   - **User Public Profile** (`/user/[id]`): Public reviewer reputation, verified badge, review history.
   - **Admin Management Console** (`/admin`): Business claim approvals, review moderation, company catalog manager, and Hostinger runtime monitoring.
4. **All Worldwide Categories & Subcategories**: Matching Trustpilot global taxonomy.
5. **All Worldwide Countries**: Full global list with country flags.
