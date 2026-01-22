# ADR-003: C005 Phase 3 Strategy Mapping SSOT Definition

> **Status**: APPROVED
> **Date**: 2026-01-22
> **Deciders**: Architect (豪哥)
> **Technical Context**: C005 Listing Checker / Strategy Universe
> **Mode**: GOVERNANCE-ONLY / READ-ONLY

---

## Preamble

### Sealed Context

| ADR | 狀態 | Commit | 說明 |
|-----|------|--------|------|
| ADR-001 (Phase 2) | SEALED | `bb7d304` | 決策級上架率已實作 |
| ADR-002 (Phase 3) | SEALED | `67b9406` | Strategy Universe 定義完成，SSOT 待定 |

### Phase 3 工程凍結狀態

Phase 3 工程已凍結，等待 Strategy SSOT 決策完成後方可解凍。

### Governance Boundary

```
❌ 不修改任何程式碼
❌ 不寫入任何 Sheet
❌ 不回填任何歷史 FACT
❌ 不影響 Phase 2 / Phase 3 已封存語義
```

---

## Context

### 問題陳述

ADR-002 已定義 `strategy_universe_count(platform)` 概念，但資料來源（SSOT）尚未裁定。

本 ADR 旨在裁定：
1. Strategy Mapping Sheet 作為 SSOT 的地位
2. 標準欄位結構
3. 輸入與治理流程
4. 與 Phase 3 指標的關係

### 設計原則

1. **分離關注點**：策略資料與商品主檔（T005）分離
2. **單一真相來源**：Strategy Mapping Sheet 為策略的唯一權威
3. **向前相容**：不影響 Phase 2 已封存指標
4. **業務可操作**：結構簡單，業務可直接填寫

---

## Decision

### 1. Strategy Mapping Sheet 的 SSOT 地位

#### 1.1 裁定

**同意** Strategy Mapping Sheet 為 Phase 3 Strategy Universe 的**唯一 SSOT**。

| 項目 | 裁定 |
|------|------|
| SSOT 地位 | Strategy Mapping Sheet 為**唯一權威來源** |
| T005 角色 | 商品主檔，**不承擔平台策略判斷** |
| 策略判斷依據 | 僅依 Strategy Mapping Sheet |

#### 1.2 權威關係

```
Strategy Mapping Sheet (SSOT)
  └─ 定義：哪些商品可/不可上哪些平台
  └─ 用途：計算 strategy_universe_count(platform)

T005 (商品主檔)
  └─ 定義：商品基本資料（UID, 品牌, 型號, 狀態...）
  └─ 用途：商品識別、Phase 2 母集合
  └─ 不承擔：平台策略判斷
```

#### 1.3 明確禁止

| 禁止事項 | 原因 |
|----------|------|
| ❌ 在程式碼 hardcode 策略 | 策略應可由業務調整 |
| ❌ 將策略欄位混入 Phase 2 指標 | Phase 2 語義已封存 |
| ❌ 在 T005 新增策略欄位 | 分離關注點，T005 專注商品主檔 |
| ❌ 多來源混用策略資料 | 單一 SSOT 原則 |

---

### 2. Strategy Mapping Sheet 標準欄位定義

#### 2.1 裁定：MVP 最小必需欄位集

| 欄位名稱 | Column | 資料型別 | 必填 | 說明 |
|----------|--------|----------|------|------|
| `product_id` | A | string | ✅ 是 | 對應 T005.UID 或 T005.商品型號 |
| `brand` | B | string | ✅ 是 | 品牌名稱（冗餘欄位，便於檢視）|
| `platform_code` | C | enum | ✅ 是 | 平台代碼 |
| `strategy_scope` | D | enum | ✅ 是 | 策略範圍（ALLOW/DENY/OPTIONAL）|
| `effective_start_date` | E | date | ❌ 否 | 生效起始日（空值 = 立即生效）|
| `effective_end_date` | F | date | ❌ 否 | 生效結束日（空值 = 無限期）|
| `input_by` | G | string | ✅ 是 | 填寫人 |
| `input_date` | H | date | ✅ 是 | 填寫日期 |
| `status` | I | enum | ✅ 是 | 審核狀態 |
| `approved_by` | J | string | ❌ 否 | 審核人（status=APPROVED 時必填）|
| `approved_date` | K | date | ❌ 否 | 審核日期 |
| `note` | L | string | ❌ 否 | 備註 |

