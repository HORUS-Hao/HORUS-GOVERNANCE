# C005 Governance Alignment Audit

- Module: C005 (Listing Checker / 上架檢查器)
- File: C005-GOVERNANCE-ALIGNMENT-AUDIT.md
- Version: v1.0.0
- Audit Date: 2026-01-08
- Status: **Read-Only Inventory**
- Reference Blueprint: V005 Phase 2 治理結構
- Related Documents:
  - GLOBAL/DATA-CONTRACT-COMPANY.md
  - GLOBAL/DATA-CONTRACT-USER.md
  - GLOBAL/DATA-CONTRACT-STAMP.md
- Source Files:
  - `C005-Listing-Checker/webapp/Config.js`
  - `C005-Listing-Checker/webapp/Code.js`
  - `C005-Listing-Checker/webapp/Utils.js`
  - `C005-Listing-Checker/webapp/ComparisonEngine.js`
  - `C005-Listing-Checker/webapp/PlatformProcessor.js`

---

## 一、Purpose

本文件對 C005 模組進行治理對齊盤點，與 GLOBAL Data Contract 對照。

**特別檢查項目**：
- 狀態是否隱含公司假設
- 是否存在單一操作者預設
- 是否有跨平台狀態混用風險

**限制聲明**：
- ❌ 不修改任何程式碼
- ❌ 不提出 migration 方案
- ❌ 不新增欄位

---

## 二、模組狀態盤點

### 2.1 模組基本資訊

| 項目 | 狀態 |
|------|------|
| 模組 ID | C005 |
| 模組名稱 | Listing Checker / 上架檢查器 |
| 版本 | v2.1.0 |
| 系統狀態 | ✅ **已實作** |
| 程式碼位置 | ✅ 在本次工程倉內 |
| 健診可行性 | ✅ 可進行完整健檢 |

### 2.2 模組定位

C005 是**電商平台上架狀態比對工具**：
- 比對 ERP 庫存 ↔ 電商平台 ↔ T005 商品主檔
- 支援多平台：MOMO、PChome、Yahoo、Shopee
- 支援多賣場：Shopee Gusense、Shopee KATAI

### 2.3 核心功能清單

| 功能 | 說明 | 檔案 |
|------|------|------|
| Web App 入口 | `doGet()` | Code.js |
| T005 資料讀取 | `readT005Data()` | Utils.js |
| 三向比對 | `executeComparison()` | ComparisonEngine.js |
| 平台資料處理 | `processPlatformData()` | PlatformProcessor.js |
| ERP 資料處理 | `processERPData()` | ERPProcessor.js |
| 歷史記錄管理 | `saveComparisonHistory()` | HistoryManager.js |
| 結果匯出 | `exportComparisonResults()` | ExportUtils.js |

---

## 三、Company 概念對齊盤點

### 3.1 C005 現有 Company 相關實作

| C005 實作 | 說明 | 狀態 |
|-----------|------|------|
| (無 company_id) | C005 不區分公司 | ⚪ 尚未出現 |
| (無 Company_Profile) | 無公司設定檔 | ⚪ 尚未出現 |

### 3.2 與 Data Contract 對照

| Data Contract 欄位 | C005 對應 | 狀態 |
|--------------------|-----------|------|
| `company_id` | (無) | ⚪ 尚未出現 |
| `company_name` | (無) | ⚪ 尚未出現 |
| `template_code` | (無) | ⚪ 尚未出現 |
| `stamp_file_id` | (無) | ⚪ 尚未出現 |

### 3.3 ⚠️ 隱含公司假設分析

| 檢查項目 | 現況 | 風險等級 |
|----------|------|----------|
| T005 資料來源 | 單一 Sheet ID (`CONFIG.T005_SHEET_ID`) | ⚠️ 中 |
| ERP 資料 | 上傳檔案，未區分公司 | ⚠️ 中 |
| 平台資料 | 上傳檔案，未區分公司 | ⚠️ 中 |
| 歷史記錄 | 單一 Sheet ID (`CONFIG.HISTORY_SHEET_ID`) | ⚠️ 中 |

**隱含假設**：
- C005 假設所有資料屬於**同一個公司**
- 若有多公司需求，目前架構無法區分
- 不同公司的商品可能被混合比對

---

## 四、User 概念對齊盤點

### 4.1 C005 現有 User 相關實作

| C005 實作 | 說明 | 狀態 |
|-----------|------|------|
| (無使用者管理) | 無登入機制 | ⚪ 尚未出現 |
| (無 Session) | 無會話管理 | ⚪ 尚未出現 |
| (無身份驗證) | 任何人皆可存取 | ⚪ 尚未出現 |

### 4.2 與 Data Contract 對照

| Data Contract 欄位 | C005 對應 | 狀態 |
|--------------------|-----------|------|
| `user_id` | (無) | ⚪ 尚未出現 |
| `email` | (無) | ⚪ 尚未出現 |
| `display_name` | (無) | ⚪ 尚未出現 |
| `role` | (無) | ⚪ 尚未出現 |
| `status` | (無) | ⚪ 尚未出現 |

### 4.3 ⚠️ 單一操作者預設分析

| 檢查項目 | 現況 | 風險等級 |
|----------|------|----------|
| 操作記錄 | 不記錄操作者 | ⚠️ 中 |
| 權限控制 | 無（依賴 Google Sheet 權限） | ⚠️ 中 |
| 歷史追蹤 | 無操作者欄位 | ⚠️ 低 |

