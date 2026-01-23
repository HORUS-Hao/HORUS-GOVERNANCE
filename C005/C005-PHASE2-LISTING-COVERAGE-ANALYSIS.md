# C005 Phase 2 - 上架率決策級指標補齊分析

> **Version**: v2026-01.1
> **Created**: 2026-01-22
> **Status**: READ-ONLY ANALYSIS (無程式碼修改)
> **Authority**: HORUS-GOVERNANCE

---

## 一、分析目的

本文件盤點 C005 現行上架率計算的指標缺口，提出 Phase 2 決策級指標補齊建議。

**分析範圍**：
- T005 應上架母集合 (Listing-Eligible Universe) 定義來源
- 管線中可取得但未寫入 FACT 的指標
- Phase 2 MVP 指標集建議

---

## 二、T005 應上架母集合定義來源分析

### 2.1 T005 Status 欄位現況

| 項目 | 值 |
|------|-----|
| 欄位位置 | Column 16 (Index 15) |
| 欄位名稱 | 商品狀態 (status) |
| 資料型別 | string |
| Enum 定義 | **未定義** |

**來源證據**：`T005_SHEET_SCHEMA_CANONICAL_v2026-01.md:40`

### 2.2 已知 Status 值（程式碼掃描）

| 狀態值 | 來源 | 是否用於排除 |
|--------|------|--------------|
| 正常銷售 | T030 | ❌ 否 |
| 停止銷售 | T030 | ❌ 否 |
| 庫存不足 | T030 | ❌ 否 |
| 新品開發 | T030 (預設值) | ❌ 否 |
| 停產 | T030_Proposal.js:330 | ⚠️ T030 有排除 |

### 2.3 C005 現行處理方式

| 檔案 | 行號 | 現況 |
|------|------|------|
| ComparisonEngine.js | 277-399 | `buildBaseProducts()` 使用 ERP + T005 聯集 |
| ComparisonEngine.js | 226 | `totalProducts = annotatedResults.length` |
| ComparisonEngine.js | 364, 397 | 有讀取 `status` 欄位但未用於過濾 |

**結論**：C005 目前**未依 status 過濾母數**，所有 T005 商品皆納入計算。

### 2.4 現行母數定義

```
上架率母數 = (ERP 選定倉庫商品) ∪ (T005 全商品)
           = 「最大母數版本」
           = 未依商品狀態排除
```

---

## 三、管線指標盤點 - 可取得但未寫入 FACT

### 3.1 ComparisonEngine 產出 vs FACT 寫入對照

| 指標 | ComparisonEngine 產出 | FACT 現有欄位 | 狀態 |
|------|----------------------|---------------|------|
| totalProducts | ✅ `summary.totalProducts` | ✅ D欄 (total_products) | 已寫入 |
| listedCount | ✅ `summary.listedCount` | ✅ E欄 (listed_count) | 已寫入 |
| unlistedCount | ✅ `summary.unlistedCount` | ✅ F欄 (unlisted_count) | 已寫入 |
| listingRate | ✅ 可計算 | ✅ G欄 (listing_rate) | 已寫入 |
| **t005_universe_count** | ✅ `t005Data.data.products.length` | ❌ 缺口 | **未寫入** |
| **erp_warehouse_count** | ✅ `erpData.data.byWarehouse` 可計算 | ❌ 缺口 | **未寫入** |
| **platform_records_count** | ✅ `platformData[x].data.byProduct` 長度 | ❌ 缺口 | **未寫入** |
| **matched_count** | ✅ `exactMatchCount` (compareWithPlatforms) | ❌ 缺口 | **未寫入** |
| **unmatched_count** | ✅ `noMatchCount` (compareWithPlatforms) | ❌ 缺口 | **未寫入** |

### 3.2 指標流失點分析

