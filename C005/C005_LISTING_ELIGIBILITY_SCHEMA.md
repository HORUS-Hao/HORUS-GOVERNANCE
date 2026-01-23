# C005 Listing Eligibility Schema

> **Status**: DRAFT
> **Version**: 1.0.0
> **Date**: 2026-01-23
> **Author**: Architect
> **Phase**: C005 Phase 2 - Eligibility Foundation

---

## 1. Purpose

定義「商品是否應納入上架率計算」的資料結構（Schema Only）。

本文件：
- ✅ 定義 Eligibility 資料結構
- ✅ 定義 ENUM 值域
- ✅ 定義資料來源對應
- ❌ 不包含判斷邏輯實作
- ❌ 不包含 KPI 計算公式

---

## 2. Eligibility Record Schema

| Field | Type | Nullable | Description |
|-------|------|----------|-------------|
| `sku_uid` | string | NO | 商品唯一識別碼（來自 T005 Canonical） |
| `platform_code` | string | NO | 平台代碼：MOMO / PCHOME / YAHOO / SHOPEE_KATAI / SHOPEE_GUSENSE |
| `seller_code` | string | YES | 賣場代碼（若 scope = PLATFORM_SELLER） |
| `eligibility_scope` | ENUM | NO | 適用範圍：GLOBAL / PLATFORM / PLATFORM_SELLER |
| `eligible` | boolean | NO | 是否納入上架率母數 |
| `reason_code` | string | NO | 排除/納入原因代碼 |
| `effective_date` | date | NO | 生效日期 (YYYY-MM-DD) |
| `source` | ENUM | NO | 資料來源：T005 / ERP / MANUAL |
| `created_at` | timestamp | NO | 記錄建立時間 |

---

## 3. ENUM Definitions

### 3.1 eligibility_scope

| Value | Description |
|-------|-------------|
| `GLOBAL` | 全平台適用（商品層級） |
| `PLATFORM` | 特定平台適用 |
| `PLATFORM_SELLER` | 特定平台 + 賣場適用 |

### 3.2 reason_code

| Code | eligible | Description |
|------|----------|-------------|
| `DEFAULT_INCLUDE` | true | 預設納入（無特殊排除條件） |
| `STRATEGY_ALLOW` | true | 策略允許上架 |
| `STRATEGY_OPTIONAL` | true | 策略可選上架 |
| `STRATEGY_DENY` | false | 策略禁止上架 |
| `PRODUCT_DISCONTINUED` | false | 商品已停產 |
| `PRODUCT_INACTIVE` | false | 商品未啟用 |
| `PLATFORM_RESTRICTED` | false | 平台限制（授權/合規） |
| `MANUAL_EXCLUDE` | false | 人工排除 |
| `MANUAL_INCLUDE` | true | 人工納入（覆寫排除） |

### 3.3 source

| Value | Description |
|-------|-------------|
| `T005` | 來自 T005 Canonical 商品主檔 |
| `ERP` | 來自 ERP 商品資料 |
| `MANUAL` | 人工輸入（Phase 3+） |
| `DERIVED` | 系統推導（基於規則） |

---

## 4. Data Source Mapping

### 4.1 T005 Canonical Fields → Eligibility

| T005 Field | Maps To | Logic |
|------------|---------|-------|
| `product_status` | `eligible` | ACTIVE → true, else → false |
| `brand` | (filter) | 用於 Strategy Mapping 查詢 |
| `category` | (filter) | 用於平台限制判斷 |

### 4.2 ERP Fields → Eligibility

| ERP Field | Maps To | Logic |
|-----------|---------|-------|
| `is_active` | `eligible` | true → eligible, false → ineligible |
| `discontinued_date` | `reason_code` | 有值 → PRODUCT_DISCONTINUED |

### 4.3 Strategy Mapping → Eligibility

| Strategy Field | Maps To | Logic |
|----------------|---------|-------|
| `strategy_scope` | `reason_code` | ALLOW → STRATEGY_ALLOW, DENY → STRATEGY_DENY |
| `platform_code` | `platform_code` | 直接對應 |

---

## 5. Scope Resolution Rules

當多個 Eligibility 記錄存在時，採用以下優先順序：

```
1. PLATFORM_SELLER (最具體)
2. PLATFORM
3. GLOBAL (最通用)
```

範例：
- 若 `sku_uid=A` 有 GLOBAL eligible=true
- 但 `sku_uid=A, platform_code=MOMO` 有 PLATFORM eligible=false
- 則 MOMO 平台下該商品 eligible=false

---

## 6. Phase 2 Defaults

### Architect Decision Required

| Decision | Recommended | Status |
|----------|-------------|--------|
| 預設 eligible 值 | `true`（全納入） | PENDING |
| 允許 MANUAL 覆寫 | `false`（Phase 3 再開） | PENDING |

### Phase 2 Runtime Behavior

```
IF no eligibility record exists for (sku_uid, platform_code):
  THEN eligible = true, reason_code = 'DEFAULT_INCLUDE'
```

---

## 7. Non-Goals (Phase 2)

- ❌ 不實作 MANUAL 輸入介面
- ❌ 不回填歷史 Eligibility
- ❌ 不修改 T005 / ERP 結構
- ❌ 不產生實際 KPI 數值
- ❌ 不建立 Trigger

---

## 8. Related Documents

- `C005_TOTAL_POPULATION_SNAPSHOT.md` - 母數定義
- `C005_SHOPEE_PLATFORM_DECISION.md` - 平台拆分決策
- `C005_PHASE2_READINESS.md` - Phase 2 就緒檢查

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-23 | Architect | Initial schema definition |
