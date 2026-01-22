# ADR-002: C005 Phase 3 Strategy Universe & Strategy Listing Rate

> **Status**: APPROVED
> **Date**: 2026-01-22
> **Deciders**: Architect (豪哥)
> **Technical Context**: C005 Listing Checker
> **Mode**: GOVERNANCE-ONLY / READ-ONLY

---

## Preamble

### Sealed Context (Phase 2)

Phase 2 已完成並封存：
- **Commit**: `bb7d304`
- **ADR-001**: APPROVED
- **已提供指標**：
  - `platform_internal_listing_rate` — 平台內完成率
  - `decision_listing_rate` — 決策級上架率（以全 T005 + ERP 為母集合）

### Phase 3 Goals

在**不影響 Phase 2 語義**的前提下，引入「策略母集合 (Strategy Universe)」與「策略執行率 (Strategy Listing Rate)」能力。

### Governance Boundary

```
❌ 不修改任何程式碼
❌ 不寫入任何 Sheet
❌ 不回填任何歷史 FACT
❌ 不影響 Phase 2 指標與語義
```

---

## Decision

### 1. Strategy Universe 正式定義

#### 1.1 裁定

**同意**引入 Strategy Universe 概念：

| 概念 | 定義 | 說明 |
|------|------|------|
| `strategy_universe_count(platform)` | 在 T005 中，理論上允許 / 計畫上該上此平台的商品數 | 平台專屬策略母集合 |

#### 1.2 與 Phase 2 指標的關係

```
Phase 2: base_universe_count
  └─ 定義：全 T005 + ERP 聯集（資產覆蓋基線）
  └─ 用途：決策級上架率分母
  └─ 語義：「公司全部商品中，此平台覆蓋多少」

Phase 3: strategy_universe_count(platform)
  └─ 定義：T005 中策略上允許上此平台的商品子集
  └─ 用途：策略執行率分母
  └─ 語義：「在策略上應上此平台的商品中，實際上架多少」
```

#### 1.3 邊界聲明

| 聲明 | 說明 |
|------|------|
| `strategy_universe_count(platform)` ≠ `base_universe_count` | 策略母集合為資產母集合的子集 |
| Strategy Universe 僅用於策略層 | 不參與平台間比較基準 |
| 不影響 Phase 2 指標 | `decision_listing_rate` 定義不變 |

#### 1.4 數學關係

```
strategy_universe_count(platform) ≤ base_universe_count

其中：
- strategy_universe_count(MOMO) 可能 ≠ strategy_universe_count(PCHOME)
- 各平台策略母集合獨立，由策略標記決定
```

---

### 2. Strategy Universe 資料來源裁定

#### 2.1 現況盤點

根據 T005 Schema (`T005_SHEET_SCHEMA_CANONICAL_v2026-01.md`)：

| 欄位 | 是否存在 | 說明 |
|------|----------|------|
| `brand_platform_allow` | ❌ 不存在 | T005 目前無此欄位 |
| `sku_platform_scope` | ❌ 不存在 | T005 目前無此欄位 |
| `status` | ✅ 存在 (Col 16) | 但 enum 未定義，且用途為商品狀態，非策略標記 |
| `owner_company` | ✅ 存在 (Col 22) | 商品歸屬公司，非平台策略 |

#### 2.2 候選來源分析

| 候選來源 | 優點 | 缺點 | 適用性 |
|----------|------|------|--------|
| **Option A: T005 新增欄位** | SSOT 集中、Schema 一致 | 需 Schema 變更 ADR、欄位定義複雜 | 中期適用 |
| **Option B: 獨立 Strategy Mapping Sheet** | 彈性高、不影響 T005 | 多來源管理、同步風險 | 短期適用 |
| **Option C: Brand-level 策略表** | 簡化管理（品牌粒度） | 無法處理 SKU 粒度例外 | 視業務需求 |

#### 2.3 裁定：SSOT 定義

**裁定**：Phase 3 的 Strategy Universe SSOT **待定 (DEFERRED)**

| 項目 | 裁定 |
|------|------|
| 權威來源 | **待 ADR 決定**（需業務輸入）|
| 暫定優先選項 | Option B: 獨立 Strategy Mapping Sheet |
| 前置條件 | 業務定義「哪些品牌/SKU 限定哪些平台」規則 |

#### 2.4 SSOT 決定前置條件

```
Strategy Universe SSOT 決定前，需完成：
1. 業務輸入：品牌 × 平台限制規則
2. 業務輸入：SKU 粒度例外規則（若有）
3. ADR: Strategy Mapping 權威來源定義
4. 若選 Option A，需額外 ADR: T005 Schema 擴充
```

#### 2.5 多來源規則（若採用）

若 Phase 3 實作時採用多來源，優先序為：

```
優先序（高 → 低）：
1. SKU-level override（若存在）
2. Brand-level mapping
3. Default: 全平台可上（fallback to base_universe）
```

---

### 3. Strategy Listing Rate 定義

#### 3.1 裁定

**同意**引入第三層指標：

