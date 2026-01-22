# FACT Registry v0

- 文件：FACT-REGISTRY-v0.md
- 版本：v0.2.0
- 建立日期：2026-01-08
- 最後更新：2026-01-09
- 狀態：**補充權限表資訊（S005/V005 Only）**
- 範圍：僅 S005 / V005 模組

---

## 一、文件目的

本文件記錄 S005（報價建立）與 V005（報價檢視）模組寫入/讀取的 FACT 清單。

**FACT 定義**：系統中的原始事實資料，不經計算推導，具有明確來源與寫入點。

**限制聲明**：
- ❌ 本版不包含 Derived 規則
- ❌ 本版不做自動修正
- ❌ 本版不回寫任何資料

---

## 二、S005 模組 FACT 清單

### 2.1 報價單主表（S005_QUOTES）

| FACT 名稱 | 欄位名稱 | SSOT | 寫入點 | 更新頻率 | 允許修正 |
|-----------|----------|------|--------|----------|----------|
| QuoteRefId | `ref_id` | S005_QUOTES | `processSubmission()` | 事件觸發（建立時） | 否 |
| QuoteCreatedAt | `created_at` | S005_QUOTES | `processSubmission()` | 事件觸發（建立時） | 否 |
| QuoteDate | `quote_date` | S005_QUOTES | `processSubmission()` | 事件觸發（建立時） | 否 |
| QuoteCompany | `quote_company` | S005_QUOTES | `processSubmission()` | 事件觸發（建立時） | 否 |
| QuoteStatus | `status` | S005_QUOTES | 多點（見下方） | 事件觸發（狀態變更） | 否 |
| ItemsJson | `items_json` | S005_QUOTES | `writeToQuotes()` | 事件觸發（建立時） | 否 |
| SnapshotJson | `quotation_snapshot_json` | S005_QUOTES | `buildSnapshot_()` | 事件觸發（建立/核准時） | 否 |
| StatusUpdatedAt | `status_updated_at` | S005_QUOTES | 狀態變更時 | 事件觸發 | 否 |

### 2.2 報價對象資訊

| FACT 名稱 | 欄位名稱 | SSOT | 寫入點 | 更新頻率 | 允許修正 |
|-----------|----------|------|--------|----------|----------|
| RecipientCompany | `recipient_company` | S005_QUOTES | `processSubmission()` | 事件觸發（建立時） | 否 |
| RecipientName | `recipient_name` | S005_QUOTES | `processSubmission()` | 事件觸發（建立時） | 否 |
| RecipientEmail | `recipient_email` | S005_QUOTES | `processSubmission()` | 事件觸發（建立時） | 否 |

### 2.3 審批相關

| FACT 名稱 | 欄位名稱 | SSOT | 寫入點 | 更新頻率 | 允許修正 |
|-----------|----------|------|--------|----------|----------|
| ApprovalToken | `approval_token` | S005_QUOTES | `submitForApproval()` | 事件觸發（送審時） | 否 |
| TokenExpiresAt | `token_expires_at` | S005_QUOTES | `submitForApproval()` | 事件觸發（送審時） | 否 |
| SubmittedBy | `submitted_by` | S005_QUOTES | `submitForApproval()` | 事件觸發（送審時） | 否 |
| SubmittedAt | `submitted_at` | S005_QUOTES | `submitForApproval()` | 事件觸發（送審時） | 否 |
| ApprovedBy | `approved_by` | S005_QUOTES | `executeApproval_()` | 事件觸發（核准時） | 否 |
| ApprovedAt | `approved_at` | S005_QUOTES | `executeApproval_()` | 事件觸發（核准時） | 否 |
| ApprovedStampFileId | `approved_stamp_file_id` | S005_QUOTES | `executeApproval_()` | 事件觸發（核准時） | 否 |
| RejectedBy | `rejected_by` | S005_QUOTES | `executeRejection_()` | 事件觸發（退回時） | 否 |
| RejectedAt | `rejected_at` | S005_QUOTES | `executeRejection_()` | 事件觸發（退回時） | 否 |
| RejectReason | `reject_reason` | S005_QUOTES | `executeRejection_()` | 事件觸發（退回時） | 否 |

