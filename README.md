# AI Driven Judicial Precedent and Case Management Ecosystem

A modern AI-powered platform for judicial workflows, precedent discovery, case management, and role-based legal decision support.

## Project Overview

AI Driven Judicial Precedent and Case Management Ecosystem enables advocates, judges, and citizens to manage cases with intelligent analysis and high transparency. It provides:
- Role-based dashboards (Advocate, Citizen, Judge)
- Case filing, requests, case chat, and status tracking
- AI-driven precedent search and SimilarCaseAnalyzer
- Legal draft generation (DraftGenerator)
- Judicial analytics and live case feed
- Blockchain-style audit log (BlockchainLog)
- Multi-language UI (LanguageContext + useTranslations)

## Tech Stack

- React
- TypeScript
- Vite
- Context API
- Gemini AI integration (`services/geminiService.ts`)

## Installation

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` after the dev server starts.

## Key Pages and Modules

- `components/LoginPage.tsx`
- `components/DashboardLayout.tsx`, `components/Header.tsx`, `components/Sidebar.tsx`
- `components/CaseFiling.tsx`, `components/CaseRequests.tsx`, `components/CaseChat.tsx`
- `components/AIResearchHub.tsx`, `components/PrecedentSearch.tsx`, `components/AnalyticsDashboard.tsx`

## Initial Workflow

1. Set up local environment
2. Add sample data in `data/mockData.ts`
3. Implement role-based route guard
4. Build and validate core case workflows

## Roadmap

- Add authentication + RBAC
- Connect to real backend (Node/Express + database)
- Add unit and integration tests
- Add CI / GitHub Actions
- Deploy to Vercel/Netlify/Azure

## License

MIT
