# Shopee 平台治理政策

> **Version**: v2026-01.2
> **Created**: 2026-01-23
> **Updated**: 2026-01-23
> **Status**: ACTIVE
> **Authority**: Architect
> **Platform Code**: SHOPEE

---

## 0. FACT Declaration

| Item | Value |
|------|-------|
| Can become FACT | **YES** |
| FACT Date Basis | **Asia/Taipei** |
| FACT Date Format | yyyy-MM-dd |

---

## 1. Platform Overview

| Item | Value |
|------|-------|
| Platform Name | 蝦皮購物 |
| Platform Code | SHOPEE |
| Integration Status | GOVERNANCE_READY |
| Data Source | C005 Crawler |
| Write Permission | NONE (read-only observation) |

### 1.1 Seller Accounts (Runtime Only)

| Account | 說明 |
|---------|------|
| KATAI | 賣場帳號 1 |
| Gusense | 賣場帳號 2 |

> **Note**: 賣場帳號為 Runtime 層級資訊，不影響 platform_code。
> FACT 層僅使用 `SHOPEE` 作為 platform_code。

---

## 2. Listing Status Definition

### 2.1 Status Enum

| Status | 中文 | 定義 |
|--------|------|------|
| `SHOULD_LIST` | 應上架 | T005 有效商品，應在 Shopee 上架 |
| `LISTED` | 已上架 | 已在 Shopee 確認上架 |
| `CONFLICT` | 衝突 | 狀態不一致 |
| `BLOCKED` | 封鎖 | 平台政策封鎖或下架 |
| `NOT_APPLICABLE` | 不適用 | 商品不適合此平台 |

### 2.2 Status Transition

```
SHOULD_LIST → LISTED (上架確認)
SHOULD_LIST → CONFLICT (超時未上架)
LISTED → SHOULD_LIST (重新評估)
LISTED → BLOCKED (平台下架)
BLOCKED → SHOULD_LIST (解除封鎖)
```

---

## 3. Listing Eligibility Rules

### 3.1 基本條件

| Condition | Requirement |
|-----------|-------------|
| T005 Status | `正常銷售` OR `庫存不足` |
| Product Category | Shopee 允許類別 |
| Price Range | 符合平台價格政策 |
| Brand Authorization | 建議有 |

### 3.2 排除條件

| Exclusion | Reason |
|-----------|--------|
| T005 Status = 停產 | 永久停產 |
| T005 Status = 停止銷售 | 暫停銷售 |
| T005 Status = 新品開發 | 尚未上市 |
| Blocked by Platform | 平台政策封鎖 |
| Category restricted | 平台禁售類別 |

---

## 4. Data Flow

### 4.1 來源

```
T005 (SSOT) → C005 (Comparison) → Shopee Status (SHOPEE)
```

### 4.2 不允許操作

| Operation | Allowed |
|-----------|---------|
| Read Shopee listing | YES |
| Compare with T005 | YES |
| Update Shopee via API | NO |
| Auto-list new products | NO |
| Auto-delist products | NO |
| Cross-platform sync | NO |

---

## 5. Conflict Detection

### 5.1 衝突類型

| Conflict Type | Detection Rule |
|---------------|----------------|
| SHOULD_BUT_NOT | T005 eligible + Shopee not listed |
| SHOULD_NOT_BUT_LISTED | T005 not eligible + Shopee listed |
| PRICE_MISMATCH | T005 price ≠ Shopee price (>5%) |
| DATA_MISMATCH | T005 name/spec ≠ Shopee data |

### 5.2 衝突處理

| Action | Automation |
|--------|------------|
| Alert PM | YES (via Mail Router) |
| Auto-resolve | NO |
| Manual queue | YES |
| Cross-platform reconciliation | NO (manual) |

---

## 6. Reporting

### 6.1 Daily Report Fields

| Field | Source |
|-------|--------|
| Total T005 products | T005 |
| Shopee eligible products | T005 filtered |
| Actually listed | C005 crawl |
| Listing rate | calculated |
| Conflicts | C005 comparison |

### 6.2 Report Recipients

| Role | Receives |
|------|----------|
| PM | Daily summary |
| Architect | Conflict alerts only |

---

## 7. Governance Constraints

| Constraint | Reason |
|------------|--------|
| No direct API write | 避免未授權操作 |
| No auto-sync | 需人工確認 |
| Read-only observation | 治理級可用 |
| Single platform_code (SHOPEE) | 統一 FACT 層識別 |

---

## Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-23 | v2026-01.2 | Remove SHOPEE_G/SHOPEE_K, use single SHOPEE code; Add FACT declaration |
| 2026-01-23 | v2026-01.1 | Initial policy definition |

---

**END OF SHOPEE_POLICY.md**
