# R020 Governance Alignment Audit

- Module: R020 (Price Comparator / 市場比價系統)
- File: R020-GOVERNANCE-ALIGNMENT-AUDIT.md
- Version: v1.0.0
- Audit Date: 2026-01-08
- Status: **Read-Only Inventory**
- Reference Blueprint: V005 Phase 2 治理結構
- Related Documents:
  - GLOBAL/DATA-CONTRACT-COMPANY.md
  - GLOBAL/DATA-CONTRACT-USER.md
  - GLOBAL/DATA-CONTRACT-STAMP.md
- Source Files:
  - `R020-Price-Comparator/gas_api.js`
  - `R020-Price-Comparator/PriceComparer.js`
  - `R020-Price-Comparator/R020_Utils.js`
  - `R020-Price-Comparator/R020_Competitor.js`

---

## 一、Purpose

本文件對 R020 模組進行治理對齊盤點，與 GLOBAL Data Contract 進行「適用性分析」。

**限制聲明**：
- ❌ 不修改任何程式碼
- ❌ 不提出 migration 方案
- ❌ 不新增欄位
- ❌ 不延伸到 C005 / T005

---

## 二、模組狀態盤點

### 2.1 模組基本資訊

| 項目 | 狀態 |
|------|------|
| 模組 ID | R020 |
| 模組名稱 | Price Comparator / 市場比價系統 |
| 版本 | v2.0.0 (gas_api), v1.6.1 (PriceComparer) |
| 系統狀態 | ✅ **已實作** |
| 程式碼位置 | ✅ 在本次工程倉內 |
| 健診可行性 | ✅ 可進行完整健檢 |

### 2.2 模組定位

R020 是**市場價格比對系統**：
- 比對我方售價 ↔ 市場價格
- 支援多平台：MOMO、PChome、Yahoo、Shopee
- 競品監控與價格分析
- 與 T005 商品主檔整合

### 2.3 核心功能清單

| 功能 | 說明 | 檔案 |
|------|------|------|
| Web App 入口 | `doGet()` | gas_api.js |
| 市場價格讀取 | `R020_getMarketPricesFromCache_()` | PriceComparer.js |
| 比價引擎 | `R020_comparePrices_()` | PriceComparer.js |
| 結果語意層 | `R020_calcResultStatus_()` | PriceComparer.js |
| 競品監控 | `R020_CompetitorSummary`, `R020_CompetitorWatch` | R020_Competitor.js |
| 工具函數 | `R020_parsePrice_()`, `R020_parseStock_()` | R020_Utils.js |

---

## 三、Company 概念適用性分析

### 3.1 R020 現有 Company 相關實作

| R020 實作 | 說明 | 狀態 |
|-----------|------|------|
| (無 company_id) | R020 不區分公司 | ⚪ 尚未出現 |
| (無 Company_Profile) | 無公司設定檔 | ⚪ 尚未出現 |
| CONFIG.R020_SPREADSHEET_ID | 單一試算表 ID | 隱含單一公司 |

### 3.2 與 Data Contract 對照

| Data Contract 欄位 | R020 對應 | 狀態 |
|--------------------|-----------|------|
| `company_id` | (無) | ⚪ 尚未出現 |
| `company_name` | (無) | ⚪ 尚未出現 |
| `template_code` | (無) | ⚪ 尚未出現 |
| `stamp_file_id` | (無) | ⚪ 尚未出現 |

### 3.3 適用性評估

| 評估項目 | 結論 |
|----------|------|
| Company 概念是否適用？ | ⚠️ **有限適用** |
| 原因 | R020 假設所有比價資料屬於同一公司，CONFIG 使用固定 Spreadsheet ID |
| 多公司潛在風險 | ⚠️ 中 — 若需多公司比價，目前架構需大幅修改 |

---

## 四、User 概念適用性分析

### 4.1 R020 現有 User 相關實作

| R020 實作 | 說明 | 狀態 |
|-----------|------|------|
| (無使用者管理) | 無登入機制 | ⚪ 尚未出現 |
| `pm` 欄位 | MD/PM 負責人（字串欄位） | 🔸 部分相關 |

