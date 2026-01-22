# S005 Governance Alignment Audit

- Module: S005
- File: S005-GOVERNANCE-ALIGNMENT-AUDIT.md
- Version: v1.0.0
- Audit Date: 2026-01-08
- Status: **Read-Only Inventory**
- Reference Blueprint: V005 Phase 2 治理結構
- Related Documents:
  - GLOBAL/DATA-CONTRACT-COMPANY.md
  - GLOBAL/DATA-CONTRACT-USER.md
  - GLOBAL/DATA-CONTRACT-STAMP.md
  - S005-CODEGS-MODULE-BOUNDARY-INVENTORY.md

---

## 一、Purpose

本文件對 S005 進行治理對齊盤點，以 V005 Phase 2 已完成之治理結構為藍本，與 GLOBAL Data Contract 對照。

**限制聲明**：
- ❌ 不修改任何程式碼
- ❌ 不提出 migration 方案
- ❌ 不新增欄位

---

## 二、Company 概念對齊盤點

### 2.1 S005 現有 Company 相關實作

| S005 實作 | 說明 | 狀態 |
|-----------|------|------|
| `CONFIG.COMPANY_PROFILE_SHEET` | Company_Profile 工作表名稱 | ✅ 已存在 |
| `getCompanyProfile(companyName)` | 取得公司設定檔 | ✅ 已存在 |
| `getSupervisorEmails_(companyName)` | 取得公司監管人 | ✅ 已存在 |
| `getUserAllowedCompanies(email)` | 取得使用者允許公司 | ✅ 已存在 |
| `getUserCompanies(email)` | 取得使用者公司授權 | ✅ 已存在 |
| `checkCompanyPermission(email, companyCode)` | 檢查公司權限 | ✅ 已存在 |

### 2.2 與 Data Contract 對照

| Data Contract 欄位 | S005 對應 | 狀態 |
|--------------------|-----------|------|
| `company_code` | `companyProfile.company_code` | ✅ 已符合 |
| `company_name` | `companyProfile.company_name` | ✅ 已符合 |
| `template_code` | `companyProfile.template_code` | ✅ 已符合 |
| `contact_person` | `companyProfile.contact_person` | ✅ 已符合 |
| `contact_phone` | `companyProfile.contact_phone` | ✅ 已符合 |
| `contact_email` | `companyProfile.contact_email` | ✅ 已符合 |
| `contact_address` | `companyProfile.contact_address` | ✅ 已符合 |
| `tax_id` | `companyProfile.tax_id` | ✅ 已符合 |
| `stamp_file_id` | `companyProfile.stamp_file_id` | ✅ 已符合 |
| `mail_footer` | `companyProfile.mail_footer` | ✅ 已符合 |
| `supervisor_emails` | `companyProfile.supervisor_emails` | ✅ 已符合 |

### 2.3 命名差異

| S005 名稱 | Data Contract 名稱 | 狀態 |
|-----------|-------------------|------|
| `quote_company` | `company_name` | ⚠️ 名稱不同但語意相同 |
| `quoteCompany` | `company_name` | ⚠️ 變數命名差異 |
| `companyCode` | `company_code` | ✅ 已符合（駝峰 vs 底線） |

---

## 三、User 概念對齊盤點

### 3.1 S005 現有 User 相關實作

| S005 實作 | 說明 | 狀態 |
|-----------|------|------|
| `CONFIG.ADMIN_USERS_SHEET` | Admin_Users 工作表 | ✅ 已存在 |
| `CONFIG.ADMIN_SESSIONS_SHEET` | Admin_Sessions 工作表 | ✅ 已存在 |
| `CONFIG.ADMIN_OTP_SHEET` | Admin_OTP 工作表 | ✅ 已存在 |
| `CONFIG.USERS_ACCESS_SHEET` | USERS_ACCESS 工作表 | ✅ 已存在 |
| `CONFIG.USER_COMPANIES_SHEET` | USER_COMPANIES 工作表 | ✅ 已存在 |
| `CONFIG.USER_CUSTOMERS_SHEET` | USER_CUSTOMERS 工作表 | ✅ 已存在 |
| `getAdminUser_(email)` | 取得使用者資料 | ✅ 已存在 |
| `getUserRole(email)` | 取得使用者角色 | ✅ 已存在 |
| `getCurrentUserEmail()` | 取得當前使用者 | ✅ 已存在 |
| `getCurrentUser(sessionToken)` | 取得當前使用者（含 Session） | ✅ 已存在 |
| `checkRolePermission(email, allowedRoles)` | 檢查角色權限 | ✅ 已存在 |
| `checkPermission(options)` | 綜合權限檢查 | ✅ 已存在 |

