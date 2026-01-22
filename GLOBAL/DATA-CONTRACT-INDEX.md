# Data Contract Index — GLOBAL

- Module: GLOBAL
- File: DATA-CONTRACT-INDEX.md
- Version: v1.0.0
- Effective Date: 2026-01-08
- Status: **Active**

---

## 一、Purpose

本文件為 HORUS-PDM 系統 Data Contract 之總索引，列出所有核心實體之資料結構規格。

---

## 二、Data Contract 清單

| 文件 | 實體 | 版本 | 狀態 |
|------|------|------|------|
| DATA-CONTRACT-COMPANY.md | CompanyId / CompanyProfile | v1.0.0 | Active |
| DATA-CONTRACT-USER.md | UserId / AdminUser / UserAccess | v1.0.0 | Active |
| DATA-CONTRACT-STAMP.md | StampId / StampReference | v1.0.0 | Active |

---

## 三、實體關係圖

```
┌─────────────────┐
│  CompanyProfile │
│  (company_code) │
└────────┬────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐      ┌─────────────────┐
│  USER_COMPANIES │◄────►│    AdminUser    │
│ (company_code,  │      │   (user_id,     │
│      email)     │      │     email)      │
└─────────────────┘      └────────┬────────┘
                                  │
                                  │ 1:1
                                  ▼
                         ┌─────────────────┐
                         │   USERS_ACCESS  │
                         │  (email, role)  │
                         └─────────────────┘

┌─────────────────┐
│  CompanyProfile │
│ (stamp_file_id) │
└────────┬────────┘
         │
         │ 1:1
         ▼
┌─────────────────┐      ┌─────────────────┐
│   Google Drive  │◄────►│    Snapshot     │
│   (File ID)     │      │ (approved_stamp │
│                 │      │   _file_id)     │
└─────────────────┘      └─────────────────┘
```

---

## 四、與既有工作表對應總覽

### 4.1 主要工作表

| 工作表 | 對應 Data Contract | 說明 |
|--------|-------------------|------|
| Company_Profile | DATA-CONTRACT-COMPANY | 公司設定檔 |
| Admin_Users | DATA-CONTRACT-USER | 使用者主檔 |
| USERS_ACCESS | DATA-CONTRACT-USER | 角色授權 |
| USER_COMPANIES | DATA-CONTRACT-USER | 公司授權 |
| S005_QUOTES | 全部 | 報價單主檔 |

### 4.2 輔助工作表

| 工作表 | 對應 Data Contract | 說明 |
|--------|-------------------|------|
| Admin_Sessions | DATA-CONTRACT-USER | Device Session |
| Admin_OTP | DATA-CONTRACT-USER | OTP 記錄 |
| USER_CUSTOMERS | DATA-CONTRACT-USER | 客戶授權（擴充） |
| Contacts | - | 聯絡人（獨立） |

---

## 五、S005 / V005 共用欄位

### 5.1 S005_QUOTES 核心欄位

| 欄位 | Data Contract | 說明 |
|------|---------------|------|
| quote_company | CompanyId | 報價公司名稱 |
| approved_stamp_file_id | StampId | 核准章 File ID |
| approved_by | UserId | 核准人 Email |
| submitted_by | UserId | 送審人 Email |
| rejected_by | UserId | 退回人 Email |
| quotation_snapshot_json | 全部 | 包含 Company、Stamps、Approval |

### 5.2 Snapshot 結構

| 路徑 | Data Contract | 說明 |
|------|---------------|------|
| snapshot.company.code | CompanyId | 公司識別碼 |
| snapshot.company.stamp_file_id | StampId | 公司印章 |
| snapshot.stamps.approved_stamp_file_id | StampId | 核准章 |
| snapshot.approval.approved_by | UserId | 核准人 |

---

## 六、驗證規則總覽

| 實體 | Primary Key | 唯一約束 | 格式約束 |
|------|-------------|----------|----------|
| CompanyId | company_code | company_code, company_name | 大寫英文 |
| UserId | user_id | email | 小寫 Email |
| StampId | stamp_file_id | stamp_file_id | Drive File ID |

---

## 七、治理文件對應

| Data Contract | 治理文件 |
|---------------|----------|
| DATA-CONTRACT-COMPANY | GOVERNANCE-MULTI-COMPANY.md |
| DATA-CONTRACT-USER | GOVERNANCE-MULTI-USER.md |
| DATA-CONTRACT-STAMP | GOVERNANCE-MULTI-STAMP.md |

---

## 八、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立 |

