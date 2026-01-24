# T050-B Replenishment FACT Snapshot

> **Status**: FROZEN
> **Effective Date**: 2026-01-24
> **Governance Level**: Canonical
> **Phase**: T050-B
> **Version**: v1.0
> **Created**: 2026-01-24
> **Author**: Claude Code (Architect Mode)

---

> **Freeze Notice**
>
> 本文件已凍結為 T050-B 治理基準版本。
> 後續任何變更需透過新版本（v1.x）或新 Phase（T050-C）進行。
> 直接修改本文件屬違規行為，需經 Architect 審核。

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
| `platform_listing_status` | ENUM | | Platform | 平台上架狀態（標準化 ENUM，見下方定義） |

#### platform_listing_status ENUM 定義（v1.0 裁定）

| 值 | 說明 |
|----|------|
| `LISTED` | 已上架、販售中 |
| `UNLISTED` | 已下架、停止販售 |
| `OUT_OF_STOCK` | 缺貨中 |
| `PENDING` | 待審核、處理中 |
| `UNKNOWN` | 無法判斷或資料缺失 |

> **Note**: 各平台原始狀態值需透過「獨立平台 Config」進行 mapping。
> Status mapping 不屬於 T050-A 職責範圍。

### 2.4 平台銷售欄位（Optional）

| 欄位名稱 | 資料型別 | 必填 | 來源 | 說明 |
|---------|---------|-----|------|------|
| `platform_sales_qty_7d` | INTEGER | | Platform | 過去 7 個完整日曆天銷售數量（不含今日） |
| `platform_sales_qty_30d` | INTEGER | | Platform | 過去 30 個完整日曆天銷售數量（不含今日） |
| `platform_sales_timestamp` | TIMESTAMP | | Platform | 銷售數據擷取時間 |

#### 銷售數量計算區間定義（v1.0 裁定）

| 欄位 | 計算區間 | 說明 |
|------|---------|------|
| `platform_sales_qty_7d` | `TODAY - 7` 至 `TODAY - 1` | 不含今日，避免當日資料不完整 |
| `platform_sales_qty_30d` | `TODAY - 30` 至 `TODAY - 1` | 固定日曆天數，避免月份天數差異 |

### 2.5 ERP 庫存欄位（Optional）

| 欄位名稱 | 資料型別 | 必填 | 來源 | 說明 |
|---------|---------|-----|------|------|
| `erp_inventory_qty` | INTEGER | | ERP | ERP 系統當前庫存數量（**加總模式**） |
| `erp_warehouse` | STRING | | ERP | 固定值：`ALL` 或 `CONSOLIDATED` |
| `erp_inventory_timestamp` | TIMESTAMP | | ERP | ERP 數據擷取時間 |

#### ERP 倉庫處理策略（v1.0 裁定）

| 項目 | 裁定 |
|------|------|
| **模式** | 加總模式（Consolidated） |
| **erp_inventory_qty** | 所有倉庫庫存加總值 |
| **erp_warehouse** | 固定標記 `ALL` 或 `CONSOLIDATED` |
| **分倉明細** | Out of Scope（如需分倉，由未來 T050-C 或上游 ERP 報表處理） |

### 2.6 計算欄位

| 欄位名稱 | 資料型別 | 必填 | 來源 | 說明 |
|---------|---------|-----|------|------|
| `inventory_gap` | INTEGER | | Calculated | ERP 庫存 - 平台庫存（**僅數值差異，非建議量**） |
| `data_quality_flag` | STRING | | Calculated | 資料品質標記（complete/partial/missing） |

#### inventory_gap 語意定義（v1.0 裁定）

```
inventory_gap = erp_inventory_qty - platform_inventory_qty
```

| 值 | 語意 | 說明 |
|----|------|------|
| **正值** | 有餘裕可補貨 | ERP 庫存 > 平台庫存 |
| **零值** | 庫存一致 | 無需補貨 |
| **負值** | 異常警示 | 平台庫存 > ERP 庫存（超賣或 ERP 未同步） |

> **Note**: `inventory_gap` 僅為數值差異，不代表建議補貨量。
> 補貨建議邏輯由 T060 負責。

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

## 7. 語意裁定紀錄（v1.0）

> **Note**: 以下欄位已於 v1.0 完成語意裁定。

| 欄位 | 原不確定項目 | 裁定結果 |
|------|-------------|---------|
| `platform_sales_qty_7d` | 計算區間 | ✅ 過去 7 個完整日曆天（不含今日） |
| `platform_sales_qty_30d` | 計算區間 | ✅ 過去 30 個完整日曆天（不含今日） |
| `erp_warehouse` | 多倉庫處理 | ✅ 加總模式，固定值 `ALL` / `CONSOLIDATED` |
| `inventory_gap` | 負值語意 | ✅ 負值 = 平台庫存 > ERP（異常警示） |
| `platform_listing_status` | ENUM 值 | ✅ 標準化：LISTED / UNLISTED / OUT_OF_STOCK / PENDING / UNKNOWN |

> **Status Mapping**: 各平台原始值需透過「獨立平台 Config」進行 mapping，非 T050-A 職責。

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
| v1.0 | 2026-01-24 | Freeze T050-B canonical baseline（含語意裁定） |

---

## 10. 相關文件

- [T050-B-GOVERNANCE.md](./T050-B-GOVERNANCE.md) - T050-B 治理規範
- [T050-A-Platform-Product-Mapping-PCHOME.md](./T050-A-Platform-Product-Mapping-PCHOME.md) - T050-A 資料表定義
- [T005_SHEET_SCHEMA_CANONICAL_v2026-01.md](../T005/T005_SHEET_SCHEMA_CANONICAL_v2026-01.md) - T005 Canonical Schema
