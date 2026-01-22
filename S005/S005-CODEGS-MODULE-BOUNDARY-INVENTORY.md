# S005 Code.gs 模組邊界盤點

- Module: S005
- File: S005-CODEGS-MODULE-BOUNDARY-INVENTORY.md
- Version: v1.0.0
- Effective Date: 2026-01-08
- Status: Active
- 來源檔案：`10-基礎服務層-BASE-SERVICES/S005-Submission-Entry/Code.gs`
- 總行數：4,754 行

---

## 一、盤點目的

本文件列出 S005 Code.gs 內所有功能區塊與函數邊界。

**本文件不修改任何程式碼、不拆分、不重構、不優化、不新增任何治理裁定。**

---

## 二、模組邊界清冊

### 2.1 Entry / WebApp

| 函數 | 行號 | 說明 |
|------|------|------|
| `doGet(e)` | 180-193 | Web App 入口（含 Approval Endpoint 路由） |
| `doPost(e)` | 198-211 | POST 入口（API 串接） |

### 2.2 Configuration & Constants（設定與常數）

| 對象 | 行號 | 說明 |
|------|------|------|
| `CONFIG` | 77-91 | 系統組態（Spreadsheet ID、Sheet 名稱等） |
| `ROLES` | 96-101 | 角色定義（VIEWER、CREATOR、ISSUER、APPROVER） |
| `QUOTE_STATUS` | 106-114 | 報價單狀態定義（註：`PENDING_APPROVAL` 為合法狀態字串，非 QUOTE_STATUS 常數） |
| `APPROVAL_TOKEN_EXPIRY_MS` | 120 | Approval Token 有效期限（24 小時） |
| `DEVICE_SESSION_EXPIRY_MS` | 126 | Device Session 有效期限（30 天） |
| `OTP_EXPIRY_MS` | 132 | OTP 有效期限（15 分鐘） |
| `LOGIN_MAX_ATTEMPTS` | 137 | 登入最大錯誤次數（5 次） |
| `LOGIN_LOCKOUT_MS` | 138 | 鎖定時間（15 分鐘） |
| `OTP_STATUS` | 143-149 | OTP 驗證狀態碼 |
| `OTP_PURPOSE` | 154-157 | OTP 用途 |
| `SUPERVISOR_EXEMPT_EMAILS` | 162-165 | 監管豁免帳號 |
| `DEFAULT_SUPERVISORS` | 171-174 | 預設監管 CC |

### 2.3 State Machine（狀態機）

| 函數/常數 | 行號 | 說明 |
|-----------|------|------|
| `QUOTE_STATUS` | 106-114 | 狀態定義（DRAFT → SUBMITTED → APPROVED/REJECTED → SENT） |
| `processSubmission(payload)` | 217-285 | 建立報價單（初始狀態 DRAFT） |
| `writeToQuotes(data)` | 433-461 | 寫入資料庫（狀態欄位） |
| `submitForApproval(refId)` | 2878-2958 | 送審（DRAFT → SUBMITTED） |
| `executeApproval_(...)` | 3000-3100 | 核准執行（SUBMITTED → APPROVED） |
| `executeRejection_(...)` | 3106-3186 | 退回執行（SUBMITTED → REJECTED） |
| `sendQuotationMail(...)` | 3619-3717 | 發送報價（APPROVED → SENT） |
| `acceptQuotation(refId)` | 4371-4488 | 商務成立（→ ACCEPTED） |

### 2.4 Approval Flow（審批流程）

| 函數 | 行號 | 說明 |
|------|------|------|
| `isFinalApprover(email)` | 2274-2276 | 檢查是否為 Final Approver |
| `getApprovalInfo()` | 2282-2288 | 取得審批資訊 |
| `approveQuotation(refId)` | 2303-2444 | 審批報價單（Web Review 入口） |
| `rejectQuotation(refId, reason)` | 2454-2550 | 退回報價單（Web Review 入口） |
| `generateApprovalToken_()` | 2868-2875 | 產生 Approval Token |
| `submitForApproval(refId)` | 2878-2958 | 送審（觸發審批流程） |
| `handleApprovalAction(e)` | 2962-2994 | 處理 Approval Endpoint |
| `executeApproval_(...)` | 3000-3100 | 執行核准 |
| `executeRejection_(...)` | 3106-3186 | 執行退回 |
| `buildApprovalResultPage_(...)` | 3546-3576 | 建立審批結果頁面 |

### 2.5 Role / Permission（角色與權限）

