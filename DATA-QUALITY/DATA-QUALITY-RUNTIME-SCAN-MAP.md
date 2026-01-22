# Data Quality Runtime Scan Map

- 文件：DATA-QUALITY-RUNTIME-SCAN-MAP.md
- 版本：v1.0.0
- 建立日期：2026-01-08
- 狀態：Read-only Scan Point Registry
- 來源：FACT-REGISTRY-v0.md

---

## 一、文件目的

本文件整理「允許掃描的 Runtime 讀取點位清單」，定義 Data Quality v1 可存取的資料來源。

**核心原則**：
- ✅ 只讀取（Read-only）
- ❌ 不寫入
- ❌ 不修正
- ❌ 不阻斷

---

## 二、允許掃描的 Runtime 讀取點

### 2.1 S005 模組 — 報價單主表

| Sheet 名稱 | 欄位 | 讀取方式 | 類型 | 掃描許可 |
|------------|------|----------|------|----------|
| S005_QUOTES | `ref_id` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `created_at` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `quote_date` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `quote_company` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `status` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `status_updated_at` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `items_json` | getRange().getValues() + JSON.parse | FACT | ✅ 允許 |
| S005_QUOTES | `quotation_snapshot_json` | getRange().getValues() + JSON.parse | FACT | ✅ 允許 |

### 2.2 S005 模組 — 報價對象

| Sheet 名稱 | 欄位 | 讀取方式 | 類型 | 掃描許可 |
|------------|------|----------|------|----------|
| S005_QUOTES | `recipient_company` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `recipient_name` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `recipient_email` | getRange().getValues() | FACT | ✅ 允許 |

### 2.3 S005 模組 — 審批相關

| Sheet 名稱 | 欄位 | 讀取方式 | 類型 | 掃描許可 |
|------------|------|----------|------|----------|
| S005_QUOTES | `approval_token` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `token_expires_at` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `submitted_by` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `submitted_at` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `approved_by` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `approved_at` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `approved_stamp_file_id` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `rejected_by` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `rejected_at` | getRange().getValues() | FACT | ✅ 允許 |
| S005_QUOTES | `reject_reason` | getRange().getValues() | FACT | ✅ 允許 |

### 2.4 S005 模組 — 公司設定

| Sheet 名稱 | 欄位 | 讀取方式 | 類型 | 掃描許可 |
|------------|------|----------|------|----------|
| Company_Profile | `company_code` | getRange().getValues() | FACT | ✅ 允許 |
| Company_Profile | `company_name` | getRange().getValues() | FACT | ✅ 允許 |
| Company_Profile | `template_code` | getRange().getValues() | FACT | ✅ 允許 |
| Company_Profile | `stamp_file_id` | getRange().getValues() | FACT | ✅ 允許 |
| Company_Profile | `contact_person` | getRange().getValues() | FACT | ✅ 允許 |
| Company_Profile | `contact_phone` | getRange().getValues() | FACT | ✅ 允許 |
| Company_Profile | `contact_email` | getRange().getValues() | FACT | ✅ 允許 |
| Company_Profile | `contact_address` | getRange().getValues() | FACT | ✅ 允許 |
| Company_Profile | `tax_id` | getRange().getValues() | FACT | ✅ 允許 |
| Company_Profile | `mail_footer` | getRange().getValues() | FACT | ✅ 允許 |
| Company_Profile | `supervisor_emails` | getRange().getValues() | FACT | ✅ 允許 |

### 2.5 S005 模組 — 使用者權限

| Sheet 名稱 | 欄位 | 讀取方式 | 類型 | 掃描許可 |
|------------|------|----------|------|----------|
| USERS_ACCESS | `email` | getRange().getValues() | Reference | ✅ 允許 |
| USERS_ACCESS | `role` | getRange().getValues() | Reference | ✅ 允許 |
| USERS_ACCESS | `status` | getRange().getValues() | Reference | ✅ 允許 |

### 2.6 S005 模組 — 身份驗證

| Sheet 名稱 | 欄位 | 讀取方式 | 類型 | 掃描許可 |
|------------|------|----------|------|----------|
| Admin_Users | `email` | getRange().getValues() | FACT | ✅ 允許 |
| Admin_Users | `pin_hash` | getRange().getValues() | FACT | ⚠️ 敏感（僅存在性檢查） |
| Admin_Users | `status` | getRange().getValues() | FACT | ✅ 允許 |
| Admin_Users | `failed_attempts` | getRange().getValues() | FACT | ✅ 允許 |
| Admin_Users | `locked_until` | getRange().getValues() | FACT | ✅ 允許 |
| Admin_Sessions | `session_token` | getRange().getValues() | FACT | ⚠️ 敏感（僅存在性檢查） |
| Admin_Sessions | `device_id` | getRange().getValues() | FACT | ✅ 允許 |
| Admin_Sessions | `expires_at` | getRange().getValues() | FACT | ✅ 允許 |
| Admin_OTP | `otp_code` | getRange().getValues() | FACT | ❌ 禁止掃描 |
| Admin_OTP | `expires_at` | getRange().getValues() | FACT | ✅ 允許 |
| Admin_OTP | `purpose` | getRange().getValues() | FACT | ✅ 允許 |

