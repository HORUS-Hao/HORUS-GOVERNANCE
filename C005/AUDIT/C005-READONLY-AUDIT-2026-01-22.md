# C005-Listing-Checker 唯讀審計報告

**版本**: v1.0
**審計日期**: 2026-01-22
**審計範圍**: `C005-Listing-Checker/webapp/`
**性質**: Read-only Audit（禁止修改、僅供分析）

---

## 1. 模組實際職責（以檔案為單位）

| 檔案 | 主要職責 | 資料存取權 | 關鍵函數 |
|------|---------|-----------|---------|
| **Code.js** | Web App 入口、RPC API 暴露層 | R | `doGet`, `getT005Data`, `performComparison`, `processUploadedFile` |
| **Config.js** | 單一真理來源配置（環境/平台/欄位映射） | N/A | `getCurrentEnvironment`, `getEnabledPlatforms`, `resolveT005FieldName` |
| **Utils.js** | T005 資料讀取、D001 整合層 | R(T005 Sheet) | `readT005Data`, `getT005FromD001`, `normalizeT005Product` |
| **ComparisonEngine.js** | 三向比對核心邏輯（ERP↔平台↔T005） | N/A（純計算） | `executeComparison`, `buildBaseProducts`, `markAnomalies` |
| **ERPProcessor.js** | ERP Excel 資料處理/標準化 | N/A（純轉換） | `processERPData`, `identifyERPFields`, `groupByWarehouse` |
| **PlatformProcessor.js** | 電商平台資料處理（MOMO/PChome/Yahoo/Shopee） | N/A（純轉換） | `processPlatformData`, `mapPlatformStatus`, `groupByProduct` |
| **HistoryManager.js** | 比對歷史記錄管理 | R/W(History Sheet) | `saveComparisonHistory`, `getComparisonHistoryList` |
| **ExportUtils.js** | 匯出 Excel/Sheet（角色權限過濾） | W(Export Sheet) | `exportComparisonResults`, `createExcelBlob` |
| **ExternalCanonical.js** | 外部欄位 SSOT、角色權限定義 | N/A（純定義） | `EXTERNAL_CANONICAL_COLUMNS`, `USER_ROLES`, `EXPORT_SCHEMA` |
| **D001-Integration.js** | D001 Data Hub 整合層（含 Fallback） | R(via D001 Library) | `D001Service.getProducts`, `D001Service.batchGetByUIDs` |
| **SYNC_T005_SALES_COMPANY.js** | T005_SALES_COMPANY 同步腳本 | R/W(T005_SALES_COMPANY) | `refreshT005SalesCompanySeed`, `assertWritePermission` |

---

## 2. 實際資料流（FACT / DERIVED / GOVERNANCE）

### 2.1 資料分類

```
┌─────────────────────────────────────────────────────────────────┐
│                         FACT 層（原始事實）                       │
├─────────────────────────────────────────────────────────────────┤
│ • T005-1.商品主表 (Google Sheet) → readT005Data()               │
│   - 24 欄 Canonical Schema（UID/供應商/PM/品牌/型號/名稱...）      │
│   - 5 分鐘快取（CACHE_EXPIRY: 300000ms）                         │
│                                                                 │
│ • ERP Excel（用戶上傳）→ processERPData()                        │
│   - 產品編號 + 倉庫名稱 + 庫存數量                                 │
│                                                                 │
│ • 平台 Excel/CSV（用戶上傳）→ processPlatformData()               │
│   - 廠商料號 + 商品名稱 + 狀態欄位                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      DERIVED 層（衍生計算）                       │
├─────────────────────────────────────────────────────────────────┤
│ • buildBaseProducts() - 建立比對基準（T005 + ERP 聯集）           │
│ • compareWithPlatforms() - 平台上架狀態匹配                       │
│ • compareWithERP() - ERP 庫存比對                                │
│ • mergeComparisonResults() - 三向比對結果整合                     │
│ • markAnomalies() - 異常標記（has_stock_not_listed 等）           │
│ • calculateStatistics() - 統計資訊計算                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     GOVERNANCE 層（治理控制）                     │
├─────────────────────────────────────────────────────────────────┤
│ • Config.js → T005_CANONICAL_FIELDS / T005_LEGACY_TO_CANONICAL   │
│ • Config.js → CONFIG.PLATFORM_STATUS（平台狀態單一真理來源）      │
│ • Config.js → CONFIG.FIELD_MAPPING.ERP/T005（欄位映射）           │
│ • ExternalCanonical.js → USER_ROLES（OWNER/ADMIN/INTERNAL/VIEWER）│
│ • ExternalCanonical.js → EXPORT_SCHEMA（角色可見欄位控制）        │
│ • SYNC_T005_SALES_COMPANY.js → ALLOWED_WRITE_FUNCTIONS（寫入白名單）│
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 資料流向圖

```
[T005 Sheet] ──readT005Data()──→ [Utils.js] ──→ [Code.js/getT005Data]
                                      ↓