| 函數 | 行號 | 說明 |
|------|------|------|
| `getCurrentUserEmail()` | 2562-2564 | 取得當前使用者 email |
| `getUserRole(email)` | 2571-2601 | 取得使用者角色 |
| `getUserCompanies(email)` | 2603-2631 | 取得使用者可操作公司 |
| `getUserCustomers(email, companyCode)` | 2633-2662 | 取得使用者可操作客戶 |
| `checkRolePermission(email, allowedRoles)` | 2664-2702 | 檢查角色權限 |
| `checkCompanyPermission(email, companyCode)` | 2704-2732 | 檢查公司權限 |
| `checkCustomerPermission(...)` | 2734-2761 | 檢查客戶權限 |
| `checkPermission(options)` | 2763-2819 | 綜合權限檢查 |
| `initPermissionSheets()` | 2821-2866 | 初始化權限表 |
| `getCurrentUser(sessionToken)` | 1482-1507 | 取得當前使用者（支援 Session） |
| `getUserAllowedCompanies(userEmail)` | 1509-1578 | 取得使用者允許的公司清單 |

### 2.6 Company Context（公司設定）

| 函數 | 行號 | 說明 |
|------|------|------|
| `getCompanyProfile(companyName)` | 370-407 | 取得公司設定檔 |
| `getSupervisorEmails_(companyName)` | 3578-3606 | 取得公司監管人 email |

### 2.7 Stamp / Seal Handling（印章處理）

| 函數 | 行號 | 說明 |
|------|------|------|
| `getStampDataUrl(fileId)` | 414-426 | 從 Drive File ID 取得印章 Data URL |
| `updateQuotationStamp(refId)` | 4091-4209 | 更新報價單印章 |
| `updateAllStampsForCompany(companyName)` | 4211-4323 | 批次更新公司所有印章 |
| `viewCompanyStamp(companyName)` | 4325-4369 | 檢視公司印章 |
| `runUpdateStamp()` | 4063-4067 | 便利函數：更新印章 |
| `runUpdateAllStamps()` | 4069-4073 | 便利函數：批次更新印章 |
| `runViewStamp()` | 4075-4089 | 便利函數：檢視印章 |

### 2.8 Notification（通知）

| 函數 | 行號 | 說明 |
|------|------|------|
| `sendQuoteCreationNotification_(...)` | 3206-3364 | 報價單建立通知 |
| `sendApprovalRequestMail_(...)` | 3366-3445 | 送審通知 Mail |
| `sendApprovalResultMail_(...)` | 3447-3472 | 審批結果通知 Mail |
| `sendQuotationMail(refId, options)` | 3619-3717 | 發送報價單給客戶 |
| `getApproverEmails_()` | 3474-3498 | 取得核准人 email 清單 |
| `getQuoteSummary_(refId)` | 3500-3544 | 取得報價摘要（供 Mail 使用） |

### 2.9 Identity / Session（身分驗證）

| 函數 | 行號 | 說明 |
|------|------|------|
| `sha256_(input)` | 514-519 | SHA-256 Hash |
| `verifyPin(email, pin, deviceId)` | 528-602 | 驗證 PIN（第一層驗證） |
| `verifyOtp(email, otp, deviceId)` | 611-657 | 驗證 OTP 並建立 Session |
| `resendOtp(email)` | 664-703 | 重新寄送 OTP |
| `initiatePinReset(email, oldPin)` | 711-756 | 發起 PIN 變更流程 |
| `completePinReset(email, otp, newPinHash)` | 765-813 | 完成 PIN 變更 |
| `getUserBySession(sessionToken)` | 846-870 | 從 Session Token 取得使用者 |
| `logoutSession(sessionToken)` | 877-887 | 登出 Session |
| `getAdminUser_(email)` | 900-932 | 取得 Admin_Users 使用者資料 |
| `getValidDeviceSession_(email, deviceId)` | 940-982 | 取得有效 Device Session |
| `getSessionByToken_(token)` | 989-1028 | 根據 Token 取得 Session |
| `getUserEmailById_(userId)` | 1033-1051 | 根據 user_id 取得 email |
| `createDeviceSession_(email, deviceId, pinHash)` | 1060-1111 | 建立 Device Session |
| `updateSessionLastActive_(token)` | 1117-1135 | 更新 Session 最後活動時間 |
| `revokeSession_(token)` | 1141-1159 | 撤銷 Session |
| `revokeAllUserSessions_(userId)` | 819-839 | 撤銷使用者所有 Session |
| `detectLoginRiskEvent_(...)` | 1179-1206 | 偵測登入風險事件 |
| `checkUserLockout_(user)` | 1213-1234 | 檢查使用者是否被鎖定 |
| `incrementFailedAttempts_(userId)` | 1240-1271 | 累加失敗次數 |
| `resetFailedAttempts_(userId)` | 1277-1300 | 重置失敗次數 |
| `sendOtp_(email, purpose)` | 1313-1385 | 發送 OTP Email |
| `validateOtp_(email, otp)` | 1399-1469 | 驗證 OTP |