#### 2.2 ENUM 定義

##### 2.2.1 `platform_code` 合法值

| 值 | 說明 |
|----|------|
| `MOMO` | MOMO 購物 |
| `PCHOME` | PChome 24h |
| `YAHOO` | Yahoo 購物中心 |
| `SHOPEE` | 蝦皮購物 |

> **Note**: 與 R020_DATA_CONTRACT 一致，全大寫。

##### 2.2.2 `strategy_scope` 合法值

| 值 | 說明 | strategy_universe 計算 |
|----|------|------------------------|
| `ALLOW` | 允許上架此平台 | ✅ 納入 |
| `DENY` | 禁止上架此平台 | ❌ 排除 |
| `OPTIONAL` | 可選（由營運判斷）| ✅ 納入（預設納入）|

##### 2.2.3 `status` 合法值

| 值 | 說明 | 是否生效 |
|----|------|----------|
| `DRAFT` | 草稿 | ❌ 不生效 |
| `PENDING_APPROVAL` | 待審核 | ❌ 不生效 |
| `APPROVED` | 已核准 | ✅ 生效 |
| `REJECTED` | 已駁回 | ❌ 不生效 |
| `DEPRECATED` | 已廢棄 | ❌ 不生效 |

#### 2.3 欄位規則

| 規則 | 說明 |
|------|------|
| 複合主鍵 | `product_id` + `platform_code` 組合唯一 |
| 預設行為 | 若商品無對應記錄，預設為 `ALLOW`（全平台可上）|
| 生效條件 | `status = APPROVED` 且在 `effective_start_date` ~ `effective_end_date` 區間內 |

#### 2.4 Sheet 命名建議

```
Sheet 名稱: Strategy_Mapping
位置: 與 Listing_History 同一 Spreadsheet（C005 FACT Sheet）
或: 獨立 Spreadsheet（業務維護優先）
```

---

### 3. 輸入責任與治理流程

#### 3.1 責任矩陣（RACI）

| 活動 | 業務/PM | 營運 | Architect | 說明 |
|------|---------|------|-----------|------|
| 新增/修改策略記錄 | R | C | I | 業務主責，營運諮詢 |
| 審核策略記錄 | - | A | I | 營運核准 |
| 定義 ENUM 值 | C | I | R | Architect 主責定義 |
| Schema 變更 | I | I | R/A | 需 ADR |

> R=Responsible, A=Accountable, C=Consulted, I=Informed

#### 3.2 輸入責任人

| 角色 | 責任 |
|------|------|
| **業務 / PM** | 填寫策略記錄（DRAFT → PENDING_APPROVAL）|
| **營運** | 審核策略記錄（PENDING_APPROVAL → APPROVED / REJECTED）|

#### 3.3 審核流程

```
┌─────────────┐     ┌──────────────────┐     ┌───────────┐
│   DRAFT     │ ──> │ PENDING_APPROVAL │ ──> │  APPROVED │
│ (業務填寫)   │     │   (等待審核)      │     │  (生效)    │
└─────────────┘     └──────────────────┘     └───────────┘
                            │
                            v
                    ┌───────────┐
                    │  REJECTED │
                    │  (駁回)    │
                    └───────────┘
```

#### 3.4 變更影響範圍

| 項目 | 裁定 |
|------|------|
| 變更影響範圍 | **只影響未來 FACT** |
| 歷史 FACT | **不回溯**、不重算 |
| 生效時點 | 下一次 C005 執行時讀取最新 APPROVED 記錄 |

#### 3.5 審計要求

| 要求 | 說明 |
|------|------|
| 保留歷史版本 | 不刪除舊記錄，使用 `DEPRECATED` 標記 |
| 可追溯 | `input_by`, `input_date`, `approved_by`, `approved_date` 必須留存 |

---

### 4. 與 Phase 3 指標的關係