### 3.2 與 Data Contract 對照

| Data Contract 欄位 | S005 對應 | 狀態 |
|--------------------|-----------|------|
| `user_id` | `Admin_Users.user_id` | ✅ 已符合 |
| `email` | `Admin_Users.email` | ✅ 已符合 |
| `display_name` | `Admin_Users.display_name` | ✅ 已符合 |
| `pin_hash` | `Admin_Users.pin_hash` | ✅ 已符合 |
| `failed_attempts` | `Admin_Users.failed_attempts` | ✅ 已符合 |
| `locked_until` | `Admin_Users.locked_until` | ✅ 已符合 |
| `role` | `USERS_ACCESS.role` | ✅ 已符合 |
| `status` | `USERS_ACCESS.status` | ✅ 已符合 |

### 3.3 S005 額外 User 相關實作（Contract 未明定）

| S005 實作 | 說明 | 狀態 |
|-----------|------|------|
| `Admin_Sessions` | Device Session 管理 | ✅ 已存在（擴充） |
| `Admin_OTP` | OTP 記錄 | ✅ 已存在（擴充） |
| `USER_CUSTOMERS` | 客戶授權 | ✅ 已存在（擴充） |
| `verifyPin()` | PIN 驗證 | ✅ 已存在（擴充） |
| `verifyOtp()` | OTP 驗證 | ✅ 已存在（擴充） |
| `createDeviceSession_()` | 建立 Session | ✅ 已存在（擴充） |

---

## 四、Role 概念對齊盤點

### 4.1 S005 現有 Role 定義

| S005 常數 | 值 | 說明 |
|-----------|-----|------|
| `ROLES.VIEWER` | `'VIEWER'` | 僅檢視 |
| `ROLES.CREATOR` | `'CREATOR'` | 建立報價單 |
| `ROLES.ISSUER` | `'ISSUER'` | 建立 + 發送 |
| `ROLES.APPROVER` | `'APPROVER'` | 核准 + 印章管理 |

### 4.2 與 Data Contract 對照

| Data Contract Role | S005 對應 | 狀態 |
|--------------------|-----------|------|
| VIEWER | `ROLES.VIEWER` | ✅ 已符合 |
| CREATOR | `ROLES.CREATOR` | ✅ 已符合 |
| ISSUER | `ROLES.ISSUER` | ✅ 已符合 |
| APPROVER | `ROLES.APPROVER` | ✅ 已符合 |

### 4.3 角色權限檢查函數

| 函數 | Data Contract 描述 | 狀態 |
|------|-------------------|------|
| `checkRolePermission()` | 角色權限檢查 | ✅ 已符合 |
| `checkCompanyPermission()` | 公司權限檢查 | ✅ 已符合 |
| `checkCustomerPermission()` | 客戶權限檢查 | ✅ 已存在（擴充） |
| `checkPermission()` | 綜合權限檢查 | ✅ 已符合 |
| `isFinalApprover()` | APPROVER 特殊檢查 | ✅ 已存在（擴充） |

---

## 五、Stamp 概念對齊盤點

### 5.1 S005 現有 Stamp 相關實作

| S005 實作 | 說明 | 狀態 |
|-----------|------|------|
| `companyProfile.stamp_file_id` | 公司印章 File ID | ✅ 已存在 |
| `getStampDataUrl(fileId)` | 印章轉 Data URL | ✅ 已存在 |
| `updateQuotationStamp(refId)` | 更新報價單印章 | ✅ 已存在 |
| `updateAllStampsForCompany(companyName)` | 批次更新印章 | ✅ 已存在 |
| `viewCompanyStamp(companyName)` | 檢視公司印章 | ✅ 已存在 |

