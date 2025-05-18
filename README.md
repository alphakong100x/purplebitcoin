# CryptoMarketer AI • Promo Site  
*Powered by Purple Bitcoin (PBTC)*  

[![Build](https://github.com/PurpleBitcoin/CryptoMarketerAI‑promo/actions/workflows/ci.yml/badge.svg)](https://github.com/PurpleBitcoin/CryptoMarketerAI‑promo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 1 Project goal  
Deliver a fast, wallet‑gated landing page that:

* Presents CryptoMarketer AI features  
* Verifies a visitor's PBTC balance before showing the early‑access form  
* Stores sign‑ups in Supabase for later outreach  
* Ships from GitHub to Vercel on every push  

Everything lives in this repository and is released under MIT.

---

## 2 Stack in use

| Layer          | Choice                                       |
|----------------|----------------------------------------------|
| Front‑end      | Next.js 14 (App Router) + TypeScript         |
| Styling        | Tailwind CSS 3                                |
| Wallet         | Solana Wallet Adapter + Helius RPC           |
| Backend API    | Next.js `app/api` routes                      |
| Database       | Supabase (PostgreSQL)                         |
| CI / CD        | GitHub Actions ➜ Vercel                      |
| Package mgr    | pnpm (lockfile commited)                     |

---

## 3 Folder map
```
/
├── apps/site # Next.js code
├── public/img # Optimised WebP + SVG assets
├── packages/ui # Shared React components
├── packages/config # Tailwind, ESLint, tsconfig
├── .github/workflows # Continuous‑integration jobs
├── docker # Local preview setup
└── README.md
```

---

## 4 Brand rules
* **Primary purple:** `#8E35FF`  
* **Secondary purple:** `#6E23FF`  
* **Neon accent:** `#FF4CF0`  
* **Dark background:** `#0D0D16`  

Typography  
* Headings – Space Grotesk  
* Body – Inter  

Mascot "**Alpha**"  
* Gorilla with PBTC "B" icon on left cheek  
* Ray‑Ban style shades  
* SVG + 512 px WebP stored in `/public/img/alpha/`  

---

## 5 Local development

```bash
# 1 clone
git clone https://github.com/PurpleBitcoin/CryptoMarketerAI‑promo.git
cd CryptoMarketerAI‑promo

# 2 install
pnpm install

# 3 env  
cp .env.example .env.local   # then fill keys

# 4 run
pnpm dev      # http://localhost:3000
```

## 6 Environment variables
| Key | Purpose |
|-----|---------|
| NEXT_PUBLIC_HELIUS_URL | Solana RPC endpoint |
| PBTC_MINT | PBTC mint address |
| SUPABASE_URL | Supabase project URL |
| SUPABASE_ANON_KEY | Supabase anon key (public) |
| SITE_URL | Vercel production URL |

Keep private keys out of git.

## 7 PBTC wallet gate flow
1. Visitor clicks Connect wallet
2. Front‑end fetches GET /api/balance?address=<pubkey>
3. API calls Helius for SPL token list
4. If PBTC balance ≥ 1 → set gateOpen = true in session
5. Early‑access modal appears with email + Discord fields

## 8 Lead capture
```sql
create table early_access (
  id          uuid primary key default gen_random_uuid(),
  email       text unique,
  wallet      text,
  created_at  timestamptz default now()
);
```
API route /api/signup saves form data through a Zod schema and returns 200.

## 9 Continuous integration
- lint + type‑check — pnpm eslint, pnpm tsc --noEmit
- unit tests (if added) — pnpm vitest
- build — pnpm build
- deploy — Vercel GitHub Action pushes preview on every PR and production on merge to main.

## 10 Roadmap
| Phase | Target date | Deliverable |
|-------|-------------|-------------|
| Alpha live | 2025‑06‑15 | PBTC wallet gate, sign‑up |
| Beta | 2025‑07‑30 | Discord bot demo, social post MVP |
| Public launch | 2025‑09‑01 | Full feature set, docs |

Roadmap JSON sits in /data/roadmap.json and feeds the timeline component.

For a more detailed development roadmap, please see the [ROADMAP.md](ROADMAP.md) file in the repository root.

## 11 How to contribute
1. Fork ➜ branch ➜ commit descriptive messages
2. Follow lint and type rules (pnpm lint fix helps)
3. Open pull request to main, fill template
4. The CI must pass before review

All new UI pieces must respect the color palette and include keyboard navigation focus rings.

## 12 License
Released under the MIT license.
See LICENSE for details.

---

## Current Implementation

This repository currently contains a static HTML/CSS/JS implementation of the promotional website for CryptoMarketer AI, sponsored by the Purple Bitcoin Project.

### Features

- **Responsive Design**: Fully responsive layout that works on mobile, tablet, and desktop devices
- **Interactive Elements**: Animated features, modal popups, and interactive UI components
- **Purple Bitcoin Integration**: Exclusive payment system using PBTC tokens
- **Custom Branding**: Featuring the Purple Bitcoin gorilla mascot and branded color scheme
- **Modern UI**: Sleek, futuristic interface with subtle animations and transitions

### Technologies Used

- HTML5
- CSS3 (with custom animations and transitions)
- JavaScript (vanilla JS for all interactions)
- Font Awesome (for icons)
- Google Fonts (Inter font family)

### Structure

- `index.html` - Main HTML file
- `styles.css` - Main stylesheet
- `script.js` - Core JavaScript functionality
- `payment.js` - Purple Bitcoin payment integration
- `assets/` - Directory containing all images and media files

### Deployment

The website is currently deployed at: https://sxmwiyyl.manus.space
