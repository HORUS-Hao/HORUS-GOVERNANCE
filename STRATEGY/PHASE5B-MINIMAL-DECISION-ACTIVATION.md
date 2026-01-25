# Phase 5-B Minimal Decision Activation

> **TYPE**: GOVERNANCE / PHASE DECLARATION
> **STATUS**: ACTIVE
> **PHASE**: 5-B (Minimal Decision Activation)
> **DATE**: 2026-01-25
> **AUTHOR**: Claude Code (Architect)

---

## Phase 5-B Declaration

```
Phase 5-B: Minimal Decision Activation

1. 僅影響 Presentation Layer（Mail / UI / Log 說明文字）
2. 不構成策略判斷（Strategy Decision）
3. 不構成責任裁定（Accountability Assignment）
4. 不影響任何計算結果（Listing Rate, Eligibility, FACT）
```

---

## 1. T005 欄位使用規範

### 1.1 允許使用的欄位

| Column | Field | 用途限制 |
|--------|-------|----------|
| A | UID | ✅ 可用於說明文字 |
| B | 供應商 | ✅ 可用於說明文字 |
| C | 品牌 | ✅ 可用於說明文字 |
| D | 商品型號 | ✅ 可用於說明文字 |
| E | 商品名稱 | ✅ 可用於說明文字 |
| F | 商品大類 | ✅ 可用於說明文字 |
| G | 商品中類 | ✅ 可用於說明文字 |
| H | 商品小類 | ✅ 可用於說明文字 |
| J | 國際條碼 | ✅ 可用於說明文字 |

### 1.2 僅可顯示的欄位

| Column | Field | 用途限制 |
|--------|-------|----------|
| I | 商品狀態 | ⚠️ 僅可顯示，不可解釋 |
| K | 付款條件 | ⚠️ 僅可顯示，不可解釋 |

### 1.3 禁止使用的欄位

| Column | Field | 理由 |
|--------|-------|------|
| L | 商品歸屬公司 | ❌ 高風險：易被解讀為責任歸屬 |
| M | 可銷售公司 | ❌ 高風險：易被解讀為上架義務 |

---

## 2. 允許影響的輸出

| 輸出類型 | 允許動作 | 範例 |
|----------|----------|------|
| Mail 補充說明段落 | ✅ 顯示商品基本資訊 | 「商品：[品牌] [商品名稱]」 |
| Mail 表格欄位 | ✅ 顯示 UID / 品牌 / 型號 | 表格內加入品牌欄 |
| UI Tooltip | ✅ 顯示商品分類 | 「大類：[商品大類]」 |
| Log 輸出 | ✅ 記錄商品識別資訊 | Logger.log 中含 UID |

---

## 3. 禁止影響的輸出

| 輸出類型 | 禁止動作 | 理由 |
|----------|----------|------|
| 上架率計算 | ❌ 不得依 T005 欄位調整分子/分母 | 影響 FACT 語意 |
| 是否上架判斷 | ❌ 不得依 T005 欄位判斷 listed/unlisted | 構成決策 |
| Eligibility 結果 | ❌ 不得依 T005 欄位調整 eligible/ineligible | 構成責任歸屬 |
| Listing_History 寫入 | ❌ 不得新增欄位或調整值 | 影響 FACT schema |
| strategy_mapping 決策 | ❌ 不得讀取 strategy_mapping 做決策 | Phase 5-A 為 Registry only |

---

## 4. Forbidden Actions (Red Lines)

| Action | Status |
|--------|--------|
| `if (商品歸屬公司 ...)` | ❌ FORBIDDEN |
| `if (可銷售公司 ...)` | ❌ FORBIDDEN |
| `if (商品狀態 === ...) { markAsEligible() }` | ❌ FORBIDDEN |
| 任何依據 T005 欄位的計算或寫回 | ❌ FORBIDDEN |
| 使用「應上架」「該負責」等責任歸屬用語 | ❌ FORBIDDEN |

---

## 5. Mail Disclaimer

若 Mail 顯示 T005 欄位，必須加入以下聲明：

```
※ 本郵件所列商品資訊僅供參考，不構成上架義務或責任歸屬判定。
```

---

## 6. Architect Guard

### Q1: 為什麼 Phase 5-B 不等於 Strategy 啟用？

Phase 5-B 僅影響 Presentation Layer。Strategy 啟用需要：
- 讀取 strategy_mapping 的 scope/status
- 依據 strategy 判斷「應上架 / 不應上架」
- 將判斷結果影響 Eligibility 或 Listing Rate

Phase 5-B 不做上述任何一項。

### Q2: 為什麼使用 T005 欄位「顯示」不構成決策？

```
決策 = 依據資料 → 產出判斷 → 影響後續行為
顯示 = 依據資料 → 產出文字 → 不影響任何計算或狀態
```

### Q3: 系統如何自我防呆？

| 層級 | 防呆措施 |
|------|----------|
| 程式碼 | GOVERNANCE NOTE 註解於相關模組 |
| 治理文件 | GOVERNANCE_CONTRACT.yml 明列 FORBIDDEN |
| 欄位鎖定 | 商品歸屬公司 / 可銷售公司 標記為 FORBIDDEN |
| AI Guard | 遇到決策類請求必須 STOP |

---

## 7. Related Documents

| Document | Description |
|----------|-------------|
| `GOVERNANCE_CONTRACT.yml` | Machine-readable governance contract |
| `PHASE5B-PRESENTATION-READER.md` | Presentation Reader 規格（若實作） |
| `T005_SALES_COMPANY_PHASE6_USAGE.md` | T005 欄位使用聲明 |

---

## 8. Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-25 | 1.0.0 | Initial - Phase 5-B Minimal Decision Activation |

---

**END OF PHASE5B-MINIMAL-DECISION-ACTIVATION.md**
