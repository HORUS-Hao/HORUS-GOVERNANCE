# Platform Status View Definition

> **Version**: v2026-01.1
> **Created**: 2026-01-23
> **Status**: ACTIVE
> **Authority**: Architect
> **Purpose**: 平台狀態一眼可判

---

## 1. Overview

本文件定義「平台狀態 View」的結構與產生規則。
View 為 DERIVED 層產物，不對平台寫入。

---

## 2. Data Sources

| Source | Layer | Role |
|--------|-------|------|
| T005 | FACT | 商品 SSOT |
| C005 | DERIVED | 平台上架事實 |
| R020 | DERIVED | 價格比較結果 |

---

## 3. Platform Status View Schema

### 3.1 View 欄位定義

| Column | Type | Source | Description |
|--------|------|--------|-------------|
| uid | string | T005 | 商品唯一識別碼 |
| product_name | string | T005 | 商品名稱 |
| brand | string | T005 | 品牌 |
| t005_status | string | T005 | T005 商品狀態 |
| listing_eligible | boolean | calculated | 是否應上架 |
| momo_status | enum | C005 | MOMO 上架狀態 |
| pchome_status | enum | C005 | PChome 上架狀態 |
| yahoo_status | enum | C005 | Yahoo 上架狀態 |
| shopee_g_status | enum | C005 | 蝦皮購物狀態 |
| shopee_k_status | enum | C005 | 蝦皮商城狀態 |
| overall_status | enum | calculated | 整體狀態 |
| conflict_count | number | calculated | 衝突數量 |
| last_checked | datetime | C005 | 最後檢查時間 |

### 3.2 Status Enum Values

| Value | 中文 | Color Code |
|-------|------|------------|
| SHOULD_LIST | 應上架 | YELLOW |
| LISTED | 已上架 | GREEN |
| CONFLICT | 衝突 | RED |
| BLOCKED | 封鎖 | GRAY |
| NOT_APPLICABLE | 不適用 | WHITE |
| UNKNOWN | 未知 | GRAY |

---

## 4. View Generation Logic

### 4.1 Pseudo Code

```javascript
function generatePlatformStatusView() {
  var t005Products = getT005Products();
  var c005Status = getC005LatestStatus();

  var view = [];

  for (var product of t005Products) {
    var row = {
      uid: product.uid,
      product_name: product.name,
      brand: product.brand,
      t005_status: product.status,
      listing_eligible: isListingEligible(product.status),

      // Platform status from C005
      momo_status: c005Status.get(product.uid, 'MOMO') || 'UNKNOWN',
      pchome_status: c005Status.get(product.uid, 'PCHOME') || 'UNKNOWN',
      yahoo_status: c005Status.get(product.uid, 'YAHOO') || 'UNKNOWN',
      shopee_g_status: c005Status.get(product.uid, 'SHOPEE_G') || 'UNKNOWN',
      shopee_k_status: c005Status.get(product.uid, 'SHOPEE_K') || 'UNKNOWN',

      // Calculated fields
      overall_status: calculateOverallStatus(row),
      conflict_count: countConflicts(row),
      last_checked: c005Status.getLastChecked(product.uid)
    };

    view.push(row);
  }

  return view;
}
```

### 4.2 Overall Status Calculation

```javascript
function calculateOverallStatus(row) {
  var statuses = [
    row.momo_status,
    row.pchome_status,
    row.yahoo_status,
    row.shopee_g_status,
    row.shopee_k_status
  ];

  // Priority: CONFLICT > SHOULD_LIST > BLOCKED > LISTED > NOT_APPLICABLE
  if (statuses.some(s => s === 'CONFLICT')) return 'CONFLICT';
  if (row.listing_eligible && statuses.some(s => s === 'SHOULD_LIST')) return 'SHOULD_LIST';
  if (statuses.some(s => s === 'BLOCKED')) return 'BLOCKED';
  if (statuses.every(s => s === 'LISTED' || s === 'NOT_APPLICABLE')) return 'LISTED';

  return 'UNKNOWN';
}
```

### 4.3 Conflict Detection

```javascript
function countConflicts(row) {
  var count = 0;

  // 應上架但未上
  if (row.listing_eligible) {
    ['momo', 'pchome', 'yahoo', 'shopee_g', 'shopee_k'].forEach(function(platform) {
      var status = row[platform + '_status'];
      if (status === 'SHOULD_LIST' || status === 'UNKNOWN') {
        count++;
      }
    });
  }

  // 不應上架但已上
  if (!row.listing_eligible) {
    ['momo', 'pchome', 'yahoo', 'shopee_g', 'shopee_k'].forEach(function(platform) {
      var status = row[platform + '_status'];
      if (status === 'LISTED') {
        count++;
      }
    });
  }

  return count;
}
```

---

## 5. View Output Locations

### 5.1 Primary Output

| Location | Format | Purpose |
|----------|--------|---------|
| HORUS-DERIVED/PLATFORM_STATUS/ | JSON | 程式化存取 |
| C005 Spreadsheet / Platform_View | Sheet | 人工查閱 |

### 5.2 File Naming Convention

```
PLATFORM_STATUS_{YYYY-MM-DD}.json
```

---

## 6. Quick Judgment Matrix

### 6.1 一眼可判矩陣

| T005 Status | 應上架 | MOMO | PCHOME | YAHOO | SHOPEE_G | SHOPEE_K | 判定 |
|-------------|--------|------|--------|-------|----------|----------|------|
| 正常銷售 | YES | ✅ | ✅ | ✅ | ✅ | ✅ | OK |
| 正常銷售 | YES | ✅ | ❌ | ✅ | ✅ | ✅ | CONFLICT (1) |
| 正常銷售 | YES | ❌ | ❌ | ❌ | ❌ | ❌ | CONFLICT (5) |
| 停產 | NO | ❌ | ❌ | ❌ | ❌ | ❌ | OK |
| 停產 | NO | ✅ | ❌ | ❌ | ❌ | ❌ | CONFLICT (1) |

### 6.2 顏色標示

| Conflict Count | Color | Action |
|----------------|-------|--------|
| 0 | GREEN | No action needed |
| 1-2 | YELLOW | Review recommended |
| 3+ | RED | Immediate attention |

---

## 7. Governance Constraints

| Constraint | Reason |
|------------|--------|
| View is DERIVED | 不寫入 FACT |
| No platform write | 僅觀測 |
| Daily refresh | 非即時 |
| Human decision required | 衝突處理需人工 |

---

## 8. Related Documents

| Document | Purpose |
|----------|---------|
| YAHOO_POLICY.md | Yahoo 平台政策 |
| SHOPEE_POLICY.md | Shopee 平台政策 |
| T005_STATUS_ENUM.md | 商品狀態定義 |
| C005-GOVERNANCE.md | C005 治理規範 |

---

## Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-23 | v2026-01.1 | Initial view definition |

---

**END OF PLATFORM_STATUS_VIEW.md**
