# FACT Quality Ruleset v1 — DRAFT

- 文件：FACT-QUALITY-RULESET-v1-DRAFT.md
- 版本：v1.0.0-DRAFT
- 建立日期：2026-01-08
- **Status**: DRAFT
- **Execution**: Not Allowed
- **Mode**: Read-only Audit

---

## 一、文件目的與限制

### 1.1 目的

本文件將 Data Quality v1 啟動條件轉化為「可被工程使用、但不執行」的靜態規則文件。

### 1.2 核心限制

| 限制項目 | 說明 |
|----------|------|
| ❌ 不執行 | 本文件僅定義規則，不啟動任何檢查程序 |
| ❌ 不修正 | 不得基於本文件執行任何自動修正 |
| ❌ 不擴展 | 不得超出 S005 / V005 FACT 範圍 |
| ❌ 無 Derived | 不包含任何推導欄位規則 |

### 1.3 來源文件

本文件整合自以下三份基礎文件：
- `FACT-REGISTRY-v0.md`
- `FACT-QUALITY-BASELINE-v0.md`
- `STD-FACT-INGEST-BASELINE-0001.md`

---

## 二、FACT 欄位檢查規則

### 2.1 報價單主表（S005_QUOTES）— 必填檢查

| FACT 名稱 | 欄位 | 必填 | 條件 |
|-----------|------|------|------|
| QuoteRefId | `ref_id` | ✅ | 無條件必填 |
| QuoteCreatedAt | `created_at` | ✅ | 無條件必填 |
| QuoteCompany | `quote_company` | ✅ | 無條件必填 |
| QuoteStatus | `status` | ✅ | 無條件必填 |
| StatusUpdatedAt | `status_updated_at` | ✅ | 無條件必填 |
| ItemsJson | `items_json` | ✅ | 無條件必填 |
| SnapshotJson | `quotation_snapshot_json` | ⚠️ | 建議必填（status ≠ DRAFT 時） |

### 2.2 報價單主表 — 條件式必填

| FACT 名稱 | 欄位 | 必填條件 |
|-----------|------|----------|
| SubmittedBy | `submitted_by` | status = SUBMITTED / APPROVED / SENT |
| SubmittedAt | `submitted_at` | status = SUBMITTED / APPROVED / SENT |
| ApprovedBy | `approved_by` | status = APPROVED / SENT |
| ApprovedAt | `approved_at` | status = APPROVED / SENT |
| ApprovedStampFileId | `approved_stamp_file_id` | status = APPROVED / SENT |
| RejectedBy | `rejected_by` | status = REJECTED |
| RejectedAt | `rejected_at` | status = REJECTED |
| RejectReason | `reject_reason` | status = REJECTED |

### 2.3 報價對象 — 必填檢查

| FACT 名稱 | 欄位 | 必填 | 條件 |
|-----------|------|------|------|
| RecipientCompany | `recipient_company` | ⚠️ | 建議必填 |
| RecipientName | `recipient_name` | ⚠️ | 建議必填 |
| RecipientEmail | `recipient_email` | ⚠️ | 發送前必填 |

### 2.4 商品明細（Items JSON）— 必填檢查

| FACT 名稱 | JSON Path | 必填 |
|-----------|-----------|------|
| ItemModel | `items[].model` | ✅ |
| ItemName | `items[].name` | ⚠️ |
| ItemQty | `items[].qty` | ✅ |
| ItemPrice | `items[].price` | ✅ |
| ItemMode | `items[].mode` | ⚠️ |
| ItemImageFileId | `items[].image_file_id` | ❌ |

### 2.5 Snapshot 結構 — 必填檢查

| FACT 名稱 | JSON Path | 必填 |
|-----------|-----------|------|
| SnapshotVersion | `snapshot_version` | ✅ |
| SnapshotCreatedAt | `created_at` | ✅ |
| CompanyCode | `company.code` | ✅ |
| CompanyName | `company.name` | ✅ |
| TemplateCode | `company.template_code` | ⚠️ |
| StampFileId | `company.stamp_file_id` | ⚠️ |

