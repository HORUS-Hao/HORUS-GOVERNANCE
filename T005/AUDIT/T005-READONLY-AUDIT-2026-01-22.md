# T005 Product Master — Full Blind Read-only Audit

- **Audit Date**: 2026-01-22
- **Mode**: Read-only Blind Audit
- **Scope**: `T005-商品管理-Product-Mgmt/` (Canonical Root Only)
- **Premise**: 不假設 T005 是「唯一正確」，僅根據程式碼事實判斷

---

## 1. 模組實際職責（逐檔案）

### 1.1 Core.gs

| 項目 | 內容 |
|------|------|
| **實際責任** | 系統配置管理、日誌記錄、備份執行、分散式鎖定 |
| **建表** | 無（依賴 SystemTables.gs 建立的表） |
| **寫入** | `_config`（配置讀寫）、`_log`（日誌追加）、`_validation`（驗證記錄）、`_backup_log`（備份記錄） |
| **修復** | 無 |
| **驗證** | `validate_()` - 記錄驗證結果 |
| **API** | `getConfig_()`, `setConfig_()`, `log_()`, `backup_()`, `withLock_()` |
| **接觸 Sheet** | `_config`, `_log`, `_validation`, `_backup_log` |

**風險發現**：
- `backup_()` 會自動刪除舊備份（`cleanupOldBackups_()`），無確認機制
- `setConfig_()` 可任意修改配置，無權限控制

---

### 1.2 Main.gs

| 項目 | 內容 |
|------|------|
| **實際責任** | 系統初始化主入口、業務表建立、格式設定 |
| **建表** | 11 個業務表（`T005-1.商品主表` 至 `T005-11.刪除商品記錄表`） |
| **寫入** | 所有業務表（建立時寫入標題列）、下拉選單驗證規則 |
| **修復** | 無 |
| **驗證** | `validateSystemSetup_()` - 檢查必要 Sheet 是否存在 |
| **API** | `建立T005商品庫系統v33()`, `onOpen()` |
| **接觸 Sheet** | 所有 16 個 Sheet（11 業務 + 5 系統） |

**風險發現**：
- `建立T005商品庫系統v33()` 可重複執行，但不會覆蓋現有 Sheet（跳過邏輯）
- Schema 硬編碼在 `getBusinessSheetsConfig_()` 中，共 **28 欄**（T005-1）
- `setDropdownValidations_()` 設定至 1000 列，超過後無保護

---

### 1.3 UID.gs

| 項目 | 內容 |
|------|------|
| **實際責任** | UID 生成、驗證、關聯管理 |
| **建表** | 無 |
| **寫入** | `_relations`（關聯建立）、`_log`（間接）、`_validation`（間接） |
| **修復** | 無 |
| **驗證** | `validateUID_()`, `checkUIDUniqueness_()` |
| **API** | `generateUID_()`, `batchGenerateUID_()`, `createRelation_()`, `getRelations_()` |
| **接觸 Sheet** | `T005-1.商品主表`, `_relations` |

**UID 格式**：`{System}_{YYYYMMDD}_{Sequence}`（例：`T005_20261022_1001`）

**風險發現**：
- `getNextSequence_()` 每次掃描整個主表取得最大序號，**O(n) 效能問題**
- 無鎖定機制，高併發時可能產生重複 UID
- UID 驗證 pattern 預設為 `^[A-Z0-9]+_\d{8}_\d{4}$`，但可被配置覆蓋

---

### 1.4 Sync.gs

| 項目 | 內容 |
|------|------|
| **實際責任** | T002→T005 同步、Notion 雙向同步、衝突解決 |
| **建表** | 無 |
| **寫入** | `T005-1.商品主表`（建立/更新商品）、`_relations`（建立關聯）、`_log`、`_validation` |
| **修復** | 無 |
| **驗證** | `validateT002Data_()` |
| **API** | `syncT002ToT005()`, `syncT005ToNotion()` |
| **接觸 Sheet** | `T005-1.商品主表`, `T002-原料庫`（外部）, `_relations`, `_log`, `_validation` |

