
# ClinicFlow

ClinicFlow is a Next.js demo app for managing a clinic's day-to-day workflow. It provides a polished patient management experience with a login flow, dashboard analytics, appointment scheduling, payment tracking, notification logs, and configurable clinic settings.

The app is currently implemented as a front-end-first prototype. Data is stored in browser local storage and seeded from mock records in the repository, so it runs without any backend or database.

## Features

- Demo sign-in with phone number or Google-style quick login
- Role-based session presets for doctor, receptionist, and admin users
- Dashboard with live-looking clinic metrics, patient shortcuts, appointments, revenue, and pending dues
- Patient directory with search, sort, add, edit, and delete flows
- Appointment scheduler with patient selection and visit type support
- Payments ledger with paid and pending totals
- Notification queue with cron simulation, queue processing, reset, and clear actions
- Settings screen for clinic profile, OP validity, and reminder channel preferences
- Spotlight search and responsive sidebar/header layout

## Tech Stack

- Next.js 14 with the App Router
- React 18
- TypeScript
- Tailwind CSS
- Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install

```bash
npm install
```

### Run the app

```bash
npm run dev
```

Open the app in your browser at http://localhost:3000.

If port 3000 is already in use, Next.js will automatically fall back to another port such as 3001.

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - run the production server
- `npm run lint` - run Next.js linting

## Deploy to Vercel (from GitHub)

This repository contains the runnable Next.js app in `/clinicflow`, so configure Vercel to use that folder as the project root.

### 1) Push your latest code to GitHub

From your local clone:

```bash
git add .
git commit -m "ready for vercel deploy"
git push origin <your-branch>
```

### 2) Import the repository in Vercel

1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Sign in with GitHub and authorize Vercel access if prompted.
3. Select `Tejarobo/ClinicApp`.
4. Click **Import**.

### 3) Configure build settings

In the project setup screen, use:

- **Framework Preset:** `Next.js` (auto-detected)
- **Root Directory:** `clinicflow`
- **Install Command:** `npm install`
- **Build Command:** `npm run build`
- **Output Directory:** leave empty (Next.js default)

Then click **Deploy**.

### 4) Add environment variables (optional, only if using Supabase)

If you want Supabase-backed features, add these in **Project Settings → Environment Variables**:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

If these are not set, the app still runs using local mock data.

### 5) Redeploy after config changes

After adding/changing environment variables:

1. Open your Vercel project.
2. Go to **Deployments**.
3. Click **Redeploy** on the latest deployment.

### 6) Set production domain

1. Open **Project Settings → Domains**.
2. Add your custom domain (optional), or use the default `*.vercel.app` URL.

### 7) Verify deployment

After deployment succeeds:

1. Open the production URL.
2. Go to `/login`.
3. Sign in with any demo role or phone + OTP.
4. Check dashboard, patients, appointments, and settings pages load correctly.

## Demo Login

Use one of the quick roles on the login screen, or enter a 10-digit phone number and OTP.

Demo OTP: `123456`

Quick role phone numbers:

- Doctor: `9876543210`
- Receptionist: `9123456789`
- Admin: `9988776655`

## Project Structure

- `app/` - route segments, layouts, and pages
- `components/` - shared UI such as the header, sidebar, and cards
- `lib/mock-data.ts` - seeded clinic data and local-storage helpers
- `types/` - shared TypeScript types

## Notes

- The home route redirects to `/login`.
- The app uses browser local storage for session state and mock records.
- Most screens are interactive, but the project does not currently include a backend API.

## Browser Support

The app is designed for modern desktop and mobile browsers.
