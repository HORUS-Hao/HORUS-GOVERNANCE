# ADR-001: C005 Phase 2 Listing Coverage Decision

> **Status**: APPROVED
> **Date**: 2026-01-22
> **Deciders**: Architect (豪哥)
> **Technical Context**: C005 Listing Checker

---

## Context

Phase 1 / 1.5 已完成：
- MAIL 治理揭露已上線（commit `9753b61`）
- totalProducts 差異已裁定為 Case A（平台 universe 不同，設計預期）
- 分析文件已產出：`C005-PHASE2-LISTING-COVERAGE-ANALYSIS.md`

**現行問題**：
- 現行 `listing_rate` 為「平台內完成率」，無法回答：「在全部 T005 商品中，有多少已成功對應並上架」
- 關鍵指標 `matched_count` 在管線中計算後被丟棄，未寫入 FACT
- 無法區分「平台觀測 universe」與「T005 決策 universe」

---

## Decision

### 1. Phase 2「上架率」正式定義

#### 1.1 裁定

**同意**引入兩層上架率定義：

| 指標名稱 | 定義 | 公式 | 用途 |
|----------|------|------|------|
| `platform_internal_listing_rate` | 平台內完成率 | `listed_count / total_products` | 現行指標，維持不變 |
| `decision_listing_rate` | 決策級上架率 | `matched_count / base_universe_count` | Phase 2 新增 |

#### 1.2 公式說明

```
decision_listing_rate = matched_count / base_universe_count

其中：
- matched_count: 平台檔案中成功對應到母集合的 SKU 數
- base_universe_count: 母集合（T005 + ERP 聯集）商品總數
```

#### 1.3 兩指標關係

```
platform_internal_listing_rate → 回答：「在平台可觀測範圍內，上架完成度如何」
decision_listing_rate         → 回答：「在全部應管理商品中，此平台覆蓋率如何」
```

---

### 2. T005 應上架母集合裁定

#### 2.1 裁定

**同意** Phase 2 不引入 status / eligibility filter。

| 項目 | Phase 2 裁定 |
|------|--------------|
| 母集合定義 | 全 T005 + ERP 聯集（現行邏輯不變）|
| status 過濾 | **不實作** |
| eligibility 規則 | **留待 Phase 3** |

#### 2.2 理由

1. T005 `status` 欄位尚無正式 enum 定義
2. 狀態 → 上架資格對照表尚未經業務確認
3. Phase 2 目標為「補齊可觀測覆蓋率」，而非「定義商業應上架規則」

#### 2.3 Phase 3 前置條件

```
eligibility 實作前，需完成：
1. ADR: T005 status enum 定義
2. ADR: 狀態 → 上架資格對照表
3. 業務確認
```

#### 2.4 Note (Phase 3 Extension – Strategy Universe)

> Phase 2 `base_universe_count` is an **asset-coverage baseline** (full T005 + ERP union) and does not represent platform-specific "should list" eligibility.
>
> If brand/SKU is restricted to specific platforms, introduce a separate Phase 3 metric `strategy_universe_count(platform)` and a derived `strategy_listing_rate = matched_count / strategy_universe_count(platform)`.
>
> This Phase 3 extension **must not** retroactively change Phase 2 semantics and **must not** overwrite `base_universe_count`.

---

### 3. Phase 2 MVP FACT Schema 裁定

#### 3.1 裁定

**同意**最小新增 3 欄：

| 欄位 | Column | 說明 | 資料型別 |
|------|--------|------|----------|
| `base_universe_count` | K | 母集合商品總數 | integer |
| `platform_records_count` | L | 平台原始筆數 | integer |
| `matched_count` | M | 成功對應筆數 | integer |

#### 3.2 完整 Schema（Phase 2 後）

```
Listing_History Schema (A-M):

A: fact_date              (既有)
B: platform_code          (既有)
C: platform_name          (既有)
D: total_products         (既有) ← 維持現行語義
E: listed_count           (既有)
F: unlisted_count         (既有)
G: listing_rate           (既有) ← platform_internal_listing_rate
H: source                 (既有)
I: snapshot_id            (既有)
J: created_at             (既有)
K: base_universe_count    (Phase 2 新增)
L: platform_records_count (Phase 2 新增)
M: matched_count          (Phase 2 新增)
```

#### 3.3 寫入規則

| 項目 | 裁定 |
|------|------|
| 寫入位置 | 維持 `Listing_History` Sheet |
| 寫入頻率 | 維持每日一平台一筆 FACT |
| 歷史相容 | 歷史 FACT 的 K-M 欄為空（不回填）|

---

### 4. 工程修改邊界

#### 4.1 允許修改範圍（白名單）

| 檔案 | 允許修改 | 修改內容 |
|------|----------|----------|
| `ComparisonEngine.js` | ✅ | 回傳 `matched_count`, `platform_records_count` |
| `C005_FactWriter.js` | ✅ | 寫入 K-M 新欄位 |
| `C005_MailService.js` | ✅ | 顯示 `decision_listing_rate` |

