# Serapod2u — QR/RFID Product Movement System

End-to-end platform to track products (Manufacturer → Warehouse → Distributor → Shop), verify authenticity, and run campaigns (Lucky Draw, Redeem, Rewards Points).

- Product Master Data (Category, Brand, Group, Sub-Group, Manufacturer, Product, Variants)
- Orders → PO → Invoice → Payment → Receipt
- QR/RFID with buffer & exception flows
- Batch-level campaign flags (Lucky Draw, Redeem text, Rewards Points on)
- Role-based access (HQ Admin, Power User, Manufacturer, Warehouse, Distributor, Shop)

👉 **Full spec:** [`/docs/spec.md`](./docs/spec.md)  
📋 **Branching Strategy:** [`/docs/branching-strategy.md`](./docs/branching-strategy.md)

---

## 🚀 Phase 1 - Foundation Complete

**Tech Stack:**
- Next.js 14+ (App Router) + TypeScript
- Tailwind CSS v4 (design tokens)
- shadcn/ui components + Lucide icons + Sonner toasts
- Supabase (Database + Authentication)

**Features Implemented:**
- ✅ Authentication system with Supabase
- ✅ Protected routes with middleware
- ✅ Role-based access control (6 roles)
- ✅ Header with avatar menu + logout
- ✅ Sidebar navigation (2-level)
- ✅ Dashboard with overview cards
- ✅ Settings page with tabs (Profile, Notifications, Danger Zone)
- ✅ Fast Login (dev-only) for testing
- ✅ Database schema (profiles + product_categories)

## Development Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account and project

### Installation

```bash
# Clone repository
git clone https://github.com/edierwan/serapod2u.git
cd serapod2u

# Install dependencies
npm install

# Environment setup
cp .env.local.example .env.local
# Update .env.local with your Supabase credentials
```

### Database Setup

1. **Run SQL Migration:**
   - Open your Supabase dashboard
   - Go to SQL Editor
   - Copy and execute the contents of `supabase/migrations/001_initial_schema.sql`

2. **Verify Tables Created:**
   - `profiles` table with RLS enabled
   - `product_categories` table seeded with 'Vape' and 'Non-Vape'

### Running the Application

```bash
# Start development server
npm run dev

# Build for production
npm run build
npm start

# Lint code
npm run lint

# Format code
npm run format
```

Visit [http://localhost:3000](http://localhost:3000)

### 🚀 Fast Login (Development Only)

When `NEXT_PUBLIC_ENABLE_FAST_LOGIN=true` in `.env.local`, the login page shows a "Fast Login" panel with 6 role buttons:

- **HQ Admin** - Full system access
- **Power User** - Administrative privileges
- **Manufacturer** - Production management
- **Warehouse** - Inventory management  
- **Distributor** - Distribution management
- **Shop** - Retail management

Each creates a test user: `dev+{role}@serapod2u.local` with password `dev123456`.

⚠️ **Security:** Fast login is automatically disabled in production environments.

## Project Structure

```
app/
├── (protected)/          # Protected routes requiring authentication
│   ├── dashboard/        # Main dashboard
│   ├── orders/          # Order management (placeholder)
│   ├── settings/        # User settings with tabs
│   └── ...              # Other protected routes
├── api/
│   └── dev/
│       └── fast-login/   # Dev-only fast authentication
├── login/               # Authentication pages
└── globals.css          # Tailwind styles

components/
├── ui/                  # shadcn/ui components
└── layout/              # Header, Sidebar, Navigation

lib/
├── supabase.ts          # Supabase client configuration
├── database.types.ts    # TypeScript types for database
└── utils.ts             # Utility functions

supabase/
└── migrations/          # SQL migration files
```

## User Roles & Permissions

| Role | Code | Access Level | Description |
|------|------|--------------|-------------|
| HQ Admin | `hq_admin` | Full System | Complete administrative access |
| Power User | `power_user` | Administrative | Extended privileges |
| Manufacturer | `manufacturer` | Production | Manage manufacturing data |
| Warehouse | `warehouse` | Inventory | Warehouse operations |
| Distributor | `distributor` | Distribution | Distribution management |
| Shop | `shop` | Retail | Point-of-sale operations |

## Authentication Flow

1. **/** → Redirects to `/login`
2. **Login** → Email/password or Fast Login (dev)
3. **Protected Routes** → Check session, redirect if none
4. **Role-based UI** → Danger Zone visible only to privileged users

## Development Workflow

This project uses a **three-stage branching strategy**:

- **`development`** → Active development and feature integration
- **`staging`** → Pre-production testing and QA
- **`main`** → Production-ready code (protected)

### Quick Start for Contributors

```bash
# Start new feature from development
git checkout development
git pull origin development
git checkout -b feature/your-feature-name

# After development, create PR to development branch
# Then promote: development → staging → main
```

📋 **See full workflow:** [`/docs/branching-strategy.md`](./docs/branching-strategy.md)

---

## Next Phases

**Phase 2 - Core Business Logic:**
- Product Master Data management
- Order/PO/Invoice/Payment flows
- QR/RFID tracking system

**Phase 3 - Advanced Features:**
- Campaign management (Lucky Draw, Redeem, Rewards)
- Reporting and analytics
- Mobile app integration

**Phase 4 - Scale & Polish:**
- Performance optimization
- Advanced role permissions
- Multi-tenant support