[ERP Excel] ──processERPData()──→ [ERPProcessor.js]──┐
                                                     ↓
[Platform Excel] ──processPlatformData()──→ [PlatformProcessor.js]──┐
                                                                    ↓
                                          [ComparisonEngine.js/executeComparison]
                                                     ↓
                                          [HistoryManager.js] ←── WRITE
                                                     ↓
                                          [ExportUtils.js] ←── WRITE (匯出)
```

---

## 3. 隱性耦合與越權風險

### 3.1 硬耦合風險 🔴

| 風險等級 | 檔案 | 問題描述 | 位置 |
|---------|------|---------|------|
| **HIGH** | Utils.js | T005 欄位索引硬編碼（row[0]~row[23]） | Lines 82-101 |
| **HIGH** | Utils.js | 24 欄 Schema 假設無防禦性驗證 | `normalizeT005Product()` |
| **MEDIUM** | Config.js | DEPLOYMENT_ID 硬編碼於程式碼中 | Lines 71, 107-114 |
| **MEDIUM** | PlatformProcessor.js | `CONFIG.PLATFORM_STATUS` 依賴路徑未做 null-check | Lines 637-646 |

### 3.2 越權風險 🔴

| 風險等級 | 檔案 | 問題描述 | 證據 |
|---------|------|---------|------|
| **HIGH** | SYNC_T005_SALES_COMPANY.js | 可寫入 T005_SALES_COMPANY Sheet | `refreshT005SalesCompanySeed()` |
| **MEDIUM** | HistoryManager.js | 可建立/刪除 History Sheet 工作表 | `saveComparisonHistory()`, `deleteComparisonHistory()` |
| **MEDIUM** | ExportUtils.js | 可寫入 Google Drive（匯出 Excel） | `createExcelBlob()` |
| **LOW** | Code.js | RPC 暴露 `diag_*` 診斷函數（資訊洩漏風險） | Lines 690-1092 |

### 3.3 隱性耦合識別

```
┌───────────────────────────────────────────────────────────────┐
│ 耦合 1: Utils.js ←→ T005 Sheet Schema                         │
│ • 硬編碼 24 欄索引，Sheet 欄位變動將導致 silent failure        │
│ • 無 runtime schema 驗證                                       │
├───────────────────────────────────────────────────────────────┤
│ 耦合 2: ComparisonEngine.js ←→ Config.js                       │
│ • 依賴 CONFIG.COMPARISON.ERP_WAREHOUSES 預設值                 │
│ • 倉庫名稱模糊匹配（indexOf）可能誤判                          │
├───────────────────────────────────────────────────────────────┤
│ 耦合 3: PlatformProcessor.js ←→ CONFIG.PLATFORM_STATUS         │
│ • 平台狀態映射依賴 Config 定義，缺少 fallback                   │
│ • 新平台加入需同時修改多處                                      │
├───────────────────────────────────────────────────────────────┤
│ 耦合 4: Code.js ←→ 所有處理模組                                │
│ • RPC 層直接呼叫處理函數，無中介層隔離                          │
│ • 錯誤處理依賴各模組自行實作                                    │
└───────────────────────────────────────────────────────────────┘
```

---

## 4. 與 T005 / T002 / C020 的責任邊界

### 4.1 責任矩陣

| 能力 | T005 (商品主表) | T002 (待確認) | C020 (待確認) | C005 (本模組) |
|------|----------------|---------------|---------------|---------------|
| 商品主資料 CRUD | ✅ 唯一寫入者 | - | - | ❌ 唯讀 |
| UID 主鍵維護 | ✅ Owner | - | - | ❌ Consumer |
| 上架狀態比對 | - | - | - | ✅ 唯一執行者 |
| 平台資料處理 | - | - | - | ✅ 唯一執行者 |
| 比對歷史儲存 | - | - | - | ✅ 唯一寫入者 |
| T005_SALES_COMPANY 同步 | ⚠️ 越界風險 | - | - | ⚠️ 應移除或隔離 |

### 4.2 邊界違規分析

**SYNC_T005_SALES_COMPANY.js 越界風險**:
- 此檔案屬於 C005 但寫入 T005_SALES_COMPANY Sheet
- 違反「C005 對 T005 唯讀」原則
- 建議：遷移至 T005 模組或建立獨立 SYNC 服務

**Utils.js readT005Data() 責任清晰**:
- 正確：僅讀取 T005-1.商品主表，不執行寫入
- 符合 C005 對 T005 的唯讀消費者角色

---

## 5. Phase 拆分與 Freeze 建議

### 5.1 Phase 拆分建議

```
┌─────────────────────────────────────────────────────────────────┐
│ Phase 1: Core（可 Freeze）                                      │
├─────────────────────────────────────────────────────────────────┤
│ • Config.js          - SSOT 配置（已穩定）                       │
│ • ExternalCanonical.js - 欄位/角色定義（已穩定）                  │
│ • Utils.js           - T005 讀取層（需 schema 驗證加固後 Freeze）│
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Phase 2: Processing（可 Freeze）                                 │
├─────────────────────────────────────────────────────────────────┤
│ • ERPProcessor.js    - ERP 處理邏輯（已穩定）                     │
│ • PlatformProcessor.js - 平台處理邏輯（已穩定，狀態映射完整）     │
│ • ComparisonEngine.js - 比對引擎（核心邏輯完整）                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Phase 3: I/O（需審慎評估）                                       │
├─────────────────────────────────────────────────────────────────┤
│ • Code.js            - RPC 層（診斷函數需評估移除）               │
│ • HistoryManager.js  - 歷史管理（寫入權限需控制）                 │
│ • ExportUtils.js     - 匯出功能（角色權限需強化）                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Phase X: Isolation Required（需隔離/遷移）                       │
├─────────────────────────────────────────────────────────────────┤
│ • SYNC_T005_SALES_COMPANY.js - 越界寫入，建議遷移至 T005 或獨立服務│
│ • D001-Integration.js - 依賴外部服務，需評估 fallback 完整性      │
└─────────────────────────────────────────────────────────────────┘
```

### 5.2 Freeze 條件

| 模組 | Freeze 條件 | 當前狀態 |
|------|------------|---------|
| Config.js | 無重大配置變更 | ✅ 可 Freeze |
| ExternalCanonical.js | 欄位定義穩定 | ✅ 可 Freeze |
| Utils.js | 加入 schema runtime 驗證 | ⚠️ 條件 Freeze |
| ERPProcessor.js | 無新欄位需求 | ✅ 可 Freeze |
| PlatformProcessor.js | 無新平台加入 | ✅ 可 Freeze |
| ComparisonEngine.js | 比對邏輯穩定 | ✅ 可 Freeze |
| Code.js | 移除/保護 diag_* 函數 | ⚠️ 條件 Freeze |
| HistoryManager.js | 權限控制完善 | ⚠️ 條件 Freeze |
| SYNC_T005_SALES_COMPANY.js | 遷移至獨立服務 | ❌ 需隔離 |

---

## 6. 風險彙總表

| 風險 ID | 類型 | 嚴重度 | 檔案 | 描述 | 建議行動 |
|---------|------|--------|------|------|---------|
| R-001 | 越權 | HIGH | SYNC_T005_SALES_COMPANY.js | 寫入 T005_SALES_COMPANY 越界 | 遷移至 T005 模組 |
| R-002 | 耦合 | HIGH | Utils.js | T005 24欄硬編碼無驗證 | 加入 runtime schema check |
| R-003 | 資訊洩漏 | MEDIUM | Code.js | diag_* 暴露內部資訊 | 移除或加權限控制 |
| R-004 | 耦合 | MEDIUM | PlatformProcessor.js | PLATFORM_STATUS 無 fallback | 加入防禦性 null-check |
| R-005 | 維護性 | MEDIUM | Config.js | DEPLOYMENT_ID 硬編碼 | 遷移至 ScriptProperties |

---

## 附錄 A: T005 Canonical Schema（Utils.js 依賴）

```javascript
// T005 Canonical Schema (24 columns):
//   Col 1-6:   核心識別欄位 (uid, supplier, pm, brand, model, name)
//   Col 7-9:   分類欄位 (categoryMajor, categoryMiddle, categorySmall)
//   Col 10-15: 價格欄位 (realCostNoTax, costNoTax, costWithTax, marketPrice, suggestedPrice, profitMargin)
//   Col 16-18: 管理欄位 (status, barcode, paymentTerms)
//   Col 19-21: 業務欄位 (notes, createDateTime, updateDateTime)
//   Col 22-23: 系統欄位 (同步來源, 同步時間) - 不讀取
//   Col 24:    營運欄位 (ownerCompany)
```

---

## 附錄 B: RPC 寫入權限白名單

```javascript
// SYNC_T005_SALES_COMPANY.js
var ALLOWED_WRITE_FUNCTIONS = [
  'refreshT005SalesCompanySeed',
  'repairT005SalesCompanySchema'
];
```

---

## 文件資訊

| 項目 | 內容 |
|------|------|
| 文件類型 | GOVERNANCE / DERIVED |
| 產出工具 | Claude Code (Opus 4.5) |
| 審計模式 | Read-only Audit |
| Commit 狀態 | 待 Architect 裁定 |
