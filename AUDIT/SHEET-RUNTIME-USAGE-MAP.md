# S005 / V005 Sheet Runtime Usage Map

**Audit ID**: V-USER-001-GOV-AUDIT
**Audit Date**: 2026-01-09
**Audit Type**: Read-Only Structure Scan
**Scope**: S005 Code.gs, V005 Code.gs

---

## 1. Sheet 使用狀態總表

### 1.1 S005 CONFIG 定義的 Sheet

| Sheet Name | CONFIG 常數 | S005 讀取 | S005 寫入 | V005 讀取 | V005 寫入 | 判定 |
|------------|-------------|-----------|-----------|-----------|-----------|------|
| S005_QUOTES | QUOTES_SHEET_NAME | Yes | Yes | Yes | Yes | **Runtime** |
| Company_Profile | COMPANY_PROFILE_SHEET | Yes | Yes (欄位新增) | Yes | Yes (初始化) | **Runtime** |
| User_Company_Permission | USER_PERMISSION_SHEET | Yes | No | Yes (初始化) | Yes (初始化) | **Runtime** |
| USERS_ACCESS | USERS_ACCESS_SHEET | Yes | Yes (初始化) | Yes | No | **Runtime** |
| USER_COMPANIES | USER_COMPANIES_SHEET | Yes | Yes (初始化) | No | No | **Runtime** |
| USER_CUSTOMERS | USER_CUSTOMERS_SHEET | Yes | Yes (初始化) | No | No | **Runtime** |
| Admin_Users | ADMIN_USERS_SHEET | Yes | Yes | No | No | **Runtime** |
| Admin_Sessions | ADMIN_SESSIONS_SHEET | Yes | Yes | No | No | **Runtime** |
| Admin_OTP | ADMIN_OTP_SHEET | Yes | Yes | No | No | **Runtime** |

### 1.2 硬編碼 Sheet（非 CONFIG 定義）

| Sheet Name | S005 讀取 | S005 寫入 | V005 讀取 | V005 寫入 | 判定 |
|------------|-----------|-----------|-----------|-----------|------|
| Contacts | Yes | No | Yes | Yes (初始化) | **Runtime** |
| QUOTATION_INPUT | Yes | Yes | No | No | **Runtime** |
| QUOTATION_ITEMS_INPUT | Yes | Yes | No | No | **Runtime** |
| Quote_Status_Version | No | No | Yes (初始化) | Yes (初始化) | **Legacy/初始化用** |

### 1.3 治理文件提及但程式未直接使用

| Sheet Name | 治理文件來源 | 程式碼引用 | 判定 |
|------------|-------------|-----------|------|
| EXTERNAL_ACCESS | 測試模板提及 | 無 | **Legacy / 文件錯誤** |

---

## 2. 欄位級使用對照（重點表）

### 2.1 User_Company_Permission

| 欄位名稱 | S005 讀取 | S005 寫入 | V005 讀取 | V005 寫入 | 來源函式 / 行號 | 備註 |
|----------|-----------|-----------|-----------|-----------|-----------------|------|
| user_email | Yes | No | No | Yes (init) | S005: getUserAllowedCompanies():1566 | 權限查詢主鍵 |
| company_code | Yes | No | No | Yes (init) | S005: getUserAllowedCompanies():1567 | 公司授權 |
| role | Yes | No | No | Yes (init) | S005: getUserAllowedCompanies():1568 | **讀取但實際未使用於邏輯判斷** |

### 2.2 USERS_ACCESS

| 欄位名稱 | S005 讀取 | S005 寫入 | V005 讀取 | V005 寫入 | 來源函式 / 行號 | 備註 |
|----------|-----------|-----------|-----------|-----------|-----------------|------|
| email | Yes | Yes (init) | Yes | No | S005:2705, V005:1524 | 使用者識別 |
| role | Yes | Yes (init) | Yes | No | S005:2706, V005:1525 | 角色判斷（APPROVER） |
| status | Yes | Yes (init) | Yes | No | S005:2707, V005:1526 | 狀態檢查 |

### 2.3 Company_Profile