### 2.7 V005 模組 — 讀取點（依賴 S005）

| 來源 | 欄位 | 讀取方式 | 類型 | 掃描許可 |
|------|------|----------|------|----------|
| S005_QUOTES | `ref_id` | getQuote() | Reference | ✅ 允許 |
| S005_QUOTES | `quotation_snapshot_json` | getQuote() | Reference | ✅ 允許 |
| S005_QUOTES | `status` | getQuote() | Reference | ✅ 允許 |
| Company_Profile | (全部) | getCompanyProfile() | Reference | ✅ 允許 |

---

## 三、JSON 內部結構掃描點

### 3.1 items_json 內部

| JSON Path | 讀取方式 | 類型 | 掃描許可 |
|-----------|----------|------|----------|
| `items[].model` | JSON.parse + iterate | FACT | ✅ 允許 |
| `items[].name` | JSON.parse + iterate | FACT | ✅ 允許 |
| `items[].qty` | JSON.parse + iterate | FACT | ✅ 允許 |
| `items[].price` | JSON.parse + iterate | FACT | ✅ 允許 |
| `items[].mode` | JSON.parse + iterate | FACT | ✅ 允許 |
| `items[].image_file_id` | JSON.parse + iterate | FACT | ✅ 允許 |

### 3.2 quotation_snapshot_json 內部

| JSON Path | 讀取方式 | 類型 | 掃描許可 |
|-----------|----------|------|----------|
| `snapshot_version` | JSON.parse | FACT | ✅ 允許 |
| `created_at` | JSON.parse | FACT | ✅ 允許 |
| `company.code` | JSON.parse | FACT | ✅ 允許 |
| `company.name` | JSON.parse | FACT | ✅ 允許 |
| `company.template_code` | JSON.parse | FACT | ✅ 允許 |
| `company.stamp_file_id` | JSON.parse | FACT | ✅ 允許 |
| `stamps.approved_stamp_file_id` | JSON.parse | FACT | ✅ 允許 |
| `items[].*` | JSON.parse + iterate | FACT | ✅ 允許 |

---

## 四、禁止掃描的來源

### 4.1 安全敏感欄位

| Sheet 名稱 | 欄位 | 禁止原因 |
|------------|------|----------|
| Admin_OTP | `otp_code` | 一次性密碼，高度敏感 |
| Admin_Users | `pin_hash`（內容） | 僅可檢查存在性，不可讀取內容 |
| Admin_Sessions | `session_token`（內容） | 僅可檢查存在性/唯一性 |

### 4.2 範圍外模組

| 模組 | 禁止原因 |
|------|----------|
| T005 | v1 不納入 |
| C005 | v1 不納入 |
| R020 | v1 不納入 |
| T030 | v1 不納入 |
| T002 | 程式碼不在工程倉內 |

### 4.3 Runtime 寫入點

| 類型 | 禁止原因 |
|------|----------|
| 任何 setValue() | 禁止寫入 |
| 任何 setValues() | 禁止寫入 |
| 任何 appendRow() | 禁止寫入 |
| 任何 deleteRow() | 禁止刪除 |

---

## 五、掃描執行規範

### 5.1 允許的讀取模式

| 模式 | 說明 | 許可 |
|------|------|------|
| Batch Read | 一次讀取整個 Sheet | ✅ 允許 |
| Range Read | 讀取指定範圍 | ✅ 允許 |
| Single Cell | 讀取單一儲存格 | ✅ 允許 |
| JSON Parse | 解析 JSON 欄位 | ✅ 允許 |

### 5.2 禁止的操作

| 操作 | 說明 | 許可 |
|------|------|------|
| Write | 任何寫入操作 | ❌ 禁止 |
| Delete | 任何刪除操作 | ❌ 禁止 |
| Modify | 任何修改操作 | ❌ 禁止 |
| External API | 外部 API 呼叫 | ❌ 禁止 |

---

## 六、掃描點統計

| 類別 | 數量 |
|------|------|
| S005_QUOTES 欄位 | 18 |
| Company_Profile 欄位 | 11 |
| USERS_ACCESS 欄位 | 3 |
| Admin_Users 欄位 | 5 |
| Admin_Sessions 欄位 | 3 |
| Admin_OTP 欄位 | 2（排除 otp_code） |
| items_json 內部 | 6 |
| snapshot_json 內部 | 7+ |
| **總計允許掃描點** | **55+** |

---

## 七、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立（Runtime Scan Map） |

