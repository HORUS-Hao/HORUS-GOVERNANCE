# DECISION: S005 External Submit Gate

- 文件：DECISION-S005-EXTERNAL-SUBMIT-GATE.md
- 版本：v1.0.0
- 建立日期：2026-01-09
- 狀態：**Active**
- 適用模組：S005 (Submission Entry)

---

## 一、決策摘要

本文件定義 S005 報價提交流程中，內部/外部使用者的權限矩陣與狀態落點規則。

---

## 二、允許/禁止矩陣

### 2.1 Role × Source × OTP 矩陣

| Role | Source | OTP 狀態 | 允許提交 | 狀態落點 |
|------|--------|----------|----------|----------|
| APPROVER | Internal | Verified | ✅ Allow | DRAFT |
| APPROVER | Internal | Not Verified | ❌ Deny | - |
| APPROVER | External | Verified | ✅ Allow | DRAFT |
| APPROVER | External | Not Verified | ❌ Deny | - |
| ISSUER | Internal | Verified | ✅ Allow | DRAFT |
| ISSUER | Internal | Not Verified | ❌ Deny | - |
| ISSUER | External | Verified | ✅ Allow | PENDING_APPROVAL |
| ISSUER | External | Not Verified | ❌ Deny | - |
| CREATOR | Internal | Verified | ✅ Allow | DRAFT |
| CREATOR | Internal | Not Verified | ❌ Deny | - |
| **CREATOR** | **External** | **Verified** | ✅ **Allow** | **PENDING_APPROVAL** |
| CREATOR | External | Not Verified | ❌ Deny | - |
| VIEWER | Internal | Any | ❌ Deny | - |
| VIEWER | External | Any | ❌ Deny | - |

### 2.2 矩陣規則說明

| 規則 | 說明 |
|------|------|
| OTP 必須驗證 | 所有提交行為必須通過 OTP 驗證 |
| VIEWER 無提交權限 | VIEWER 角色在任何情況下都不能提交 |
| External CREATOR/ISSUER | 外部來源的 CREATOR/ISSUER 提交後狀態為 PENDING_APPROVAL |
| Internal 一律 DRAFT | 內部來源提交後狀態為 DRAFT（可自行編輯） |

---

## 三、外部 CREATOR Allow 條件

### 3.1 Allow 條件（全部必須滿足）

| # | 條件 | 檢查方式 |
|---|------|----------|
| 1 | Role = CREATOR | `getUserRole(email) === 'CREATOR'` |
| 2 | OTP Verified = TRUE | `session.otp_verified === true` |
| 3 | Source = External | `request.source === 'EXTERNAL'` |
| 4 | Company 授權 | `userAllowedCompanies.includes(quoteCompany)` |
| 5 | Session 有效 | `session.expires_at > now` |

### 3.2 狀態落點

| 條件 | 狀態落點 |
|------|----------|
| External CREATOR + All Conditions Met | `PENDING_APPROVAL` |

### 3.3 PENDING_APPROVAL 行為

| 項目 | 行為 |
|------|------|
| 可編輯 | ❌ 否（需 APPROVER 審核） |
| 可刪除 | ❌ 否 |
| 可送審 | ❌ 否（已在審核狀態） |
| 通知 | ✅ 自動發送審核通知給 APPROVER |

> **註**：APPROVER 在 S005 Mail Routing SSOT 中，具體落地為 `Company_Profile.supervisor_emails`。
> 詳見：`HORUS-GOVERNANCE/S005/S005_MAIL_ROUTING_GOVERNANCE.md`

---

## 四、Deny Message 規格

### 4.1 Deny 代碼與訊息

