# Account Settings Manager

A full-stack application for managing per-account settings. Built for the TRIVO Technical Assignment.

---

## Technologies

### Frontend

| Tool | Purpose |
|------|---------|
| Vite + React 18 | Build tooling and UI framework |
| TypeScript | Static typing |
| Material UI (MUI) v6 | Component library |
| React Hook Form | Form state management |
| Zod + `@hookform/resolvers` | Schema-based form validation |
| TanStack Query v5 | Server state, caching, and mutations |
| Axios | HTTP client |
| React Router v6 | Client-side routing |

### Backend

| Tool | Purpose |
|------|---------|
| Fastify | HTTP server |
| TypeScript | Static typing |
| Prisma ORM | Type-safe database access and migrations |
| PostgreSQL | Relational database |
| Zod | Request body and param validation |
| tsx | TypeScript execution in development |

### Infrastructure

| Tool | Purpose |
|------|---------|
| Docker + Docker Compose | PostgreSQL container |

---

## Project Structure

```
account-settings-manager/
├── docker-compose.yml
├── .env.example
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── accounts/       # AccountCard, CreateAccountDialog
│       │   ├── layout/         # AppShell — top nav and page wrapper
│       │   ├── settings/       # SettingField (dynamic renderer), SettingsForm
│       │   └── ui/             # Shared UI — PageLoader
│       ├── hooks/              # useAccounts, useAccountSettings, useSettingsDefinitions
│       ├── lib/
│       │   ├── query/          # queryClient.ts, keys.ts
│       │   ├── api.ts          # Axios instance
│       │   ├── helpers.ts      # Pure utility functions
│       │   └── theme.ts        # MUI theme config
│       ├── pages/              # AccountsPage, AccountSettingsPage
│       ├── routes/             # React Router config
│       ├── schemas/            # Zod validation schemas
│       ├── services/           # Raw API call functions
│       └── types/              # Shared TypeScript interfaces
│
└── backend/
    ├── prisma/
    │   ├── schema.prisma       # DB models: Account, AccountSetting, SettingDefinition
    │   └── migrations/
    └── src/
        ├── controllers/        # HTTP request handlers
        ├── middleware/         # Zod parse helpers
        ├── repositories/       # Prisma query layer — only layer touching the DB
        ├── routes/             # Fastify route registration
        │   └── index.ts        # Central route entry point
        ├── schemas/            # Zod input schemas
        ├── services/           # Business logic and key validation
        ├── lib/                # Prisma client singleton, seed script
        └── types/              # Shared TypeScript types
```

---

## Features

- **Account list** — view, create, and navigate between accounts
- **Per-account settings** — each account has its own independent settings values
- **Database-driven definitions** — setting definitions (key, type, label, options, default) are stored in the `setting_definitions` table. Adding a new setting requires only a DB insert — no frontend code changes
- **Dynamic form rendering** — `SettingField` maps each setting type (`boolean`, `text`, `number`, `select`, `multiselect`) to the correct MUI control automatically
- **Key validation** — the backend rejects any setting key not present in `setting_definitions`, preventing arbitrary data from being stored
- **Layered backend architecture** — `Route → Controller → Service → Repository → Prisma`

---

## Installation & Running

### Prerequisites

- Node.js 18+
- Docker Desktop

---

### 1. Start the database

```bash
docker compose up -d
```

PostgreSQL starts on port **5433** (avoids conflict with any local Postgres on 5432).

---

### 2. Backend

```bash
cd backend

cp .env.example .env       # Review and adjust if needed

npm install

npm run db:migrate         # Apply Prisma migrations
npm run db:seed            # Seed 8 setting definitions + 5 sample accounts

npm run dev                # Starts on http://localhost:3001
```

#### Backend scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with hot reload (`tsx watch`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled output |
| `npm run db:migrate` | Run pending Prisma migrations |
| `npm run db:seed` | Seed definitions and accounts |
| `npm run db:studio` | Open Prisma Studio in browser |

---

### 3. Frontend

```bash
cd frontend

cp .env.example .env.local  # Sets VITE_API_URL=http://localhost:3001/api

npm install

npm run dev                 # Starts on http://localhost:5173
```

#### Frontend scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |

---

## Database Models

### `accounts`

Represents a customer account.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key, auto-generated |
| `name` | `text` | Account display name |
| `created_at` | `timestamp` | Auto-set on insert |
| `updated_at` | `timestamp` | Auto-updated on change |

---

### `account_settings`

Stores the saved setting values for each account. One row per account/key pair.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | Primary key, auto-generated |
| `account_id` | `uuid` | Foreign key → `accounts.id` (cascade delete) |
| `key` | `text` | Setting key (e.g. `timezone`, `enable_notifications`) |
| `value` | `text` | JSON-serialised value — supports `boolean`, `string`, `number`, `string[]` |
| `created_at` | `timestamp` | Auto-set on insert |
| `updated_at` | `timestamp` | Auto-updated on change |

**Constraints:** `UNIQUE (account_id, key)` — one value per setting per account. This composite unique index also serves as the index for lookups by `account_id`.

---

### `setting_definitions`

The source of truth for what settings exist in the system. Seeded on first deploy; managed via DB or admin tooling afterwards. The backend validates every write against this table.

| Column | Type | Notes |
|--------|------|-------|
| `key` | `text` | Primary key — unique setting identifier (e.g. `daily_email_limit`) |
| `label` | `text` | Human-readable label shown in the UI |
| `description` | `text?` | Optional helper text shown below the field |
| `type` | `text` | One of `boolean`, `text`, `number`, `select`, `multiselect` |
| `default_value` | `text` | JSON-serialised default (used when an account has no saved value) |
| `options` | `text?` | JSON-serialised `{ label, value }[]` — required for `select` and `multiselect` |
| `sort_order` | `integer` | Controls display order in the UI (default `0`) |
| `created_at` | `timestamp` | Auto-set on insert |
| `updated_at` | `timestamp` | Auto-updated on change |

---

## API Reference

### Accounts

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/accounts` | List all accounts |
| `GET` | `/api/accounts/:id` | Get account by ID |
| `POST` | `/api/accounts` | Create account |
| `PATCH` | `/api/accounts/:id` | Update account name |
| `DELETE` | `/api/accounts/:id` | Delete account |

### Settings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/settings/definitions` | List all setting definitions |
| `GET` | `/api/settings/accounts/:id` | Get saved settings for an account |
| `PUT` | `/api/settings/accounts/:id` | Batch save settings for an account |
| `PUT` | `/api/settings/accounts/:id/:key` | Save a single setting |
| `DELETE` | `/api/settings/accounts/:id/:key` | Delete a single setting |

---

## Approach

### Database-driven settings

Setting definitions live in the `setting_definitions` table, not in code. The backend exposes them via `GET /api/settings/definitions`. The frontend fetches this once on load (cached indefinitely) and uses it to render the form dynamically. Adding a new setting is a database operation, not a deployment.

### Dynamic form rendering

`SettingField.tsx` is the single place that maps a `type` value to a UI control. It handles all five types (`boolean` → Switch, `text` → TextField, `number` → TextField, `select` → Select, `multiselect` → Checkboxes). No per-setting components, no conditional rendering scattered across the codebase.

### Backend key validation

On every write, the service layer fetches valid keys from `setting_definitions` and rejects any unknown key with a `400`. The database is the authority on what is allowed.

### Query key management

All React Query keys are centralised in `src/lib/query/keys.ts` as a typed factory object. This prevents key string duplication and makes targeted cache invalidation straightforward.