### 2.4 狀態機轉換點

| 狀態轉換 | 寫入函數 | 觸發條件 |
|----------|----------|----------|
| → DRAFT | `writeToQuotes()` | 報價單建立 |
| DRAFT → SUBMITTED | `submitForApproval()` | 使用者送審 |
| SUBMITTED → APPROVED | `executeApproval_()` | APPROVER 核准 |
| SUBMITTED → REJECTED | `executeRejection_()` | APPROVER 退回 |
| APPROVED → SENT | `sendQuotationMail()` | 發送 Email 後 |
| * → VOIDED | 待盤點 | 作廢操作 |

### 2.5 商品明細（Items）

| FACT 名稱 | JSON Path | SSOT | 寫入點 | 允許修正 |
|-----------|-----------|------|--------|----------|
| ItemModel | `items[].model` | items_json / snapshot | `buildSnapshot_()` | 否 |
| ItemName | `items[].name` | items_json / snapshot | `buildSnapshot_()` | 否 |
| ItemQty | `items[].qty` | items_json / snapshot | `buildSnapshot_()` | 否 |
| ItemPrice | `items[].price` | items_json / snapshot | `buildSnapshot_()` | 否 |
| ItemMode | `items[].mode` | items_json / snapshot | `buildSnapshot_()` | 否 |
| ItemImageFileId | `items[].image_file_id` | items_json / snapshot | `processItemImages_()` | 否 |

### 2.6 Snapshot 結構（報價凍結）

| FACT 名稱 | JSON Path | SSOT | 寫入點 | 允許修正 |
|-----------|-----------|------|--------|----------|
| SnapshotVersion | `snapshot_version` | quotation_snapshot_json | `buildSnapshot_()` | 否 |
| SnapshotCreatedAt | `created_at` | quotation_snapshot_json | `buildSnapshot_()` | 否 |
| CompanyCode | `company.code` | quotation_snapshot_json | `buildSnapshot_()` | 否 |
| CompanyName | `company.name` | quotation_snapshot_json | `buildSnapshot_()` | 否 |
| TemplateCode | `company.template_code` | quotation_snapshot_json | `buildSnapshot_()` | 否 |
| StampFileId | `company.stamp_file_id` | quotation_snapshot_json | `buildSnapshot_()` | 否 |
| ApprovalStampFileId | `stamps.approved_stamp_file_id` | quotation_snapshot_json | `executeApproval_()` | 否 |

### 2.7 身份驗證相關（Admin 表）

| FACT 名稱 | 欄位/表 | SSOT | 寫入點 | 更新頻率 | 允許修正 |
|-----------|---------|------|--------|----------|----------|
| UserEmail | Admin_Users.email | Admin_Users | 手動建立 | 手動 | 否 |
| UserPinHash | Admin_Users.pin_hash | Admin_Users | `PIN_HASH()` / PIN 變更 | 事件觸發 | 否 |
| UserStatus | Admin_Users.status | Admin_Users | 手動 / 鎖定機制 | 事件觸發 | 否 |
| SessionToken | Admin_Sessions.session_token | Admin_Sessions | `createDeviceSession_()` | 事件觸發 | 否 |
| SessionDeviceId | Admin_Sessions.device_id | Admin_Sessions | `createDeviceSession_()` | 事件觸發 | 否 |
| OtpCode | Admin_OTP.otp_code | Admin_OTP | `sendOtp_()` | 事件觸發 | 否 |

---

## 三、V005 模組 FACT 依賴

V005 為**讀取模組**，不直接寫入 FACT，但依賴以下資料：

### 3.1 讀取的 FACT

