# T005 Data Contract v1.0

> **STATUS: DEPRECATED (DIVERGED FROM PRODUCTION)**
>
> **REASON**: Production T005 sheet schema is 21 columns (UID..updateDateTime). This document does not reflect current sheet.
>
> **DO NOT USE** for row index mapping validation.
>
> **SUPERSEDED BY**: `HORUS-GOVERNANCE/T005/T005_SHEET_SCHEMA_CANONICAL_v2026-01.md`
>
> **Deprecation Date**: 2026-01-17

---

> ~~**Status**: EFFECTIVE~~ (DEPRECATED)
> **Module**: T005 - Product Master
> **Role**: Single Source of Truth (SSOT) for Product Semantics
> **Version**: v1.0
> **Effective Date**: 2026-01-06

---

## 1. Authority & Scope

### 1.1 Authority

T005 是 HORUS 系統中 **Product Master（商品主檔）** 的唯一權威來源。

- **定位**: 語義源頭（Semantic Source of Truth）
- **職責**: 定義商品欄位的業務語義與標準命名
- **權限**: 所有下游模組必須以 T005 為準

### 1.2 Scope

本契約涵蓋：
- T005 所有 Worksheets 的欄位定義
- 欄位語義與業務意義
- 資料可變性規則
- 下游依賴關係

本契約不涵蓋：
- 流程設計或 SOP
- UI/UX 規範
- 執行時間排程

---

## 2. Sheet & Ownership

### 2.1 Sheet Identity

| Property | Value | Decision |
|----------|-------|----------|
| Sheet ID | TBD | Architect 裁定 |
| Sheet Name | T005-商品管理 | 既存事實 |
| Owner Module | T005 | 既存事實 |

### 2.2 Worksheets（共 16 張）

#### Layer 1: Business Data Sheets（11 張）

| Worksheet | Purpose | Field Count |
|-----------|---------|-------------|
| T005-1. 商品主表 | 核心商品資料（Master Table） | 29 |
| T005-2. 商品命名規範表 | 商品命名標準 | 15 |
| T005-3. 商品功能規格表 | 功能與規格 | 22 |
| T005-4. 商品尺寸重量表 | 尺寸與重量 | 19 |
| T005-5. 商品價格表 | 定價資訊 | 25 |
| T005-6. 圖庫狀態追蹤表 | 圖片狀態 | 10 |
| T005-7. 商品生命週期表 | 生命週期管理 | 11 |
| T005-8. 類別專屬資料管理表 | 類別專屬欄位 | 11 |
| T005-9. 平台輸出管理表 | 平台輸出設定 | 9 |
| T005-10. 商品變更追蹤表 | 變更審計軌跡 | 11 |
| T005-11. 刪除商品記錄表 | 已刪除商品歸檔 | 10 |

#### Layer 2: System Management Sheets（5 張）

| Worksheet | Purpose | Key Fields |
|-----------|---------|------------|
| _config | 系統設定 | category, configKey, value, dataType, updateTime, description |
| _log | 操作日誌 | timestamp, action, note, user, extraInfo, sheet_id |
| _relations | 模組關聯 | sourceModule, sourceUID, targetModule, targetUID, relationType, status |
| _validation | 資料驗證記錄 | validationTime, validationType, status, note, details |
| _backup_log | 備份歷史 | backupTime, fileID, fileName, reason, sourceSpreadsheetID, operator |

---

## 3. Schema Definition

### 3.1 T005-1. 商品主表（Master Table）- 完整欄位清單