### 2.6 Company_Profile — 必填檢查

| FACT 名稱 | 欄位 | 必填 |
|-----------|------|------|
| CompanyCode | `company_code` | ✅ |
| CompanyName | `company_name` | ✅ |
| TemplateCode | `template_code` | ⚠️ |
| StampFileId | `stamp_file_id` | ⚠️ |
| ContactPerson | `contact_person` | ⚠️ |
| TaxId | `tax_id` | ⚠️ |

### 2.7 Admin 身份驗證 — 必填檢查

| FACT 名稱 | 欄位 | 必填 |
|-----------|------|------|
| UserEmail | `Admin_Users.email` | ✅ |
| UserPinHash | `Admin_Users.pin_hash` | ✅ |
| SessionToken | `Admin_Sessions.session_token` | ✅ |
| SessionDeviceId | `Admin_Sessions.device_id` | ✅ |

---

## 三、型別檢查規則

### 3.1 字串型別

| FACT 名稱 | 欄位 | 型別 | 規則 |
|-----------|------|------|------|
| QuoteRefId | `ref_id` | String | 非空字串 |
| QuoteCompany | `quote_company` | String | 非空字串 |
| RecipientEmail | `recipient_email` | String | 非空字串 |
| SubmittedBy | `submitted_by` | String | Email 格式 |
| ApprovedBy | `approved_by` | String | Email 格式 |
| RejectedBy | `rejected_by` | String | Email 格式 |
| RejectReason | `reject_reason` | String | 非空字串 |
| ItemModel | `items[].model` | String | 非空字串 |
| ItemName | `items[].name` | String | 非空字串 |

### 3.2 數值型別

| FACT 名稱 | 欄位 | 型別 | 規則 |
|-----------|------|------|------|
| ItemQty | `items[].qty` | Number | 正整數 |
| ItemPrice | `items[].price` | Number | 正數（含小數） |

### 3.3 日期型別

| FACT 名稱 | 欄位 | 型別 | 規則 |
|-----------|------|------|------|
| QuoteCreatedAt | `created_at` | Date | 可解析為日期 |
| StatusUpdatedAt | `status_updated_at` | Date | 可解析為日期 |
| SubmittedAt | `submitted_at` | Date | 可解析為日期 |
| ApprovedAt | `approved_at` | Date | 可解析為日期 |
| RejectedAt | `rejected_at` | Date | 可解析為日期 |
| TokenExpiresAt | `token_expires_at` | Date | 可解析為日期 |

### 3.4 JSON 型別

| FACT 名稱 | 欄位 | 型別 | 規則 |
|-----------|------|------|------|
| ItemsJson | `items_json` | JSON Array | 可解析為陣列，每筆為物件 |
| SnapshotJson | `quotation_snapshot_json` | JSON Object | 可解析為物件 |

### 3.5 枚舉型別

| FACT 名稱 | 欄位 | 型別 | 規則 |
|-----------|------|------|------|
| QuoteStatus | `status` | Enum | 見值域檢查 |
| ItemMode | `items[].mode` | Enum | 見值域檢查 |
| UserRole | `USERS_ACCESS.role` | Enum | 見值域檢查 |

---

## 四、值域檢查規則

### 4.1 枚舉值域

| FACT 名稱 | 欄位 | 允許值 |
|-----------|------|--------|
| QuoteStatus | `status` | DRAFT, SUBMITTED, APPROVED, REJECTED, SENT, VOIDED, ACCEPTED |
| ItemMode | `items[].mode` | excl, incl |
| UserRole | `USERS_ACCESS.role` | VIEWER, CREATOR, ISSUER, APPROVER |
| UserAccessStatus | `USERS_ACCESS.status` | ACTIVE, INACTIVE |

### 4.2 數值範圍

