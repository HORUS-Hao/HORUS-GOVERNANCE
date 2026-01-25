# ADR-T005-LISTING-ELIGIBILITY-SOURCE

> **Status**: APPROVED
> **Date**: 2026-01-25
> **Architect**: Claude Code
> **Decision**: FINAL

---

## 1. Context (背景)

### 1.1 問題陳述

多個下游模組（C005, R020, T030）需要判斷「商品是否應該上架」，但目前存在：

1. **語義混淆**：T005 的「商品狀態」欄位被不同模組以不同方式解讀
2. **歷史殘留**：舊文件提及「O_上架狀態」欄位，但該欄位**從未進入 Canonical Schema**
3. **隱性邏輯**：C005 目前使用「平台有資料 = 上架」的隱性判斷，而非正式資格審核

### 1.2 盤點結果

| 項目 | 狀態 |
|------|------|
| T005 Canonical Schema 中的狀態欄位 | 僅 `商品狀態` (Col 16) |
| 歷史提及的「O_上架狀態」 | **NON-CANONICAL / 不存在** |
| `T005_LISTING_ELIGIBILITY` 映射表 | 已存在於 GOVERNANCE-GUARDS |
| 多模組共用該欄位 | 是（C005, R020, T030, T005 Sync） |

---

## 2. Decision (裁定)

### 2.1 Source of Truth (唯一來源)

```
Eligibility Source = T005-1.商品主表.商品狀態 (Col 16)
                   + T005_LISTING_ELIGIBILITY (Governance Mapping)
```

**此欄位語義定位為**：Product Lifecycle State（商品生命週期）

**下游「平台是否上架」判斷**：
- 不得自行推論
- 必須經過治理層映射（T005_LISTING_ELIGIBILITY）

### 2.2 Eligibility Mapping (治理層映射規則)

| 商品狀態 | isListingEligible | riskFlag | 說明 |
|----------|-------------------|----------|------|
| 正常銷售 | `true` | null | 允許上架 |
| 庫存不足 | `true` | LOW_INVENTORY | 缺貨 ≠ 不可上架 |
| 新品開發 | `false` | null | 尚未對外販售 |
| 停止銷售 | `false` | null | 策略停售 |
| 停產 | `false` | null | 生命週期結束 |

**語義說明**：
- 「是否上架」屬於**策略資格（Eligibility）**
- 而非平台事實或庫存即時狀態
- 「庫存不足」仍可上架，僅標註風險旗標

### 2.3 Phase 控制

| Phase | USE_ELIGIBILITY_FILTER | 行為 |
|-------|------------------------|------|
| Phase 1 (Observation) | `false` | 治理文件先行確立，Filter 不啟用 |
| Phase 2 (Eligibility Enable) | `true` | 正式啟用 Eligibility Filter |

---

## 3. Hard Constraints (明確禁止事項)

### 3.1 禁止新增欄位

❌ 禁止在 T005 新增任何形式的：
- 上架狀態
- 平台專屬開關
- MOMO / Shopee / PChome 欄位

### 3.2 禁止下游自行判斷

❌ 禁止 C005 / R020 / 任何下游模組：
- 硬編碼「有資料 = 上架」
- 自行判斷或複製 Eligibility 邏輯
- 繞過 T005_LISTING_ELIGIBILITY 映射

### 3.3 禁止復活歷史設計

❌ 禁止復活歷史文件中提及但已廢棄的：
- `O_上架狀態` — **DEPRECATED / NON-CANONICAL**
- 多狀態欄位設計

---

## 4. Implementation (實作指引)

### 4.1 正確使用方式

```javascript
// 引用治理層映射
var eligibility = T005_Status.getListingEligibility(product.status);

if (eligibility.eligible) {
  // 可上架
} else {
  // 不可上架
}

// 檢查風險旗標
if (eligibility.riskFlag === 'LOW_INVENTORY') {
  // 標註庫存不足警告
}
```

### 4.2 禁止使用方式

```javascript
// ❌ 錯誤：直接判斷
if (product.status === '正常銷售') { ... }

// ❌ 錯誤：隱性邏輯
if (platformData.length > 0) { /* 視為上架 */ }

// ❌ 錯誤：自行定義規則
var MY_LISTING_RULES = { ... };
```

---

## 5. Related Documents

| 文件 | 說明 |
|------|------|
| `T005_SHEET_SCHEMA_CANONICAL_v2026-01.md` | T005 Canonical Schema 定義 |
| `T005_Status_Enum.js` | T005_LISTING_ELIGIBILITY 實作 |
| `C005_SyncJob.js:124` | USE_ELIGIBILITY_FILTER 開關位置 |
| `ADR-C005-ELIGIBILITY-ENABLE.md` | C005 Phase 2 啟用條件 |

---

## 6. Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-25 | 1.0 | Initial ADR - 確立 Eligibility Source 為 T005 商品狀態 + Governance Mapping |

---

**END OF ADR-T005-LISTING-ELIGIBILITY-SOURCE.md**
