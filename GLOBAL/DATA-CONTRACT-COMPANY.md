# Data Contract — CompanyId

- Module: GLOBAL
- File: DATA-CONTRACT-COMPANY.md
- Version: v1.0.0
- Effective Date: 2026-01-08
- Status: **Active**
- Related Governance: GOVERNANCE-MULTI-COMPANY.md

---

## 一、Purpose

本文件定義 `CompanyId` 之資料結構規格，作為工程實作之唯一依據。

**適用範圍**：
- S005、V005 及所有依賴公司識別之模組
- 資料讀寫、權限檢查、印章管理等操作

---

## 二、資料結構定義

### 2.1 CompanyId Schema

```typescript
interface CompanyId {
  company_code: string;      // Primary Key, 唯一識別碼
  company_name: string;      // 顯示名稱
}
```

### 2.2 Company Profile Schema

```typescript
interface CompanyProfile {
  // 識別
  company_code: string;      // PK, 大寫英文（如 HORUS, DAPANDA）
  company_name: string;      // 中文名稱
  
  // 模板
  template_code: string;     // 報價單模板代碼（TEMPLATE_A, TEMPLATE_B）
  
  // 聯絡資訊
  contact_person: string;    // 聯絡人
  contact_phone: string;     // 電話
  contact_email: string;     // Email
  contact_address: string;   // 地址
  
  // 法定資訊
  tax_id: string;            // 統一編號
  
  // 印章
  seal_file_id: string;      // 騎縫章 Drive File ID（選用）
  stamp_file_id: string;     // 核准章 Drive File ID
  
  // Mail
  mail_footer: string;       // 郵件簽名檔
  
  // 監管
  supervisor_emails: string; // 監管人 Email（逗號分隔）
}
```

### 2.3 欄位約束

| 欄位 | 型別 | 必填 | 唯一 | 說明 |
|------|------|------|------|------|
| company_code | string | ✅ | ✅ | 大寫英文，不可變更 |
| company_name | string | ✅ | ✅ | 中文公司名稱 |
| template_code | string | ✅ | ❌ | 預設 TEMPLATE_A |
| stamp_file_id | string | ❌ | ❌ | Google Drive File ID |

---

## 三、與 S005 / V005 既有欄位對應表

### 3.1 Company_Profile 工作表對應

| Data Contract 欄位 | Company_Profile 欄位 | 狀態 |
|--------------------|---------------------|------|
| company_code | company_code | ✅ 已存在 |
| company_name | company_name | ✅ 已存在 |
| template_code | template_code | ✅ 已存在 |
| contact_person | contact_person | ✅ 已存在 |
| contact_phone | contact_phone | ✅ 已存在 |
| contact_email | contact_email | ✅ 已存在 |
| contact_address | contact_address | ✅ 已存在 |
| tax_id | tax_id | ✅ 已存在 |
| seal_file_id | seal_file_id | ✅ 已存在 |
| stamp_file_id | stamp_file_id | ✅ 已存在 |
| mail_footer | mail_footer | ✅ 已存在 |
| supervisor_emails | supervisor_emails | ✅ 已存在 |

### 3.2 S005_QUOTES 工作表對應

| Data Contract 欄位 | S005_QUOTES 欄位 | 說明 |
|--------------------|------------------|------|
| company_code | quote_company | 透過 company_name 查詢 company_code |

### 3.3 Snapshot 對應

| Data Contract 欄位 | Snapshot 路徑 | 說明 |
|--------------------|---------------|------|
| company_code | snapshot.company.code | ✅ 已存在 |
| company_name | snapshot.company.name | ✅ 已存在 |
| template_code | snapshot.company.template_code | ✅ 已存在 |
| stamp_file_id | snapshot.company.stamp_file_id | ✅ 已存在 |

---

## 四、識別與查詢規則

### 4.1 Primary Key

- **唯一識別**：`company_code`
- **備援識別**：`company_name`（歷史相容）

### 4.2 查詢模式

```javascript
// 標準查詢：由 company_name 取得完整 Profile
function getCompanyProfile(companyName) → CompanyProfile

// company_code 查詢（未來擴充）
function getCompanyByCode(companyCode) → CompanyProfile
```

### 4.3 關聯查詢

| 來源 | 關聯欄位 | 目標 |
|------|----------|------|
| S005_QUOTES.quote_company | company_name | Company_Profile |
| USER_COMPANIES.company_code | company_code | Company_Profile |
| USERS_ACCESS.company_code | company_code | Company_Profile |

---

## 五、驗證規則

| 規則 | 說明 |
|------|------|
| company_code 格式 | 大寫英文，2-10 字元 |
| company_code 唯一 | 不可重複 |
| company_name 唯一 | 不可重複 |
| stamp_file_id 格式 | Google Drive File ID 或空字串 |

---

## 六、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立 |