| FACT 名稱 | 來源表 | 讀取函數 | 用途 |
|-----------|--------|----------|------|
| QuoteRefId | S005_QUOTES | `getQuote()` | 報價單檢視 |
| SnapshotJson | S005_QUOTES | `getQuote()` | 報價單 Render |
| QuoteStatus | S005_QUOTES | `getQuote()` | 狀態顯示 |
| ApprovedStampFileId | S005_QUOTES / Snapshot | `getQuote()` | 印章顯示 |
| CompanyProfile | Company_Profile | `getCompanyProfile()` | 公司資訊 |
| TemplateCode | Company_Profile / Snapshot | `getCompanyProfile()` | 版型選擇 |

### 3.2 V005 輸出（非 FACT，為 Derived）

| 輸出名稱 | 產出函數 | 用途 | 備註 |
|----------|----------|------|------|
| PDF 檔案 | `exportQuotePDF()` | PDF 匯出 | Derived（非 FACT） |
| Mail Content | `sendQuotationMail()` | Email 發送 | Derived（非 FACT） |
| StampDataUrl | `getStampDataUrl()` | 印章 Base64 | Derived（轉換用） |

---

## 四、公司與權限相關 FACT

### 4.1 Company_Profile 表

| FACT 名稱 | 欄位名稱 | SSOT | 寫入點 | 更新頻率 | 允許修正 |
|-----------|----------|------|--------|----------|----------|
| CompanyCode | `company_code` | Company_Profile | 手動維護 | 手動 | 否 |
| CompanyName | `company_name` | Company_Profile | 手動維護 | 手動 | 否 |
| TemplateCode | `template_code` | Company_Profile | 手動維護 | 手動 | 否 |
| StampFileId | `stamp_file_id` | Company_Profile | 手動維護 | 手動 | 否 |
| ~~SealFileId~~ | `seal_file_id` | Company_Profile | — | — | **LEGACY** |
| ContactPerson | `contact_person` | Company_Profile | 手動維護 | 手動 | 否 |
| ContactPhone | `contact_phone` | Company_Profile | 手動維護 | 手動 | 否 |
| ContactEmail | `contact_email` | Company_Profile | 手動維護 | 手動 | 否 |
| ContactAddress | `contact_address` | Company_Profile | 手動維護 | 手動 | 否 |
| TaxId | `tax_id` | Company_Profile | 手動維護 | 手動 | 否 |
| MailFooter | `mail_footer` | Company_Profile | 手動維護 | 手動 | 否 |
| SupervisorEmails | `supervisor_emails` | Company_Profile | 手動維護 | 手動 | 否 |

> ⚠️ **LEGACY 欄位**：`seal_file_id` 為舊版欄位，已被 `stamp_file_id` 取代。Runtime 僅使用 `stamp_file_id`，請勿修改 `seal_file_id`。

**印章治理裁定**（2026-01-09）：

| 項目 | 規則 |
|------|------|
| Runtime Key | `stamp_file_id`（唯一識別） |
| 檔名 | **無系統意義**，僅供治理可讀性 |
| 資料夾路徑 | **無系統意義**，僅供治理歸檔 |
| 重新命名 | ✅ 允許（File ID 不變即可） |
| 移動資料夾 | ✅ 允許（File ID 不變即可） |

### 4.2 權限表（USERS_ACCESS）

| FACT 名稱 | 欄位名稱 | SSOT | 寫入點 | 更新頻率 | 允許修正 |
|-----------|----------|------|--------|----------|----------|
| UserRole | `role` | USERS_ACCESS | 手動維護 | 手動 | 否 |
| UserAccessStatus | `status` | USERS_ACCESS | 手動維護 | 手動 | 否 |

**角色生效狀態**（2026-01-09 Audit）：

| 角色 | 定義存在 | 實際檢查 | 說明 |
|------|----------|----------|------|
| APPROVER | ✅ | ✅ | 唯一生效角色，控制審核權限 |
| VIEWER | ✅ | ❌ | 定義存在，無對應權限檢查 |
| CREATOR | ✅ | ❌ | 定義存在，無對應權限檢查 |
| ISSUER | ✅ | ❌ | 定義存在，無對應權限檢查 |