#### 4.2 明確禁止（黑名單）

| 禁止事項 | 原因 |
|----------|------|
| ❌ eligibility filter | 留待 Phase 3 |
| ❌ 歷史 FACT 回填 | 高成本、低價值 |
| ❌ 改寫既有指標語義 | 維持向後相容 |
| ❌ 修改 `listing_rate` 計算公式 | 現行指標不變 |
| ❌ 修改 `buildBaseProducts()` 過濾邏輯 | 母集合定義不變 |
| ❌ 新增其他 FACT 欄位 | 超出 MVP 範圍 |

#### 4.3 邊界聲明

```
Phase 2 工程邊界鎖定：
- 僅新增「觀測指標」
- 不變更「既有計算邏輯」
- 不變更「母集合定義」
- 不變更「上架判定邏輯」
```

---

### 5. Phase 2 完成定義（Done Criteria）

#### 5.1 必要條件

| # | 條件 | 驗收方式 |
|---|------|----------|
| 1 | FACT Schema 擴充完成 | Listing_History 有 K-M 欄 |
| 2 | 新指標寫入正常 | 新 FACT 筆數 K-M 欄有值 |
| 3 | MAIL 顯示兩層上架率 | 同時顯示 `platform_internal_listing_rate` 與 `decision_listing_rate` |
| 4 | 任一平台可回答核心問題 | 見 5.2 |

#### 5.2 核心問題驗收

對於 MOMO 或 PCHOME，Phase 2 完成後 MAIL 需能回答：

```
Q: 在全部 T005 商品中，有多少已成功對應並上架到此平台？

A:
  - 母集合商品數: {base_universe_count}
  - 平台原始筆數: {platform_records_count}
  - 成功對應筆數: {matched_count}
  - 決策級上架率: {decision_listing_rate}%
```

#### 5.3 MAIL 顯示規格

```
【平台: MOMO】
  平台內完成率: 85.3% (1559 / 1827)  ← 現行指標
  決策級上架率: 55.9% (1559 / 2790)  ← Phase 2 新增

  母集合商品數: 2790
  平台原始筆數: 1850
  成功對應筆數: 1559
```

#### 5.4 不屬於 Phase 2 完成條件

| 項目 | 歸屬 |
|------|------|
| eligibility 過濾 | Phase 3 |
| 歷史資料回填 | Phase 3 或不做 |
| 其他平台（YAHOO/SHOPEE）| Phase 3 |

---

## Consequences

### Positive

1. 建立「決策級上架率」指標，可回答管理層核心問題
2. 保留完整診斷資訊（matched_count, platform_records_count）
3. 維持向後相容（既有指標不變）
4. 工程邊界清晰，避免範圍蔓延

### Negative

1. MAIL 資訊量增加，需注意可讀性
2. 歷史 FACT 無新欄位，無法回溯計算

### Risks

| 風險 | 影響 | 緩解措施 |
|------|------|----------|
| 新舊指標混淆 | 中 | MAIL 明確標註「平台內」vs「決策級」|
| 歷史資料不連續 | 低 | 記錄 Phase 2 生效日期，標註資料版本 |

---

## Alternatives Considered

### Alternative 1: 同時實作 eligibility

**拒絕原因**：
- T005 status enum 未定義
- 業務規則未確認
- 範圍過大

### Alternative 2: 只修改 MAIL 顯示，不寫入 FACT

**拒絕原因**：
- 無法追蹤歷史趨勢
- 無法進行回溯分析

### Alternative 3: 不區分兩層上架率

**拒絕原因**：
- 無法回答管理層核心問題
- 無法診斷對應率問題

---

## Related Documents

| 文件 | 說明 |
|------|------|
| `C005-PHASE2-LISTING-COVERAGE-ANALYSIS.md` | Phase 2 分析文件 |
| `T005-LISTING-ELIGIBILITY-RULES.md` | 上架資格規則（Phase 1）|
| `C005-MAIL-AND-PLATFORM-COMPLETION-ROADMAP.md` | 完成度路線圖 |

---

## Approval

| 角色 | 狀態 | 日期 | 簽名 |
|------|------|------|------|
| Architect | APPROVED | 2026-01-22 | 豪哥 |
| 業務確認 | N/A | - | (Phase 2 為技術指標補齊，不涉及業務規則變更) |

---

## Changelog

| Date | Version | Change | Author |
|------|---------|--------|--------|
| 2026-01-22 | v1.0 | 初版草稿 | Claude Code |
| 2026-01-22 | v1.1 | 新增 Phase 3 Strategy Universe 備註；狀態改為 APPROVED | Claude Code |

---

**END OF ADR-001-C005-PHASE2-LISTING-COVERAGE.md**