| Column | Field Name | Data Type | Nullable | Decision |
|--------|------------|-----------|----------|----------|
| 1 | UID | string | NO | 既存事實 |
| 2 | 原廠品牌（參考） | string | YES | 既存事實 |
| 3 | 原廠型號（參考） | string | YES | 既存事實 |
| 4 | 原廠商品名稱（參考） | string | YES | 既存事實 |
| 5 | 品牌 | string | NO | Canonical |
| 6 | 商品型號 | string | NO | Canonical |
| 7 | 商品名稱 | string | NO | Canonical |
| 8 | 商品名稱（副標） | string | YES | 既存事實 |
| 9 | 商品大類 | string | NO | Canonical |
| 10 | 商品中類 | string | YES | Canonical |
| 11 | 商品小類 | string | YES | Canonical (補登) |
| 12 | 商品狀態 | string | NO | 既存事實 |
| 13 | 主要銷售平台 | string | YES | 既存事實 |
| 14 | 次要銷售平台 | string | YES | 既存事實 |
| 15 | 建檔日期 | date | NO | 既存事實 |
| 16 | 最後更新日期 | date | NO | 既存事實 |
| 17 | EOL狀態 | string | YES | 既存事實 |
| 18 | EOL預計日期 | date | YES | 既存事實 |
| 19 | 備註 | string | YES | 既存事實 |
| 20 | 總完成度(%) | number | YES | 既存事實 |
| 21 | 處理負責人 | string | YES | 既存事實 |
| 22 | SLA狀態 | string | YES | 既存事實 |
| 23 | 資料來源 | string | YES | 既存事實 |
| 24 | 轉換狀態 | string | YES | 既存事實 |
| 25 | T002原料庫關聯ID | string | YES | 既存事實 |
| 26 | P005圖庫關聯狀態 | string | YES | 既存事實 |
| 27 | A005智能庫關聯狀態 | string | YES | 既存事實 |
| 28 | T009關聯狀態 | string | YES | 既存事實 |
| 29 | 類別驗證狀態 | string | YES | 既存事實 |

### 3.2 UID 格式標準

| Property | Value |
|----------|-------|
| Format | `T005_YYYYMMDD_XXXX` |
| Example | `T005_20251006_1001` |
| Sequence Start | 1001（每日重置） |
| Uniqueness | Global Unique across T005 |

---

## 4. Field Semantics（欄位語義）

### 4.1 Canonical Fields（正式名稱，已凍結）

以下欄位名稱為 **Canonical**，所有下游模組必須使用此名稱：

| Canonical Name | Legacy Names (禁用) | 業務語義 |
|----------------|---------------------|----------|
| UID | UID(主鍵), UID（主鍵） | 商品唯一識別碼，全系統不重複 |
| 品牌 | 品牌(標準化), 品牌（標準化） | 標準化後的品牌名稱 |
| 商品型號 | 商品型號(標準化), 商品型號（標準化） | 標準化後的商品型號 |
| 商品名稱 | 商品名稱(標準化), 商品名稱（標準化） | 標準化後的商品名稱 |
| 商品大類 | 商品分類(大), 商品分類（大） | 一級分類 |
| 商品中類 | 商品分類(中), 商品分類（中） | 二級分類 |
| 商品小類 | 商品分類(小), 商品分類（小） | 三級分類（補登：實務既存、C020/C005 已依賴） |

**凍結日期**: 2025-12-31
**補登日期**: 2026-01-15（商品小類）
**補登原因**: 實務既存欄位，C020 / C005 已依賴
**規則**: 所有新程式碼必須直接使用 Canonical Name，禁止使用 Legacy Names

### 4.2 Status Fields 語義

| Field | Valid Values | 業務語義 | Decision |
|-------|--------------|----------|----------|
| 商品狀態 | TBD | 商品當前狀態 | Architect 裁定 |
| EOL狀態 | TBD | 生命終止狀態 | Architect 裁定 |
| SLA狀態 | TBD | 服務等級狀態 | Architect 裁定 |
| 轉換狀態 | TBD | 資料轉換狀態 | Architect 裁定 |

### 4.3 Reference Fields 語義

| Field | 業務語義 | 關聯模組 |
|-------|----------|----------|
| 原廠品牌（參考） | 原始輸入的品牌名稱，未經標準化 | T002 |
| 原廠型號（參考） | 原始輸入的型號，未經標準化 | T002 |
| 原廠商品名稱（參考） | 原始輸入的名稱，未經標準化 | T002 |
| T002原料庫關聯ID | 關聯至 T002 的 UID | T002 |

---

## 5. Mutability Rules（可變性規則）

### 5.1 Immutable Fields（不可變欄位）

| Field | Reason | Decision |
|-------|--------|----------|
| UID | 主鍵，建立後不可變更 | 既存事實 |
| 建檔日期 | 歷史記錄，不可變更 | 既存事實 |

### 5.2 Append-Only Fields（僅可追加）

| Field | Reason | Decision |
|-------|--------|----------|
| TBD | TBD | Architect 裁定 |

### 5.3 Mutable Fields（可變欄位）

除上述 Immutable 欄位外，其餘欄位均為 Mutable，但：
- 變更須記錄於 `T005-10. 商品變更追蹤表`
- 變更須記錄於 `_log` 系統表

