# T005 Status Enum Definition

> **Version**: v2026-01.1
> **Created**: 2026-01-23
> **Status**: ACTIVE
> **Authority**: Architect
> **Decision**: GR-T005-G1-005 / ENUM_DEFINE_REQUIRED

---

## Purpose

本文件定義 T005 商品主表 `status` 欄位的允許值（Enum）。
所有商品狀態必須符合此定義。

---

## Status Enum Definition

| Status Code | 中文名稱 | 語義 | 上架資格 | 說明 |
|-------------|---------|------|---------|------|
| `正常銷售` | 正常銷售 | Active product, available for sale | **YES** | 可正常銷售的商品 |
| `停止銷售` | 停止銷售 | Temporarily suspended | **NO** | 暫停銷售，可能恢復 |
| `庫存不足` | 庫存不足 | Low inventory warning | **YES** (風險標註) | 庫存警示，仍可銷售 |
| `新品開發` | 新品開發 | Under development | **NO** | 開發中，尚未上市 |
| `停產` | 停產 | Discontinued | **NO** | 永久停產，不再銷售 |

---

## Listing Eligibility Mapping

### 應上架商品 (Listing-Eligible)

| Status | Eligible | Risk Flag |
|--------|----------|-----------|
| 正常銷售 | YES | - |
| 庫存不足 | YES | LOW_INVENTORY |

### 不應上架商品 (Not Listing-Eligible)

| Status | Reason |
|--------|--------|
| 停止銷售 | 暫停銷售 |
| 新品開發 | 尚未上市 |
| 停產 | 永久停產 |

---

## Governance Rules

### 1. 允許值限制

只有上列 5 種狀態為合法值。
任何其他值視為 **INVALID**。

### 2. 預設值

新商品若未指定狀態，預設為 `新品開發`。

### 3. 狀態轉換規則

```
新品開發 → 正常銷售 → 庫存不足 → 正常銷售
           ↓           ↓
         停止銷售    停止銷售
           ↓           ↓
         停產        停產
```

### 4. 不可逆轉換

- `停產` → 任何其他狀態：**禁止**（需 Architect 核准例外）

---

## Consumer Module Usage

### C005 Listing Checker

```javascript
// 判斷是否為應上架商品
function isListingEligible(status) {
  return status === '正常銷售' || status === '庫存不足';
}
```

### T030 Margin Simulation

```javascript
// 排除停產商品
function isActiveProduct(status) {
  return status !== '停產';
}
```

---

## GAS Enum Map (Read-only)

```javascript
/**
 * T005 Status Enum (Read-only)
 * @governance GR-T005-G1-005 / ENUM_DEFINE_REQUIRED
 */
var T005_STATUS_ENUM = Object.freeze({
  NORMAL_SALE: '正常銷售',
  STOP_SALE: '停止銷售',
  LOW_INVENTORY: '庫存不足',
  NEW_DEVELOPMENT: '新品開發',
  DISCONTINUED: '停產'
});

/**
 * 上架資格對應表 (Read-only)
 */
var T005_LISTING_ELIGIBILITY = Object.freeze({
  '正常銷售': { eligible: true, riskFlag: null },
  '停止銷售': { eligible: false, riskFlag: null },
  '庫存不足': { eligible: true, riskFlag: 'LOW_INVENTORY' },
  '新品開發': { eligible: false, riskFlag: null },
  '停產': { eligible: false, riskFlag: null }
});
```

---

## Validation

### 驗證商品狀態是否合法

```javascript
function isValidT005Status(status) {
  return Object.values(T005_STATUS_ENUM).includes(status);
}
```

### 取得上架資格

```javascript
function getListingEligibility(status) {
  return T005_LISTING_ELIGIBILITY[status] || { eligible: false, riskFlag: 'UNKNOWN_STATUS' };
}
```

---

## Migration Notes

### 現有資料處理

- 不回寫或清理舊資料
- 若發現不合法狀態值，標記為 `NEEDS_REVIEW`
- 人工審查後修正

### 程式碼更新

- 所有讀取 status 的程式碼應使用 enum map
- 禁止硬編碼狀態字串

---

## Related Documents

| Document | Purpose |
|----------|---------|
| `T005_SHEET_SCHEMA_CANONICAL_v2026-01.md` | Canonical Schema |
| `T005-LISTING-ELIGIBILITY-RULES.md` | 上架資格規則 |
| `T005_GOVERNANCE_DECISIONS_G2.md` | G2 裁定文件 |

---

## Changelog

| Date | Version | Change | Authority |
|------|---------|--------|-----------|
| 2026-01-23 | v2026-01.1 | Initial enum definition | Architect |

---

**END OF T005_STATUS_ENUM.md**
