# T005 Status Normalization Governance

> **TYPE**: GOVERNANCE / NORMALIZATION
> **STATUS**: ACTIVE
> **PHASE**: 3 (Normalization Framework)
> **MUTATION**: NONE (Read-Only to System)
> **Date**: 2026-01-25
> **Architect**: Claude Code

---

## 1. Purpose

本文件定義 T005 商品狀態正規化機制的治理規則。

**核心原則：**
- Normalization Sheet **不是即時控制**
- Phase < 3 時 **完全無效**
- 未命中 mapping **一律 not eligible**

---

## 2. Normalization Sheet 定義

### 2.1 Sheet 資訊

| 項目 | 值 |
|------|-----|
| Sheet 名稱 | `T005-STATUS-NORMALIZATION` |
| 工作表名稱 | `STATUS_MAP` |
| 存取權限 | 系統僅讀取，人工維護 |
| AI 寫入 | ❌ 禁止 |

### 2.2 欄位定義（順序不可變）

| 欄位 | 說明 | 範例 |
|------|------|------|
| `raw_status` | T005 實際出現的原始值（完全比對）| `現貨` |
| `normalized_status` | 正規化後狀態（enum）| `ACTIVE` |
| `eligible` | true / false | `TRUE` |
| `phase` | 啟用 Phase（僅允許 >= 3）| `3` |
| `source` | human / legacy / vendor | `human` |
| `note` | 人類備註 | `現貨視為可銷售` |
| `last_reviewed` | YYYY-MM-DD | `2026-01-25` |

### 2.3 normalized_status Enum

| Enum | Description |
|------|-------------|
| `ACTIVE` | 正常銷售中 |
| `OUT_OF_STOCK` | 暫時缺貨（仍可上架）|
| `DISCONTINUED` | 停產（不可上架）|
| `PENDING` | 待處理（不可上架）|
| `UNKNOWN` | 未知狀態（不可上架）|

---

## 3. 系統行為規則

### 3.1 執行邏輯順序（不可調換）

```
Step 0｜Hard Lock
  若 Phase < 3 → 禁止讀取 Normalization Sheet
  → 直接使用硬編碼規則

Step 1｜Master Gate（硬規則，永不移除）
  status === "正常銷售" → pass
  其他 → 進入 Step 2

Step 2｜Normalization Lookup（Phase >= 3 才啟用）
  若 raw_status 命中 STATUS_MAP
    → 使用 eligible 欄位
  若未命中
    → eligible = false
    → 記錄 Observation Signal: UNKNOWN_STATUS
```

### 3.2 Phase 控制

| Phase | Normalization Sheet 行為 |
|-------|--------------------------|
| 1 | 完全無效，不讀取 |
| 2 | 完全無效，不讀取 |
| 3 | 啟用讀取，依 mapping 判斷 |
| 4+ | 同 Phase 3 |

---

## 4. Observation Signal 擴充

### 4.1 新增 Signal 類型

| Signal | Condition | Description |
|--------|-----------|-------------|
| `UNKNOWN_STATUS` | raw_status 未命中 mapping | 未知狀態，需人工補 mapping |
| `UNMAPPED_STATUS` | 同上，強調未映射 | 用於統計 |
| `PHASE_BLOCKED_MAPPING` | Phase < 3 嘗試讀取 | 被 Phase 鎖阻擋 |

### 4.2 Summary 擴充

```javascript
summary.normalizationCoverage = {
  totalStatuses: 9,           // T005 中出現的狀態總數
  mappedStatuses: 5,          // 已有 mapping 的狀態數
  unmappedStatuses: 4,        // 未有 mapping 的狀態數
  unmappedTop10: [            // 未映射狀態 Top 10
    { status: '現貨', count: 474 },
    { status: '(空白)', count: 404 },
    // ...
  ]
}
```

---

## 5. 禁止事項（紅線）

### 5.1 絕對禁止

| 項目 | 狀態 |
|------|------|
| 刪除硬規則（`status === "正常銷售"`）| ❌ 禁止 |
| Sheet 直接影響 Phase 2 以前結果 | ❌ 禁止 |
| 自動補 mapping | ❌ 禁止 |
| AI 寫入 Sheet | ❌ 禁止 |
| 新增 enable/disable 欄位 | ❌ 禁止 |

### 5.2 允許事項

| 項目 | 狀態 |
|------|------|
| 人工維護 STATUS_MAP | ✅ 允許 |
| 系統讀取 STATUS_MAP（Phase >= 3）| ✅ 允許 |
| 記錄 UNKNOWN_STATUS 到 Observation | ✅ 允許 |

---

## 6. 維護流程

### 6.1 新增 Mapping

1. 人工在 STATUS_MAP 新增一列
2. 填寫所有欄位（`phase` 必須 >= 3）
3. 設定 `last_reviewed` 為當日日期
4. 下次執行時自動生效

### 6.2 審核週期

- 每週審核 UNKNOWN_STATUS 清單
- 由 Architect 決定是否新增 mapping
- 不可自動化此流程

---

## 7. Related Documents

| Document | Description |
|----------|-------------|
| `EligibilityService.js` | Phase 3 Normalization 實作 |
| `T002-WK-PLATFORM-STRATEGY-CONTRACT.md` | Platform Eligibility 契約 |
| `C005-OBSERVATION-SIGNAL-PLATFORM-FACT.md` | Observation Signal 定義 |
| `ADR-T005-LISTING-ELIGIBILITY-SOURCE.md` | Eligibility 來源定義 |

---

## 8. Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-25 | 1.0.0 | Initial - Phase 3 Normalization Framework |

---

**END OF T005-STATUS-NORMALIZATION-GOVERNANCE.md**
