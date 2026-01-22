# Data Contract — StampId

- Module: GLOBAL
- File: DATA-CONTRACT-STAMP.md
- Version: v1.0.0
- Effective Date: 2026-01-08
- Status: **Active**
- Related Governance: GOVERNANCE-MULTI-STAMP.md

---

## 一、Purpose

本文件定義 `StampId` 之資料結構規格，作為工程實作之唯一依據。

**適用範圍**：
- S005、V005 及所有依賴印章功能之模組
- 核准蓋章、印章顯示、印章管理等操作

---

## 二、資料結構定義

### 2.1 StampId Schema

```typescript
interface StampId {
  stamp_file_id: string;     // Primary Key, Google Drive File ID
  company_code: string;      // FK → CompanyProfile.company_code
}
```

### 2.2 Stamp Reference Schema

```typescript
interface StampReference {
  // 識別
  stamp_file_id: string;     // PK, Google Drive File ID
  
  // 歸屬
  company_code: string;      // 所屬公司
  
  // 檔案資訊
  content_type: string;      // MIME type（image/png, image/jpeg）
  
  // 使用狀態
  is_active: boolean;        // 是否為該公司當前使用章
}
```

### 2.3 Snapshot Stamps Schema

```typescript
interface SnapshotStamps {
  draft_stamp_file_id: string;      // 草稿章 File ID（目前未啟用）
  approved_stamp_file_id: string;   // 核准章 File ID
}
```

### 2.4 欄位約束

| 欄位 | 型別 | 必填 | 唯一 | 說明 |
|------|------|------|------|------|
| stamp_file_id | string | ✅ | ✅ | Google Drive File ID |
| company_code | string | ✅ | ❌ | 歸屬公司 |
| approved_stamp_file_id | string | ❌ | ❌ | 核准時填入 |

---

## 三、與 S005 / V005 既有欄位對應表

### 3.1 Company_Profile 工作表對應

| Data Contract 欄位 | Company_Profile 欄位 | 狀態 |
|--------------------|---------------------|------|
| stamp_file_id | stamp_file_id | ✅ 已存在 |
| company_code | company_code | ✅ 已存在 |

### 3.2 S005_QUOTES 工作表對應

| Data Contract 欄位 | S005_QUOTES 欄位 | 狀態 |
|--------------------|------------------|------|
| approved_stamp_file_id | approved_stamp_file_id | ✅ 已存在 |

### 3.3 Snapshot 對應

| Data Contract 欄位 | Snapshot 路徑 | 狀態 |
|--------------------|---------------|------|
| stamp_file_id | snapshot.company.stamp_file_id | ✅ 已存在 |
| draft_stamp_file_id | snapshot.stamps.draft_stamp_file_id | ✅ 已存在 |
| approved_stamp_file_id | snapshot.stamps.approved_stamp_file_id | ✅ 已存在 |

---

## 四、識別與查詢規則

### 4.1 Primary Key

- **唯一識別**：`stamp_file_id`（Google Drive File ID）
- **歸屬識別**：`company_code` + `is_active`

### 4.2 查詢模式

```javascript
// 標準查詢：由 File ID 取得印章 Data URL
function getStampDataUrl(fileId) → string  // data:image/...;base64,...

// 公司印章查詢：由 company_name 取得當前印章
function getCompanyProfile(companyName).stamp_file_id → string
```

### 4.3 關聯查詢

| 來源 | 關聯欄位 | 目標 |
|------|----------|------|
| Company_Profile.stamp_file_id | stamp_file_id | Google Drive File |
| S005_QUOTES.approved_stamp_file_id | stamp_file_id | Google Drive File |
| Snapshot.stamps.approved_stamp_file_id | stamp_file_id | Google Drive File |

---

## 五、印章狀態對應

### 5.1 報價單狀態與印章顯示

| 報價單狀態 | 印章顯示 | 來源欄位 |
|------------|----------|----------|
| DRAFT | 無印章 | - |
| SUBMITTED | 無印章 | - |
| APPROVED | 核准章 | snapshot.stamps.approved_stamp_file_id |
| SENT | 核准章 | snapshot.stamps.approved_stamp_file_id |
| ACCEPTED | 核准章 | snapshot.stamps.approved_stamp_file_id |
| REJECTED | 無印章 | - |
| VOIDED | 無印章 | - |

### 5.2 印章寫入時機

| 操作 | 寫入欄位 | 來源 |
|------|----------|------|
| approveQuotation | approved_stamp_file_id | Company_Profile.stamp_file_id |
| executeApproval_ | snapshot.stamps.approved_stamp_file_id | Company_Profile.stamp_file_id |

---

## 六、驗證規則

| 規則 | 說明 |
|------|------|
| stamp_file_id 格式 | Google Drive File ID（約 33 字元） |
| stamp_file_id 存在性 | 需為有效的 Drive File ID |
| stamp_file_id 權限 | 執行帳號需有讀取權限 |
| 空值處理 | 空字串表示無印章 |

---

## 七、治理紅線對應

| 治理規則 | 技術實作 |
|----------|----------|
| 禁止跨公司使用印章 | stamp_file_id 僅從對應公司的 Company_Profile 取得 |
| 禁止資料夾掃描決策 | 僅使用 stamp_file_id 查詢，不掃描 STAMPS 資料夾 |
| 禁止修改已凍結印章 | Snapshot 一經寫入不可變更 |
| 禁止公開印章檔案 | 印章檔案需設為私有，透過 Data URL 傳輸 |

---

## 八、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立 |

