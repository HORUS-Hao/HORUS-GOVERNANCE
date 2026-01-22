# T005 Canonical Root Discovery

- **Audit Date**: 2026-01-22
- **Mode**: Read-only Discovery
- **Scope**: BASE-SERVICES 全目錄
- **Purpose**: 識別所有與 T005 商品主表相關的程式碼位置

---

## 1. 摘要

| 類別 | 數量 |
|------|------|
| T005 核心目錄 | 1 |
| T005 封存/棄用目錄 | 4 |
| T005 核心 GAS 檔案 | 7 |
| 引用 T005 的外部模組 | 5 |
| 引用 T005 的 JS 檔案 | 64 |

---

## 2. T005 目錄結構分類

### 2.1 主要目錄（Active）

| 路徑 | 狀態 | 說明 |
|------|------|------|
| `T005-商品管理-Product-Mgmt/` | ✅ **ACTIVE** | T005 主模組，包含所有核心 GAS 腳本 |

### 2.2 封存/棄用目錄

| 路徑 | 狀態 | 說明 |
|------|------|------|
| `T005-Phase0-Planning-Archive (ARCHIVE-REFERENCE-ONLY)/` | ❄️ ARCHIVE | 規劃階段文件封存 |
| `T005-Pricing (DEPRECATED-EMPTY)/` | ⛔ DEPRECATED | 空目錄，已棄用 |
| `T005-backup-scripts (DEPRECATED-BACKUP)/` | ⛔ DEPRECATED | 備份腳本，已棄用 |
| `T005-Product-Management-v3 (ARCHIVE-DO-NOT-USE)/` | ⛔ ARCHIVE | v3 舊版封存，禁止使用 |
| `T005-Product-Management-v3/` | ⚠️ SECONDARY | 包含 Header Migration 腳本 |

### 2.3 治理目錄

| 路徑 | 狀態 | 說明 |
|------|------|------|
| `HORUS-GOVERNANCE/T005/` | 📋 GOVERNANCE | T005 治理文件 |

---

## 3. T005 核心檔案清單

### 3.1 主模組 GAS 腳本（T005-商品管理-Product-Mgmt/gas-scripts/）

| 檔案名稱 | 分類 | 理由 |
|---------|------|------|
| `UID.gs` | ✅ T005 核心 | UID 生成邏輯（`generateUID_()`），格式：`{System}_{YYYYMMDD}_{Sequence}` |
| `Core.gs` | ✅ T005 核心 | 系統配置、日誌、備份、鎖定機制（`getConfig_()`, `log_()`, `backup_()`, `withLock_()`） |
| `Main.gs` | ✅ T005 核心 | 系統初始化入口（`建立T005商品庫系統v33()`），建立 11 業務表 + 5 系統表 |
| `Sync.gs` | ✅ T005 核心 | T002→T005 同步、Notion 雙向同步、衝突解決策略 |
| `SystemTables.gs` | ✅ T005 核心 | 系統表初始化（`_config`, `_log`, `_relations`, `_validation`, `_backup_log`） |
| `WebApp.gs` | ✅ T005 核心 | Web Dashboard API（資料品質報告、匯出、系統統計） |
| `DataQuality.gs` | ✅ T005 核心 | 資料完整性檢查、品質掃描、缺失資料匯出 |

### 3.2 輔助腳本

| 檔案路徑 | 分類 | 理由 |
|---------|------|------|
| `T005_FieldNameResolver.js` | ⚠️ T005 周邊 | **DEPRECATED** - 欄位名稱映射（Legacy→Canonical），Phase 5 後已過時 |
| `T005-Product-Management-v3/scripts/T005_HeaderMigration.gs` | ⚠️ T005 周邊 | 表頭遷移工具（Legacy→Canonical v1.0） |

---

## 4. 引用 T005 的外部模組

### 4.1 模組依賴關係