```
[ComparisonEngine.js]
  ↓
  compareWithPlatforms() 產出:
    - exactMatchCount ─────────> 🚫 未回傳
    - fuzzyMatchCount ─────────> 🚫 未回傳 (已停用)
    - noMatchCount ────────────> 🚫 未回傳
    - comparison.byPlatform ───> 只有 listedCount/unlistedCount
  ↓
  statistics 只包含:
    - total, listedCount, unlistedCount
    - byPlatform[platformId].listed/unlisted/draft
  ↓
[FactWriter.js]
  ↓
  只寫入:
    - total_products
    - listed_count
    - unlisted_count
    - listing_rate
```

### 3.3 流失指標價值評估

| 指標 | 商業價值 | 診斷價值 | 優先級 |
|------|----------|----------|--------|
| t005_universe_count | T005 母集合大小監控 | 可偵測 T005 異常縮減 | P1 |
| erp_warehouse_count | ERP 選定倉庫 SKU 數 | 可偵測 ERP 資料異常 | P2 |
| platform_records_count | 平台原始筆數 | 可偵測平台資料完整性 | P1 |
| matched_count | 成功對應筆數 | **核心診斷指標** | P0 |
| unmatched_count | 無法對應筆數 | **核心診斷指標** | P0 |
| coverage_rate | matched / platform_records | 對應率趨勢監控 | P1 |

---

## 四、Phase 2 MVP 指標集建議

### 4.1 MVP 指標定義（最小可行）

| 欄位名 | 說明 | 計算方式 | 前置條件 |
|--------|------|----------|----------|
| `base_universe_count` | 母集合大小 | `baseProducts.length` | 無 |
| `platform_records_count` | 平台原始筆數 | `Object.keys(platformData[x].data.byProduct).length` | 需改 compareWithPlatforms() 回傳 |
| `matched_count` | 成功對應筆數 | `exactMatchCount` | 需改 compareWithPlatforms() 回傳 |

### 4.2 建議 FACT Schema 擴充

```
現有欄位 (A-J):
  A: fact_date
  B: platform_code
  C: platform_name
  D: total_products      ← 現為 annotatedResults.length
  E: listed_count
  F: unlisted_count
  G: listing_rate
  H: source
  I: snapshot_id
  J: created_at

建議新增 (K-M):
  K: base_universe_count     ← 母集合原始大小（Phase 2）
  L: platform_records_count  ← 平台原始筆數（Phase 2）
  M: matched_count           ← 成功對應筆數（Phase 2）
```

### 4.3 計算邏輯變更摘要

| 階段 | 檔案 | 變更 |
|------|------|------|
| Step 1 | ComparisonEngine.js | `compareWithPlatforms()` 回傳 `exactMatchCount`, `noMatchCount` |
| Step 2 | ComparisonEngine.js | `executeComparison()` 將新指標納入 `summary` |
| Step 3 | C005_FactWriter.js | 擴充寫入邏輯，新增 K-M 欄 |
| Step 4 | C005_MailService.js | 顯示新指標（可選） |

---

## 五、eligibility 過濾（Phase 2 進階）

### 5.1 前置條件

在實作 eligibility 過濾前，需完成：

1. **T005 status enum 正式定義**（Schema ADR）
2. **狀態 → 上架資格對照表**（業務決策）
3. **C005 過濾邏輯實作**（程式碼變更）

### 5.2 建議 eligibility 對照表（草案）

| Status 值 | 建議上架資格 | 說明 |
|-----------|--------------|------|
| 正常銷售 | ✅ 應上架 | |
| 新品開發 | ⚠️ 待議 | 可能尚未準備好上架 |
| 庫存不足 | ✅ 應上架 | 庫存不影響上架資格 |
| 停止銷售 | ❌ 不應上架 | |
| 停產 | ❌ 不應上架 | T030 已有此排除 |

**注意**：此對照表為草案，需業務確認後經 ADR 核准。

### 5.3 eligibility 實作後的指標變化

```
Phase 1 (現行):
  上架率 = listed_count / total_products
         = listed_count / (全部商品)

Phase 2 (eligibility 實作後):
  eligibility_adjusted_rate = listed_count / eligible_universe_count
                            = listed_count / (排除停產/停售後的商品)
```

---

## 六、資料層架構圖

