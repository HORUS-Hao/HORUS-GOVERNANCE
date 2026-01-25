# T002-WK Platform Strategy - Phase 2 Observation Plan

> **TYPE**: GOVERNANCE / OBSERVATION
> **STATUS**: ACTIVE
> **PHASE**: 2 (Observe-only)
> **MUTATION**: NONE
> **Date**: 2026-01-25

---

## 1. Scope & Non-Goals

### 1.1 Scope

| 項目 | 說明 |
|------|------|
| T002-WK | 「Naming = Intent」模型，建檔名稱非空白 = eligibility true |
| T005 商品狀態 | Master Gate（總開關），僅「正常銷售」可進入 Layer 2 |
| C005 Eligibility | Derived read-only 計算，不回寫任何 Sheet |

### 1.2 Non-Goals

| 禁止項目 | 說明 |
|----------|------|
| ❌ 不新增欄位 | 禁止新增「是否上架」或任何 enable/disable 欄位 |
| ❌ 不強制填寫 | Phase 2 為觀察期，不阻擋未填寫 |
| ❌ 不做 Gate | 不做流程阻斷、不強制驗證 |
| ❌ 不回寫 T005/T002 | Eligibility 僅存在於 Runtime/Output |
| ❌ 不改 Trigger | 不新增自動化觸發 |

---

## 2. Decision Summary

### 2.1 Related Documents

| 文件 | 說明 |
|------|------|
| `ADR-T005-LISTING-ELIGIBILITY-SOURCE.md` | Lifecycle → Eligibility 映射規則 |
| `T002-WK-PLATFORM-STRATEGY-FACT.md` | Naming = Intent 事實確認 |
| `T002-WK-PLATFORM-STRATEGY-CONTRACT.md` | 雙層判斷模型契約 |
| `C005-PHASE2-ELIGIBILITY-IMPLEMENTATION.md` | Phase 2 實作記錄 |

### 2.2 Implementation Commits

| Repository | Commit | Description |
|------------|--------|-------------|
| HORUS-PDM | `2e8bc93` | feat(c005): Phase 2 - WK-based Platform Eligibility |
| HORUS-GOVERNANCE | `cd5695f` | governance(T002): seal "Naming = Intent" model as FINAL |
| HORUS-GOVERNANCE | `d63992e` | governance(fact): confirm T002-WK naming=intent eligibility model |

---

## 3. Observation KPIs (2–4 週)

### 3.1 KPI Definitions

| KPI | Name | Definition |
|-----|------|------------|
| KPI-1 | WK 填寫率（Overall） | 有填任一平台建檔名稱的 UID / 總 UID |
| KPI-2 | 各平台填寫率 | 該平台建檔名稱非空白的 UID / 總 UID |
| KPI-3 | UID 平台數分布 | 每個 UID 填寫了幾個平台（0/1/2/3/4/5）的分布 |
| KPI-4 | Master Gate 不通過比例 | T005.商品狀態 ≠ 正常銷售 的 UID 占比 |
| KPI-5 | 疑似誤填樣本 | 建檔名稱很短（<3字）/ 重複 / 明顯 placeholder（如 "1", "test", "xxx"） |

### 3.2 Collection Method

- 來源：T002-WK-平台建檔名稱 工作表（人工或腳本讀取）
- 週期：每週一次
- 執行者：Architect 或指定人員
- 工具：READ-ONLY 掃描，不寫入任何資料

---

## 4. Reporting Cadence

| 週次 | 日期範圍 | 說明 |
|------|----------|------|
| W1 | 觀察期第 1 週 | 首次回報，建立 baseline |
| W2 | 觀察期第 2 週 | 趨勢觀察 |
| W3 | 觀察期第 3 週 | 異常樣本分析 |
| W4 | 觀察期第 4 週 | 最終回報，供 Architect 裁定是否升級 Phase 3 |

**原則**：只報數字與異常樣本，不做裁定。裁定由 Architect 進行。

---

## 5. Weekly Report Format

```yaml
WEEK: W<n>
DATE_RANGE: YYYY-MM-DD ~ YYYY-MM-DD
WK_FILL_RATE_OVERALL: xx%
PLATFORM_FILL_RATE:
  MOMO: xx%
  PCHOME: xx%
  YAHOO: xx%
  SHOPEE: xx%
  COUPANG: xx%
UID_PLATFORM_COUNT_DISTRIBUTION:
  0: n
  1: n
  2: n
  3: n
  4: n
  5: n
MASTER_GATE_FAILED_UID_COUNT: n
SUSPECTED_BAD_ENTRIES_SAMPLES: [最多 10 筆 UID + 欄位 + 值]
NOTES: (只描述事實，不下結論)
```

### 5.1 Sample Report

```yaml
WEEK: W1
DATE_RANGE: 2026-01-27 ~ 2026-02-02
WK_FILL_RATE_OVERALL: 12%
PLATFORM_FILL_RATE:
  MOMO: 10%
  PCHOME: 8%
  YAHOO: 5%
  SHOPEE: 3%
  COUPANG: 1%
UID_PLATFORM_COUNT_DISTRIBUTION:
  0: 880
  1: 50
  2: 40
  3: 20
  4: 8
  5: 2
MASTER_GATE_FAILED_UID_COUNT: 150
SUSPECTED_BAD_ENTRIES_SAMPLES:
  - UID: ABC-001, MOMO: "1"
  - UID: DEF-002, PCHOME: "test"
  - UID: GHI-003, YAHOO: "xxx"
NOTES: 首週填寫率偏低，符合預期（人工填寫尚未全面啟動）
```

---

## 6. Phase 3 Upgrade Criteria (Architect 裁定用)

> **注意**：以下為參考條件，最終由 Architect 裁定。

| 條件 | Threshold | 說明 |
|------|-----------|------|
| Overall 填寫率 | ≥ 30% | 至少 3 成商品有填任一平台 |
| 誤填率 | ≤ 5% | 疑似誤填樣本佔填寫總數 ≤ 5% |
| 人工操作回饋 | 無重大抱怨 | PM/營運無反映操作困難 |

**Phase 3 可能方向（僅參考）**：
- 啟用 WK 填寫提醒（Soft Gate）
- 整合 C005 輸出報表呈現 Eligibility
- 建立自動化 KPI 儀表板

---

## 7. Related Documents

| 文件 | 說明 |
|------|------|
| `T002-WK-PLATFORM-STRATEGY-CONTRACT.md` | 平台策略治理契約 |
| `T002-WK-PLATFORM-STRATEGY-FACT.md` | 事實確認文件 |
| `ADR-T005-LISTING-ELIGIBILITY-SOURCE.md` | Eligibility 來源定義 |
| `C005-PHASE2-ELIGIBILITY-IMPLEMENTATION.md` | Phase 2 實作記錄 |

---

**END OF T002-WK-PLATFORM-STRATEGY-OBSERVATION-PHASE2.md**
