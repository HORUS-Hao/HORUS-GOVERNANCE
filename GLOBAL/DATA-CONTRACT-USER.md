# Data Contract — UserId

- Module: GLOBAL
- File: DATA-CONTRACT-USER.md
- Version: v1.0.0
- Effective Date: 2026-01-08
- Status: **Active**
- Related Governance: GOVERNANCE-MULTI-USER.md

---

## 一、Purpose

本文件定義 `UserId` 之資料結構規格，作為工程實作之唯一依據。

**適用範圍**：
- S005、V005 及所有依賴使用者識別之模組
- 身分驗證、權限檢查、審計追蹤等操作

---

## 二、資料結構定義

### 2.1 UserId Schema

```typescript
interface UserId {
  user_id: string;           // Primary Key, UUID
  email: string;             // 唯一識別，小寫
}
```

### 2.2 Admin User Schema

```typescript
interface AdminUser {
  // 識別
  user_id: string;           // PK, UUID
  email: string;             // 唯一，小寫，去空白
  display_name: string;      // 顯示名稱
  
  // 驗證
  pin_hash: string;          // PIN 雜湊值 (SHA-256)
  
  // 安全控制
  failed_attempts: number;   // 登入失敗次數
  locked_until: Date | null; // 鎖定到期時間
}
```

### 2.3 User Access Schema（角色授權）

```typescript
interface UserAccess {
  email: string;             // FK → AdminUser.email
  role: Role;                // 角色（VIEWER | CREATOR | ISSUER | APPROVER）
  status: string;            // 狀態（ACTIVE | INACTIVE）
}

type Role = 'VIEWER' | 'CREATOR' | 'ISSUER' | 'APPROVER';
```

### 2.4 User Company Schema（公司授權）

```typescript
interface UserCompany {
  email: string;             // FK → AdminUser.email
  company_code: string;      // FK → CompanyProfile.company_code
}
```

### 2.5 欄位約束

| 欄位 | 型別 | 必填 | 唯一 | 說明 |
|------|------|------|------|------|
| user_id | string | ✅ | ✅ | UUID 格式 |
| email | string | ✅ | ✅ | 小寫，去空白 |
| pin_hash | string | ✅ | ❌ | SHA-256 雜湊 |
| role | enum | ✅ | ❌ | 四種角色之一 |

---

## 三、與 S005 / V005 既有欄位對應表

### 3.1 Admin_Users 工作表對應

| Data Contract 欄位 | Admin_Users 欄位 | 狀態 |
|--------------------|------------------|------|
| user_id | user_id | ✅ 已存在 |
| email | email | ✅ 已存在 |
| display_name | display_name | ✅ 已存在 |
| pin_hash | pin_hash | ✅ 已存在 |
| failed_attempts | failed_attempts | ✅ 已存在 |
| locked_until | locked_until | ✅ 已存在 |

### 3.2 USERS_ACCESS 工作表對應

| Data Contract 欄位 | USERS_ACCESS 欄位 | 狀態 |
|--------------------|-------------------|------|
| email | email | ✅ 已存在 |
| role | role | ✅ 已存在 |
| status | status | ✅ 已存在 |

### 3.3 USER_COMPANIES 工作表對應

| Data Contract 欄位 | USER_COMPANIES 欄位 | 狀態 |
|--------------------|---------------------|------|
| email | email | ✅ 已存在 |
| company_code | company_code | ✅ 已存在 |

### 3.4 S005_QUOTES 審計欄位對應

| Data Contract 欄位 | S005_QUOTES 欄位 | 說明 |
|--------------------|------------------|------|
| email | created_by | 建立者（選用） |
| email | submitted_by | 送審者 |
| email | approved_by | 核准者 |
| email | rejected_by | 退回者 |

---

## 四、識別與查詢規則

### 4.1 Primary Key

- **唯一識別**：`user_id`（UUID）
- **業務識別**：`email`（主要使用）

### 4.2 查詢模式

```javascript
// 標準查詢：由 email 取得使用者
function getAdminUser_(email) → AdminUser

// 角色查詢
function getUserRole(email) → { role, status }

// 公司授權查詢
function getUserAllowedCompanies(email) → CompanyProfile[]
```

### 4.3 關聯查詢

| 來源 | 關聯欄位 | 目標 |
|------|----------|------|
| Admin_Sessions.user_id | user_id | Admin_Users |
| Admin_OTP.user_id | user_id | Admin_Users |
| USERS_ACCESS.email | email | Admin_Users |
| USER_COMPANIES.email | email | Admin_Users |

---

## 五、角色定義對應

| Data Contract | S005/V005 常數 | 說明 |
|---------------|----------------|------|
| VIEWER | ROLES.VIEWER | 僅檢視 |
| CREATOR | ROLES.CREATOR | 建立報價單 |
| ISSUER | ROLES.ISSUER | 建立 + 發送 |
| APPROVER | ROLES.APPROVER | 核准 + 印章管理 |

---

## 六、驗證規則

| 規則 | 說明 |
|------|------|
| email 格式 | 有效 Email 格式 |
| email 正規化 | 小寫，trim() |
| email 唯一 | 不可重複 |
| pin_hash 格式 | 64 字元 SHA-256 hex |
| role 值域 | VIEWER / CREATOR / ISSUER / APPROVER |
| status 值域 | ACTIVE / INACTIVE |

---

## 七、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立 |

