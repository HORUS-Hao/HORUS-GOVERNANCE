# T050-B Replenishment FACT Snapshot

> **Status**: Draft
> **Phase**: T050-B
> **Version**: v0.1
> **Created**: 2026-01-24
> **Author**: Claude Code (Architect Mode)

---

## 1. 概述

本文件定義 **T050-B-Replenishment-FACT** 資料表結構，
用於產生平台補貨決策所需的 FACT 快照。

### 1.1 設計原則

| 原則 | 說明 |
|------|------|
| 僅使用 `t005_uid + platform_code` 關聯 | 禁止使用商品型號 JOIN |
| 每欄位標記資料來源 | T005 / Platform / Calculated |
| 快照時間戳記 | 每筆資料標記擷取時間 |
| 無策略邏輯 | 不包含「是否需補貨」等判斷 |

---

## 2. 資料表欄位定義

### 2.1 主鍵與識別欄位

| 欄位名稱 | 資料型別 | 必填 | 來源 | 說明 |
|---------|---------|-----|------|------|
| `snapshot_id` | STRING | ✓ | Calculated | 快照唯一識別碼（UUID 或時間戳記組合） |
| `snapshot_timestamp` | TIMESTAMP | ✓ | Calculated | 快照產生時間 |
| `t005_uid` | STRING | ✓ | T005 | HORUS 商品唯一識別碼（**PK 之一**） |
| `platform_code` | STRING | ✓ | T050-A | 平台代碼 PCHOME/MOMO/YAHOO/SHOPEE（**PK 之一**） |
| `platform_product_id` | STRING | ✓ | T050-A | 平台商品識別碼 |

### 2.2 T005 商品主檔欄位

| 欄位名稱 | 資料型別 | 必填 | 來源 | 說明 |
|---------|---------|-----|------|------|
| `brand` | STRING | ✓ | T005 | 品牌名稱 |
| `product_model_raw` | STRING | | T005 | 商品型號（**僅供顯示，不作 JOIN**） |
| `product_name` | STRING | ✓ | T005 | 商品名稱 |
| `product_status` | STRING | ✓ | T005 | 商品狀態（正常/停售/待上架...） |
| `category_major` | STRING | | T005 | 商品大類 |
| `category_middle` | STRING | | T005 | 商品中類 |
| `supplier` | STRING | | T005 | 供應商 |

### 2.3 平台庫存欄位

| 欄位名稱 | 資料型別 | 必填 | 來源 | 說明 |
|---------|---------|-----|------|------|
| `platform_inventory_qty` | INTEGER | | Platform | 平台當前庫存數量 |
| `platform_inventory_timestamp` | TIMESTAMP | | Platform | 庫存數據擷取時間 |
| `platform_listing_status` | STRING | | Platform | 平台上架狀態（上架/下架/缺貨...） |

### 2.4 平台銷售欄位（Optional）

| 欄位名稱 | 資料型別 | 必填 | 來源 | 說明 |
|---------|---------|-----|------|------|
| `platform_sales_qty_7d` | INTEGER | | Platform | 近 7 日銷售數量 |
| `platform_sales_qty_30d` | INTEGER | | Platform | 近 30 日銷售數量 |
| `platform_sales_timestamp` | TIMESTAMP | | Platform | 銷售數據擷取時間 |

### 2.5 ERP 庫存欄位（Optional）

| 欄位名稱 | 資料型別 | 必填 | 來源 | 說明 |
|---------|---------|-----|------|------|
| `erp_inventory_qty` | INTEGER | | ERP | ERP 系統當前庫存數量 |
| `erp_warehouse` | STRING | | ERP | ERP 倉庫名稱 |
| `erp_inventory_timestamp` | TIMESTAMP | | ERP | ERP 數據擷取時間 |

### 2.6 計算欄位

| 欄位名稱 | 資料型別 | 必填 | 來源 | 說明 |
|---------|---------|-----|------|------|
| `inventory_gap` | INTEGER | | Calculated | ERP 庫存 - 平台庫存（**僅數值差異，非建議量**） |
| `data_quality_flag` | STRING | | Calculated | 資料品質標記（complete/partial/missing） |

### 2.7 Metadata 欄位

| 欄位名稱 | 資料型別 | 必填 | 來源 | 說明 |
|---------|---------|-----|------|------|
| `created_at` | TIMESTAMP | ✓ | Calculated | 記錄建立時間 |
| `source_version` | STRING | | Calculated | 資料來源版本標記 |

---

## 3. 主鍵設計

### 3.1 Composite Primary Key

```
PK: (snapshot_id, t005_uid, platform_code)
```

### 3.2 設計理由