**風險發現**：
- 同步前可選擇性備份（`backup.beforeSync` 配置）
- 衝突解決策略：`T005-priority`（預設）、`T002-priority`、`manual`、`timestamp`
- `createT005Product_()` 直接 `appendRow()`，無交易控制
- `updateT005Product_()` 逐欄更新，非批次操作

---

### 1.5 SystemTables.gs

| 項目 | 內容 |
|------|------|
| **實際責任** | 5 個系統表初始化、預設配置寫入 |
| **建表** | `_config`, `_log`, `_relations`, `_validation`, `_backup_log` |
| **寫入** | 所有 5 個系統表（建立標題列）、`_config`（預設配置） |
| **修復** | 無（但可重建現有表，會清除資料） |
| **驗證** | `checkSystemTables()` |
| **API** | `initSystemTables()`, `resetSystemTables()` |
| **接觸 Sheet** | `_config`, `_log`, `_relations`, `_validation`, `_backup_log` |

**風險發現**：
- `resetSystemTables()` 是危險操作，會清除所有系統資料
- 預設配置包含硬編碼的品牌、類別、平台清單
- `initDefaultConfig_()` 寫入 22 筆預設配置

---

### 1.6 WebApp.gs

| 項目 | 內容 |
|------|------|
| **實際責任** | Web Dashboard API 端點 |
| **建表** | 無 |
| **寫入** | `_log`（API 呼叫日誌） |
| **修復** | 無 |
| **驗證** | 無 |
| **API** | `doGet()`, `apiGetQualityReport()`, `apiExportMissingData()`, `apiGetFilterOptions()`, `apiGetSystemStats()` |
| **接觸 Sheet** | `T005-1.商品主表`, `_log` |

**風險發現**：
- `doGet()` 暴露 Web App 入口，無權限驗證
- `apiExportMissingData()` 會建立新試算表（寫入 Google Drive）
- `setXFrameOptionsMode(ALLOWALL)` 允許任何來源 iframe 嵌入

---

### 1.7 DataQuality.gs

| 項目 | 內容 |
|------|------|
| **實際責任** | 資料完整性掃描、品質報告、缺失資料匯出 |
| **建表** | 無（但 `exportMissingDataToExcel()` 會建立新試算表） |
| **寫入** | `_log`（間接）、新試算表（匯出時） |
| **修復** | 無 |
| **驗證** | `loadValidationRules_()`, `checkProductCompleteness_()` |
| **API** | `scanDataQuality()`, `exportMissingDataToExcel()`, `getBrandList()`, `getCategoryList()` |
| **接觸 Sheet** | `T005-1.商品主表` |

**風險發現**：
- `loadValidationRules_()` 目前硬編碼規則（TODO 註解顯示應從 Drive 讀取）
- 完整度計算公式：核心 40% + 業務 30% + 建議 30%
- 驗證欄位與 Schema Contract 使用 Canonical 名稱，但 validation-rules JSON 仍使用 Legacy 名稱

---

## 2. 實際資料層級重建（FACT / DERIVED / GOVERNANCE）

### 2.1 FACT 層（原始事實資料）

| Sheet | 判定 | 理由 |
|-------|------|------|
| `T005-1.商品主表` | **FACT** | 商品主資料，是下游系統的唯一真實來源 |
| `T005-2.商品命名規範表` | **FACT** | 平台商品名稱，為業務產出物 |
| `T005-3.商品功能規格表` | **FACT** | 商品規格，為業務產出物 |
| `T005-4.商品尺寸重量表` | **FACT** | 物流數據，為業務產出物 |
| `T005-5.商品價格表` | **FACT** | 價格資料，為業務產出物 |

### 2.2 名義 FACT 實際 DERIVED

