# C005 Observation Signal - Platform Fact

> **TYPE**: GOVERNANCE / SEMANTIC DEFINITION
> **STATUS**: ACTIVE
> **PHASE**: 2 (Observe-only)
> **MUTATION**: NONE
> **Date**: 2026-01-25
> **Architect**: Claude Code

---

## 1. Purpose

本文件定義 C005 的 **Observation Signal 語意模型**，將「平台有資料」與「策略允許上架」明確分離。

---

## 2. Core Semantic Definition

### 2.1 Signal Types

| Signal | Name | Source | Role |
|--------|------|--------|------|
| `platformFact` | 平台事實 | C005 ComparisonEngine | **Observation**（觀察）|
| `eligibility` | 上架資格 | EligibilityService | **Decision**（決策）|
| `discrepancy` | 不一致 | ObservationSignal | **Derived**（衍生）|

### 2.2 Semantic Anchoring

```
platformFact = 平台是否「實際有資料」
  → This is OBSERVATION (客觀事實)
  → Source: ComparisonEngine 比對結果

eligibility = 策略是否「應該上架」
  → This is DECISION (主觀決策)
  → Source: T005.商品狀態 + T002-WK.平台建檔名稱

discrepancy = platformFact ≠ eligibility
  → This is DERIVED (衍生指標)
  → 用於觀察期間，不做任何強制動作
```

---

## 3. Discrepancy Types

| Type | Condition | Meaning | Action (Phase 2) |
|------|-----------|---------|------------------|
| `ShouldDelist` | `platformFact=true`, `eligibility=false` | 策略禁止但仍存在 | Observe Only |
| `ShouldList` | `platformFact=false`, `eligibility=true` | 策略允許但尚未存在 | Observe Only |
| `null` | `platformFact === eligibility` | 一致，無問題 | - |

### 3.1 Example

```javascript
// UID: EXAMPLE-001
{
  platformFact: {
    MOMO: true,    // 平台有資料
    PCHOME: false, // 平台無資料
    SHOPEE: true   // 平台有資料
  },
  eligibility: {
    MOMO: true,    // 策略允許
    PCHOME: true,  // 策略允許（但平台沒資料）
    SHOPEE: false  // 策略禁止（但平台有資料）
  },
  discrepancy: {
    MOMO: false,   // 一致
    PCHOME: true,  // ShouldList
    SHOPEE: true   // ShouldDelist
  },
  discrepancyType: {
    MOMO: null,
    PCHOME: 'ShouldList',
    SHOPEE: 'ShouldDelist'
  }
}
```

---

## 4. Implementation Reference

### 4.1 Files

| File | Function | Description |
|------|----------|-------------|
| `ObservationSignal.js` | `buildSignals()` | 建立完整 signals 物件 |
| `ObservationSignal.js` | `extractPlatformFact()` | 從 platforms 提取 fact |
| `ObservationSignal.js` | `calculateDiscrepancy()` | 計算 discrepancy |
| `ObservationSignal.js` | `summarizeDiscrepancies()` | 統計 discrepancy |
| `ComparisonEngine.js` | `mergeComparisonResults()` | 注入 signals 到結果 |

### 4.2 Integration Point

```javascript
// ComparisonEngine.js - mergeComparisonResults()
if (typeof ObservationSignal !== 'undefined' && ObservationSignal.buildSignals) {
  result.signals = ObservationSignal.buildSignals(
    result.platforms,
    product.eligibility || null,
    ['MOMO', 'PCHOME', 'YAHOO', 'SHOPEE', 'COUPANG']
  );
}
```

---

## 5. Observation Rules (Phase 2)

### 5.1 What We Do

| Action | Status |
|--------|--------|
| 計算 discrepancy | ✅ 執行 |
| 記錄 discrepancy 到 result.signals | ✅ 執行 |
| 輸出 discrepancy summary log | ✅ 執行 |
| 提供 top N discrepancy 清單 | ✅ 執行 |

### 5.2 What We Do NOT Do

| Action | Status | Reason |
|--------|--------|--------|
| 阻斷任何流程 | ❌ 禁止 | Observe-only |
| 自動通知/警報 | ❌ 禁止 | Observe-only |
| 回寫任何 Sheet | ❌ 禁止 | Non-Canonical |
| 強制修正 discrepancy | ❌ 禁止 | Observe-only |

---

## 6. Discrepancy Summary Format

### 6.1 Log Format

```
========== Observation Signal Discrepancy Summary ==========
Total Results: 1000
Consistent: 850
ShouldDelist: 50
ShouldList: 100

By Platform:
  MOMO: ShouldDelist=10, ShouldList=20, Consistent=970
  PCHOME: ShouldDelist=15, ShouldList=30, Consistent=955
  YAHOO: ShouldDelist=10, ShouldList=25, Consistent=965
  SHOPEE: ShouldDelist=10, ShouldList=15, Consistent=975
  COUPANG: ShouldDelist=5, ShouldList=10, Consistent=985

Top 20 Discrepancies:
  1. UID=ABC-001 | MOMO:ShouldDelist, SHOPEE:ShouldList
  2. UID=DEF-002 | PCHOME:ShouldList
  ...
============================================================
```

### 6.2 API Response Extension

```javascript
// executeComparison() 回傳結構擴充
{
  success: true,
  data: {
    results: [...],
    statistics: {...},
    summary: {
      // ... 既有欄位 ...

      // v2.2.0 新增: Observation Signal Summary
      observationSignals: {
        total: 1000,
        consistent: 850,
        shouldDelistCount: 50,
        shouldListCount: 100,
        byPlatform: {
          MOMO: { shouldDelist: 10, shouldList: 20, consistent: 970 },
          // ...
        },
        topDiscrepancies: [
          { uid: 'ABC-001', discrepancyType: { MOMO: 'ShouldDelist', ... } },
          // ...
        ]
      }
    }
  }
}
```

---

## 7. Phase Transition Criteria

### 7.1 Phase 2 → Phase 3

| Criteria | Threshold | Description |
|----------|-----------|-------------|
| Discrepancy 穩定性 | ≤ 10% 波動 | 連續 2 週 discrepancy 數量穩定 |
| ShouldDelist 處理率 | N/A | Phase 2 不處理，僅觀察 |
| Architect 裁定 | Required | 需要 Architect 確認升級 |

### 7.2 Phase 3 可能方向

- 將 discrepancy 資訊整合到 C005 報表
- 提供 discrepancy 警示（Soft Alert）
- 建立 discrepancy 追蹤儀表板

---

## 8. Related Documents

| Document | Description |
|----------|-------------|
| `T002-WK-PLATFORM-STRATEGY-CONTRACT.md` | Eligibility 計算來源定義 |
| `T002-WK-PLATFORM-STRATEGY-FACT.md` | Naming = Intent 事實確認 |
| `T002-WK-PLATFORM-STRATEGY-OBSERVATION-PHASE2.md` | Phase 2 觀察計畫 |
| `EligibilityService.js` | Eligibility 計算服務 |
| `ObservationSignal.js` | Observation Signal 服務 |

---

## 9. Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-25 | 1.0.0 | Initial - Observation Signal 語意定義 |

---

**END OF C005-OBSERVATION-SIGNAL-PLATFORM-FACT.md**