**隱含假設**：
- C005 假設**單一操作者**或**不需追蹤操作者**
- 歷史記錄無法識別是誰執行的比對
- 若有稽核需求，無法追溯

---

## 五、Role 概念對齊盤點

### 5.1 C005 現有 Role 相關實作

| C005 實作 | 說明 | 狀態 |
|-----------|------|------|
| (無 ROLES 定義) | 無角色常數 | ⚪ 尚未出現 |
| (無權限檢查) | 無 `checkPermission` | ⚪ 尚未出現 |

### 5.2 與 Data Contract 對照

| Data Contract Role | C005 對應 | 狀態 |
|--------------------|-----------|------|
| VIEWER | (無) | ⚪ 尚未出現 |
| CREATOR | (無) | ⚪ 尚未出現 |
| ISSUER | (無) | ⚪ 尚未出現 |
| APPROVER | (無) | ⚪ 尚未出現 |

### 5.3 分析結論

**C005 無角色權限機制**：
- 所有操作無角色限制
- 依賴 Google 試算表原生權限
- Web App 發布後，任何有連結的人皆可使用

---

## 六、Stamp 概念對齊盤點

### 6.1 C005 現有 Stamp 相關實作

| C005 實作 | 說明 | 狀態 |
|-----------|------|------|
| (無印章功能) | 比對系統不涉及印章 | ⚪ 尚未出現 |

### 6.2 分析結論

**C005 不涉及印章功能**。上架比對系統無需印章蓋章機制。

---

## 七、⚠️ 跨平台狀態混用風險分析

### 7.1 平台狀態定義（CONFIG.PLATFORM_STATUS）

| 平台 | 狀態值 | 語意 |
|------|--------|------|
| MOMO | `selling` | 銷售中 |
| MOMO | `suspended` | 暫時中斷 |
| MOMO | `offline` | 永久下架 |
| PChome | `draft` | 草稿 |
| PChome | `listed` | 已上架 |
| PChome | `both` | 兩者皆有 |
| Yahoo | `listed` | 已上架 |
| Shopee | `listed` | 已上架 |
| Shopee | `unlisted` | 未上架 |
| Shopee | `unknown` | 未知 |

### 7.2 狀態混用風險

| 風險項目 | 說明 | 風險等級 |
|----------|------|----------|
| 狀態語意不一致 | MOMO 的 `suspended` ≠ Shopee 的 `unlisted` | ⚠️ 中 |
| 狀態值相同但語意不同 | 各平台 `listed` 可能有不同條件 | ⚠️ 低 |
| 統一篩選風險 | UI 篩選「已上架」時，各平台判斷邏輯不同 | ⚠️ 中 |
| 狀態轉換不透明 | `mapPlatformStatus()` 隱含轉換邏輯 | ⚠️ 低 |

### 7.3 現況處理方式

```javascript
// Config.js 中的狀態定義
PLATFORM_STATUS: {
  MOMO: { SELLING: 'selling', SUSPENDED: 'suspended', OFFLINE: 'offline' },
  PCHOME: { DRAFT: 'draft', LISTED: 'listed', BOTH: 'both' },
  YAHOO: { LISTED: 'listed' },
  SHOPEE: { LISTED: 'listed', UNLISTED: 'unlisted', UNKNOWN: 'unknown' }
}
```

**現況評估**：
- ✅ 已將狀態定義集中在 `CONFIG.PLATFORM_STATUS`
- ✅ 後端使用統一配置，避免 hardcoded
- ⚠️ 狀態語意差異仍需人工理解

---

## 八、對齊總結

### 8.1 統計

| 分類 | 已符合 | 名稱不同語意相同 | 尚未出現 |
|------|--------|-----------------|----------|
| Company | 0 | 0 | 4 |
| User | 0 | 0 | 5 |
| Role | 0 | 0 | 4 |
| Stamp | 0 | 0 | 2 |
| **總計** | **0** | **0** | **15** |

### 8.2 風險評估總結

| 風險項目 | 等級 | 說明 |
|----------|------|------|
| 隱含公司假設 | ⚠️ 中 | 假設所有資料屬於同一公司 |
| 單一操作者預設 | ⚠️ 中 | 無法追蹤操作者身份 |
| 跨平台狀態混用 | ⚠️ 中 | 各平台狀態語意不同 |
| 權限控制缺失 | ⚠️ 中 | 依賴 Google 原生權限 |

### 8.3 結論

| 評估項目 | 結果 |
|----------|------|
| 與 S005/V005 架構相似度 | ⚪ **低** |
| Company 概念對齊 | ❌ 不適用（隱含單一公司） |
| User 概念對齊 | ❌ 不適用（無使用者管理） |
| Role 概念對齊 | ❌ 不適用（無權限機制） |
| Stamp 概念對齊 | ❌ 不適用（無印章需求） |

### 8.4 架構差異分析

| 項目 | S005/V005 (報價系統) | C005 (上架檢查器) |
|------|---------------------|------------------|
| 核心識別 | 公司 + 報價單 | 商品 + 平台 |
| 使用者管理 | Admin_Users + Session | 無 |
| 權限控制 | RBAC (角色權限) | 無（Google 權限） |
| 審批流程 | 有（狀態機） | 無 |
| 印章管理 | 有 | 無 |
| 多公司支援 | 有 | ❌ 隱含單一公司 |
| 操作追蹤 | 有 | ❌ 無 |

---

## 九、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立（完整健檢，含風險分析） |