| Sheet | 判定 | 理由 |
|-------|------|------|
| `T005-6.圖庫狀態追蹤表` | **DERIVED** | 追蹤 P005 狀態，非原始資料 |
| `T005-7.商品生命週期表` | **DERIVED** | 狀態追蹤，可從其他資料推算 |
| `T005-8.類別專屬資料管理表` | **DERIVED** | T009 關聯狀態追蹤 |
| `T005-9.平台輸出管理表` | **DERIVED** | 同步狀態追蹤，非原始資料 |
| `T005-10.商品變更追蹤表` | **DERIVED** | 變更日誌，為衍生記錄 |
| `T005-11.刪除商品記錄表` | **DERIVED** | 軟刪除記錄，為衍生記錄 |

### 2.3 GOVERNANCE 層

| Sheet | 判定 | 理由 |
|-------|------|------|
| `_config` | **GOVERNANCE** | 系統配置規則 |
| `_log` | **GOVERNANCE** | 操作日誌（稽核用） |
| `_relations` | **GOVERNANCE** | 模組關聯定義 |
| `_validation` | **GOVERNANCE** | 驗證記錄（稽核用） |
| `_backup_log` | **GOVERNANCE** | 備份記錄（稽核用） |

---

## 3. 寫入權限與高風險行為盤點

### 3.1 所有可寫入點

| 檔案 | 函數 | 目標 Sheet | 寫入類型 |
|------|------|------------|---------|
| Main.gs | `createBusinessSheets_()` | 所有業務表 | 建立表/標題列 |
| Main.gs | `setDropdownValidations_()` | 所有業務表 | 資料驗證規則 |
| SystemTables.gs | `init_*Table_()` | 5 系統表 | 建立表/標題列 |
| SystemTables.gs | `initDefaultConfig_()` | `_config` | 預設配置 |
| Core.gs | `setConfig_()` | `_config` | 配置更新 |
| Core.gs | `log_()` | `_log` | 日誌追加 |
| Core.gs | `validate_()` | `_validation` | 驗證記錄 |
| Core.gs | `backup_()` | `_backup_log` | 備份記錄 |
| UID.gs | `createRelation_()` | `_relations` | 關聯建立 |
| UID.gs | `updateRelationStatus_()` | `_relations` | 關聯更新 |
| UID.gs | `deleteRelation_()` | `_relations` | 關聯刪除 |
| Sync.gs | `createT005Product_()` | `T005-1.商品主表` | 商品新增 |
| Sync.gs | `updateT005Product_()` | `T005-1.商品主表` | 商品更新 |
| DataQuality.gs | `exportMissingDataToExcel()` | **新試算表** | 建立新檔 |

### 3.2 高風險行為

| 風險類型 | 檔案 | 函數 | 說明 |
|---------|------|------|------|
| **自動刪除** | Core.gs | `cleanupOldBackups_()` | 自動刪除舊備份，無確認 |
| **表結構重建** | SystemTables.gs | `init_*Table_()` | 可重建現有表，清除所有資料 |
| **無確認寫入** | Sync.gs | `createT005Product_()` | 直接 appendRow，無交易控制 |
| **批次同步** | Sync.gs | `syncT002ToT005()` | 批次處理，失敗不回滾 |
| **外部寫入** | DataQuality.gs | `exportMissingDataToExcel()` | 建立新試算表至 Google Drive |
| **配置覆寫** | Core.gs | `setConfig_()` | 可覆寫任何配置，無權限驗證 |

### 3.3 不存在的保護

| 期望 | 實際 |
|------|------|
| Schema 變更前驗證 | 無 |
| 欄位刪除保護 | 無 |
| 資料回滾機制 | 無 |
| 權限分層控制 | 無 |

---

## 4. Schema 假設與耦合點

### 4.1 欄位索引依賴

| 檔案 | 依賴方式 | 風險 |
|------|---------|------|
| UID.gs | `data[i][0]`（UID 在第一欄） | 高 - 欄位順序變更會破壞 |
| Sync.gs | `headers.indexOf()` | 中 - Header-based，需欄位名稱正確 |
| DataQuality.gs | `headers.indexOf()` | 中 - Header-based |

### 4.2 欄位名稱依賴