| FACT 名稱 | 欄位 | 最小值 | 最大值 |
|-----------|------|--------|--------|
| ItemQty | `items[].qty` | 1 | 99999 |
| ItemPrice | `items[].price` | 0.01 | 999999999 |
| SnapshotVersion | `snapshot_version` | 1.0 | 9.9 |

### 4.3 格式規則

| FACT 名稱 | 欄位 | 格式規則 | 範例 |
|-----------|------|----------|------|
| QuoteRefId | `ref_id` | `{PREFIX}-{YYYYMMDD}-{4digits}` | HRS-20260108-1234 |
| RecipientEmail | `recipient_email` | RFC 5322 Email | user@domain.com |
| SubmittedBy | `submitted_by` | RFC 5322 Email | user@domain.com |
| ApprovedBy | `approved_by` | RFC 5322 Email | user@domain.com |
| Timestamp | 各 `*_at` 欄位 | ISO 8601 | 2026-01-08T10:30:00+08:00 |

---

## 五、唯一性檢查規則

### 5.1 全域唯一

| FACT 名稱 | 欄位 | 範圍 | 檢查方式 |
|-----------|------|------|----------|
| QuoteRefId | `ref_id` | S005_QUOTES 全表 | 無重複 |
| ApprovalToken | `approval_token` | S005_QUOTES 全表 | 無重複（排除空值） |
| UserEmail | `Admin_Users.email` | Admin_Users 全表 | 無重複 |
| SessionToken | `Admin_Sessions.session_token` | Admin_Sessions 全表 | 無重複 |

### 5.2 Company 唯一

| FACT 名稱 | 欄位 | 範圍 | 檢查方式 |
|-----------|------|------|----------|
| CompanyCode | `company_code` | Company_Profile 全表 | 無重複 |

---

## 六、問題分類定義

### 6.1 Missing（缺失）

| 問題代碼 | 說明 | 嚴重等級 |
|----------|------|----------|
| MISSING_REQUIRED | 無條件必填欄位缺失 | ERROR |
| MISSING_CONDITIONAL | 條件式必填欄位缺失 | ERROR |
| MISSING_RECOMMENDED | 建議必填欄位缺失 | WARNING |
| MISSING_OPTIONAL | 可選欄位缺失 | INFO |

### 6.2 Invalid（無效）

| 問題代碼 | 說明 | 嚴重等級 |
|----------|------|----------|
| INVALID_TYPE | 型別不符預期 | ERROR |
| INVALID_FORMAT | 格式不符規則 | ERROR |
| INVALID_ENUM | 值不在允許枚舉內 | ERROR |
| INVALID_RANGE | 數值超出允許範圍 | WARNING |
| INVALID_EMAIL | Email 格式不合法 | ERROR |
| INVALID_DATE | 日期格式不合法 | ERROR |
| INVALID_JSON | JSON 無法解析 | ERROR |

### 6.3 Inconsistent（不一致）

| 問題代碼 | 說明 | 嚴重等級 |
|----------|------|----------|
| INCONSISTENT_STATE | 狀態與必填欄位不一致 | ERROR |
| INCONSISTENT_TIMESTAMP | 時間戳記邏輯不一致 | WARNING |
| INCONSISTENT_SNAPSHOT | Snapshot 與主表不一致 | WARNING |

**Inconsistent 規則明細**：

| 規則名稱 | 檢查條件 |
|----------|----------|
| APPROVED 完整性 | status=APPROVED 時，approved_by 與 approved_at 必須存在 |
| REJECTED 完整性 | status=REJECTED 時，rejected_by、rejected_at、reject_reason 必須存在 |
| SUBMITTED 完整性 | status=SUBMITTED/APPROVED/SENT 時，submitted_by 與 submitted_at 必須存在 |
| 時間順序 | status_updated_at ≥ created_at |
| 核准順序 | approved_at ≥ submitted_at（若兩者皆存在） |

### 6.4 Unknown Source（來源不明）

