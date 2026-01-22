# V005 Code.gs 模組邊界清冊

- 模組：V005 (Quotation Viewer)
- 類型：Module Boundary Inventory
- 版本：v1.0.0
- 生效日期：2026-01-08（台北時間）
- 狀態：Active
- 來源檔案：`10-基礎服務層-BASE-SERVICES/V005-Quotation-Viewer/Code.gs`
- 總行數：1,717 行

---

## 一、清冊目的

本文件列出 V005 Code.gs 內所有功能區塊與函數邊界，
作為後續模組化重構之依據。

**本文件不修改任何程式碼、不進行拆分、不整理、不優化、不重構。**

---

## 二、模組邊界清冊

### 2.1 Configuration & Constants（設定與常數）

| 函數/對象 | 行號 | 說明 |
|-----------|------|------|
| `CONFIG` | 26-34 | 系統組態（Spreadsheet ID、Sheet 名稱等） |
| `ROLES` | 39-44 | 角色定義（VIEWER、CREATOR、ISSUER、APPROVER） |
| `STATUS_TRANSITIONS` | 974-979 | 狀態轉移定義（DRAFT → ISSUED → SENT → VOIDED） |

### 2.2 Entry Point（入口點）

| 函數 | 行號 | 說明 |
|------|------|------|
| `doGet(e)` | 54-88 | Web App 入口，處理 URL 參數、角色判斷、返回 HTML |

### 2.3 Company Profile（公司設定檔）

| 函數 | 行號 | 說明 |
|------|------|------|
| `getCompanyProfile(companyName)` | 96-136 | 讀取公司設定檔（含 v1.3 新增欄位） |

### 2.4 Stamp & Image Services（印章與圖片服務）

| 函數 | 行號 | 說明 |
|------|------|------|
| `getStampDataUrl(fileId)` | 143-155 | 從 Drive File ID 取得印章 Data URL（Security Fix） |
| `processItemImagesForDisplay_(items)` | 163-184 | 處理商品圖片供前端顯示（Image Governance v1.0） |

### 2.5 Quote Data Service（報價資料服務）

| 函數 | 行號 | 說明 |
|------|------|------|
| `getQuote(refId)` | 194-378 | 讀取報價資料（含 Snapshot 優先、Stamp/Approval 處理） |
| `testGetQuote()` | 383-387 | 測試函數 |
| `debugStampResult()` | 392-412 | 診斷印章 Data URL |

### 2.6 Migration Scripts（遷移腳本）

| 函數 | 行號 | 說明 |
|------|------|------|
| `phase0_createSkeletonSheets()` | 420-470 | 一次性建立骨架 Sheet |
| `migrateCompanyProfile_v1_1()` | 478-517 | Company_Profile v1.1 升級腳本 |
| `populateCompanyData_v1_1()` | 525-573 | Company_Profile v1.1 資料填入 |
| `phase1_setupTemplateTest()` | 582-622 | 建立模板切換測試資料 |
| `phase33_addSnapshotColumn()` | 932-956 | 新增 quotation_snapshot_json 欄位 |
| `phase4a_addStatusUpdatedAtColumn()` | 1101-1124 | 新增 status_updated_at 欄位 |

### 2.7 PDF Export Service（PDF 匯出服務）

| 函數 | 行號 | 說明 |
|------|------|------|
| `exportQuotePDF(refId, htmlContent)` | 639-670 | 匯出報價單 PDF（不落地檔案版） |

### 2.8 Mail Service（郵件服務）

| 函數 | 行號 | 說明 |
|------|------|------|
| `sendQuotationMail(refId, mailPayload)` | 691-773 | 發送報價單郵件（含狀態機整合） |
| `buildMailBody_v1_(recipient, companyProfile)` | 790-820 | 建立郵件內文（v1 固定結構） |
| `sendRejectNotification_(...)` | 1395-1447 | 發送退回通知 Mail（P0 責任閉環） |

### 2.9 Contacts Service（通訊錄服務）

| 函數 | 行號 | 說明 |
|------|------|------|
| `getContacts()` | 832-865 | 取得通訊錄清單 |
| `getContactsFromQuotes_()` | 870-906 | 從歷史報價中取得聯絡人（Fallback） |
| `createContactsSheet()` | 911-924 | 建立 Contacts 工作表 |