**Canonical Schema v1.0**（已啟用）：
- `UID`, `品牌`, `商品型號`, `商品名稱`, `商品大類`, `商品中類`, `商品小類`

**Legacy Names**（仍存在於 JSON 配置）：
- `UID（主鍵）`, `品牌（標準化）`, `商品型號（標準化）`, `商品名稱（主標）`, `商品分類（大）`

**Schema 不一致**：

| 位置 | 欄位名稱格式 | 狀態 |
|------|-------------|------|
| GAS 程式碼 | Canonical | 已遷移 |
| Main.gs Schema | 混合 | 部分 Legacy |
| field-mapping.json | Legacy | 未遷移 |
| validation-rules.json | Legacy | 未遷移 |

### 4.3 欄位異動破壞半徑

| 變更類型 | 影響範圍 |
|---------|---------|
| 新增欄位（尾部） | 低 - 僅需更新 Main.gs schema |
| 刪除欄位 | **高** - 所有 indexOf 查詢失敗 |
| 重新排序欄位 | **高** - Index-based 查詢失敗 |
| 重命名欄位 | **中** - Header-based 查詢失敗 |

### 4.4 無 Runtime Schema 驗證

| 期望 | 實際 |
|------|------|
| 啟動時驗證 Schema 版本 | 無 |
| 讀取前驗證欄位存在 | 無 |
| 欄位數量防禦性檢查 | 無 |

---

## 5. 外部依賴與 API 角色

### 5.1 外部模組依賴 T005 方式

| 模組 | 角色 | 依賴檔案 | 存取方式 |
|------|------|---------|---------|
| **C005** | Read-only Consumer | Utils.js | Index-based (col 0-23) |
| **R020** | Read-only Consumer | gas_api.js | Header-based + Fallback |
| **T030** | Read-only Consumer | T030_Config.js | Header-based |
| **Observer-Mail** | Read-only Consumer | Multiple | Header-based |

### 5.2 T005 作為 API 提供者

| API 層級 | 函數 | 說明 |
|---------|------|------|
| **RPC（選單）** | `menuSyncT002ToT005()` | UI 觸發同步 |
| **RPC（選單）** | `menuSyncT005ToNotion()` | UI 觸發 Notion 同步 |
| **Web App** | `doGet()` | Dashboard 入口 |
| **Web App** | `apiGetQualityReport()` | 品質報告 API |
| **Web App** | `apiGetFilterOptions()` | 篩選選項 API |
| **Web App** | `apiGetSystemStats()` | 系統統計 API |
| **Web App** | `apiExportMissingData()` | 匯出 API（會建立新檔案） |

### 5.3 隱性 API 合約

| 合約 | 來源 | 風險 |
|------|------|------|
| UID 格式 `{System}_{YYYYMMDD}_{Sequence}` | UID.gs | 高 - 外部模組假設此格式 |
| 主表欄位順序 | Main.gs | 高 - C005 使用 Index-based |
| Canonical 欄位名稱 | Schema Contract | 中 - JSON 配置未同步 |
| SpreadsheetId | （未在程式碼中硬編碼） | 低 - 由 getActiveSpreadsheet() |

### 5.4 T005 對外部的依賴

| 依賴目標 | 依賴方式 | 說明 |
|---------|---------|------|
| **T002** | `t002.spreadsheet_id` 配置 | 同步來源 |
| **Notion** | `notion.token`, `notion.database_id` 配置 | 同步目標 |
| **Google Drive** | `backup.folder_id` 配置 | 備份目標 |

---

## 6. Phase 拆分建議（僅觀察，不裁定）

### 6.1 高度穩定區塊（建議先凍結）

| 區塊 | 檔案 | 理由 |
|------|------|------|
| **UID 生成** | UID.gs | 核心功能，格式已標準化 |
| **配置管理** | Core.gs (`getConfig_`, `setConfig_`) | 基礎設施，廣泛使用 |
| **日誌系統** | Core.gs (`log_`, `validate_`) | 稽核功能，不應變動 |
| **系統表 Schema** | SystemTables.gs | 結構已穩定 |