### 5.2 與 Data Contract 對照

| Data Contract 欄位 | S005 對應 | 狀態 |
|--------------------|-----------|------|
| `stamp_file_id` | `Company_Profile.stamp_file_id` | ✅ 已符合 |
| `approved_stamp_file_id` | `S005_QUOTES.approved_stamp_file_id` | ✅ 已符合 |
| `draft_stamp_file_id` | `snapshot.stamps.draft_stamp_file_id` | ✅ 已符合 |
| `snapshot.stamps.approved_stamp_file_id` | Snapshot 核准章 | ✅ 已符合 |
| `snapshot.company.stamp_file_id` | Snapshot 公司章 | ✅ 已符合 |

### 5.3 S005 額外 Stamp 相關實作

| S005 實作 | 說明 | 狀態 |
|-----------|------|------|
| `seal_file_id` | 騎縫章（非核准章） | ✅ 已存在（擴充） |
| GOVERNANCE NOTICE | 印章治理通知（程式碼註解） | ✅ 已存在 |

---

## 六、S005 額外概念（V005 / Contract 未涵蓋）

### 6.1 State Machine

| S005 實作 | 說明 |
|-----------|------|
| `QUOTE_STATUS` | 狀態定義常數 |
| `DRAFT → SUBMITTED → APPROVED → SENT` | 狀態轉移流程 |
| `acceptQuotation()` | 商務成立（ACCEPTED） |

### 6.2 Approval Flow

| S005 實作 | 說明 |
|-----------|------|
| `APPROVAL_TOKEN_EXPIRY_MS` | Token 有效期限 |
| `generateApprovalToken_()` | 產生 Token |
| `submitForApproval()` | 送審入口 |
| `handleApprovalAction()` | 審批 Endpoint |
| `FINAL_APPROVERS` | 最終核准人清單 |

### 6.3 Identity / Session

| S005 實作 | 說明 |
|-----------|------|
| `DEVICE_SESSION_EXPIRY_MS` | Session 有效期限 |
| `OTP_EXPIRY_MS` | OTP 有效期限 |
| `LOGIN_MAX_ATTEMPTS` | 登入鎖定控制 |
| `OTP_STATUS` | OTP 狀態碼 |
| `OTP_PURPOSE` | OTP 用途 |

---

## 七、對齊總結

### 7.1 統計

| 分類 | 已符合 | 名稱不同但語意相同 | 尚未出現 | S005 擴充 |
|------|--------|-------------------|----------|-----------|
| Company | 11 | 2 | 0 | 0 |
| User | 8 | 0 | 0 | 6 |
| Role | 4 | 0 | 0 | 1 |
| Stamp | 5 | 0 | 0 | 2 |
| **總計** | **28** | **2** | **0** | **9** |

### 7.2 結論

1. **高度對齊**：S005 與 GLOBAL Data Contract 高度一致
2. **完整實作**：Company / User / Role / Stamp 等核心概念均已實作
3. **額外擴充**：S005 包含 State Machine、Approval Flow、Identity 等 V005 未涵蓋之實作
4. **命名差異**：僅 `quote_company` vs `company_name` 存在命名差異
5. **無缺失**：所有 Data Contract 定義之欄位 S005 均已具備

### 7.3 與 V005 對比

| 項目 | V005 | S005 |
|------|------|------|
| Company 對齊 | ✅ | ✅ |
| User 對齊 | ✅ | ✅ |
| Role 對齊 | ✅ | ✅ |
| Stamp 對齊 | ✅ | ✅ |
| State Machine | 依賴 S005 | ✅ 完整實作 |
| Approval Flow | 依賴 S005 | ✅ 完整實作 |
| Identity/Session | 依賴 S005 | ✅ 完整實作 |

---

## 八、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立（只讀盤點） |