#### 4.1 strategy_universe_count 推導邏輯

```
strategy_universe_count(platform) = COUNT(
  SELECT product_id FROM Strategy_Mapping
  WHERE platform_code = {platform}
    AND strategy_scope IN ('ALLOW', 'OPTIONAL')
    AND status = 'APPROVED'
    AND (effective_start_date IS NULL OR effective_start_date <= TODAY)
    AND (effective_end_date IS NULL OR effective_end_date >= TODAY)
)
```

#### 4.2 預設行為（無記錄時）

| 情境 | 行為 |
|------|------|
| 商品在 Strategy_Mapping 無任何記錄 | 預設所有平台皆可上（ALLOW）|
| 商品在特定平台無記錄，但其他平台有記錄 | 該平台預設 ALLOW |

**實作建議**：
```
strategy_universe_count(platform) =
  base_universe_count - COUNT(DENY records for platform)
```

#### 4.3 明確不得覆蓋的指標

| 指標 | 保護狀態 |
|------|----------|
| `base_universe_count` | ❌ 不得覆蓋（Phase 2 封存）|
| `decision_listing_rate` | ❌ 不得覆蓋（Phase 2 封存）|
| `matched_count` | ❌ 不得覆蓋（Phase 2 封存）|

#### 4.4 Strategy Mapping 僅用於

| 用途 | 說明 |
|------|------|
| `strategy_universe_count(platform)` | ✅ 計算策略母集合 |
| `strategy_listing_rate` | ✅ 計算策略執行率（顯示層）|

---

### 5. 工程與治理邊界

#### 5.1 Phase 3 工程凍結聲明

```
Phase 3 工程在以下條件滿足前，禁止解凍：
1. ADR-003 核准（本 ADR）
2. Strategy_Mapping Sheet 建立並有初始資料
3. 業務/營運確認輸入流程
```

#### 5.2 明確禁止（黑名單）

| 禁止事項 | 原因 |
|----------|------|
| ❌ 在 Phase 3 工程解凍前動任何程式碼 | 策略資料層尚未就緒 |
| ❌ 將 Strategy Sheet 作為 Phase 2 的母集合 | Phase 2 母集合為 `base_universe_count`，不變 |
| ❌ 回填、重算任何歷史 FACT | 歷史封存原則 |
| ❌ 在 T005 新增策略欄位 | Strategy Mapping Sheet 為 SSOT |
| ❌ 修改 ADR-001 / ADR-002 已封存的指標語義 | 向後相容 |

#### 5.3 Phase 3 工程解凍後允許修改範圍

| 檔案 | 允許修改 | 修改內容 |
|------|----------|----------|
| `ComparisonEngine.js` | ✅ | 讀取 Strategy_Mapping，計算 `strategy_universe_count` |
| `C005_FactWriter.js` | ✅ | 寫入 N 欄 (`strategy_universe_count`) |
| `C005_MailService.js` | ✅ | 顯示 `strategy_listing_rate` |
| `Strategy_Mapping Sheet` | ✅ | 新建（業務維護）|

---

### 6. ADR-003 完成定義（Done Criteria）

#### 6.1 ADR 完成條件

| # | 條件 | 驗收方式 |
|---|------|----------|
| 1 | 欄位結構定義完成 | 本 ADR 第 2 節 |
| 2 | ENUM 定義完成 | 本 ADR 第 2.2 節 |
| 3 | 輸入責任明確 | 本 ADR 第 3 節 |
| 4 | 與 Phase 3 指標關係明確 | 本 ADR 第 4 節 |
| 5 | 工程邊界明確 | 本 ADR 第 5 節 |

#### 6.2 ADR 核准後交付物

| 交付物 | 說明 |
|--------|------|
| Strategy_Mapping Sheet 結構規格 | 可直接建立 Sheet |
| 欄位 ENUM 定義 | 可直接用於資料驗證 |
| 輸入流程 SOP | 可直接交付業務執行 |

#### 6.3 ADR 核准後狀態

```
ADR-003 核准後：
- Strategy Mapping Sheet 結構已確定
- 不需再討論「欄位長什麼樣」
- 僅剩「資料填寫與核准」行為
```