### 6.2 高風險區塊（需審慎處理）

| 區塊 | 檔案 | 風險 |
|------|------|------|
| **T002 同步** | Sync.gs | 跨模組依賴，衝突解決策略複雜 |
| **Notion 同步** | Sync.gs | 外部 API 依賴，欄位映射未完全遷移 |
| **備份清理** | Core.gs (`cleanupOldBackups_`) | 自動刪除，無確認 |
| **表重建** | SystemTables.gs (`init_*Table_`) | 可清除現有資料 |

### 6.3 應被隔離成服務

| 功能 | 現況 | 建議 |
|------|------|------|
| **Web Dashboard** | 嵌入 T005 | 應獨立為 UI 服務 |
| **資料品質報告** | 嵌入 T005 | 可獨立為 Audit 服務 |
| **Excel 匯出** | 嵌入 T005 | 應獨立為 Export 服務 |
| **Notion 同步** | 嵌入 T005 | 應獨立為 Sync Adapter |

### 6.4 Schema 不一致需修復

| 位置 | 問題 | 優先級 |
|------|------|--------|
| `field-mapping.json` | 使用 Legacy 欄位名稱 | 高 |
| `validation-rules-v3.4.json` | 使用 Legacy 欄位名稱 | 高 |
| `Main.gs` 業務表 Schema | 部分欄位名稱不一致 | 中 |
| `DataQuality.gs` 規則 | 硬編碼 vs JSON 不同步 | 中 |

---

## 附錄 A：程式碼證據索引

| 發現 | 檔案 | 位置 |
|------|------|------|
| UID 生成格式 | UID.gs | `generateUID_()` Line 18-27 |
| 序號掃描效能 | UID.gs | `getNextSequence_()` Line 46-77 |
| 業務表 Schema | Main.gs | `getBusinessSheetsConfig_()` Line 175-300 |
| 衝突解決策略 | Sync.gs | `resolveConflict_()` Line 551-603 |
| 備份自動刪除 | Core.gs | `cleanupOldBackups_()` Line 257-291 |
| 驗證規則硬編碼 | DataQuality.gs | `loadValidationRules_()` Line 23-60 |
| Web App 權限 | WebApp.gs | `doGet()` Line 21-47 |
| Schema Contract | T005_Canonical_Schema_Contract.md | 全文件 |

---

## 附錄 B：Sheet 清單

### 業務表（11 個）

1. `T005-1.商品主表` - 28 欄
2. `T005-2.商品命名規範表` - 15 欄
3. `T005-3.商品功能規格表` - 22 欄
4. `T005-4.商品尺寸重量表` - 19 欄
5. `T005-5.商品價格表` - 25 欄
6. `T005-6.圖庫狀態追蹤表` - 15 欄
7. `T005-7.商品生命週期表` - 12 欄
8. `T005-8.類別專屬資料管理表` - 11 欄
9. `T005-9.平台輸出管理表` - 14 欄
10. `T005-10.商品變更追蹤表` - 11 欄
11. `T005-11.刪除商品記錄表` - 10 欄

### 系統表（5 個）

1. `_config` - 6 欄（類別/配置鍵/配置值/資料型態/更新時間/說明）
2. `_log` - 6 欄
3. `_relations` - 10 欄
4. `_validation` - 5 欄
5. `_backup_log` - 6 欄

---

## 附錄 C：風險等級摘要

| 風險等級 | 項目 |
|---------|------|
| **高** | UID 序號掃描無鎖定、自動備份刪除無確認、表重建會清資料 |
| **中** | Schema JSON 與程式碼不一致、Web App 無權限驗證、欄位名稱混用 |
| **低** | Notion 同步可選、下拉選單超過 1000 列無保護 |

---

**本文件為 Blind Audit 產出，所有結論皆可追溯至程式碼路徑。**
**不假設任何設計是合理的，僅基於事實判斷。**
**不包含最終裁定，僅提供可供裁定之事實與風險輪廓。**