| 模組 | 分類 | 依賴類型 | 關鍵檔案 |
|------|------|----------|---------|
| **C005** (Listing Checker) | ❌ 非 T005（引用） | Read-only Consumer | `Utils.js`, `Config.js`, `SYNC_T005_SALES_COMPANY.js` |
| **R020** (Price Comparator) | ❌ 非 T005（引用） | Read-only Consumer | `gas_api.js`, `Observer_DataAdapter.js` |
| **T030** (Margin Simulation) | ❌ 非 T005（引用） | Read-only Consumer | `T030_Config.js`, `T030_Service.js` |
| **MB035** (Restock Mailer) | ❌ 非 T005（引用） | Read-only Consumer | `Config.js`, `Sender.js` |
| **Observer-Mail** | ❌ 非 T005（引用） | Read-only Consumer | `R021_MarketIntel_Service.js` |

### 4.2 C005 模組 T005 引用明細

| 檔案 | 引用方式 | 讀/寫 | 說明 |
|------|----------|-------|------|
| `Utils.js` | `readT005Data()` | Read | Index-based 讀取 24 欄 |
| `Config.js` | `FIELD_MAPPING.T005` | Read | 欄位索引定義 |
| `SYNC_T005_SALES_COMPANY.js` | `refreshT005SalesCompanySeed()` | **Write** | ⚠️ 越界寫入 T005_SALES_COMPANY |
| `SalesCompanyService.js` | T005_SALES_COMPANY 查詢 | Read | 讀取可銷售公司對照 |
| `D001-Integration.js` | T005 Fallback | Read | D001 不可用時回退至 T005 |

### 4.3 R020 模組 T005 引用明細

| 檔案 | 引用方式 | 讀/寫 | 說明 |
|------|----------|-------|------|
| `gas_api.js` | SpreadsheetId 硬編碼 | Read | 直接引用 T005 SpreadsheetId |
| `Observer_DataAdapter.js` | Header-based | Read | 透過表頭名稱讀取 |
| `R020_C005Integration.js` | 整合 C005 | Read | 透過 C005 間接存取 T005 |

---

## 5. T005 核心識別標準

### 5.1 判斷為 T005 核心的條件

1. 位於 `T005-商品管理-Product-Mgmt/` 目錄下
2. 包含 UID 生成邏輯（`generateUID_()`）
3. 包含 T005 Schema 定義或初始化
4. 直接操作 T005 SpreadsheetId（`1MHeqKjpt7Iq1mV7OvLMYIqjr2UVIMgK1DJqFU3a8jSk`）
5. 包含 T005 同步邏輯（T002→T005）

### 5.2 判斷為 T005 周邊的條件

1. 位於封存/棄用目錄
2. 標記為 DEPRECATED
3. 僅包含遷移/相容性工具

### 5.3 判斷為非 T005（僅引用）的條件

1. 位於其他模組目錄
2. 僅讀取 T005 資料
3. 不包含 T005 Schema 定義
4. 不執行 T005 寫入（除 SYNC_T005_SALES_COMPANY.js 例外）

---

## 6. 結構化清單（完整）

### 6.1 ✅ T005 核心

| 完整路徑 | 檔案名稱 | 理由 |
|---------|---------|------|
| `BASE-SERVICES/T005-商品管理-Product-Mgmt/gas-scripts/UID.gs` | UID.gs | UID 生成核心邏輯 |
| `BASE-SERVICES/T005-商品管理-Product-Mgmt/gas-scripts/Core.gs` | Core.gs | 系統配置/日誌/備份核心 |
| `BASE-SERVICES/T005-商品管理-Product-Mgmt/gas-scripts/Main.gs` | Main.gs | 系統初始化主入口 |
| `BASE-SERVICES/T005-商品管理-Product-Mgmt/gas-scripts/Sync.gs` | Sync.gs | T002→T005 同步核心 |
| `BASE-SERVICES/T005-商品管理-Product-Mgmt/gas-scripts/SystemTables.gs` | SystemTables.gs | 系統表初始化 |
| `BASE-SERVICES/T005-商品管理-Product-Mgmt/gas-scripts/WebApp.gs` | WebApp.gs | Web API 核心 |
| `BASE-SERVICES/T005-商品管理-Product-Mgmt/gas-scripts/DataQuality.gs` | DataQuality.gs | 資料品質檢查核心 |