### 4.2 PM 欄位分析

```javascript
// PriceComparer.js (Line 262-263)
var baseResult = {
  pm: my.pm || '',                 // v1.2.0: MD/PM 負責人
  // ...
};
```

| 項目 | 說明 |
|------|------|
| 欄位名稱 | `pm` |
| 來源 | 從 T005 或 MyPrices 帶入 |
| 用途 | 識別商品負責人 |
| 是否等於 User Entity？ | ❌ **否** — 僅字串，無 user_id 關聯 |

### 4.3 與 Data Contract 對照

| Data Contract 欄位 | R020 對應 | 狀態 |
|--------------------|-----------|------|
| `user_id` | (無) | ⚪ 尚未出現 |
| `email` | (無) | ⚪ 尚未出現 |
| `display_name` | `pm`（部分相似） | 🔸 名稱不同語意不同 |
| `role` | (無) | ⚪ 尚未出現 |
| `status` | (無) | ⚪ 尚未出現 |

### 4.4 適用性評估

| 評估項目 | 結論 |
|----------|------|
| User 概念是否適用？ | ⚠️ **有限適用** |
| 原因 | R020 的 `pm` 僅為識別字串，非完整 User Entity |
| 操作追蹤需求 | ⚠️ 低 — 比價系統為分析工具，不需追蹤操作者 |

---

## 五、Role 概念適用性分析

### 5.1 R020 現有 Role 相關實作

| R020 實作 | 說明 | 狀態 |
|-----------|------|------|
| (無 ROLES 定義) | 無角色常數 | ⚪ 尚未出現 |
| (無權限檢查) | 無 `checkPermission` | ⚪ 尚未出現 |

### 5.2 適用性評估

| 評估項目 | 結論 |
|----------|------|
| Role 概念是否適用？ | ❌ **不適用** |
| 原因 | R020 為分析工具，無需角色權限控制 |
| 權限依賴 | 依賴 Google Sheets / Web App 原生權限 |

---

## 六、Stamp 概念適用性分析

### 6.1 R020 現有 Stamp 相關實作

| R020 實作 | 說明 | 狀態 |
|-----------|------|------|
| (無印章功能) | 比價系統不涉及印章 | ⚪ 尚未出現 |

### 6.2 適用性評估

| 評估項目 | 結論 |
|----------|------|
| Stamp 概念是否適用？ | ❌ **不適用** |
| 原因 | 市場比價系統無印章需求 |

---

## 七、⚠️ 風險標註

### 7.1 平台 Ingest 狀態定義

```javascript
// PriceComparer.js (Line 344-349)
var R020_PLATFORM_INGEST_STATUS = {
  MOMO: true,      // 有 ingest
  PCHOME: true,    // 有 ingest
  YAHOO: false,    // 無 ingest（By Design）
  SHOPEE: false    // 無 ingest（By Design）
};
```

| 風險項目 | 說明 | 等級 |
|----------|------|------|
| 平台覆蓋不完整 | Yahoo/Shopee 無市場價格 ingest | ⚠️ 中 |
| 狀態判斷影響 | `EXPECTED_SKIP` 語意依賴此定義 | ⚠️ 低 |

### 7.2 跨平台資料來源

```javascript
// gas_api.js (Line 93-100)
FACT_FOLDER_IDS: {
  MOMO: '1B-uGmfiGmIJqY1e0mNnJti7xk-pdIlUb',
  PCHOME_LISTED: '1Xdy7hXtvDqbygCKzBh6KmEXa-J_kpjbo',
  PCHOME_DRAFT: '16UH0oo7WQ23q7pGf1iMs_LYu94tpSgn3',
  YAHOO: '1U7l0x1XVfLy5Wvm_oDB1haTfXFR_LivV',
  SHOPEE_GUSENSE: '1EzEQOP2hQXoERgEy5pNyKZnV8-ymfCby',
  SHOPEE_KATAI: '1X2F375SXtRWG58oyVfPuQkH1AF7Ehs9Y'
}
```

