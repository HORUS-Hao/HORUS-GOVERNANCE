# T050-B First Replenishment Report – MVP Data List

> **Status**: MVP Proposal
> **Date**: 2026-01-24
> **Platform**: PCHOME Only

---

## 1. 必須欄位（不可少）

| 欄位 | 來源 | 說明 |
|------|------|------|
| `t005_uid` | T005 | HORUS 商品唯一識別碼 |
| `platform_code` | T050-A | 固定 `PCHOME` |
| `platform_product_id` | T050-A | PCHOME 廠商料號 |
| `brand` | T005 | 品牌名稱 |
| `product_model_raw` | T005 | 商品型號（顯示用） |
| `product_name` | T005 | 商品名稱 |
| `platform_inventory_qty` | Platform | PCHOME 當前庫存 |
| `erp_inventory_qty` | ERP | ERP 加總庫存 |
| `inventory_gap` | Calculated | ERP - Platform（正值=可補貨） |
| `snapshot_timestamp` | Calculated | 快照時間 |

**必須欄位：10 個**

---

## 2. 可延後欄位（Optional）

| 欄位 | 來源 | 延後理由 |
|------|------|---------|
| `product_status` | T005 | MVP 可先不篩選 |
| `category_major` | T005 | 分類報表後續再做 |
| `category_middle` | T005 | 分類報表後續再做 |
| `supplier` | T005 | 供應商報表後續再做 |
| `platform_listing_status` | Platform | 需建立 Status Mapping |
| `platform_sales_qty_7d` | Platform | 銷售數據需額外取得 |
| `platform_sales_qty_30d` | Platform | 銷售數據需額外取得 |
| `erp_warehouse` | ERP | MVP 使用加總即可 |
| `data_quality_flag` | Calculated | MVP 可人工確認 |

**可延後欄位：9 個**

---

## 3. 欄位來源分佈（MVP）

| 來源 | 必須欄位 | 可延後欄位 |
|------|---------|-----------|
| **T005** | 4 | 4 |
| **T050-A** | 2 | 0 |
| **Platform** | 1 | 3 |
| **ERP** | 1 | 1 |
| **Calculated** | 2 | 1 |

---

## 4. MVP 資料流

```
T005 (商品主表)
    │
    ├─ t005_uid, brand, product_model_raw, product_name
    │
    ▼
T050-A (Mapping)
    │
    ├─ platform_code, platform_product_id
    │
    ▼
Platform (PCHOME 後台)
    │
    ├─ platform_inventory_qty
    │
    ▼
ERP (庫存系統)
    │
    ├─ erp_inventory_qty
    │
    ▼
Calculated
    │
    ├─ inventory_gap = erp_inventory_qty - platform_inventory_qty
    ├─ snapshot_timestamp = NOW()
    │
    ▼
【第一份補貨報告】
```

---

## 5. MVP 輸出範例

| t005_uid | platform_code | platform_product_id | brand | product_model_raw | product_name | platform_inventory_qty | erp_inventory_qty | inventory_gap | snapshot_timestamp |
|----------|---------------|---------------------|-------|-------------------|--------------|------------------------|-------------------|---------------|-------------------|
| UID-001 | PCHOME | ABC-123 | BrandA | MODEL-X | 商品名稱A | 5 | 20 | +15 | 2026-01-24 22:00 |
| UID-002 | PCHOME | DEF-456 | BrandB | MODEL-Y | 商品名稱B | 10 | 8 | -2 | 2026-01-24 22:00 |

---

## 6. 相關文件

- [T050-B-GOVERNANCE.md](./T050-B-GOVERNANCE.md) - T050-B 治理規範（FROZEN）
- [T050-B-Replenishment-FACT.md](./T050-B-Replenishment-FACT.md) - T050-B 資料表定義（FROZEN）

---

## 7. 版本紀錄

| 版本 | 日期 | 變更說明 |
|-----|------|---------|
| v0.1 | 2026-01-24 | 初版 MVP Data List |