---

## 6. Forbidden Actions（明確禁止）

### 6.1 Absolute Prohibitions

| Action | Reason |
|--------|--------|
| 修改 UID | 破壞全系統關聯性 |
| 刪除 Canonical Field | 破壞下游語義依賴 |
| 使用 Legacy Field Name | 語義凍結，禁止使用 |
| 直接刪除商品列 | 必須移至 T005-11 歸檔 |
| 跳過 _log 記錄 | 破壞審計軌跡 |

### 6.2 AI / Agent Prohibitions

| Action | Reason |
|--------|--------|
| 推導欄位值 | T005 為 SSOT，不可推導 |
| 自行新增欄位 | 需 Architect 裁定 |
| 修改 Canonical Name | 語義已凍結 |
| 假設缺失欄位存在 | 只能使用既存事實 |

---

## 7. Downstream Dependencies（下游依賴）

### 7.1 FACT Writer

| Module | 依賴關係 | Notes |
|--------|----------|-------|
| D005 | 使用 T005 UID 作為 SKU 關聯鍵 | FACT Writer |

### 7.2 READ-ONLY Consumers

| Module | 依賴關係 | Notes |
|--------|----------|-------|
| C005 | 讀取 T005 商品資料進行比對 | Web App |
| C020 | 讀取 T005 商品資料進行壁掛架查詢 | Web App (Viewer) |
| R020 | 讀取 T005 Canonical Fields | Price Comparator |

### 7.3 Derived Modules

| Module | 依賴關係 | Notes |
|--------|----------|-------|
| T030 | 使用 T005 欄位進行毛利模擬 | Margin Simulation |

### 7.4 Dependency Matrix

| Consumer | Canonical Fields Used | Integration Type |
|----------|----------------------|------------------|
| R020 | 品牌, 商品型號, 商品名稱 | Canonical + Fallback |
| T030 | 品牌, 商品型號, 商品大類 | Canonical |
| D005 | UID | Lookup Key |
| C005 | UID, 商品型號 | Index-based |
| C020 | UID, 品牌, 商品型號, 商品名稱, 商品大類, 商品中類, 商品小類 | Canonical + Fallback |

---

## 8. Governance Guarantees

### 8.1 T005 Guarantees

T005 作為 SSOT，保證：

| Guarantee | Description |
|-----------|-------------|
| UID Uniqueness | 每個 UID 在 T005 中唯一 |
| Canonical Name Stability | Canonical Fields 名稱不變 |
| Schema Versioning | Schema 變更需版本升級 |
| Audit Trail | 所有變更記錄於 _log |
| Backup | 關鍵操作前自動備份 |

### 8.2 Consumer Guarantees

下游模組可依賴：

| Guarantee | Description |
|-----------|-------------|
| Field Existence | Canonical Fields 必定存在 |
| Data Type Consistency | 欄位型別不變 |
| Semantic Stability | 欄位語義不變 |

---

## 9. Changelog

| Version | Date | Description |
|---------|------|-------------|
| v1.0 | 2026-01-06 | Initial release - Schema extracted from existing facts |
| v1.0.1 | 2026-01-15 | 補登「商品小類」Canonical 欄位（實務既存、C020/C005 已依賴）；新增 C020 為 Consumer |

---

## Appendix A: TBD Items（待 Architect 裁定）

以下項目標記為 TBD，需 Architect 逐條裁定：

| Section | Item | Current Value |
|---------|------|---------------|
| 2.1 | Sheet ID | TBD |
| 4.2 | 商品狀態 Valid Values | TBD |
| 4.2 | EOL狀態 Valid Values | TBD |
| 4.2 | SLA狀態 Valid Values | TBD |
| 4.2 | 轉換狀態 Valid Values | TBD |
| 5.2 | Append-Only Fields 清單 | TBD |

---

## Appendix B: Field Source Evidence

本契約所有欄位均來自既存事實：

| Source | Evidence Type |
|--------|---------------|
| T005-商品管理-Product-Mgmt/gas-scripts/ | Production Code |
| T005_Canonical_Schema_Contract.md | Frozen Schema (2025-12-31) |
| T005_FieldNameResolver.js | Legacy Mapping (Deprecated) |

---

**END OF T005_DATA_CONTRACT_v1.0.md**