### 4.3 公司授權表（User_Company_Permission）— 2026-01-09 補充

| FACT 名稱 | 欄位名稱 | SSOT | 寫入點 | 更新頻率 | 允許修正 |
|-----------|----------|------|--------|----------|----------|
| UserEmail | `user_email` | User_Company_Permission | 手動維護 | 手動 | 否 |
| AllowedCompanyCode | `company_code` | User_Company_Permission | 手動維護 | 手動 | 否 |
| CompanyPermRole | `role` | User_Company_Permission | 手動維護 | 手動 | 否 |

**欄位生效狀態**：

| 欄位 | 讀取 | 使用於判斷 | 說明 |
|------|------|-----------|------|
| `user_email` | ✅ | ✅ | 查詢條件 |
| `company_code` | ✅ | ✅ | 控制可建立報價的公司 |
| `role` | ✅ | ❌ | **讀取但未使用**，預留欄位 |

**用途說明**：
- 函數 `getUserAllowedCompanies()` 查詢此表
- 決定使用者可在 S005 選擇哪些公司建立報價
- `role` 欄位目前不影響任何邏輯

---

## 4.4 Stamp_Registry 表（v0.3.0 新增）

| FACT 名稱 | 欄位名稱 | SSOT | 寫入點 | 更新頻率 | 允許修正 |
|-----------|----------|------|--------|----------|----------|
| StampId | `stamp_id` | Stamp_Registry | `initStampRegistry_()` / 手動 | 事件觸發 | 否 |
| StampType | `stamp_type` | Stamp_Registry | `initStampRegistry_()` / 手動 | 手動 | 否 |
| StampCompanyCode | `company_code` | Stamp_Registry | `syncCompanyStampsToRegistry_()` | 手動 | 否 |
| StampOwnerEmail | `owner_email` | Stamp_Registry | 手動維護 | 手動 | 否 |
| StampFileId | `stamp_file_id` | Stamp_Registry | `syncCompanyStampsToRegistry_()` / 手動 | 手動 | 否 |
| StampStatus | `status` | Stamp_Registry | 手動維護 | 手動 | 否 |
| StampCreatedAt | `created_at` | Stamp_Registry | `initStampRegistry_()` | 事件觸發 | 否 |
| StampCreatedBy | `created_by` | Stamp_Registry | `initStampRegistry_()` | 事件觸發 | 否 |

**v0 狀態說明**：

| 項目 | 狀態 |
|------|------|
| COMPANY stamp | ✅ 支援 |
| PERSONAL stamp | ⏸ Internal only（未啟用 UI） |
| External + PERSONAL | ❌ Hard Gate 禁止 |
| UI 切換 | ❌ 不提供（v0 固定 COMPANY） |

**Runtime 解析函數**：`resolveStampFileId_(context)`

---

## 五、待盤點項目

以下 FACT 來源或寫入點尚未完全確認：

| 項目 | 模組 | 原因 |
|------|------|------|
| VOIDED 狀態轉換 | S005 | 作廢邏輯未完整追蹤 |
| ACCEPTED 狀態轉換 | S005 | 客戶確認流程待確認 |
| Contacts 表維護 | S005 | 報價對象來源待確認 |
| User_Companies 表 | S005 | 多公司權限映射待確認 |
| User_Customers 表 | S005 | 客戶授權機制待確認 |
| Mail 發送記錄 | S005/V005 | 是否有 FACT 紀錄待確認 |
| PDF 存檔位置 | V005 | Drive Folder ID 設定待確認 |
| Image 來源 | S005 | FACTS/IMAGES 資料夾結構待確認 |

---

## 六、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v0.1.0 | 2026-01-08 | 初版建立，僅含 S005/V005 |
| v0.2.0 | 2026-01-09 | 新增 User_Company_Permission 表、標示 seal_file_id 為 LEGACY、補充 USERS_ACCESS 角色生效狀態 |
| v0.3.0 | 2026-01-09 | 新增 Stamp_Registry 表（v0 Company Only） |

