# Data Contract — Runtime Audit Report

- Module: GLOBAL
- File: DATA-CONTRACT-RUNTIME-AUDIT.md
- Version: v1.0.0
- Audit Date: 2026-01-08
- Status: **Read-Only Inventory**
- Related Contracts:
  - DATA-CONTRACT-COMPANY.md
  - DATA-CONTRACT-USER.md
  - DATA-CONTRACT-STAMP.md

---

## 一、Purpose

本文件為 S005 / V005 現有程式碼之只讀盤點，對照 Data Contract 定義。

**限制聲明**：
- ❌ 不新增欄位
- ❌ 不修改程式碼
- ❌ 不提出實作方案

---

## 二、CompanyId 盤點

### 2.1 S005 Runtime 使用

| 使用欄位 | Data Contract 欄位 | 狀態 | 說明 |
|----------|-------------------|------|------|
| `company_code` | company_code | ✅ 已符合 | Primary Key，直接使用 |
| `company_name` | company_name | ✅ 已符合 | 顯示名稱，直接使用 |
| `quote_company` | - | ⚠️ 名稱不同但語意相同 | 存放 company_name，非 company_code |
| `template_code` | template_code | ✅ 已符合 | 模板代碼 |
| `contact_person` | contact_person | ✅ 已符合 | 聯絡人 |
| `contact_phone` | contact_phone | ✅ 已符合 | 電話 |
| `contact_email` | contact_email | ✅ 已符合 | Email |
| `contact_address` | contact_address | ✅ 已符合 | 地址 |
| `tax_id` | tax_id | ✅ 已符合 | 統一編號 |
| `mail_footer` | mail_footer | ✅ 已符合 | 郵件簽名檔 |
| `supervisor_emails` | supervisor_emails | ✅ 已符合 | 監管人清單 |

### 2.2 V005 Runtime 使用

| 使用欄位 | Data Contract 欄位 | 狀態 | 說明 |
|----------|-------------------|------|------|
| `company_code` | company_code | ✅ 已符合 | 從 CompanyProfile 讀取 |
| `company_name` | company_name | ✅ 已符合 | 從 CompanyProfile 讀取 |
| `quote_company` | - | ⚠️ 名稱不同但語意相同 | S005_QUOTES 欄位，存 company_name |
| `snapshot.company.code` | company_code | ✅ 已符合 | Snapshot 內嵌 |
| `snapshot.company.name` | company_name | ✅ 已符合 | Snapshot 內嵌 |

### 2.3 公司識別對照總結

| 識別方式 | 位置 | 狀態 |
|----------|------|------|
| `company_code` | Company_Profile | ✅ 已存在 |
| `company_name` | Company_Profile、quote_company | ✅ 已存在 |
| 透過 company_name 查 company_code | getCompanyProfile() | ✅ 已實作 |

---

## 三、UserId 盤點

### 3.1 S005 Runtime 使用

| 使用欄位 | Data Contract 欄位 | 狀態 | 說明 |
|----------|-------------------|------|------|
| `user_id` | user_id | ✅ 已符合 | Admin_Users Primary Key |
| `email` | email | ✅ 已符合 | 唯一識別，小寫處理 |
| `display_name` | display_name | ✅ 已符合 | 顯示名稱 |
| `pin_hash` | pin_hash | ✅ 已符合 | SHA-256 雜湊 |
| `failed_attempts` | failed_attempts | ✅ 已符合 | 登入失敗次數 |
| `locked_until` | locked_until | ✅ 已符合 | 鎖定到期時間 |
| `role` | role | ✅ 已符合 | USERS_ACCESS 角色 |
| `status` | status | ✅ 已符合 | USERS_ACCESS 狀態 |
| `approved_by` | - | ⚠️ 語意相同 | 存放 email，用於審計追蹤 |
| `rejected_by` | - | ⚠️ 語意相同 | 存放 email，用於審計追蹤 |
| `submitted_by` | - | ⚠️ 語意相同 | 存放 email，用於審計追蹤 |
| `userEmail` | email | ⚠️ 名稱不同但語意相同 | 變數命名差異 |
| `permCheck.email` | email | ✅ 已符合 | 權限檢查回傳 |

### 3.2 V005 Runtime 使用

| 使用欄位 | Data Contract 欄位 | 狀態 | 說明 |
|----------|-------------------|------|------|
| `userEmail` | email | ⚠️ 名稱不同但語意相同 | 變數命名差異 |
| `email` | email | ✅ 已符合 | USERS_ACCESS 查詢鍵 |
| `role` | role | ✅ 已符合 | USERS_ACCESS 角色 |
| `approved_by` | - | ⚠️ 語意相同 | 存放 email |
| `rejected_by` | - | ⚠️ 語意相同 | 存放 email |
| `created_by` | - | ⚠️ 語意相同 | 存放 email（查詢用） |

### 3.3 權限表對照

| 工作表 | Data Contract | 狀態 | 說明 |
|--------|---------------|------|------|
| `Admin_Users` | AdminUser | ✅ 已符合 | 使用者主檔 |
| `Admin_Sessions` | - | ✅ 已存在 | Session 管理（Contract 未明定） |
| `Admin_OTP` | - | ✅ 已存在 | OTP 管理（Contract 未明定） |
| `USERS_ACCESS` | UserAccess | ✅ 已符合 | 角色授權 |
| `USER_COMPANIES` | UserCompany | ✅ 已符合 | 公司授權 |
| `USER_CUSTOMERS` | - | ✅ 已存在 | 客戶授權（Contract 未明定） |

