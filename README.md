# WinkBench.com — Global Business Reviews, Reputation & Community Platform

WinkBench is an independent, uncompromised global review platform engineered from first principles. It delivers transparent customer reviews, dual-metric independent Trust Scores, and accountable business claim workflows.

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict typing enabled)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Target Production Host**: Hostinger (Cloud / KVM VPS with Node.js persistent runtime)
- **Database & Auth (Phase 2)**: Cloud Firestore & Firebase Authentication (Existing user project `winkbench`)

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run local development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

## Documentation
- [Database Schema (19 Collections)](docs/DATABASE_SCHEMA.md)
- [Hostinger Deployment Guide](docs/HOSTINGER_DEPLOYMENT.md)
- [Draft Firebase Security Rules](docs/SECURITY_RULES_DRAFT.md)
- [Project Phases & Roadmap](docs/PHASE_STATUS.md)