| Deny Code | Condition | Message (中文) | Message (English) |
|-----------|-----------|----------------|-------------------|
| `DENY_NO_OTP` | OTP 未驗證 | 請先完成 OTP 驗證 | OTP verification required |
| `DENY_NO_ROLE` | Role 不存在 | 您沒有提交權限 | You do not have submit permission |
| `DENY_VIEWER` | Role = VIEWER | 檢視者無法提交報價 | Viewers cannot submit quotations |
| `DENY_NO_COMPANY` | 未授權公司 | 您未被授權操作此公司 | You are not authorized for this company |
| `DENY_SESSION_EXPIRED` | Session 過期 | 登入已過期，請重新登入 | Session expired, please login again |
| `DENY_INTERNAL_ERROR` | 系統錯誤 | 系統錯誤，請稍後再試 | System error, please try again later |

### 4.2 Deny Response 格式

```json
{
  "success": false,
  "code": "DENY_NO_OTP",
  "message": "請先完成 OTP 驗證",
  "message_en": "OTP verification required",
  "timestamp": "2026-01-09T12:00:00Z"
}
```

---

## 五、Audit Log 欄位

### 5.1 必要欄位

| 欄位名稱 | 類型 | 說明 | 範例 |
|----------|------|------|------|
| `log_id` | string | 唯一識別碼 | `LOG-20260109-001` |
| `timestamp` | datetime | 事件時間 | `2026-01-09T12:00:00Z` |
| `action` | string | 動作類型 | `SUBMIT_ATTEMPT` |
| `result` | string | 結果 | `ALLOW` / `DENY` |
| `user_email` | string | 操作者 Email | `user@example.com` |
| `user_role` | string | 操作者角色 | `CREATOR` |
| `source` | string | 來源 | `INTERNAL` / `EXTERNAL` |
| `otp_verified` | boolean | OTP 狀態 | `true` / `false` |
| `quote_company` | string | 報價公司 | `HORUS` |
| `ref_id` | string | 報價單編號（若有） | `SUB-20260109-001` |
| `deny_code` | string | 拒絕代碼（若 DENY） | `DENY_NO_OTP` |
| `status_after` | string | 提交後狀態（若 ALLOW） | `PENDING_APPROVAL` |

### 5.2 Audit Log 範例

#### Allow 範例

```json
{
  "log_id": "LOG-20260109-001",
  "timestamp": "2026-01-09T12:00:00Z",
  "action": "SUBMIT_ATTEMPT",
  "result": "ALLOW",
  "user_email": "creator@external.com",
  "user_role": "CREATOR",
  "source": "EXTERNAL",
  "otp_verified": true,
  "quote_company": "HORUS",
  "ref_id": "SUB-20260109-001",
  "deny_code": null,
  "status_after": "PENDING_APPROVAL"
}
```

#### Deny 範例

```json
{
  "log_id": "LOG-20260109-002",
  "timestamp": "2026-01-09T12:01:00Z",
  "action": "SUBMIT_ATTEMPT",
  "result": "DENY",
  "user_email": "viewer@external.com",
  "user_role": "VIEWER",
  "source": "EXTERNAL",
  "otp_verified": true,
  "quote_company": "HORUS",
  "ref_id": null,
  "deny_code": "DENY_VIEWER",
  "status_after": null
}
```

---

## 六、規則摘要表

| 規則 ID | 規則內容 |
|---------|----------|
| R-001 | 所有提交必須通過 OTP 驗證 |
| R-002 | VIEWER 角色不可提交 |
| R-003 | External CREATOR 提交後狀態為 PENDING_APPROVAL |
| R-004 | Internal 提交後狀態為 DRAFT |
| R-005 | 每次提交嘗試必須記錄 Audit Log |
| R-006 | Deny 必須回傳標準格式錯誤訊息 |

---

## 七、版本歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-09 | 初版建立（v1.0 規則寫死） |

---

## 八、聲明

> **本文件為 S005 External Submit Gate 的唯一規格來源。**
> **任何實作必須完全遵守本文件定義的矩陣與規則。**
> **本文件不包含任何新制度，僅為既有 v1.0 規則的正式記錄。**
