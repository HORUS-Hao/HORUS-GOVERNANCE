# 治理文件需修正項目清單

**Audit Date**: 2026-01-09
**Status**: 僅標記，暫不動 Code

---

## 分類說明

| 類別 | 定義 |
|------|------|
| 文件錯誤 | 文件描述與實際行為不符 |
| 文件過期 | 文件內容已被後續變更取代 |
| 文件超前設計 | 文件描述的功能尚未實作 |

---

## 1. 文件錯誤

### 1.1 EXTERNAL_ACCESS 表引用

| 項目 | 值 |
|------|-----|
| 文件位置 | `HORUS-GOVERNANCE/TESTING/TEST-USER-VALIDATION-2026-01-09.md` |
| 錯誤內容 | 引用 `EXTERNAL_ACCESS` 表 |
| 實際狀態 | 此表不存在於程式碼，應為 `User_Company_Permission` |
| 修正建議 | 將所有 `EXTERNAL_ACCESS` 改為 `User_Company_Permission` |

### 1.2 USERS_ACCESS 為主要權限表的描述

| 項目 | 值 |
|------|-----|
| 文件位置 | `HORUS-GOVERNANCE/DECISIONS/DECISION-V005-EXTERNAL-VIEWER-HARD-GATE.md:14` |
| 錯誤內容 | 「原設計僅依賴 USERS_ACCESS.role 做權限控管，External 使用者不在此表中」 |
| 實際狀態 | S005 External 使用 `User_Company_Permission` + OTP，不查 `USERS_ACCESS` |
| 修正建議 | 補充說明雙表架構 |

### 1.3 External Hard Gate 描述

| 項目 | 值 |
|------|-----|
| 文件位置 | `DECISION-V005-EXTERNAL-VIEWER-HARD-GATE.md` |
| 錯誤內容 | 暗示 External 判斷依賴表查詢 |
| 實際狀態 | `isInternalUser_()` 為 Hard Code Domain 判斷，不查任何表 |
| 修正建議 | 明確說明 Hard Code Domain List |

---

## 2. 文件過期

### 2.1 seal_file_id 欄位

| 項目 | 值 |
|------|-----|
| 文件位置 | 多處初始化說明 |
| 過期內容 | `seal_file_id` 作為印章欄位 |
| 實際狀態 | 已被 `stamp_file_id` 取代（Security Fix） |
| 修正建議 | 標示 `seal_file_id` 為 LEGACY |

### 2.2 FACT-REGISTRY-v0.md 權限表描述

| 項目 | 值 |
|------|-----|
| 文件位置 | `HORUS-GOVERNANCE/DATA-QUALITY/FACT-REGISTRY-v0.md:152-158` |
| 過期內容 | 僅記載 `USERS_ACCESS` 為權限表 |
| 實際狀態 | `User_Company_Permission` 為公司授權主表 |
| 修正建議 | 補充 `User_Company_Permission` 表描述 |

---

## 3. 文件超前設計

### 3.1 ROLES 定義 vs 實際檢查

| 項目 | 值 |
|------|-----|
| 文件/程式位置 | S005:96-101, V005:39-44 |
| 超前內容 | 定義 VIEWER / CREATOR / ISSUER / APPROVER 四種角色 |
| 實際狀態 | 僅 APPROVER 有實際權限檢查，其他三種無效果 |
| 修正建議 | 文件說明目前僅 APPROVER 生效 |

### 3.2 User_Company_Permission.role 欄位

| 項目 | 值 |
|------|-----|
| 文件/程式位置 | V005 initDataSheets():442 |
| 超前內容 | 欄位存在且有值（'admin'） |
| 實際狀態 | `getUserAllowedCompanies()` 讀取但未使用於任何判斷 |
| 修正建議 | 文件標示為「預留欄位，目前未生效」 |

### 3.3 Phase 5-A 三層權限表

| 項目 | 值 |
|------|-----|
| 文件位置 | S005 註解:59 |
| 超前內容 | 「USERS_ACCESS / USER_COMPANIES / USER_CUSTOMERS 三層權限表」 |
| 實際狀態 | 三表存在但整合邏輯未完整實作 |
| 修正建議 | 文件說明目前實際生效範圍 |

---

## 4. 修正優先級建議

| 優先級 | 項目 | 理由 |
|--------|------|------|
| 高 | EXTERNAL_ACCESS 誤引用 | 測試模板錯誤，影響測試執行 |
| 中 | seal_file_id LEGACY 標示 | 避免管理員誤操作 |
| 中 | ROLES 實際生效說明 | 避免權限設定誤解 |
| 低 | User_Company_Permission.role | 預留欄位，暫無影響 |
| 低 | 三層權限表說明 | 設計文件，非操作文件 |

---

*此清單僅標記需修正項目，不包含實作方案。*