| 欄位名稱 | S005 讀取 | S005 寫入 | V005 讀取 | V005 寫入 | 來源函式 / 行號 | 備註 |
|----------|-----------|-----------|-----------|-----------|-----------------|------|
| company_code | Yes | No | Yes | Yes (init) | S005:1589, V005:121 | 公司識別主鍵 |
| company_name | Yes | No | Yes | Yes (init) | S005:1590, V005:121 | 顯示名稱 |
| template_code | No | No | Yes | Yes (init) | V005 | 報價單版型 |
| stamp_file_id | Yes | No | Yes | No | S005:2376, V005:239 | **印章檔案 ID (Security Fix)** |
| seal_file_id | No | No | No | Yes (init) | V005:428 | **Legacy 欄位，與 stamp_file_id 重複** |
| mail_footer | No | No | Yes | Yes (init) | V005:428 | Mail 簽名 |
| supervisor_emails | Yes | Yes (欄位新增) | No | No | S005:3983 | Phase 5-B 新增 |

### 2.4 Admin_Users

| 欄位名稱 | S005 讀取 | S005 寫入 | 來源函式 / 行號 | 備註 |
|----------|-----------|-----------|-----------------|------|
| email | Yes | No | S005:958 | 登入識別 |
| pin_hash | Yes | Yes | S005:842, 845 | PIN 雜湊 |
| user_id | Yes | No | S005:960 | 內部 ID |
| display_name | Yes | No | S005:961 | 顯示名稱 |
| failed_attempts | Yes | Yes | S005:962, 1307 | 登入失敗次數 |
| locked_until | Yes | Yes | S005:963, 1312 | 鎖定到期時間 |

### 2.5 Admin_Sessions

| 欄位名稱 | S005 讀取 | S005 寫入 | 來源函式 / 行號 | 備註 |
|----------|-----------|-----------|-----------------|------|
| token_hash | Yes | No | S005:998, 1046 | Session Token |
| user_id | Yes | Yes | S005:999, 1131 | 使用者 ID |
| device_id | Yes | Yes | S005:1000, 1131 | 裝置識別 |
| expire_at | Yes | Yes | S005:1001, 1131 | 過期時間 |
| revoked | Yes | Yes | S005:1002, 1203 | 撤銷狀態 |
| last_pin_hash | Yes | Yes | S005:1003, 1144 | v1.7 PIN 變更檢測 |
| last_active | Yes | Yes | S005:1175, 1179 | 最後活動時間 |

### 2.6 Admin_OTP

| 欄位名稱 | S005 讀取 | S005 寫入 | 來源函式 / 行號 | 備註 |
|----------|-----------|-----------|-----------------|------|
| user_id | Yes | Yes | S005:1390, 1404 | 使用者 ID |
| otp_hash | Yes | Yes | S005:1470, 1404 | OTP 雜湊 |
| created_at | Yes | Yes | S005:1471, 1404 | 建立時間 |
| expire_at | Yes | Yes | S005:1472, 1404 | 過期時間 |
| used | Yes | Yes | S005:1391, 1397 | 使用狀態 |
| purpose | Yes | Yes | S005:1402, 1404 | OTP 用途（選填） |

### 2.7 S005_QUOTES（部分重要欄位）

| 欄位名稱 | S005 讀取 | S005 寫入 | V005 讀取 | V005 寫入 | 備註 |
|----------|-----------|-----------|-----------|-----------|------|
| ref_id | Yes | Yes | Yes | No | 報價單主鍵 |
| status | Yes | Yes | Yes | Yes | 狀態欄位 |
| quote_company | Yes | Yes | Yes | No | 報價公司 |
| quotation_snapshot_json | Yes | Yes | Yes | Yes | JSON 快照 |
| approved_stamp_file_id | Yes | Yes | Yes | Yes | 核准印章 |
| approved_by | Yes | Yes | Yes | Yes | 核准者 |
| approved_at | Yes | Yes | Yes | Yes | 核准時間 |
| rejected_reason | Yes | Yes | Yes | Yes | 駁回原因 |
| rejected_at | Yes | Yes | Yes | Yes | 駁回時間 |
| rejected_by | Yes | Yes | Yes | Yes | 駁回者 |
| approval_token | Yes | Yes | No | No | 審批 Token |
| token_expires_at | Yes | Yes | No | No | Token 過期 |
| submitted_by | Yes | Yes | No | No | 遞交者 |
| submitted_at | Yes | Yes | No | No | 遞交時間 |
| accepted_at | Yes | Yes | No | No | Phase 6 接受時間 |
| accepted_by | Yes | Yes | No | No | Phase 6 接受者 |

---

## 3. 治理落差摘要

### 3.1 治理文件有提，但程式未使用