### 6.2 ⚠️ T005 周邊

| 完整路徑 | 檔案名稱 | 理由 |
|---------|---------|------|
| `BASE-SERVICES/T005_FieldNameResolver.js` | T005_FieldNameResolver.js | DEPRECATED - 欄位名稱映射工具 |
| `BASE-SERVICES/T005-Product-Management-v3/scripts/T005_HeaderMigration.gs` | T005_HeaderMigration.gs | 表頭遷移工具（非核心） |

### 6.3 ❌ 非 T005（僅引用）- 主要檔案

| 完整路徑 | 檔案名稱 | 理由 |
|---------|---------|------|
| `BASE-SERVICES/C005-Listing-Checker/webapp/Utils.js` | Utils.js | C005 模組，唯讀引用 T005 |
| `BASE-SERVICES/C005-Listing-Checker/webapp/Config.js` | Config.js | C005 模組，欄位映射定義 |
| `BASE-SERVICES/C005-Listing-Checker/webapp/SYNC_T005_SALES_COMPANY.js` | SYNC_T005_SALES_COMPANY.js | C005 模組，**越界寫入**（需裁定） |
| `BASE-SERVICES/R020-Price-Comparator/gas_api.js` | gas_api.js | R020 模組，唯讀引用 T005 |
| `BASE-SERVICES/R020-Price-Comparator/_clasp-observer-mail/Observer_DataAdapter.js` | Observer_DataAdapter.js | Observer 模組，唯讀引用 T005 |
| `BASE-SERVICES/T030-Margin-Simulation-Center/config/T030_Config.js` | T030_Config.js | T030 模組，唯讀引用 T005 |
| `BASE-SERVICES/T030-Margin-Simulation-Center/api/T030_Service.js` | T030_Service.js | T030 模組，唯讀引用 T005 |
| `BASE-SERVICES/MB035-Restock-Decision-Mailer/Config.js` | Config.js | MB035 模組，唯讀引用 T005 |
| `BASE-SERVICES/C005-Listing-Checker/webapp/D001-Integration.js` | D001-Integration.js | C005 模組，T005 Fallback |

---

## 7. T005 Canonical Schema 確認

### 7.1 SSOT 來源

- **文件**: `HORUS-FACTS/T005/T005_SHEET_SCHEMA_CANONICAL.md`
- **SpreadsheetId**: `1MHeqKjpt7Iq1mV7OvLMYIqjr2UVIMgK1DJqFU3a8jSk`
- **主資料表**: `T005-1.商品主表`
- **欄位數**: 24 欄（Col 1-24）

### 7.2 Schema 引用一致性

| 模組 | 引用方式 | 與 SSOT 一致 |
|------|----------|--------------|
| T005 Core | 直接定義 | ✅ 是 |
| C005 | Index-based (0-23) | ✅ 是 |
| R020 | Header-based + Fallback | ✅ 是 |
| T030 | Header-based | ✅ 是 |

---

## 8. 裁定待辦

| 項目 | 類型 | 說明 |
|------|------|------|
| `SYNC_T005_SALES_COMPANY.js` 歸屬 | ADR | 位於 C005 但寫入 T005 相關資料 |
| `T005_FieldNameResolver.js` 處置 | Governance | DEPRECATED 檔案是否刪除 |
| `T005-Product-Management-v3` 封存 | Governance | 確認是否可安全刪除 |

---

## 9. 證據索引

| 發現 | 檔案 | 位置/函數 |
|------|------|----------|
| UID 生成邏輯 | UID.gs | `generateUID_()` |
| T002→T005 同步 | Sync.gs | `syncFromT002_()` |
| 系統初始化 | Main.gs | `建立T005商品庫系統v33()` |
| SpreadsheetId 引用 | gas_api.js | 硬編碼常數 |
| C005 越界寫入 | SYNC_T005_SALES_COMPANY.js | `refreshT005SalesCompanySeed()` |

---

**本文件為 T005 Canonical Root Discovery 產出，僅供識別與分類，不包含裁定。**