| 欄位 | 理由 |
|------|------|
| `snapshot_id` | 區分不同時間點的快照 |
| `t005_uid` | HORUS 商品識別（非商品型號） |
| `platform_code` | 支援多平台 |

### 3.3 唯一性約束

```
UNIQUE: (snapshot_id, t005_uid, platform_code)
```

同一快照中，同一商品在同一平台只能有一筆記錄。

---

## 4. 欄位來源標記總表

| 來源 | 欄位數 | 欄位列表 |
|------|-------|---------|
| **T005** | 7 | t005_uid, brand, product_model_raw, product_name, product_status, category_major, category_middle, supplier |
| **T050-A** | 2 | platform_code, platform_product_id |
| **Platform** | 6 | platform_inventory_qty, platform_inventory_timestamp, platform_listing_status, platform_sales_qty_7d, platform_sales_qty_30d, platform_sales_timestamp |
| **ERP** | 3 | erp_inventory_qty, erp_warehouse, erp_inventory_timestamp |
| **Calculated** | 5 | snapshot_id, snapshot_timestamp, inventory_gap, data_quality_flag, created_at, source_version |

---

## 5. JOIN 規則

### 5.1 允許的 JOIN

```sql
-- 正確：使用 t005_uid
SELECT *
FROM T050_B_Replenishment_FACT fact
JOIN T005 t005 ON fact.t005_uid = t005.UID

-- 正確：使用 platform_code + platform_product_id
SELECT *
FROM T050_B_Replenishment_FACT fact
JOIN T050_A_Mapping mapping
  ON fact.t005_uid = mapping.t005_uid
  AND fact.platform_code = mapping.platform_code
```

### 5.2 禁止的 JOIN

```sql
-- 錯誤：使用商品型號
SELECT *
FROM T050_B_Replenishment_FACT fact
JOIN OtherTable other
  ON fact.product_model_raw = other.model  -- ❌ 禁止！
```

---

## 6. 資料品質規則

### 6.1 data_quality_flag 定義

| 值 | 說明 | 條件 |
|----|------|------|
| `complete` | 資料完整 | 所有必填欄位有值，且平台資料齊全 |
| `partial` | 資料部分缺失 | 必填欄位有值，但 Optional 欄位缺失 |
| `missing` | 資料嚴重缺失 | 必填欄位缺失，或關鍵數據無法取得 |

### 6.2 必填欄位驗證

| 欄位 | 驗證規則 |
|------|---------|
| `t005_uid` | 不可為 NULL，必須存在於 T005 |
| `platform_code` | 不可為 NULL，必須為合法 ENUM 值 |
| `platform_product_id` | 不可為 NULL |
| `snapshot_timestamp` | 不可為 NULL |

---

## 7. 語意不確定欄位

> **Note**: 以下欄位的精確定義需進一步釐清。

| 欄位 | 不確定項目 | 待釐清問題 |
|------|-----------|-----------|
| `platform_sales_qty_7d` | 計算區間 | 是「過去 7 天」還是「本週」？含今日否？ |
| `platform_sales_qty_30d` | 計算區間 | 是「過去 30 天」還是「本月」？ |
| `erp_warehouse` | 多倉庫處理 | 若有多倉庫，是加總還是分列？ |
| `inventory_gap` | 負值語意 | 負值代表平台庫存 > ERP？還是需補貨？ |
| `platform_listing_status` | ENUM 值 | 各平台狀態值不同，如何標準化？ |

---

## 8. 索引建議

| 索引名稱 | 欄位 | 類型 | 用途 |
|---------|------|-----|------|
| `pk_t050b` | `(snapshot_id, t005_uid, platform_code)` | PRIMARY | 主鍵 |
| `idx_t050b_snapshot` | `snapshot_id` | INDEX | 按快照查詢 |
| `idx_t050b_t005uid` | `t005_uid` | INDEX | 按商品查詢 |
| `idx_t050b_platform` | `platform_code` | INDEX | 按平台查詢 |
| `idx_t050b_timestamp` | `snapshot_timestamp` | INDEX | 按時間查詢 |

---

## 9. 版本紀錄

| 版本 | 日期 | 變更說明 |
|-----|------|---------|
| v0.1 | 2026-01-24 | 初版 Draft |

---

## 10. 相關文件

- [T050-B-GOVERNANCE.md](./T050-B-GOVERNANCE.md) - T050-B 治理規範
- [T050-A-Platform-Product-Mapping-PCHOME.md](./T050-A-Platform-Product-Mapping-PCHOME.md) - T050-A 資料表定義
- [T005_SHEET_SCHEMA_CANONICAL_v2026-01.md](../T005/T005_SHEET_SCHEMA_CANONICAL_v2026-01.md) - T005 Canonical Schema