```
┌─────────────────────────────────────────────────────────────────┐
│                        FACTS 層（唯讀）                          │
├─────────────────────────────────────────────────────────────────┤
│  T005 商品主檔                                                   │
│    └─ status (Col 16) ─────> 母集合過濾依據（Phase 2）           │
│                                                                 │
│  ERP 庫存                                                       │
│    └─ byWarehouse ─────────> 選定倉庫 SKU 聯集                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DERIVED 層（C005 計算）                      │
├─────────────────────────────────────────────────────────────────┤
│  ComparisonEngine.js                                            │
│    ├─ buildBaseProducts() ─────> baseProducts (母集合)          │
│    ├─ compareWithPlatforms() ──> exactMatchCount (⚠️未回傳)     │
│    └─ executeComparison() ─────> statistics (部分指標)          │
│                                                                 │
│  【缺口】以下指標在計算後被丟棄：                                 │
│    - t005_universe_count                                        │
│    - erp_warehouse_count                                        │
│    - platform_records_count                                     │
│    - exactMatchCount → matched_count                            │
│    - noMatchCount → unmatched_count                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FACT 層（Listing_History）                   │
├─────────────────────────────────────────────────────────────────┤
│  現有欄位：                                                      │
│    A-J: fact_date ~ created_at                                  │
│                                                                 │
│  【Phase 2 建議新增】：                                          │
│    K: base_universe_count                                       │
│    L: platform_records_count                                    │
│    M: matched_count                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 七、風險與注意事項

### 7.1 歷史資料相容性

| 風險 | 說明 | 建議處置 |
|------|------|----------|
| 新舊欄位混用 | 歷史 FACT 無新欄位 | 新欄位預設為空或 -1 |
| 上架率定義變更 | Phase 2 母數可能變小 | 版本標註（如 `schema_version` 欄位）|

### 7.2 效能影響

| 項目 | 影響評估 |
|------|----------|
| compareWithPlatforms() 修改 | 低（僅多回傳計數器）|
| FactWriter 新增欄位 | 低（3 個新欄位）|
| 歷史資料回填 | 高（若選擇回填）→ 建議不回填 |

---

## 八、建議行動項目

### 8.1 Phase 2 MVP 實作步驟（需 ADR）

| 順序 | 項目 | 前置條件 | 輸出 |
|------|------|----------|------|
| 1 | ADR: 核准 MVP 指標定義 | 本分析文件 | ADR 文件 |
| 2 | 修改 ComparisonEngine.js | ADR 核准 | 回傳 matched_count |
| 3 | 修改 C005_FactWriter.js | Step 2 完成 | 寫入新欄位 |
| 4 | 更新 C005_MailService.js | Step 3 完成 | 顯示新指標 |
| 5 | 驗收測試 | Step 4 完成 | 測試報告 |

### 8.2 Phase 2 進階（eligibility）步驟

| 順序 | 項目 | 前置條件 |
|------|------|----------|
| 1 | ADR: T005 status enum 定義 | 業務確認 |
| 2 | ADR: 狀態 → 上架資格對照表 | enum 定義 |
| 3 | 修改 buildBaseProducts() 加入過濾 | 對照表核准 |
| 4 | 新增 FACT 欄位 eligible_universe_count | Step 3 完成 |

---

## 九、相關文件

| 文件 | 說明 |
|------|------|
| T005-LISTING-ELIGIBILITY-RULES.md | 上架資格規則定義（Phase 1）|
| C005-MAIL-AND-PLATFORM-COMPLETION-ROADMAP.md | C005 完成度路線圖 |
| T005_SHEET_SCHEMA_CANONICAL_v2026-01.md | T005 Schema 定義 |
| ComparisonEngine.js | C005 比對引擎 |
| C005_FactWriter.js | FACT 寫入邏輯 |

---

## 十、變更歷程

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-01-22 | v2026-01.1 | 初版：Phase 2 Read-only Analysis | Claude Code |

---

**END OF C005-PHASE2-LISTING-COVERAGE-ANALYSIS.md**