#### 6.4 Phase 3 工程解凍前置條件

| # | 前置條件 | 狀態 |
|---|----------|------|
| 1 | ADR-003 核准 | PENDING（本 ADR）|
| 2 | Strategy_Mapping Sheet 建立 | PENDING |
| 3 | 初始策略資料填入（至少一平台）| PENDING |
| 4 | 業務確認輸入流程 | PENDING |

---

## Consequences

### Positive

1. Strategy Mapping Sheet 作為 SSOT，策略維護集中
2. T005 保持純淨，專注商品主檔
3. 業務可直接操作，無需工程介入
4. 審核流程確保資料品質
5. 與 Phase 2 完全分離，無向後相容風險

### Negative

1. 需維護額外 Sheet
2. 初始資料填寫有一次性成本
3. 需建立業務/營運輸入習慣

### Risks

| 風險 | 影響 | 緩解措施 |
|------|------|----------|
| 資料填寫延遲 | 高 | 設定明確時程、責任人 |
| 資料品質不佳 | 中 | 審核流程、資料驗證 |
| 預設行為混淆 | 中 | 文件說明、教育訓練 |

---

## Alternatives Considered

### Alternative 1: 在 T005 新增策略欄位

**拒絕原因**：
- 違反分離關注點原則
- T005 Schema 變更成本高
- 多平台策略需多欄位，T005 會膨脹

### Alternative 2: 品牌層級策略（非 SKU 層級）

**拒絕原因**：
- 無法處理 SKU 粒度例外
- 未來彈性不足

### Alternative 3: 程式碼 hardcode 策略

**拒絕原因**：
- 業務無法自行調整
- 違反 SSOT 原則
- 維護成本高

---

## Related Documents

| 文件 | 說明 |
|------|------|
| `ADR-001-C005-PHASE2-LISTING-COVERAGE.md` | Phase 2 裁定（SEALED）|
| `ADR-002-C005-PHASE3-STRATEGY-UNIVERSE.md` | Phase 3 Strategy Universe 定義（SEALED）|
| `R020_DATA_CONTRACT_v1.0.md` | Platform Code 定義來源 |
| `T005_SHEET_SCHEMA_CANONICAL_v2026-01.md` | T005 Schema（商品主檔）|

---

## Appendix A: Strategy_Mapping Sheet 範例

```
| product_id | brand  | platform_code | strategy_scope | effective_start_date | effective_end_date | input_by | input_date | status   | approved_by | approved_date | note          |
|------------|--------|---------------|----------------|----------------------|--------------------|----------|------------|----------|-------------|---------------|---------------|
| SKU-001    | BrandA | MOMO          | ALLOW          |                      |                    | PM-王     | 2026-01-22 | APPROVED | OPS-李      | 2026-01-22    |               |
| SKU-001    | BrandA | SHOPEE        | DENY           | 2026-02-01           |                    | PM-王     | 2026-01-22 | APPROVED | OPS-李      | 2026-01-22    | 品牌限制      |
| SKU-002    | BrandB | YAHOO         | OPTIONAL       |                      | 2026-06-30         | PM-陳     | 2026-01-22 | DRAFT    |             |               | 試賣期        |
```

---

## Appendix B: strategy_universe_count 計算範例

假設：
- `base_universe_count` = 2790（全商品）
- Strategy_Mapping 中 MOMO 有 50 筆 `DENY` 記錄

則：
```
strategy_universe_count(MOMO) = 2790 - 50 = 2740
strategy_listing_rate(MOMO) = matched_count / 2740
```

---

## Approval

| 角色 | 狀態 | 日期 | 簽名 |
|------|------|------|------|
| Architect | APPROVED | 2026-01-22 | 豪哥 |
| 業務確認 | PENDING | - | (需確認輸入流程) |
| 營運確認 | PENDING | - | (需確認審核流程) |

---

## Changelog

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-01-22 | v1.0 | 初版草稿 | Claude Code |
| 2026-01-22 | v1.1 | 狀態改為 APPROVED | Claude Code |

---

**END OF ADR-003-C005-STRATEGY-MAPPING-SSOT.md**
