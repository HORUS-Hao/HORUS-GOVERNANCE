# HORUS Trigger Registry (SSOT)

> **Version**: v2026-01-22.1
> **Created**: 2026-01-22
> **Status**: SSOT (Single Source of Truth)
> **Authority**: HORUS-GOVERNANCE

---

## 1. SSOT Declaration

本文件為 HORUS 系統所有自動 Trigger 的 **唯一權威登錄表**。

- **證據來源**: 2026-01-22_READONLY_FACT_AUDIT/risk.signals.md
- **狀態**: CONFIRMED（程式碼中發現的 Trigger 設定）

---

## 2. 已登錄 Trigger

### 2.1 dailyObserverMailJob

| 項目 | 內容 |
|------|------|
| **模組** | R020-Price-Comparator/_clasp-observer-mail |
| **檔案** | TriggerSetup.js:134-140 |
| **排程** | 每日 |
| **用途** | Observer Mail 每日報告 |
| **狀態** | ACTIVE |
| **風險等級** | MEDIUM |
| **負責人** | NEEDS-SSOT-DECISION |

### 2.2 R021_dailyIntegratedJob

| 項目 | 內容 |
|------|------|
| **模組** | R020-Price-Comparator/_clasp-observer-mail |
| **檔案** | R021_MarketIntel_Service.js:799-802 |
| **排程** | 每日 |
| **用途** | R021 市場戰情整合報告 |
| **狀態** | ACTIVE |
| **風險等級** | MEDIUM |
| **負責人** | NEEDS-SSOT-DECISION |

### 2.3 P0-PCHOME 延遲 Trigger

| 項目 | 內容 |
|------|------|
| **模組** | P0-PCHOME-Observation-Test |
| **檔案** | Main.js:118-121 |
| **排程** | 延遲觸發（動態 handler） |
| **用途** | PCHOME 觀察任務 |
| **狀態** | ACTIVE |
| **風險等級** | LOW |
| **負責人** | NEEDS-SSOT-DECISION |

### 2.4 processAllShopeeStores

| 項目 | 內容 |
|------|------|
| **模組** | C005-Listing-Checker |
| **檔案** | ShopeePreprocessor.js:310-314 |
| **排程** | 每日 02:00 |
| **用途** | Shopee 全店處理 |
| **狀態** | ACTIVE |
| **風險等級** | MEDIUM |
| **負責人** | NEEDS-SSOT-DECISION |

---

## 3. Trigger 治理規則

### 3.1 新增 Trigger 規範

1. **必須登錄**: 任何新 Trigger 必須先在本文件登錄
2. **必須說明排程**: 明確說明執行時間/頻率
3. **必須指定負責人**: 明確指定負責維運的人員
4. **必須評估風險**: 標註風險等級 (LOW/MEDIUM/HIGH)

### 3.2 修改 Trigger 規範

1. 修改前須更新本文件
2. 修改後須通知相關負責人
3. 保留修改歷史紀錄

### 3.3 刪除 Trigger 規範

1. 刪除前須更新本文件標註為 DEPRECATED
2. 等待一週觀察期後方可刪除程式碼
3. 刪除後更新本文件標註為 REMOVED

---

## 4. 風險等級定義

| 等級 | 定義 | 監控需求 |
|------|------|---------|
| LOW | 僅讀取資料，無副作用 | 每週檢視 |
| MEDIUM | 寫入資料或發送通知 | 每日監控 |
| HIGH | 關鍵業務流程、大量資料變更 | 即時監控 + 告警 |

---

## 5. NEEDS-SSOT-DECISION

以下項目需要人工確認後補齊：

| 項目 | 現狀 | 需確認 |
|------|------|--------|
| 各 Trigger 負責人 | 未指定 | 需指定維運負責人 |
| 執行時間精確值 | 僅知「每日」 | 確認具體執行時間 |
| 錯誤處理機制 | 未知 | 確認失敗時的處理流程 |
| 監控/告警設定 | 未知 | 確認是否有監控機制 |

---

## 6. PropertiesService 使用（相關）

| 模組 | Property Key | 用途 |
|------|-------------|------|
| R020-Price-Comparator | R020_URL_MAP | URL 快取 |
| R020/_clasp-observer-mail | R021_LAST_JOB_RESULT | Trigger 執行狀態追蹤 |
| P0-PCHOME-Observation-Test | PROGRESS_KEY | 進度追蹤 |

---

## 7. 證據來源

- **主要來源**: `2026-01-22_READONLY_FACT_AUDIT/risk.signals.md`
- **repair.backlog.md**: P0-4 建議建立 TRIGGER-GOVERNANCE.md

---

## 8. Changelog

| Date | Version | Change |
|------|---------|--------|
| 2026-01-22 | v2026-01-22.1 | 初始建立，登錄 4 個已知 Trigger |

---

**本文件為 HORUS-GOVERNANCE Trigger SSOT，任何 Trigger 變更須更新本文件。**