| 項目 | 治理文件來源 | 實際狀態 | 說明 |
|------|-------------|----------|------|
| EXTERNAL_ACCESS 表 | TEST-USER-VALIDATION-2026-01-09.md | **不存在於程式碼** | 測試模板錯誤引用，應為 User_Company_Permission |
| USERS_ACCESS.role 作為主要權限來源 | DECISION-V005-EXTERNAL-VIEWER-HARD-GATE.md | **部分正確** | V005 確實使用 USERS_ACCESS.role，但 S005 主要使用 User_Company_Permission |

### 3.2 欄位存在但未被程式引用

| Sheet | 欄位 | 說明 |
|-------|------|------|
| Company_Profile | seal_file_id | V005 初始化時建立，但實際使用 stamp_file_id |
| User_Company_Permission | role | 被讀取但未參與邏輯判斷（getUserAllowedCompanies 只取 company_code） |
| Quote_Status_Version | 全部欄位 | 僅 V005 初始化時建立，無運行時使用 |

### 3.3 可能的 Legacy / 歷史遺留

| 項目 | 說明 |
|------|------|
| seal_file_id vs stamp_file_id | Company_Profile 有兩個印章相關欄位，stamp_file_id 為 Security Fix 後的正式欄位 |
| Quote_Status_Version 表 | 初始化函數建立但無運行時使用，可能為早期版本控制設計 |
| User_Company_Permission.role | 欄位存在且被讀取，但未參與權限判斷邏輯 |

### 3.4 權限架構實際流程

```
┌─────────────────────────────────────────────────────────────┐
│                    S005 權限判斷流程                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 登入驗證                                                │
│     └─ Admin_Users (email, pin_hash)                       │
│     └─ Admin_Sessions (token, device)                      │
│     └─ Admin_OTP (otp_hash, expire)                        │
│                                                             │
│  2. 公司授權                                                │
│     └─ User_Company_Permission (user_email → company_code) │
│        ※ role 欄位被讀取但未使用                            │
│                                                             │
│  3. 審核權限 (Phase 4 Hard Gate)                           │
│     └─ isInternalUser_() ← Email 網域判斷                  │
│        ※ 不查表，直接檢查 @horus.tw / @dapanda.com.tw      │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    V005 權限判斷流程                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 角色檢查                                                │
│     └─ USERS_ACCESS (email → role)                         │
│     └─ checkUserRole() / isUserApprover()                  │
│                                                             │
│  2. 審核權限 (Phase 4 Hard Gate)                           │
│     └─ isInternalUser_() ← Email 網域判斷                  │
│        ※ 與 S005 相同，不查表                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.5 關鍵發現

1. **雙權限表並存**：
   - `User_Company_Permission`：控制「可代表哪些公司建立報價單」
   - `USERS_ACCESS`：控制「角色權限（APPROVER 等）」
   - 兩表功能不同，非重複

2. **External Hard Gate 不依賴任何表**：
   - `isInternalUser_()` 直接檢查 Email 網域
   - 治理文件描述「不在 USERS_ACCESS 表中」是錯誤的——實際上根本不查表

3. **User_Company_Permission.role 欄位**：
   - 被 `getUserAllowedCompanies()` 讀取並回傳
   - 但回傳後未被任何邏輯使用
   - 可能為預留欄位或早期設計遺留

---

## 4. 行號索引（供追蹤用）

### S005 Code.gs

| 函式 | 行號 | 說明 |
|------|------|------|
| CONFIG 定義 | 77-91 | Sheet 名稱常數 |
| getUserAllowedCompanies() | 1557-1609 | 讀取 User_Company_Permission |
| initPermissionSheets() | 2821-2866 | 初始化 USERS_ACCESS, USER_COMPANIES, USER_CUSTOMERS |
| isInternalUser_() | (inline) | Email 網域檢查 |
| checkPermission() | 263-280 | OTP + allowedCompanies 檢查 |

### V005 Code.gs

| 函式 | 行號 | 說明 |
|------|------|------|
| CONFIG 定義 | 26-34 | Sheet 名稱常數 |
| checkUserRole() | 1515-1560 | 讀取 USERS_ACCESS |
| isUserApprover() | 1635-1660 | APPROVER 角色檢查 |
| initDataSheets() | 420-460 | 初始化 Company_Profile, User_Company_Permission, Quote_Status_Version |

---

*Audit completed: 2026-01-09*
*This is a read-only governance audit. No modifications were made.*
