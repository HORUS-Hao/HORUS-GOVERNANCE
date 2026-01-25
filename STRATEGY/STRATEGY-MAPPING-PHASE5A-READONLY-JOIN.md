# Strategy Mapping - Phase 5-A Read-Only Join

> **TYPE**: GOVERNANCE / PHASE DECLARATION
> **STATUS**: ACTIVE
> **PHASE**: 5-A (Manual Strategy Registry)
> **MUTATION**: NONE
> **Date**: 2026-01-25
> **Architect**: Claude Code

---

## Phase 5-A Notice

```
Phase 5-A Notice:
Columns marked with [REF] are read-only projections from T005.
They are for human reference only and must not be used for logic,
inference, validation, or automated decisions.
```

---

## 1. Purpose

啟用 strategy_mapping 的 **Read-Only Join** 功能：
- 使用 T005 固定欄位作為參考呈現
- 僅做資料連動 / 顯示（join / lookup）
- 不做任何判斷、不做任何推論、不寫回 T005

---

## 2. Mode Declaration

| Item | Value |
|------|-------|
| Phase | 5-A |
| Mode | Manual Strategy Registry |
| Access | READ-ONLY JOIN |
| Write-back | FORBIDDEN |

---

## 3. Join Key

### 3.1 Primary Key

```
strategy_mapping.product_id → T005.UID
```

### 3.2 Fallback Display (No Key Match)

若無 UID 對應，僅允許輔助顯示：
- 品牌 (brand)
- 商品型號 (product_model)

**注意：Fallback 僅供顯示，不作判斷。**

---

## 4. REF Columns (Read-Only Projection)

在 strategy_mapping Sheet 右側新增顯示欄位：

| Column | Field | Source | Access |
|--------|-------|--------|--------|
| M | [REF] 商品名稱 | T005.商品名稱 | READ-ONLY |
| N | [REF] 商品大類 | T005.商品大類 | READ-ONLY |
| O | [REF] 商品中類 | T005.商品中類 | READ-ONLY |
| P | [REF] 商品小類 | T005.商品小類 | READ-ONLY |
| Q | [REF] 商品歸屬公司 | T005.商品歸屬公司 | READ-ONLY |
| R | [REF] 可銷售公司 | T005.可銷售公司 | READ-ONLY |

### 4.1 Implementation

**允許的技術方式：**
- VLOOKUP / XLOOKUP / QUERY（Sheet 公式）
- Apps Script read-only fetch（read-only accessor）

**禁止的技術方式：**
- ❌ 任何寫回 T005 的操作
- ❌ 依 REF 欄位做條件判斷

---

## 5. Forbidden Actions (Red Lines)

| Action | Status |
|--------|--------|
| `if (商品歸屬公司 ...)` | ❌ FORBIDDEN |
| `if (可銷售公司 ...)` | ❌ FORBIDDEN |
| `switch / map / derive` based on REF columns | ❌ FORBIDDEN |
| REF column affects `status` | ❌ FORBIDDEN |
| Mail or Report references strategy_mapping | ❌ FORBIDDEN |
| Write-back to T005 | ❌ FORBIDDEN |

---

## 6. Allowed Actions

| Action | Status |
|--------|--------|
| Read T005 via lookup | ✅ ALLOWED |
| Display REF columns for human reference | ✅ ALLOWED |
| Human fills strategy_mapping manually | ✅ ALLOWED |
| Human views REF columns for context | ✅ ALLOWED |

---

## 7. Sheet Information

| Item | Value |
|------|-------|
| Sheet Name | `strategy_mapping` |
| Sheet URL | https://docs.google.com/spreadsheets/d/1UrvQW7OK7n-1AiHi4zkDur3lLtwBowj8o7AJtHwHI1Y |
| T005 Source | T005-1.商品主表 |
| Current Status | **Phase 5-A ACTIVE** |

---

## 8. Column Schema (Full)

### 8.1 Original Columns (A~L)

| Column | Field | Description |
|--------|-------|-------------|
| A | product_id | 商品 ID (JOIN KEY) |
| B | brand | 品牌 |
| C | platform_code | 平台代碼 |
| D | strategy_scope | 策略範圍 (ALLOW/DENY/OPTIONAL) |
| E | effective_start_date | 生效開始日 |
| F | effective_end_date | 生效結束日 |
| G | input_by | 輸入者 |
| H | input_date | 輸入日期 |
| I | status | 狀態 |
| J | approved_by | 核准者 |
| K | approved_date | 核准日期 |
| L | note | 備註 |

### 8.2 REF Columns (M~R)

| Column | Field | Source |
|--------|-------|--------|
| M | [REF] 商品名稱 | T005.商品名稱 |
| N | [REF] 商品大類 | T005.商品大類 |
| O | [REF] 商品中類 | T005.商品中類 |
| P | [REF] 商品小類 | T005.商品小類 |
| Q | [REF] 商品歸屬公司 | T005.商品歸屬公司 |
| R | [REF] 可銷售公司 | T005.可銷售公司 |

---

## 9. Related Documents

| Document | Description |
|----------|-------------|
| `GOVERNANCE_CONTRACT.yml` | Machine-readable governance contract |
| `T005_SALES_COMPANY_PHASE6_USAGE.md` | T005 column usage declaration |
| `STRATEGY-MAPPING-PHASE5-RESERVED.md` | Original Phase 5 reservation (superseded) |

---

## 10. Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-25 | 1.0.0 | Initial - Phase 5-A Read-Only Join |

---

**END OF STRATEGY-MAPPING-PHASE5A-READONLY-JOIN.md**