| 指標名稱 | 定義 | 公式 | 用途 |
|----------|------|------|------|
| `strategy_listing_rate` | 策略執行率 | `matched_count / strategy_universe_count(platform)` | Phase 3 新增 |

#### 3.2 公式說明

```
strategy_listing_rate(platform) = matched_count / strategy_universe_count(platform)

其中：
- matched_count: 沿用 Phase 2 定義（平台檔案中成功對應到母集合的 SKU 數）
- strategy_universe_count(platform): 策略上應上此平台的商品數
```

#### 3.3 三層指標關係

```
┌─────────────────────────────────────────────────────────────────────┐
│ Layer 1: platform_internal_listing_rate (Phase 1)                   │
│   = listed_count / total_products                                   │
│   → 「在平台可觀測範圍內，上架完成度如何」                             │
├─────────────────────────────────────────────────────────────────────┤
│ Layer 2: decision_listing_rate (Phase 2)                            │
│   = matched_count / base_universe_count                             │
│   → 「在全部商品中，此平台覆蓋率如何」                                │
├─────────────────────────────────────────────────────────────────────┤
│ Layer 3: strategy_listing_rate (Phase 3)                            │
│   = matched_count / strategy_universe_count(platform)               │
│   → 「在策略上應上此平台的商品中，執行率如何」                        │
└─────────────────────────────────────────────────────────────────────┘
```

#### 3.4 語義邊界聲明

| 聲明 | 說明 |
|------|------|
| 不回溯 Phase 2 | 歷史 FACT 不回填 `strategy_listing_rate` |
| 不覆蓋 `decision_listing_rate` | Phase 2 指標定義與計算不變 |
| 僅作為「策略執行率」| 衡量策略落地程度，非平台比較基準 |

---

### 4. Phase 3 FACT Schema 邊界

#### 4.1 裁定：建議新增欄位

| 欄位 | Column | 說明 | 資料型別 |
|------|--------|------|----------|
| `strategy_universe_count` | N | 策略母集合商品數 | integer |

#### 4.2 欄位設計說明

| 項目 | 裁定 |
|------|------|
| `strategy_matched_count` | **不另設**，沿用 Phase 2 `matched_count` (M 欄) |
| `strategy_listing_rate` | **不寫入 FACT**，由顯示層計算 (N/M) |

#### 4.3 完整 Schema（Phase 3 後）

```
Listing_History Schema (A-N):

A: fact_date              (Phase 1)
B: platform_code          (Phase 1)
C: platform_name          (Phase 1)
D: total_products         (Phase 1)
E: listed_count           (Phase 1)
F: unlisted_count         (Phase 1)
G: listing_rate           (Phase 1) ← platform_internal_listing_rate
H: source                 (Phase 1)
I: snapshot_id            (Phase 1)
J: created_at             (Phase 1)
K: base_universe_count    (Phase 2)
L: platform_records_count (Phase 2)
M: matched_count          (Phase 2)
N: strategy_universe_count (Phase 3 新增)
```

#### 4.4 寫入規則

| 項目 | 裁定 |
|------|------|
| 寫入位置 | 維持 `Listing_History` Sheet |
| 獨立 Strategy FACT | **不建議**（維持單一 FACT Sheet）|
| 歷史相容 | 歷史 FACT 的 N 欄為空（不回填）|

#### 4.5 替代方案考量

| 方案 | 優點 | 缺點 | 裁定 |
|------|------|------|------|
| 獨立 Strategy_Listing_History Sheet | 分離關注點 | 查詢需 JOIN、維護成本高 | ❌ 不採用 |
| 在現有 Sheet 新增欄位 | 單一 FACT、查詢簡單 | 欄位持續增加 | ✅ 採用 |

---

### 5. 工程與治理邊界

#### 5.1 Phase 3 允許修改範圍（白名單）

| 檔案 | 允許修改 | 修改內容 |
|------|----------|----------|
| `ComparisonEngine.js` | ✅ | 新增 `strategy_universe_count` 計算 |
| `C005_FactWriter.js` | ✅ | 寫入 N 欄 |
| `C005_MailService.js` | ✅ | 顯示 `strategy_listing_rate` |
| Strategy Mapping Sheet | ✅ | 新增（若採 Option B）|

#### 5.2 明確禁止（黑名單）

| 禁止事項 | 原因 |
|----------|------|
| ❌ 影響 Phase 2 指標 | `decision_listing_rate` 定義不得變更 |
| ❌ 改寫 `base_universe_count` | Phase 2 母集合定義不變 |
| ❌ 將策略母集合誤用為平台比較基準 | 策略母集合為平台專屬 |
| ❌ 回填歷史 FACT | 高成本、低價值 |
| ❌ 修改 Phase 2 欄位語義 | K-M 欄定義不變 |
| ❌ 將 `strategy_listing_rate` 寫入 FACT | 由顯示層計算即可 |

#### 5.3 邊界聲明

