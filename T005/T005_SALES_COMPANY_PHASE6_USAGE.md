# T005_SALES_COMPANY Phase 6 Usage Declaration

> **TYPE**: GOVERNANCE / USAGE DECLARATION
> **STATUS**: ACTIVE
> **PHASE**: 6 (Read-Only Usage)
> **Date**: 2026-01-25
> **Architect**: Claude Code

---

## Phase 6 Declaration

**T005_SALES_COMPANY columns are used as READ-ONLY display references only.**
**They do not participate in any system judgment, inference, eligibility, or strategy.**
**All writable data resides in local append-only columns.**

---

## 1. Column Classification

### 1.1 READ-ONLY ZONE (A~L)

**[READ-ONLY | FROM T005_SALES_COMPANY | REFERENCE ONLY]**

| Column | Field | Source | Access |
|--------|-------|--------|--------|
| A | UID | T005-1.商品主表 | READ-ONLY |
| B | 供應商 | T005-1.商品主表 | READ-ONLY |
| C | 品牌 | T005-1.商品主表 | READ-ONLY |
| D | 商品型號 | T005-1.商品主表 | READ-ONLY |
| E | 商品名稱 | T005-1.商品主表 | READ-ONLY |
| F | 商品大類 | T005-1.商品主表 | READ-ONLY |
| G | 商品中類 | T005-1.商品主表 | READ-ONLY |
| H | 商品小類 | T005-1.商品主表 | READ-ONLY |
| I | 商品狀態 | T005-1.商品主表 | READ-ONLY |
| J | 國際條碼 | T005-1.商品主表 | READ-ONLY |
| K | 付款條件 | T005-1.商品主表 | READ-ONLY |
| L | 商品歸屬公司 | T005-1.商品主表 | READ-ONLY |
| M | 可銷售公司 | 人工維護 | READ-ONLY (display) |

**Constraints:**
- ❌ 不得 set / update
- ❌ 不得作為 if / rule / mapping 條件
- ❌ 不得回寫 T005
- ✅ 僅允許 UI 顯示 / 人工查看

### 1.2 LOCAL WRITE ZONE (M~N)

**[WRITE-ONLY | LOCAL | HUMAN INPUT]**

| Column | Field | Source | Access |
|--------|-------|--------|--------|
| M | 可銷售公司 | 人工維護 | LOCAL WRITE |
| N | 啟用狀態 | 人工維護 | LOCAL WRITE |

**Future Expansion (Phase 7+):**

| Column | Field | Purpose |
|--------|-------|---------|
| O | sales_company_manual_result | 人工審核結果 |
| P | sales_company_manual_note | 人工備註 |
| Q | filled_by | 填寫者 |
| R | filled_at | 填寫時間 |

**Constraints:**
- ✅ 僅人工填寫
- ❌ 不反向影響前段欄位
- ❌ 不參與 Canonical Status / Eligibility / Strategy

---

## 2. Forbidden Actions (Red Lines)

| Action | Status |
|--------|--------|
| `if (商品歸屬公司 ...)` | ❌ FORBIDDEN |
| `if (可銷售公司 ...)` | ❌ FORBIDDEN |
| `switch / map / derive` based on T005_SALES_COMPANY | ❌ FORBIDDEN |
| 任一自動寫入邏輯 | ❌ FORBIDDEN |

---

## 3. Verification

```bash
# 驗證指令（必須結果為空）
grep -R "if.*商品歸屬公司\|if.*可銷售公司" .
```

**Result:** No matches (verified)

---

## 4. Phase Lock

- ✅ Phase 6: Read-only Usage (CURRENT)
- ❌ Phase 7: NOT ACTIVE
- ❌ Phase 5: RESERVED (strategy_mapping)

---

## 5. Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-25 | 1.0.0 | Initial - Phase 6 Usage Declaration |

---

**END OF T005_SALES_COMPANY_PHASE6_USAGE.md**