### 2.10 Core Business Logic（核心業務）

| 函數 | 行號 | 說明 |
|------|------|------|
| `processSubmission(payload)` | 217-285 | 核心處理邏輯 |
| `buildSnapshot_(createdAt, payload, companyProfile)` | 315-364 | 建立報價快照 |
| `writeToQuotes(data)` | 433-461 | 寫入報價資料庫 |
| `clientProcessSubmission(payload)` | 466-495 | 前端呼叫入口 |
| `getRecipientList(options)` | 1580-1729 | 取得報價對象清單 |
| `deleteRecipientHistory(email)` | 1731-1783 | 刪除報價對象歷史 |
| `acceptQuotation(refId)` | 4371-4488 | 商務成立（客戶確認接受） |

### 2.11 Utility（工具函數）

| 函數 | 行號 | 說明 |
|------|------|------|
| `createQuotesSpreadsheet()` | 1785-1837 | 建立 Quotes Spreadsheet |
| `onOpen()` | 1839-1875 | Spreadsheet 開啟觸發（建立選單） |
| `PIN_HASH(pin)` | 1877-1893 | Sheet Custom Function（PIN Hash） |

### 2.12 Migration / Setup（遷移與設定）

| 函數 | 行號 | 說明 |
|------|------|------|
| `phase4c_createInputSheet()` | 1895-1963 | 建立 Input Sheet |
| `createDraftFromSelectedRow()` | 1965-1998 | 從選取列建立草稿 |
| `createDraftFromAllPending()` | 2000-2055 | 從所有待處理建立草稿 |
| `createDraftFromRow_(sheet, rowNum)` | 2057-2154 | 從列建立草稿（內部） |
| `biz11_migrateCompanyProfile()` | 2156-2191 | Company_Profile 遷移 |
| `biz11_migrateQuotesSheet()` | 2193-2228 | Quotes Sheet 遷移 |
| `biz11_runAllMigrations()` | 2230-2272 | 執行所有遷移 |
| `initPhase5BColumns()` | 3731-3769 | Phase 5-B 欄位初始化 |
| `createQuotationInputSheet_NoUI()` | 3811-3867 | 建立 Quotation Input Sheet（無 UI） |
| `createQuotationItemsInputSheet()` | 4490-4547 | 建立 Quotation Items Input Sheet |
| `processItemsInput()` | 4549-4731 | 處理 Items Input |
| `addRefKeyColumnToInput()` | 4733-4754 | 新增 ref_key 欄位 |

### 2.13 Test Functions（測試函數）

| 函數 | 行號 | 說明 |
|------|------|------|
| `testSubmitForApproval()` | 3772-3777 | 測試送審 |
| `test_Step1_SetupSheets()` | 3789-3809 | 測試 Step 1 |
| `test_Step2_AddTestDataAndProcess()` | 3869-3929 | 測試 Step 2 |
| `test_Step3_AcceptQuotation()` | 3931-4001 | 測試 Step 3 |
| `test_FullTest()` | 4003-4034 | 完整測試 |
| `testApproveQuotation()` | 4036-4042 | 測試審批 |
| `testCreateQuote()` | 4044-4061 | 測試建立報價 |

---

## 三、相關檔案

| 檔案 | 說明 |
|------|------|
| `S005_Setup.gs` | v1.6/v1.7 Admin Sheets 設定 |
| `ImageHandler.js` | 商品圖片處理（Image Governance） |
| `Entry.html` | 前端 HTML 介面 |

---

## 四、模組邊界統計

| 分類 | 函數數量 |
|------|----------|
| Entry / WebApp | 2 |
| Configuration & Constants | 12 |
| State Machine | 8 |
| Approval Flow | 10 |
| Role / Permission | 11 |
| Company Context | 2 |
| Stamp / Seal Handling | 7 |
| Notification | 6 |
| Identity / Session | 22 |
| Core Business Logic | 6 |
| Utility | 3 |
| Migration / Setup | 12 |
| Test Functions | 7 |
| **總計** | **108** |

---

## 五、治理聲明

本文件僅作為模組邊界盤點，不授權任何程式碼變更。
如需進行模組化作業，需另行建立執行計畫並經 Architect 核准。

---

## 六、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立 |