```
Phase 3 工程邊界鎖定：
- 僅新增「策略層指標」
- 不變更「Phase 2 指標定義與語義」
- 不變更「base_universe_count 計算邏輯」
- 不變更「matched_count 計算邏輯」
- Strategy Universe 來源需經 ADR 裁定後方可實作
```

---

### 6. Phase 3 完成定義（Done Criteria）

#### 6.1 前置條件（Gate）

| # | 條件 | 狀態 |
|---|------|------|
| G1 | ADR: Strategy Mapping SSOT 定義 | PENDING |
| G2 | 業務輸入：品牌 × 平台策略規則 | PENDING |
| G3 | Strategy Mapping 資料建立 | PENDING |

#### 6.2 必要條件

| # | 條件 | 驗收方式 |
|---|------|----------|
| 1 | Strategy Mapping SSOT 建立 | 有權威策略標記來源 |
| 2 | FACT Schema 擴充完成 | Listing_History 有 N 欄 |
| 3 | 新指標寫入正常 | 新 FACT 筆數 N 欄有值 |
| 4 | MAIL 顯示三層上架率 | 同時顯示 Layer 1/2/3 指標 |
| 5 | 核心問題可回答 | 見 6.3 |

#### 6.3 核心問題驗收

Phase 3 完成後，MAIL 需能回答：

```
Q: 在理論上該上 MOMO 的商品中，有多少已成功上架？

A:
  - 策略母集合商品數: {strategy_universe_count}
  - 成功上架筆數: {matched_count}
  - 策略執行率: {strategy_listing_rate}%
```

#### 6.4 MAIL 顯示規格

```
【平台: MOMO】
  平台內完成率: 85.3% (1559 / 1827)  ← Phase 1
  決策級上架率: 55.9% (1559 / 2790)  ← Phase 2
  策略執行率:   78.0% (1559 / 2000)  ← Phase 3

  母集合商品數:     2790
  策略母集合商品數: 2000
  平台原始筆數:     1850
  成功對應筆數:     1559
```

#### 6.5 三層指標並列顯示原則

| 原則 | 說明 |
|------|------|
| 不混用 | 三層指標各自獨立顯示 |
| 明確標註 | 標註「平台內」/「決策級」/「策略」前綴 |
| 可追蹤 | 各層分母皆顯示 |

#### 6.6 不屬於 Phase 3 完成條件

| 項目 | 歸屬 |
|------|------|
| T005 status enum 定義 | 獨立 ADR |
| eligibility filter | 獨立 ADR（基於 status）|
| 歷史資料回填 | Phase 4 或不做 |

---

## Consequences

### Positive

1. 建立「策略執行率」指標，可回答「策略落地程度」
2. 三層指標完整覆蓋：平台觀測 / 資產覆蓋 / 策略執行
3. 維持向後相容（Phase 2 指標不變）
4. 單一 FACT Sheet，查詢簡單

### Negative

1. MAIL 資訊量再增加，需注意可讀性
2. 歷史 FACT 無 N 欄位，無法回溯計算
3. Strategy Mapping 維護成本（若採 Option B）

### Risks

| 風險 | 影響 | 緩解措施 |
|------|------|----------|
| 策略標記來源未定 | 高 | 設定 Gate G1-G3，未完成不實作 |
| 三層指標混淆 | 中 | MAIL 明確標註、加入說明區塊 |
| Strategy Mapping 資料品質 | 中 | 建立維護流程、定期審計 |

---

## Alternatives Considered

### Alternative 1: 不引入 Strategy Universe

**拒絕原因**：
- 無法回答「策略執行率」核心問題
- 管理層需要知道策略落地程度

### Alternative 2: 將 Strategy Universe 合併到 base_universe

**拒絕原因**：
- 破壞 Phase 2 語義
- 兩者回答不同問題

### Alternative 3: 獨立 Strategy FACT Sheet

**拒絕原因**：
- 查詢複雜、需 JOIN
- 維護成本高
- 單一 FACT Sheet 足以承載

---

## Related Documents

| 文件 | 說明 |
|------|------|
| `ADR-001-C005-PHASE2-LISTING-COVERAGE.md` | Phase 2 裁定（APPROVED）|
| `C005-PHASE2-LISTING-COVERAGE-ANALYSIS.md` | Phase 2 分析文件 |
| `T005-LISTING-ELIGIBILITY-RULES.md` | 上架資格規則（Phase 1）|
| `T005_SHEET_SCHEMA_CANONICAL_v2026-01.md` | T005 Schema 定義 |

---

## Approval

| 角色 | 狀態 | 日期 | 簽名 |
|------|------|------|------|
| Architect | APPROVED | 2026-01-22 | 豪哥 |
| 業務確認 | PENDING | - | (Phase 3 涉及業務策略定義，需業務輸入) |

---

## Changelog

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-01-22 | v1.0 | 初版草稿 | Claude Code |
| 2026-01-22 | v1.1 | 狀態改為 APPROVED | Claude Code |

---

**END OF ADR-002-C005-PHASE3-STRATEGY-UNIVERSE.md**
