# T002 Legacy Script Governance Audit

**文件類型**: Governance Audit
**狀態**: Read-only Audit (No Changes)
**適用範圍**: T002 既存腳本盤點
**建立日期**: 2026-01-13
**上位文件**: ADR-T002-COLLABORATION-PHASE1.md

---

## ⚠️ 重要聲明

**本文件不構成任何實作授權，僅為治理盤點。**
**所有 Legacy Script 皆不得視為 Phase 5/6 合法實作。**

---

## 一、背景說明

此為治理框架建立前既存的實作（Legacy），包含：

- 治理前已部署的 Google Apps Script
- 治理前已建立的 clasp 專案配置
- 治理前已封存的歷史腳本

本盤點僅做分類與風險標記，**不修改任何程式碼**。

---

## 二、盤點範圍

### 2.1 雲端 GAS 專案

| 專案名稱 | Script ID | 狀態 |
|----------|-----------|------|
| T002-Material-Schema-Design | `1GqBwFMpEpSrXCshb8xECZUcVTaQwH5ytaPf9qbE31rg2I64qycG0_N_z` | 存在但無本地 .gs 檔案 |

### 2.2 盤點位置

| 位置 | 類型 |
|------|------|
| 10-基礎服務層/T002-Material-Schema-Design/ | clasp 專案配置 |
| 70-封存-ARCHIVE/vault-保險庫/T002原料庫系統-歷史版本/ | 封存腳本 |
| 70-封存-ARCHIVE/.../T005-notion-sync-system/legacy/apps-scripts/ | Legacy 主腳本 |

---

## 三、腳本清單

### 3.1 雲端專案（clasp 配置存在）

| 檔名 | 功能 | 是否寫入 | 風險等級 | 治理裁定 |
|------|------|----------|----------|----------|
| T002-Material-Schema-Design (clasp) | 雲端 GAS 專案配置 | ⚠️ 未知（需雲端檢視） | **High** | 🔒 封存（禁止使用） |

### 3.2 封存腳本

| 檔名 | 功能 | 是否寫入 | 風險等級 | 治理裁定 |
|------|------|----------|----------|----------|
| T002_20250823_v1.0_完整主腳本.gs | 建立 T002 試算表系統 | ✅ 是（createNewT002Spreadsheet） | **High** | 🔒 封存（禁止使用） |
| T002原料庫完整系統v1.0建立腳本_修正版.gscript | 系統建立腳本 | ⚠️ 可能（.gscript 連結） | **High** | 🔒 封存（禁止使用） |

### 3.3 Phase 5 合法實作

| 檔名 | 功能 | 是否寫入 | 風險等級 | 治理裁定 |
|------|------|----------|----------|----------|
| T002_DATA_COMPLETENESS_VALIDATOR.gs | Read-only 資料驗證 | ❌ 否（純讀取） | **Low** | ✅ 保留（Phase 5 合法） |

---

## 四、風險分析

### 4.1 高風險項目

| 項目 | 風險說明 |
|------|----------|
| T002-Material-Schema-Design clasp | 雲端專案可能包含寫入邏輯，未經審閱 |
| T002_20250823_v1.0_完整主腳本.gs | 明確包含 createNewT002Spreadsheet 寫入函數 |
| 任何 .gscript 連結檔 | 指向雲端腳本，內容無法本地審閱 |

### 4.2 Canonical 風險評估

| 項目 | 是否可能寫入 T005 | 風險等級 |
|------|-------------------|----------|
| T002-Material-Schema-Design | ⚠️ 未知 | **High** |
| T002_20250823_v1.0 | ❌ 否（僅建立 T002） | Medium |
| T002_DATA_COMPLETENESS_VALIDATOR | ❌ 否（Read-only） | Low |

---

## 五、治理裁定

### 5.1 裁定原則

| 原則 | 說明 |
|------|------|
| 預設封存 | 未經 ADR 審閱的 Legacy 腳本預設封存 |
| 禁止執行 | 封存腳本不得執行 |
| 禁止修改 | 封存腳本不得修改（保留原貌） |
| 啟用需 ADR | 重新啟用任何 Legacy 腳本需新 ADR |

### 5.2 各腳本裁定

| 腳本 | 裁定 | 說明 |
|------|------|------|
| T002-Material-Schema-Design (clasp) | 🔒 **封存** | 雲端專案未審閱，禁止使用 |
| T002_20250823_v1.0_完整主腳本.gs | 🔒 **封存** | 包含寫入邏輯，禁止使用 |
| T002原料庫完整系統v1.0建立腳本_修正版.gscript | 🔒 **封存** | 雲端連結，禁止使用 |
| T002_DATA_COMPLETENESS_VALIDATOR.gs | ✅ **保留** | Phase 5 合法 Read-only 實作 |

### 5.3 未來啟用條件

| 條件 | 說明 |
|------|------|
| ADR 授權 | 需建立專門 ADR 說明啟用理由 |
| 程式碼審閱 | 需完整審閱所有寫入邏輯 |
| Canonical 確認 | 確認不違反 T005 邊界 |
| Architect 批准 | 最終需 Architect 簽核 |

---

## 六、建議處置

### 6.1 整組封存建議

| 建議 | 說明 |
|------|------|
| **建議整組封存** | 所有 Legacy T002 腳本（除 Phase 5 Validator）應整組封存 |
| 封存位置 | 維持現有 70-封存-ARCHIVE 位置 |
| 禁止事項 | 禁止 pull、執行、修改、延續 |

### 6.2 雲端專案處置

| 處置 | 說明 |
|------|------|
| clasp 專案 | 不執行 clasp pull，保持現狀 |
| 雲端腳本 | 不檢視、不修改、不執行 |
| 若需使用 | 需新 ADR + 完整審閱 |

---

## 七、高風險函數治理紅標

### 7.1 CRITICAL - FORBIDDEN 函數

| 函數名稱 | 標記 | 狀態 | 說明 |
|----------|------|------|------|
| `createNewT002Spreadsheet` | 🔴 **CRITICAL - FORBIDDEN** | Legacy-only / Historical reference | Execution prohibited |

### 7.2 紅標定義

| 標記 | 法律效果 |
|------|----------|
| 🔴 CRITICAL - FORBIDDEN | 禁止執行、禁止呼叫、禁止重新實作 |
| Legacy-only | 僅作為歷史紀錄保留 |
| Historical reference | 僅供審閱參考，不得作為實作依據 |
| Execution prohibited | 任何形式的執行皆屬治理違規 |

---

## 八、Constraints

| 項目 | 說明 |
|------|------|
| 本文件為盤點 | 不構成任何實作授權 |
| Legacy 定義 | 治理框架前既存實作 |
| 不可視為合法 | Legacy Script ≠ Phase 5/6 合法實作 |

---

## 九、Formal Freeze Declaration

**All T002 Legacy Scripts identified in this audit are formally frozen.**

They are not authorized for execution, modification, or reuse under the current T002 → T005 governance model.

**Any activation requires a new ADR.**

| Frozen Item | Freeze Status |
|-------------|---------------|
| T002-Material-Schema-Design (clasp) | 🔒 FROZEN |
| T002_20250823_v1.0_完整主腳本.gs | 🔒 FROZEN |
| T002原料庫完整系統v1.0建立腳本_修正版.gscript | 🔒 FROZEN |
| createNewT002Spreadsheet function | 🔴 FORBIDDEN |

---

*本文件不構成任何實作授權，僅為治理盤點。*
*所有 Legacy Script 皆不得視為 Phase 5/6 合法實作。*
*Formal Freeze Date: 2026-01-13*