### 2.10 Status Machine（狀態機）

| 函數 | 行號 | 說明 |
|------|------|------|
| `isValidTransition(currentStatus, newStatus)` | 987-990 | 檢查狀態轉移是否合法 |
| `updateQuoteStatus(refId, newStatus)` | 998-1064 | 更新報價單狀態 |
| `getQuoteStatus(refId)` | 1071-1096 | 取得報價單目前狀態 |

### 2.11 Approval Flow（審批流程）

| 函數 | 行號 | 說明 |
|------|------|------|
| `approveQuotation(refId, userEmail)` | 1139-1266 | 核准報價單（含 Role Guard） |
| `rejectQuotation(refId, reason, userEmail)` | 1276-1388 | 退回報價單（含 Role Guard、通知 Mail） |
| `buildApprovalSnapshot_(...)` | 1453-1501 | 建立核准 Snapshot（內部函數） |

### 2.12 Role & Permission Guard（角色與權限守衛）

| 函數 | 行號 | 說明 |
|------|------|------|
| `getUserRole_(email)` | 1513-1538 | 取得使用者的角色（內部函數） |
| `checkApproverPermission_(email)` | 1546-1578 | 檢查使用者是否具有 APPROVER 角色 |
| `getUserApproverStatus()` | 1584-1627 | 取得當前使用者的 APPROVER 狀態（供前端呼叫） |

### 2.13 Diagnostic & Cleanup Tools（診斷與清理工具）

| 函數 | 行號 | 說明 |
|------|------|------|
| `DIAG_listUsersAccess()` | 1633-1651 | 診斷工具：列出 USERS_ACCESS 所有資料 |
| `FIX_cleanupUsersAccess()` | 1661-1716 | 清理工具：修正角色並移除重複列 |

---

## 三、模組邊界統計

| 分類 | 函數數量 | 行數範圍 |
|------|----------|----------|
| Configuration & Constants | 3 | 26-44, 974-979 |
| Entry Point | 1 | 54-88 |
| Company Profile | 1 | 96-136 |
| Stamp & Image Services | 2 | 143-184 |
| Quote Data Service | 3 | 194-412 |
| Migration Scripts | 6 | 420-622, 932-956, 1101-1124 |
| PDF Export Service | 1 | 639-670 |
| Mail Service | 3 | 691-820, 1395-1447 |
| Contacts Service | 3 | 832-924 |
| Status Machine | 3 | 987-1096 |
| Approval Flow | 3 | 1139-1501 |
| Role & Permission Guard | 3 | 1513-1627 |
| Diagnostic & Cleanup Tools | 2 | 1633-1716 |
| **總計** | **34** | **1,717 行** |

---

## 四、治理分類建議（僅供後續參考）

依據 CODEGS-MODULARIZATION-INITIATION.md 之初始模組分類：

| 分類 | 建議歸屬 | 函數 |
|------|----------|------|
| core/bootstrap | Entry Point | `doGet` |
| core/config | Configuration | `CONFIG`, `ROLES`, `STATUS_TRANSITIONS` |
| core/guards | Role Guard | `getUserRole_`, `checkApproverPermission_`, `getUserApproverStatus` |
| domain/quote | Quote Data | `getQuote`, `getQuoteStatus`, `updateQuoteStatus` |
| domain/approval | Approval Flow | `approveQuotation`, `rejectQuotation`, `buildApprovalSnapshot_`, `isValidTransition` |
| domain/stamp | Stamp Services | `getStampDataUrl`, `processItemImagesForDisplay_` |
| services/pdf | PDF Export | `exportQuotePDF` |
| services/mail | Mail Services | `sendQuotationMail`, `buildMailBody_v1_`, `sendRejectNotification_` |
| infra/sheets | Company Profile | `getCompanyProfile` |
| infra/contacts | Contacts | `getContacts`, `getContactsFromQuotes_`, `createContactsSheet` |
| migration/ | Migration Scripts | 所有 `phase*` 與 `migrate*` 函數 |
| tools/ | Diagnostic Tools | `DIAG_*`, `FIX_*`, `test*`, `debug*` 函數 |

---

## 五、聲明

本文件僅作為模組邊界清冊，不授權任何程式碼變更。
後續模組化作業需另行建立執行計畫並經 Architect 核准。

