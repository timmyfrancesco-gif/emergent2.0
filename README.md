# Emergent 2.0

Piattaforma di sviluppo No-Code guidata da AI. Trasforma le tue idee in applicazioni web reali attraverso semplici conversazioni.

## Stack

- **Frontend/Backend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (Dark Mode)
- **Database & Auth**: Supabase (PostgreSQL)
- **AI**: Google Gemini API

## Setup

### 1. Installa le dipendenze

```bash
npm install
```

### 2. Configura le variabili d'ambiente

Inserisci le tue credenziali nel file `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Configura il Database Supabase

1. Crea un progetto su [supabase.com](https://supabase.com)
2. Vai su **SQL Editor** nel dashboard
3. Esegui il contenuto di `supabase/migrations/001_initial.sql`

### 4. Avvia il server di sviluppo

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Funzionalità

- **Homepage**: Inserisci un'idea e avvia la generazione
- **Sidebar**: Navigazione tra progetti, crediti, impostazioni account
- **Workspace**: Chat con AI + Preview in tempo reale
- **Controlli Avanzati**: Selezione modello, budget crediti, MCP tools
- **Pubblicazione**: Genera URL pubblico `/site/[slug]`
- **Sistema Crediti**: 10 crediti iniziali, 0.5 per messaggio

## Struttura

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── auth/page.tsx         # Login/Registrazione
│   ├── workspace/[id]/       # Workspace chat + preview
│   ├── preview/[id]/         # Preview standalone
│   ├── site/[slug]/          # Sito pubblicato
│   └── api/
│       ├── generate/         # Gemini AI generation
│       ├── projects/         # CRUD progetti
│       └── credits/          # Gestione crediti
├── components/
│   ├── Sidebar.tsx
│   ├── ChatInterface.tsx
│   ├── PreviewSandbox.tsx
│   ├── AdvancedSettingsModal.tsx
│   └── AccountSettings.tsx
└── lib/
    ├── gemini.ts             # SDK Gemini
    ├── supabaseClient.ts     # Client browser
    ├── supabaseServer.ts     # Client server
    ├── types.ts              # TypeScript types
    └── utils.ts              # Utilities
```