| 問題代碼 | 說明 | 嚴重等級 |
|----------|------|----------|
| UNKNOWN_COMPANY | quote_company 不存在於 Company_Profile | ERROR |
| UNKNOWN_USER | submitted_by / approved_by 不存在於 Admin_Users | WARNING |
| UNKNOWN_STAMP | stamp_file_id 無法存取 | WARNING |

---

## 七、參照完整性規則

### 7.1 必須存在的參照

| 來源表 | 來源欄位 | 目標表 | 目標欄位 | 嚴重等級 |
|--------|----------|--------|----------|----------|
| S005_QUOTES | `quote_company` | Company_Profile | `company_name` | ERROR |
| S005_QUOTES | `submitted_by` | Admin_Users | `email` | WARNING |
| S005_QUOTES | `approved_by` | Admin_Users | `email` | WARNING |
| USERS_ACCESS | `email` | Admin_Users | `email` | ERROR |

---

## 八、檢查規則彙總表

### 8.1 S005_QUOTES 主表

| 欄位 | 必填 | 型別 | 值域 | 唯一 | 參照 |
|------|------|------|------|------|------|
| ref_id | ✅ | String | 格式規則 | ✅ | - |
| created_at | ✅ | Date | - | - | - |
| quote_company | ✅ | String | - | - | Company_Profile |
| status | ✅ | Enum | 7 值 | - | - |
| status_updated_at | ✅ | Date | - | - | - |
| items_json | ✅ | JSON Array | - | - | - |
| quotation_snapshot_json | ⚠️ | JSON Object | - | - | - |
| recipient_company | ⚠️ | String | - | - | - |
| recipient_name | ⚠️ | String | - | - | - |
| recipient_email | ⚠️ | String | Email 格式 | - | - |
| submitted_by | 條件 | String | Email 格式 | - | Admin_Users |
| submitted_at | 條件 | Date | - | - | - |
| approved_by | 條件 | String | Email 格式 | - | Admin_Users |
| approved_at | 條件 | Date | - | - | - |
| approved_stamp_file_id | 條件 | String | - | - | - |
| rejected_by | 條件 | String | Email 格式 | - | Admin_Users |
| rejected_at | 條件 | Date | - | - | - |
| reject_reason | 條件 | String | - | - | - |
| approval_token | - | String | - | ✅ | - |
| token_expires_at | - | Date | - | - | - |

### 8.2 Items JSON 內部

| JSON Path | 必填 | 型別 | 值域 |
|-----------|------|------|------|
| items[].model | ✅ | String | - |
| items[].name | ⚠️ | String | - |
| items[].qty | ✅ | Number | 1-99999 |
| items[].price | ✅ | Number | 0.01-999999999 |
| items[].mode | ⚠️ | Enum | excl, incl |
| items[].image_file_id | ❌ | String | - |

---

## 九、執行狀態聲明

### 9.1 當前狀態

| 項目 | 狀態 |
|------|------|
| 文件狀態 | DRAFT |
| 執行許可 | Not Allowed |
| 執行模式 | Read-only Audit |

### 9.2 執行禁止事項

| 禁止項目 | 說明 |
|----------|------|
| ❌ 不得執行檢查程式 | 本文件僅為規則定義 |
| ❌ 不得自動修正 | 任何問題僅記錄，不修正 |
| ❌ 不得阻擋流程 | 檢查不得中斷 S005/V005 核心流程 |
| ❌ 不得擴展範圍 | 不得超出 S005/V005 FACT |
| ❌ 不得新增欄位 | 基於現有 FACT Registry |
| ❌ 不得包含 Derived | 不得定義推導欄位規則 |

### 9.3 啟動條件

本規則集啟動需滿足：
1. `S005-AUTHORITY-MCD.md` 裁定完成 ✅
2. `V005-AUTHORITY-MCD.md` 裁定完成 ✅
3. `DATA-QUALITY-V1-ENTRY-CRITERIA.md` 允許啟動 ✅
4. 專案負責人明確核准 ⏸️ 待核准

---

## 十、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0-DRAFT | 2026-01-08 | 初版草稿建立（Read-only Audit） |

