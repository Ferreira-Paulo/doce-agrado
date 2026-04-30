# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

There is no test suite configured.

## Stack

- **Next.js** (App Router, JavaScript — no TypeScript) with React 19
- **Firebase** — Auth (email/password with custom claims) + Firestore
- **Tailwind CSS v4** via `@tailwindcss/postcss`
- Path alias `@/*` maps to `./src/*`

## Architecture

### Domain

Doce Agrado sells handmade truffles to partner establishments on a consignment basis. Partners receive deliveries and pay based on actual sales. Payments are applied FIFO across outstanding deliveries.

Key terms (used in Portuguese in the code):
- `parceiro` — partner (establishment)
- `entrega` — delivery
- `pagamento` — payment
- `saldo` — remaining balance on a delivery

### Data Model (Firestore)

```
partners/{partnerId}
  deliveries/{deliveryId}
    data          — ISO date string
    quantidade    — quantity
    valor_unitario — unit price
    pagamentos[]  — array of { valor, data } objects (FIFO applied)
```

`total = quantidade × valor_unitario`; `saldo = total − sum(pagamentos)`. Business logic lives in [src/components/utils/calc.js](src/components/utils/calc.js).

### Authentication

Login page constructs email as `{username}@doceagrado.local` and calls Firebase Auth. After login the ID token is stored; subsequent API calls send it as `Authorization: Bearer <token>`.

Two API middleware helpers:
- [src/lib/auth/requireAuth.js](src/lib/auth/requireAuth.js) — validates token (any logged-in user)
- [src/lib/auth/requireAdmin.js](src/lib/auth/requireAdmin.js) — validates token **and** requires `admin: true` custom claim

The `/api/admin/make-admin` route promotes a user to admin; it is protected by a setup key from the environment (not by a Firebase claim), so it can be called before any admin exists.

### API Routes

| Route | Method | Auth | Purpose |
|---|---|---|---|
| `/api/entregas` | GET | Admin | List all deliveries grouped by partner |
| `/api/entregas` | POST | Admin | Create a new delivery for a partner |
| `/api/pagamentos` | POST | Admin | Record a payment (FIFO applied across deliveries) |
| `/api/parceiro/entregas` | GET | Any user | Return the logged-in partner's deliveries |
| `/api/admin/make-admin` | POST | Setup key | Promote a UID to admin via custom claim |

### Pages

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | "Em breve" placeholder |
| `/teste` | Public | Marketing landing page |
| `/login` | Public | Email/password login for partners and admins |
| `/parceiro` | Logged-in | Partner dashboard — view own deliveries and balance |
| `/admin` | Admin only | Manage all partners, create deliveries and payments |

### Styling

Brand colors are CSS custom properties in [src/app/globals.css](src/app/globals.css):
- `--color-primary: #D9418C` (pink)
- `--color-secondary: #E85AA0`
- `--color-dark: #A12C66`
- `--color-bg: #FFF7FB`
- `--color-text: #3A0F24`

### Environment Variables

Firebase client keys use the `NEXT_PUBLIC_FIREBASE_*` prefix. Firebase Admin SDK credentials (service account) are server-only variables. See `.env.local` (not committed) for the full list.
