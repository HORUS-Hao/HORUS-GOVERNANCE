# Runtime Auth Flow - 真實權限流摘要

**Audit Date**: 2026-01-09
**Source**: S005 Code.gs, V005 Code.gs
**Mode**: Read-Only Analysis

---

## 1. Hard Code 定義（不查表）

### 1.1 內部網域判斷

| 項目 | 位置 | 值 |
|------|------|-----|
| INTERNAL_DOMAINS | S005:144-147 | `['horus.tw', 'dapanda.com.tw']` |
| isInternalUser_() | S005:2619-2630 | 依據 email domain 判斷 |

**判斷邏輯**：
```
@horus.tw → Internal
@dapanda.com.tw → Internal
其他 → External
```

### 1.2 Hard Code 管理員清單

| 項目 | 位置 | 值 |
|------|------|-----|
| Fallback Supervisors | S005:172-173, 181-182 | `hao.chang@horus.tw`, `hao.chang@dapanda.com.tw` |
| Default CC | S005:3432-3433 | `hao.chang@horus.tw`, `hao.chang@dapanda.com.tw` |
| Fallback Notify | S005:2314 | `hao.chang@horus.tw` |
| V005 Fallback | V005:1398-1399 | `hao.chang@horus.tw`, `hao.chang@dapanda.com.tw` |

---

## 2. 實際查表的權限檢查

### 2.1 S005 查表流程

| 函數 | 查詢表 | 欄位 | 用途 |
|------|--------|------|------|
| getUserAllowedCompanies() | User_Company_Permission | user_email, company_code, role | 取得可代表公司清單 |
| getUserRole() | USERS_ACCESS | email, role, status | 取得角色與狀態 |
| checkPermission() | USERS_ACCESS (via getUserRole) | role | Internal 使用者權限檢查 |
| hasValidOtpSession_() | Admin_Sessions | user_id, expire_at, revoked | External OTP 驗證 |
| getAdminUser_() | Admin_Users | email, pin_hash, user_id | 登入驗證 |

### 2.2 V005 查表流程

| 函數 | 查詢表 | 欄位 | 用途 |
|------|--------|------|------|
| getUserRole_() | USERS_ACCESS | email, role, status | 取得角色 |
| checkApproverPermission_() | USERS_ACCESS (via getUserRole_) | role, status | APPROVER 角色檢查 |

---

## 3. 權限流分歧點

### 3.1 S005 processSubmission() 流程

```
processSubmission()
    │
    ├─ isInternalUser_(email) ← Hard Code Domain 判斷
    │
    ├─ [Internal]
    │   └─ checkPermission() → USERS_ACCESS.role
    │
    └─ [External]
        ├─ hasValidOtpSession_() → Admin_Sessions
        └─ getUserAllowedCompanies() → User_Company_Permission.company_code
            ※ 不檢查 USERS_ACCESS.role
```

### 3.2 S005 核准/駁回流程

```
approveQuotationViaUrl() / rejectQuotationViaUrl()
    │
    ├─ isInternalUser_(email) ← Hard Code Domain 判斷
    │   └─ [External] → 403 EXTERNAL_FORBIDDEN (Hard Gate)
    │
    └─ [Internal]
        └─ checkPermission() → USERS_ACCESS.role (APPROVER)
```

### 3.3 V005 審核流程

```
approveQuotation() / rejectQuotation()
    │
    ├─ getUserRole_() → USERS_ACCESS
    │
    └─ checkApproverPermission_()
        ├─ role === 'APPROVER' → allowed
        └─ role !== 'APPROVER' → denied
```

---

## 4. 未查表但存在的欄位

| 表 | 欄位 | 狀態 | 說明 |
|----|------|------|------|
| User_Company_Permission | role | 讀取但未使用 | getUserAllowedCompanies() 讀取後未檢查 |
| USERS_ACCESS | VIEWER/CREATOR/ISSUER | 定義但未檢查 | 只有 APPROVER 有實際效果 |

---

## 5. 權限檢查呼叫位置索引

### S005

| 行號 | 函數 | 檢查類型 |
|------|------|---------|
| 238 | isInternalUser_() | Domain Hard Code |
| 252 | checkPermission() | USERS_ACCESS |
| 275 | getUserAllowedCompanies() | User_Company_Permission |
| 523 | getUserAllowedCompanies() | User_Company_Permission |
| 2402 | checkPermission() | USERS_ACCESS |
| 2547 | checkPermission() | USERS_ACCESS |
| 3014 | isInternalUser_() | Domain Hard Code |
| 3048 | checkPermission() | USERS_ACCESS |
| 3196 | checkPermission() | USERS_ACCESS |
| 3847 | checkPermission() | USERS_ACCESS |
| 4317 | checkPermission() | USERS_ACCESS |
| 4441 | checkPermission() | USERS_ACCESS |
| 4638 | checkPermission() | USERS_ACCESS |

### V005

| 行號 | 函數 | 檢查類型 |
|------|------|---------|
| 74 | getUserRole_() | USERS_ACCESS |
| 1547 | getUserRole_() | USERS_ACCESS |
| 1597 | getUserRole_() | USERS_ACCESS |

---

*This is a read-only analysis. No code was modified.*
