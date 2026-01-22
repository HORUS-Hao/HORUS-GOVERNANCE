# STD-FACT-INGEST-BASELINE-0001

- 文件：STD-FACT-INGEST-BASELINE-0001.md
- 版本：v0.1.0
- 建立日期：2026-01-08
- 狀態：**Baseline 規範（v0 只檢查、不修正）**

---

## 一、文件目的

定義 FACT 資料寫入（Ingest）的基本規範，確保資料品質的一致性與可追溯性。

**核心原則**：
- ✅ 只寫 FACT（原始事實）
- ❌ 不修正既有資料
- ❌ 不回寫（No Rewrite）
- ❌ 不做跨模組自動同步

---

## 二、Ingest 原則

### 2.1 FACT Only 原則

| 允許 | 禁止 |
|------|------|
| 寫入原始事實資料 | 寫入推導/計算結果 |
| 新增欄位記錄 | 修改既有 FACT 值 |
| Append Only 操作 | Delete / Update 操作 |
| 明確來源標註 | 無來源的資料 |

### 2.2 Immutability 規則

一旦 FACT 寫入，原則上**不可變更**。

| 情境 | 允許操作 | 禁止操作 |
|------|----------|----------|
| 報價單建立 | 寫入 ref_id, items | 修改已建立的 ref_id |
| 狀態轉換 | 新增狀態記錄 | 回滾到前一狀態 |
| 核准操作 | 寫入 approved_by | 修改已核准的印章 |
| Snapshot 建立 | 凍結當下資料 | 修改已凍結的 Snapshot |

### 2.3 來源標註規則

每筆 FACT 寫入應可追溯：

```
來源資訊 = {
  module: 'S005' | 'V005',
  function: '寫入函數名稱',
  timestamp: '寫入時間',
  trigger: 'user_action' | 'system_event' | 'scheduled'
}
```

---

## 三、驗證規則

### 3.1 必填欄位（Required Fields）

| FACT 類型 | 必填欄位 |
|-----------|----------|
| Quote | ref_id, created_at, quote_company, status |
| Recipient | recipient_email（若有 recipient） |
| Items | model, qty, price（每筆商品） |
| Approval | approved_by, approved_at（核准時） |
| Session | email, device_id, session_token |

### 3.2 型別驗證（Type Validation）

| 欄位類型 | 驗證規則 |
|----------|----------|
| ref_id | 格式：`{PREFIX}-{YYYYMMDD}-{4digits}` |
| email | 合法 Email 格式 |
| status | 允許值：DRAFT, SUBMITTED, APPROVED, REJECTED, SENT, VOIDED, ACCEPTED |
| timestamp | ISO 8601 格式 或 Date 物件 |
| qty | 正整數 |
| price | 正數（可含小數） |

### 3.3 允許值驗證（Allowed Values）

```javascript
// Status 允許值
ALLOWED_STATUS = ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'SENT', 'VOIDED', 'ACCEPTED'];

// Role 允許值
ALLOWED_ROLES = ['VIEWER', 'CREATOR', 'ISSUER', 'APPROVER'];

// Mode 允許值（含稅/未稅）
ALLOWED_MODES = ['excl', 'incl'];
```

### 3.4 唯一性驗證（Uniqueness）

| 欄位 | 唯一性範圍 |
|------|------------|
| ref_id | 全域唯一 |
| email (Admin_Users) | 全域唯一 |
| session_token | 全域唯一 |
| approval_token | 全域唯一（一次性） |

---

## 四、錯誤處理

### 4.1 核心原則

> **只記錄、不中斷**：FACT 驗證失敗時，記錄錯誤但不阻擋 S005/V005 核心流程。

### 4.2 錯誤分級

| 等級 | 定義 | 處理方式 |
|------|------|----------|
| ERROR | 必填欄位缺失 / 型別錯誤 | 記錄 + 標記 |
| WARNING | 值超出預期範圍 | 記錄 |
| INFO | 可選欄位缺失 | 記錄（低優先） |

### 4.3 錯誤處理流程

```
1. 檢測到驗證錯誤
2. 記錄到 FACT_QUALITY_LOG（若存在）
3. 繼續執行原流程（不中斷）
4. 定期彙整錯誤報告
```

---

## 五、Log 格式

### 5.1 標準 Log 結構

```json
{
  "timestamp": "2026-01-08T10:30:00+08:00",
  "module": "S005",
  "function": "processSubmission",
  "fact_type": "Quote",
  "ref_id": "HRS-20260108-1234",
  "action": "CREATE",
  "record_count": 1,
  "validation": {
    "status": "PASS" | "FAIL",
    "errors": []
  }
}
```

### 5.2 錯誤 Log 範例

```json
{
  "timestamp": "2026-01-08T10:30:00+08:00",
  "module": "S005",
  "function": "buildSnapshot_",
  "fact_type": "Items",
  "ref_id": "HRS-20260108-1234",
  "action": "VALIDATE",
  "validation": {
    "status": "FAIL",
    "errors": [
      {
        "field": "items[2].price",
        "rule": "TYPE_NUMBER",
        "value": "abc",
        "message": "Price must be a number"
      }
    ]
  }
}
```

### 5.3 Log 欄位說明

| 欄位 | 說明 | 必填 |
|------|------|------|
| timestamp | ISO 8601 格式 | ✅ |
| module | 來源模組 (S005/V005) | ✅ |
| function | 來源函數名稱 | ✅ |
| fact_type | FACT 類型 | ✅ |
| ref_id | 報價單編號（若有） | ○ |
| action | 操作類型 (CREATE/UPDATE/VALIDATE) | ✅ |
| record_count | 處理筆數 | ○ |
| validation.status | 驗證結果 (PASS/FAIL) | ✅ |
| validation.errors | 錯誤明細陣列 | ○ |

---

## 六、適用範圍

### 6.1 本規範適用

| 模組 | 適用 |
|------|------|
| S005 | ✅ |
| V005 | ✅ |
| T005 | ❌（v0 不納入） |
| C005 | ❌（v0 不納入） |
| R020 | ❌（v0 不納入） |
| T030 | ❌（v0 不納入） |

### 6.2 本規範不適用

- Authority 欄位（Company/User/Role/Stamp）的新增或調整
- Derived 資料的計算與同步
- 跨模組自動修正機制

---

## 七、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v0.1.0 | 2026-01-08 | 初版建立（Baseline 規範） |

