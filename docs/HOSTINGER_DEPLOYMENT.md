# WinkBench — Hostinger Deployment Specification & Runbook

This document details the exact requirements, commands, server settings, and deployment steps for hosting WinkBench on Hostinger.

---

## 1. Hosting Tier Compatibility Check

### Can WinkBench run on Shared Web Hosting?
- **Shared PHP Hosting (cPanel / hPanel standard):** Standard shared web hosting is designed exclusively for PHP/Apache/Nginx static files. It **cannot run a persistent Node.js background process** or Next.js App Router server features reliably.
- **Recommended Hostinger Plan:** **Hostinger Cloud Hosting** (with Node.js Application Manager) OR **Hostinger KVM VPS** (e.g., KVM 1 or KVM 2 running Ubuntu 22.04/24.04 LTS).
- **Persistent Process Requirement:** **YES.** Next.js with App Router, server-side route handlers, and API endpoints requires a persistent Node.js runtime process (managed via PM2 or systemd).

---

## 2. Core Technical Specifications

| Parameter | Value |
|---|---|
| **Node.js Version** | Node.js `v20.x LTS` or `v22.x LTS` (Current development tested on v22) |
| **Package Manager** | `npm` |
| **Install Command** | `npm install --omit=dev` (or `npm ci` for lockfile reproducibility) |
| **Development Command** | `npm run dev` |
| **Production Build Command**| `npm run build` |
| **Production Start Command**| `npm run start` (or `pm2 start npm --name "winkbench" -- run start`) |
| **Default Internal Port** | `3000` (Nginx reverse-proxies to `http://127.0.0.1:3000`) |

---

## 3. Rendering Features Support on Hostinger

- **Server-Side Rendering (SSR):** Supported. Pages dynamically fetch and render server-side on each request.
- **Incremental Static Regeneration (ISR):** Supported on VPS / Node.js persistent plans with writable `.next/cache` directory.
- **API Route Handlers (`/api/*`):** Supported.
- **Next.js Image Optimization (`next/image`):** Supported using Sharp (`npm install sharp` in production).
- **Scheduled Tasks / Cron Jobs:** Supported via host-level `crontab` or internal worker endpoints.

---

## 4. Required Production Environment Variables

Configure these in Hostinger hPanel Node.js Application Manager or in `/etc/environment` / `.env.production` (keep this file outside git):

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_APP_URL=https://winkbench.com

# Firebase Client
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=winkbench.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=winkbench
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=winkbench.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

# Firebase Admin SDK (Server-Side Only)
FIREBASE_ADMIN_PROJECT_ID=winkbench
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@winkbench.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

---

## 5. Step-by-Step Deployment Guide on Hostinger

### Option A: Hostinger Cloud Hosting with Node.js Manager
1. Log into your **Hostinger hPanel**.
2. Navigate to **Websites** → Select `winkbench.com` → **Node.js**.
3. Choose Node.js version: **v20.x or v22.x**.
4. Set **Application root**: `/public_html` or `/app`.
5. Set **Application startup file**: `node_modules/next/dist/bin/next` with argument `start` OR use an `ecosystem.config.js`.
6. Add the environment variables in the hPanel interface.
7. Click **Deploy**.

### Option B: Hostinger KVM VPS (Recommended for Highest Performance)
1. SSH into your VPS: `ssh root@YOUR_SERVER_IP`
2. Install Node.js:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
   apt install -y nodejs git nginx certbot python3-certbot-nginx
   npm install -g pm2
   ```
3. Clone your GitHub repository:
   ```bash
   cd /var/www
   git clone https://github.com/YOUR_USERNAME/winkbench.git
   cd winkbench
   npm install
   npm run build
   ```
4. Start process with PM2:
   ```bash
   pm2 start npm --name "winkbench" -- start -- -p 3000
   pm2 save
   pm2 startup
   ```
5. Configure Nginx Reverse Proxy (`/etc/nginx/sites-available/winkbench`):
   ```nginx
   server {
       server_name winkbench.com www.winkbench.com;

       location / {
           proxy_pass http://127.0.0.1:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
6. Link site and enable HTTPS with Certbot:
   ```bash
   ln -s /etc/nginx/sites-available/winkbench /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx
   certbot --nginx -d winkbench.com -d www.winkbench.com
   ```

---

## 6. How to Deploy Updates & Roll Back

### Automatic GitHub Deployments:
You can set up a GitHub Action webhook or pull updates directly on the server:
```bash
cd /var/www/winkbench
git pull origin main
npm install
npm run build
pm2 reload winkbench --update-env
```

### Zero-Downtime Rollback:
If an update has an unexpected error:
```bash
cd /var/www/winkbench
git log -n 5 --oneline
# Roll back to previous stable commit hash
git checkout PREVIOUS_COMMIT_HASH
npm run build
pm2 reload winkbench
```
