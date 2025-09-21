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

## Development Setup

```bash
git clone https://github.com/edierwan/serapod2u.git
cd serapod2u
npm install
npm run dev
```

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
