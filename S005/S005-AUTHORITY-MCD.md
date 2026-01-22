# S005 Authority 最小完成定義（MCD）

- 文件：S005-AUTHORITY-MCD.md
- 版本：v1.0.0
- 建立日期：2026-01-08
- 模組：S005 (Submission Entry)
- 層級：Authority (Company / User / Role / State / Approval)

---

## 一、文件目的

本文件定義 S005 模組 Authority 的**最小完成定義（Minimum Completion Definition）**，作為「Authority 已完成」的裁定依據。

**盤點原則**：僅盤「是否具備」，不盤實作細節。

---

## 二、Authority 構成要件清單

### 2.1 User 身分是否唯一可追蹤

| 檢查項目 | 狀態 | 依據 |
|----------|------|------|
| 是否有唯一識別碼 | ✅ 已具備 | `Admin_Users.email` 為唯一鍵 |
| 是否有身分驗證機制 | ✅ 已具備 | PIN + Email OTP + Device Session |
| 是否可追溯操作者 | ✅ 已具備 | `submitted_by`, `approved_by`, `rejected_by` |
| Session 是否可管理 | ✅ 已具備 | `Admin_Sessions` 表，30 天有效期 |

**小結**：User 身分 **✅ 已具備**

---

### 2.2 Company 關聯是否明確

| 檢查項目 | 狀態 | 依據 |
|----------|------|------|
| 是否有 Company 識別碼 | ✅ 已具備 | `Company_Profile.company_code` |
| 報價單是否綁定公司 | ✅ 已具備 | `quote_company` 欄位 |
| 使用者是否有公司授權 | ✅ 已具備 | `USER_COMPANIES` 表 |
| 印章是否綁定公司 | ✅ 已具備 | `Company_Profile.stamp_file_id` |

**小結**：Company 關聯 **✅ 已具備**

---

### 2.3 Role 是否影響行為

| 檢查項目 | 狀態 | 依據 |
|----------|------|------|
| 是否有角色定義 | ✅ 已具備 | `ROLES = { VIEWER, CREATOR, ISSUER, APPROVER }` |
| 是否有權限檢查機制 | ✅ 已具備 | `checkPermission()` 函數 |
| 角色是否限制操作 | ✅ 已具備 | CREATOR 可建立、APPROVER 可核准 |
| 是否有角色狀態管理 | ✅ 已具備 | `USERS_ACCESS.status` 欄位 |

**角色行為對照**：

| 角色 | 可建立報價 | 可送審 | 可核准/退回 | 可發送 |
|------|-----------|--------|------------|--------|
| VIEWER | ❌ | ❌ | ❌ | ❌ |
| CREATOR | ✅ | ✅ | ❌ | ❌ |
| ISSUER | ✅ | ✅ | ❌ | ✅ |
| APPROVER | ✅ | ✅ | ✅ | ✅ |

**小結**：Role 行為影響 **✅ 已具備**

---

### 2.4 State 是否不可逆

| 檢查項目 | 狀態 | 依據 |
|----------|------|------|
| 是否有狀態定義 | ✅ 已具備 | `QUOTE_STATUS = { DRAFT, SUBMITTED, APPROVED, REJECTED, SENT, VOIDED, ACCEPTED }` |
| 是否有狀態轉換規則 | ✅ 已具備 | 狀態機有方向性限制 |
| 是否記錄狀態變更時間 | ✅ 已具備 | `status_updated_at` 欄位 |
| 是否防止非法回滾 | ✅ 已具備 | 程式邏輯檢查當前狀態 |

**狀態機轉換規則**：

```
DRAFT → SUBMITTED → APPROVED → SENT
                 ↘ REJECTED
```

| 轉換 | 允許 | 禁止回滾 |
|------|------|----------|
| DRAFT → SUBMITTED | ✅ | ✅ |
| SUBMITTED → APPROVED | ✅ | ✅ |
| SUBMITTED → REJECTED | ✅ | ✅ |
| APPROVED → SENT | ✅ | ✅ |
| SENT → DRAFT | ❌ | ✅ |
| APPROVED → DRAFT | ❌ | ✅ |

**小結**：State 不可逆 **✅ 已具備**

---

### 2.5 Approval 是否有責任歸屬

| 檢查項目 | 狀態 | 依據 |
|----------|------|------|
| 是否記錄核准者 | ✅ 已具備 | `approved_by` 欄位 |
| 是否記錄核准時間 | ✅ 已具備 | `approved_at` 欄位 |
| 是否有核准權限限制 | ✅ 已具備 | `isFinalApprover()` 檢查 |
| 是否有審批 Token 機制 | ✅ 已具備 | `approval_token` + `token_expires_at` |
| 退回是否有責任歸屬 | ✅ 已具備 | `rejected_by`, `rejected_at`, `reject_reason` |

**小結**：Approval 責任歸屬 **✅ 已具備**

---

## 三、總結

### 3.1 Authority 構成要件彙整

| 要件 | 狀態 |
|------|------|
| User 身分唯一可追蹤 | ✅ 已具備 |
| Company 關聯明確 | ✅ 已具備 |
| Role 影響行為 | ✅ 已具備 |
| State 不可逆 | ✅ 已具備 |
| Approval 責任歸屬 | ✅ 已具備 |

### 3.2 一句話裁定

> **S005 模組 Authority 層級已達最小完成定義（MCD）。**
> **可宣告 S005 Authority 完成。**

---

## 四、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立，Authority MCD 裁定 |