### 3.4 角色定義對照

| Runtime 常數 | Data Contract | 狀態 |
|--------------|---------------|------|
| `ROLES.VIEWER` | VIEWER | ✅ 已符合 |
| `ROLES.CREATOR` | CREATOR | ✅ 已符合 |
| `ROLES.ISSUER` | ISSUER | ✅ 已符合 |
| `ROLES.APPROVER` | APPROVER | ✅ 已符合 |

---

## 四、StampId 盤點

### 4.1 S005 Runtime 使用

| 使用欄位 | Data Contract 欄位 | 狀態 | 說明 |
|----------|-------------------|------|------|
| `stamp_file_id` | stamp_file_id | ✅ 已符合 | Company_Profile 印章 |
| `approved_stamp_file_id` | approved_stamp_file_id | ✅ 已符合 | S005_QUOTES 核准章 |
| `draft_stamp_file_id` | draft_stamp_file_id | ✅ 已符合 | Snapshot 草稿章（未啟用） |
| `snapshot.stamps.approved_stamp_file_id` | approved_stamp_file_id | ✅ 已符合 | Snapshot 核准章 |
| `snapshot.stamps.draft_stamp_file_id` | draft_stamp_file_id | ✅ 已符合 | Snapshot 草稿章 |
| `snapshot.company.stamp_file_id` | stamp_file_id | ✅ 已符合 | Snapshot 公司印章 |
| `seal_file_id` | - | ⚠️ 語意相近 | 騎縫章（非核准章） |

### 4.2 V005 Runtime 使用

| 使用欄位 | Data Contract 欄位 | 狀態 | 說明 |
|----------|-------------------|------|------|
| `stamp_file_id` | stamp_file_id | ✅ 已符合 | Company_Profile 印章 |
| `approved_stamp_file_id` | approved_stamp_file_id | ✅ 已符合 | 讀取 S005_QUOTES |
| `stamps.approved_stamp_file_id` | approved_stamp_file_id | ✅ 已符合 | Snapshot 核准章 |
| `stamps.draft_stamp_file_id` | draft_stamp_file_id | ✅ 已符合 | Snapshot 草稿章 |
| `approved_stamp_data_url` | - | ⚠️ 衍生欄位 | 轉換後 Data URL |
| `draft_stamp_data_url` | - | ⚠️ 衍生欄位 | 轉換後 Data URL |

### 4.3 印章處理函數對照

| Runtime 函數 | Data Contract 描述 | 狀態 |
|--------------|-------------------|------|
| `getStampDataUrl(fileId)` | stamp_file_id → Data URL | ✅ 已符合 |
| `updateQuotationStamp(refId)` | 更新印章 | ✅ 已符合 |
| `updateAllStampsForCompany(companyName)` | 批次更新 | ✅ 已符合 |

---

## 五、缺失項目盤點

### 5.1 Data Contract 定義但 Runtime 未使用

| 項目 | Data Contract | 狀態 | 說明 |
|------|---------------|------|------|
| `is_active` (Stamp) | StampReference.is_active | ❌ 缺失 | 目前無多印章管理機制 |
| `content_type` (Stamp) | StampReference.content_type | ❌ 缺失 | 由 Drive API 動態取得 |

### 5.2 Runtime 存在但 Data Contract 未明定

| 項目 | 模組 | 說明 |
|------|------|------|
| `Admin_Sessions` | S005 | Session 管理表 |
| `Admin_OTP` | S005 | OTP 記錄表 |
| `USER_CUSTOMERS` | S005 | 客戶授權表 |
| `seal_file_id` | S005/V005 | 騎縫章（非核准章） |
| `*_data_url` | V005 | 印章 Data URL（衍生） |

---

## 六、命名差異對照表

| Runtime 名稱 | Data Contract 名稱 | 語意 | 建議 |
|--------------|-------------------|------|------|
| `quote_company` | company_name | 報價公司名稱 | 保持現狀（歷史相容） |
| `userEmail` | email | 使用者 Email | 保持現狀（變數命名） |
| `approved_by` | email | 核准人 Email | 保持現狀（語意清晰） |
| `rejected_by` | email | 退回人 Email | 保持現狀（語意清晰） |
| `submitted_by` | email | 送審人 Email | 保持現狀（語意清晰） |
| `created_by` | email | 建立人 Email | 保持現狀（語意清晰） |

---

## 七、盤點結論

### 7.1 統計

| 分類 | 已符合 | 名稱不同但語意相同 | 缺失 |
|------|--------|-------------------|------|
| CompanyId | 11 | 1 | 0 |
| UserId | 10 | 6 | 0 |
| StampId | 9 | 3 | 2 |
| **總計** | **30** | **10** | **2** |

### 7.2 結論

1. **高度符合**：現有 Runtime 與 Data Contract 高度一致
2. **命名差異**：主要為變數命名風格差異，語意相同
3. **缺失項目**：僅 `is_active` 與 `content_type` 未實作（屬多印章管理範疇）
4. **額外項目**：Session / OTP / 客戶授權為 Runtime 擴充，Contract 可考慮補充

---

## 八、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立（只讀盤點） |

