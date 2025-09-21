
# 📄 `/docs/spec.md` (fresh consolidated spec)

```markdown
# Serapod2u — Functional Specification (v1.3 fresh)

Single source of truth for the new repo + new Supabase project.

---

## 1) Roles
- **HQ Admin** — full admin (products, orders, campaigns, payments)
- **Power User** — approvals (orders) + Danger Zone access
- **Manufacturer** — PO acknowledge & production scans
- **Warehouse** — receive, label, scan, allocate to distributor
- **Distributor** — place orders to HQ, manage shops
- **Shop (Kedai)** — activate products, earn points, redeem

---

## 2) Auth, Routing, Header UI & Fast Login

### Authentication
- Supabase Auth (email/password or magic link)
- User role stored in `profiles.role_code` ∈ {hq_admin, power_user, manufacturer, warehouse, distributor, shop}

### Routing
- Root **`/` redirects to `/login`**
- After login, route to role-specific dashboard

### Header UI (always visible)
- Left: **Serapod2u** brand
- Right: **Avatar menu** (shows current user avatar/name/role). Dropdown items:
  - **My Profile** (edit profile data)
  - **Preferences** (theme/language, personal notification toggles)
  - **Logout**
> Logout is **outside Settings** and accessible here.

*(Optional)* Sidebar header may display “Signed in as {name} ({role})”.

### Fast Login (dev only)
- Controlled by `NEXT_PUBLIC_ENABLE_FAST_LOGIN=true`
- `/login` shows a **Fast Login** panel with buttons for each role
- On click:
  - Seed a dev user for that role if missing (e.g., `dev+role@serapod2u.local`)
  - Sign in with preset dev credentials
- Banner: “FAST LOGIN (DEV ONLY)”
- Must be **disabled** on staging/production

---

## 3) Product Master Data

### Hierarchy (final)
**Category** (fixed) → **Brand** → **Group** → **Sub-Group** → **Product** → **Variant (SKU)**

- **Category**: fixed read-only: **Vape**, **Non-Vape**
- **Brand**: unique within Category
- **Group**: unique within Category
- **Sub-Group**: unique within Group
- **Product**: base model **owned by one Manufacturer**
- **Variant (SKU)**: sellable option (flavor, nic strength, packaging, optional barcode, image)

### Manufacturer ↔ Product
- **1 → many**: one Manufacturer can produce many Products
- Each Product has `manufacturer_id` (required)
- **Recommended**: once a Product has Variants or Orders, `manufacturer_id` becomes **immutable** (block change)

### Strict Uniqueness (DB-first + UI)
- **Product** (strict): **unique** on  
  `(category_id, brand_id, group_id, sub_group_id, manufacturer_id)`  
  → Only **one** Product per Brand+Group+Sub-Group+Manufacturer inside a Category  
  → If Brand already used for that combo, user must **create a new Group/Sub-Group** (or choose another Manufacturer)

- **Variant**:
  - **SKU** is **system-generated** (read-only), **unique** globally
  - **Tuple** per product is unique:  
    `(product_id, flavor_name_ci, coalesce(nic_strength_ci,''), coalesce(packaging_ci,''))`

- **Case-insensitive + trimmed** comparisons: generated `*_ci` columns (e.g., `lower(trim(name))`) back unique indexes

### SKU Generation (simple & stable)
- Auto-generated in a DB trigger on insert (race-safe)
- Example format: `V-ABC-G-S-001-007`
  - `V/N` (Category), first 3 letters of Brand, 1–2 letters Group/Sub-Group, product seq, variant seq
- On failure (rare): show **“We couldn’t generate a SKU. Please try again.”**

### Create Product — UX
- Cascading selects: **Category → Group → Sub-Group → Manufacturer → Brand**
- If Brand already used for this Group/Sub-Group & Manufacturer:
  - Brand option is **greyed** with tooltip:  
    **“Brand already used with this Group/Sub-Group & Manufacturer. Create a new Group/Sub-Group to use it again.”**
- Product name (display) & image
- If Manufacturer missing: toast **“Please create the Manufacturer first.”**  
  (HQ Admin gets Quick-Add dialog)

### Create Variant — UX
- Cascading selects: **Category → Brand → Group → Sub-Group → Product**
- Fields: flavor, nic strength, packaging, optional barcode & image
- SKU shown **read-only** after save
- If duplicate tuple: toast **“This Variant already exists for this Product.”**

### Storage
- Images in bucket `product-images` (read for authed; delete HQ Admin only)

---

## 4) Order Management

### Flow
1. **Create Order** (HQ Admin): header (Manufacturer, MYR, `units_per_box` default 100, `buffer_pct` default 10, `use_rfid`), lines (by **Variant (SKU)**: qty, unit price)
2. **Approval** (Power User): on approve → system:
   - Creates **Batch** (status `open`, `Batch ID = Order ID`)
   - Creates **PO** (status `sent`) with lines; generates **PO PDF** in bucket `po-docs`
   - Opens **Distributor Ordering Window** for the Batch
3. **PO Acknowledge** (Manufacturer): status `acknowledged`
4. **(Phase 5)** Invoice → Payment → Receipt

### Validation
- No duplicate variants per order
- Required header present
- Buffer editable

---

## 5) Campaign Config (Batch flags)
At Order creation:
- **Lucky Draw**: toggle + select campaign
- **Redeem (Free Gift)**: toggle + `redeem_text` (≤ 80 chars)
- **Rewards (Points)**: on by default

Flags are stored on **Batch** at approval; PO PDF shows redeem note when enabled.

---

## 6) Downstream Ordering & Allocation

### Distributor → HQ
- Distributor submits order **against Batch** (by Variant)
- HQ views **Requested** vs **ATP (planned)**:  
  `ATP = Σ(HQ qty ordered) – Σ(allocated) – Σ(shipped)`
- HQ can **approve partial**; creates **allocations** rows; notifies Distributor

### Shop → Distributor
- Same pattern; Distributor approves partial; allocations created; Shop notified

Statuses: Draft → Submitted → Pending Approval → Approved/Partially Approved → (Phase 5: Invoiced → Paid → Receipt)

---

## 7) QR/RFID & Scanning (overview; full in Phase 6)
- Codes generated at Order stage
- **Master QR** per box; **Unique QR** per unit (bound to **product_variant_id**)
- Buffer (default +10%) for misprints
- **Normal**: Manufacturer prints/sticks, scans Master → register uniques; Warehouse receives & scans Master
- **Exception**: if Manufacturer couldn’t print, Warehouse prints/sticks, scans, and assigns
- All transfers logged (user/role/time, optional geo/device)

---

## 8) Campaigns & Rewards (overview)
- Batch flags drive eligibility:
  - Lucky Draw → enabled + campaign ref
  - Redeem → enabled + label printed/displayed
  - Rewards Points → on; **first valid activation** earns points (idempotent per `shop_id + code_id`)

---

## 9) Rewards (Points) — data heads (Phase 7)
- `reward_levels`, `reward_activities`, `reward_user_activity`
- `reward_catalog`
- `reward_user_state` (balance/level)
- `reward_transactions` (immutable ledger)
- `reward_redemptions`
- Activation awards store `product_variant_id` in metadata

---

## 10) Notifications & Dashboard
- In-app/email events: Order approval, PO ack, invoices, payment uploaded/verified, receipt, activations, rewards events, allocation approvals
- KPI cards + stepper view of lifecycle

---

## 11) UI Standards
- Next.js + TypeScript
- Tailwind v4 design tokens (no custom CSS files)
- **shadcn/ui** components; **lucide-react** icons; **Sonner** toasts
- `ImageWithFallback` for all images (no `<img>`)

---

## 12) Sidebar (2 levels max)

🏠 Dashboard

📂 Order Management
├─ Orders (Create | Approval | List)
├─ Purchase Orders (PO List | Acknowledge)
├─ Invoices
├─ Payments
└─ Receipts

📍 Tracking
├─ Case Movements (Inbound | Outbound)
├─ Scan History (By Batch | By Case)
└─ Blocked / Returned

🎯 Campaigns
├─ Lucky Draw
├─ Redeem
└─ Rewards (Points)

⚙️ Master Data
├─ Products (Categories | Brands | Groups | Sub-Groups | Products | Variants)
├─ Manufacturers
├─ Distributors
└─ Shops

🔔 Notifications
⚙️ Settings
├─ Profile & Preferences (page is also reachable from avatar menu)
├─ Notification Preferences (Email / WhatsApp / Push)
└─ Danger Zone (HQ Admin & Power User only)

markdown
Copy code

> **Logout is NOT here.** It’s in the **top-right avatar menu**.

---

## 13) RBAC, RLS & Audit
- RLS by `auth.uid()` + `profiles.role_code`
- Master Data:
  - HQ Admin: full
  - Power User: read-only (plus **Danger Zone** access)
  - Distributor/Shop: read-only catalog
- Orders/PO/Allocations per role matrix
- **Audit logs** for destructive & critical actions (incl. Danger Zone, approvals)

---

## 14) 🔴 Danger Zone — Clear Master Data (keep Categories)
Purpose: wipe master data during testing/migration while **keeping** `product_categories` rows **Vape** & **Non-Vape**.

- **Access:** HQ Admin, Power User (re-auth required)
- **UI:** Settings → Danger Zone → red panel; two confirmations:
  1) Checkbox: “I understand this will delete all master data except Categories”
  2) Type `DELETE ALL`
- **Deletes (transaction, in order):**
  - `product_variants`, `products`, `product_subgroups`, `product_groups`, `brands`
  - `manufacturers`, `distributors`, `shops`
  - `lucky_draw_campaigns`
  - (Rewards config/data: default **keep** balances/history; optional dev toggle later)
- **Preserves:**
  - `product_categories` (re-seed Vape/Non-Vape idempotently)
  - Orders/POs/Invoices/Payments/Receipts, scans, allocations, audit logs, auth users
- **Success toast:** “Master Data cleared successfully. Categories kept (Vape, Non-Vape).”
- **Audit:** insert into `audit_logs` with action `clear_master_data`

---

## 15) Migration Plan (high level)
1) Seed Categories (Vape/Non-Vape, read-only)
2) Create Brands/Groups/Sub-Groups/Manufacturers
3) Create Products (with Manufacturer)
4) Create Variants (SKU auto-generated)
5) Proceed with Orders → PO…

---

## 16) Acceptance (Master Data, Auth & Header)
- **Product** creation enforces Manufacturer link + strict uniqueness (combo with Sub-Group)
- **Variant** creation blocks duplicate flavor/nic/pack; **SKU generated** and shown read-only
- **If Manufacturer missing** → toast “Please create the Manufacturer first.”
- **If Brand used in this Group/Sub-Group & Manufacturer** → brand disabled + tooltip
- **All errors** are human-friendly (no DB jargon)
- `/` redirects to `/login`
- **Top-right avatar menu** provides **My Profile**, **Preferences**, and **Logout**
- **Fast Login** (dev only) works for all roles
