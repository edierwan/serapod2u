# Serapod2u — QR/RFID Product Movement System

End-to-end platform to track products (Manufacturer → Warehouse → Distributor → Shop), verify authenticity, and run campaigns (Lucky Draw, Redeem, Rewards Points).

- Product Master Data (Category, Brand, Group, Sub-Group, Manufacturer, Product, Variants)
- Orders → PO → Invoice → Payment → Receipt
- QR/RFID with buffer & exception flows
- Batch-level campaign flags (Lucky Draw, Redeem text, Rewards Points on)
- Role-based access (HQ Admin, Power User, Manufacturer, Warehouse, Distributor, Shop)

👉 **Full spec:** [`/docs/spec.md`](./docs/spec.md)

---

## Development Setup

```bash
git clone <repo-url>
cd serapod2u
npm install
npm run dev
