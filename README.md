# HealthGhuru-2 — Digital Health News Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Serverless-4169E1?style=flat-square&logo=postgresql)](https://neon.tech/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

> **"Live Better. Feel Stronger. Every Day."**

**HealthGhuru-2** is an enterprise-grade digital health news portal engineered with Next.js 14 (App Router), TypeScript, TailwindCSS, and serverless PostgreSQL.

Modeled structurally after professional news publishers (**NewsGhuru**) and stylized with the signature **HealthGhuru aesthetic** (soft pale green `#F5FAF5` canvas, forest green `#1B5E20` / `#2E7D32` primary, vibrant orange `#f06d2f` accent, and editorial serif headlines).

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+
- **Database**: PostgreSQL (Neon Serverless or any standard Postgres instance)

### 2. Environment Configuration
Verify that `.env` exists in the project root with your database credentials:
```env
DATABASE_URL="postgresql://neondb_owner:...@ep-....neon.tech/neondb?sslmode=require"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

### 3. Installation
If dependencies are not yet installed:
```bash
npm install
```

### 4. Database Setup & Seeding
To initialize the health news database schema and seed realistic clinical stories, accredited hospitals, verified medical specialists, and poll data:
```bash
node scripts/setup-news-portal-db.js
node scripts/seed-news-items.js
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏛 Platform Architecture & Core Features

### 1. News Portal Navigation & Tickers
- **Top Horizontal Ad Banner**: Accredited hospital partner banner with transparent sponsorship labels.
- **Dynamic Utility Bar**: Live date (`Wednesday, 16 September 2026`), live time ticker, edition indicator, and advertising media kit links.
- **Sticky Category Navbar**: High-contrast, uncluttered category bar (`HOME | LATEST | CANCER | HEART | DIABETES | WOMEN'S HEALTH | PEDIATRICS | MENTAL HEALTH | FITNESS | NUTRITION | MORE ▼`).
- **4-Column Mega Menu**: Full taxonomy breakdown covering *Diseases & Conditions*, *Life Stages*, *Wellness & Prevention*, and *Healthcare Ecosystem*.
- **Breaking News Ticker**: Auto-scrolling ticker with pause-on-hover, arrow navigation, and category tags.
- **Flash Updates Strip**: Fast regulatory news wire (FDA approvals, CDC alerts, WHO guidelines).

### 2. Homepage News Editorial Grid
- **3-Column Hero Layout**:
  - *Col 1–5*: Featured Lead Story with high-resolution image, category pill, excerpt, author byline, and read time.
  - *Col 6–8*: Ranked Top Stories list.
  - *Col 9–12*: Trending `01–05` editorial leaderboard.
- **Latest Health News Feed**: Filter pills by category, sorting tabs (`Latest News`, `Most Read`, `Trending`), and load-more pagination.
- **Category Section Blocks**: Dedicated modules for Cancer, Heart Health, Diabetes, Women's Health, Pediatrics, Mental Health, Fitness, and Clinical Nutrition.
- **Visual Stories / Health Infographics**: 9:16 vertical cards with an interactive full-screen story reader and progress bars.
- **Medical Research & Clinical Discoveries**: Peer-reviewed journal papers and clinical trial summaries.
- **Doctor Video Interviews**: Transcribed specialist discussions with credentials and hospital affiliation.
- **Health Videos & Shorts**: 16:9 full-length player and vertical 9:16 short clips.
- **Health Poll & Digital Magazines**: Interactive poll widget with instant voting and monthly PDF magazines.
- **Sponsored Healthcare Content**: Transparently labeled partner content.
- **News Portal Footer**: 6-column directory with statutory medical disclaimer and newsletter signup.

### 3. Dedicated Route Map
| Route | Description |
| :--- | :--- |
| `/` | Homepage (Complete news portal grid) |
| `/article/[slug]` | Full news article with **Medically Reviewed Box**, citations, and JSON-LD schema |
| `/category/[slug]` | Dedicated category news hub |
| `/doctors` | Specialist directory with credentials & verified badges |
| `/hospitals` | Accredited hospital directory & emergency contacts |
| `/research` | Medical research papers & clinical trials archive |
| `/interviews` | Doctor video interviews archive |
| `/interviews/[slug]`| Single interview viewer with video & transcript |
| `/advertise` | Healthcare advertising media kit & campaign inquiry form |
| `/tools` | Evidence-based health calculators & clinical triage tools |
| `/sitemap.xml` | Dynamic SEO sitemap indexing all news articles and categories |
| `/robots.txt` | Crawler instructions with Googlebot-News optimization |
| `/admin` | CMS Dashboard for publishing, editorial review, and ad placement |

---

## 🛠 Available Scripts

- `npm run dev`: Starts the Next.js development server on port 3000.
- `npm run build`: Creates an optimized production build.
- `npm start`: Runs the production build.
- `npm run lint`: Runs ESLint for code hygiene.
- `npx tsc --noEmit`: Validates TypeScript types across the entire project.
- `npm test`: Runs the ingestion pipeline test suite.

---

## ⚖ Medical & Legal Disclaimer
HealthGhuru is a digital health news and educational publication. Content published on this platform is for general informational purposes only and does not constitute formal medical diagnosis, treatment, or professional advice. Always consult a certified healthcare professional for medical concerns. In an emergency, contact local emergency medical services immediately.