| 風險項目 | 說明 | 等級 |
|----------|------|------|
| Folder ID 硬編碼 | 各平台 FACT 資料夾為固定 ID | ⚠️ 低 |
| 多賣場區分 | Shopee 區分 Gusense/KATAI | ✅ 已處理 |

### 7.3 結果語意層設計

```javascript
// PriceComparer.js (Line 332-337)
var R020_RESULT_STATUS = {
  OK_NORMAL: 'OK_NORMAL',
  WARNING_DATA_LIMITED: 'WARNING_DATA_LIMITED',
  ALERT_PRICE_ABNORMAL: 'ALERT_PRICE_ABNORMAL',
  INVALID_UNTRUSTED: 'INVALID_UNTRUSTED'
};
```

| 項目 | 說明 |
|------|------|
| 設計品質 | ✅ 良好 — 有明確的狀態定義和判斷邏輯 |
| 跨平台一致性 | ✅ 良好 — 統一的 ResultStatus 語意 |

### 7.4 風險總結

| 風險項目 | 等級 | 說明 |
|----------|------|------|
| 隱含公司假設 | ⚠️ 中 | 單一 Spreadsheet ID，無多公司支援 |
| 操作者不可追蹤 | ⚠️ 低 | 分析工具，低稽核需求 |
| 平台覆蓋不完整 | ⚠️ 中 | Yahoo/Shopee 無市場價格 |
| 權限控制缺失 | ⚠️ 低 | 依賴 Google 原生權限 |

---

## 八、對齊總結

### 8.1 統計

| 分類 | 已符合 | 名稱不同語意相同 | 部分相關 | 尚未出現 | 不適用 |
|------|--------|-----------------|----------|----------|--------|
| Company | 0 | 0 | 0 | 4 | - |
| User | 0 | 0 | 1 (`pm`) | 4 | - |
| Role | 0 | 0 | 0 | 0 | 4 |
| Stamp | 0 | 0 | 0 | 0 | 2 |
| **總計** | **0** | **0** | **1** | **8** | **6** |

### 8.2 適用性總結

| 治理概念 | 適用性 | 說明 |
|----------|--------|------|
| Company | ⚠️ 有限適用 | 隱含單一公司假設 |
| User | ⚠️ 有限適用 | `pm` 欄位非 User Entity |
| Role | ❌ 不適用 | 分析工具無需角色控制 |
| Stamp | ❌ 不適用 | 無印章需求 |

### 8.3 R020 特有治理機制

R020 已建立自有的治理機制：

| 機制 | 說明 | 檔案 |
|------|------|------|
| DATA CONTRACT | 欄位定義單一事實來源 | R020_DATA_CONTRACT.md |
| 結果語意層 | ResultStatus, ResultReason, ConfidenceScore | PriceComparer.js |
| Match Score | 壁掛架專用匹配評分 | PriceComparer.js |
| FACT Ingest 規範 | STD-FACT-INGEST-001 | gas_api.js |

### 8.4 架構差異分析

| 項目 | S005/V005 (報價系統) | R020 (比價系統) |
|------|---------------------|------------------|
| 核心識別 | 公司 + 報價單 | 商品 SKU + 平台 |
| 使用者管理 | Admin_Users + Session | 無（僅 pm 字串） |
| 權限控制 | RBAC (角色權限) | 無（Google 權限） |
| 審批流程 | 有（狀態機） | 無 |
| 印章管理 | 有 | 無 |
| 多公司支援 | 有 | ❌ 隱含單一公司 |
| 自有治理 | 較少 | ✅ DATA CONTRACT |

---

## 九、結論

R020 作為**市場比價分析系統**，其核心設計與 S005/V005 的「公司/使用者/印章」治理模型存在本質差異。

**主要發現**：
1. GLOBAL Data Contract 的 Company/User/Role/Stamp 概念對 R020 **適用性有限**
2. R020 已建立**自有治理機制**（DATA CONTRACT、結果語意層）
3. 主要風險為**隱含單一公司假設**

**建議**（僅供記錄，本文件不提 migration）：
- 若未來需多公司比價，需重新評估架構
- R020 現有 DATA CONTRACT 機制可作為其他模組參考

---

## 十、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立（完整健檢，適用性分析） |

