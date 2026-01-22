# FACT Quality Baseline v0

- 文件：FACT-QUALITY-BASELINE-v0.md
- 版本：v0.1.0
- 建立日期：2026-01-08
- 狀態：**只檢查、不修正**

---

## 一、文件目的

定義 FACT 資料品質的檢查基線，建立品質報告格式。

**核心裁定**：
> **v0 階段僅執行品質檢查，不做任何資料修正。**
> **修正動作留待 v1（Authority 完成後）。**

---

## 二、檢查清單

### 2.1 必填檢查（Required）

| 檢查項目 | 目標表 | 檢查欄位 | 錯誤等級 |
|----------|--------|----------|----------|
| Quote 必填 | S005_QUOTES | ref_id, created_at, quote_company, status | ERROR |
| Recipient Email | S005_QUOTES | recipient_email（若 recipient_company 存在） | WARNING |
| Items 必填 | items_json | 每筆需有 model, qty, price | ERROR |
| Snapshot 存在 | S005_QUOTES | quotation_snapshot_json（非空） | WARNING |
| Approval 完整 | S005_QUOTES | approved_by, approved_at（若 status=APPROVED） | ERROR |

### 2.2 型別檢查（Type）

| 檢查項目 | 預期型別 | 檢查規則 |
|----------|----------|----------|
| ref_id | String | 非空字串 |
| created_at | Date | 可解析為日期 |
| status | Enum | 在 ALLOWED_STATUS 內 |
| items_json | JSON Array | 可解析為陣列 |
| qty | Number | 正整數 |
| price | Number | 正數 |

### 2.3 格式檢查（Format）

| 檢查項目 | 格式規則 | 範例 |
|----------|----------|------|
| ref_id | `{PREFIX}-{YYYYMMDD}-{4digits}` | HRS-20260108-1234 |
| email | RFC 5322 Email 格式 | user@domain.com |
| timestamp | ISO 8601 | 2026-01-08T10:30:00+08:00 |

### 2.4 唯一性檢查（Uniqueness）

| 檢查項目 | 範圍 | 檢查方式 |
|----------|------|----------|
| ref_id | S005_QUOTES 全表 | 計算重複數量 |
| approval_token | S005_QUOTES 全表 | 計算重複數量（排除空值） |

### 2.5 參照完整性檢查（Referential Integrity）

| 檢查項目 | 來源表 | 目標表 | 檢查方式 |
|----------|--------|--------|----------|
| quote_company → company_name | S005_QUOTES | Company_Profile | 值必須存在 |
| submitted_by → email | S005_QUOTES | Admin_Users | 值必須存在 |
| approved_by → email | S005_QUOTES | Admin_Users | 值必須存在 |

### 2.6 範圍檢查（Range）

| 檢查項目 | 允許範圍 | 錯誤等級 |
|----------|----------|----------|
| qty | 1 ~ 99999 | WARNING（超範圍） |
| price | 0.01 ~ 999999999 | WARNING（超範圍） |
| snapshot_version | '1.0' ~ '9.9' | INFO |

---

## 三、產出報告格式

### 3.1 Summary 區塊

```markdown
## FACT Quality Report - Summary

| 指標 | 數值 |
|------|------|
| 檢查日期 | 2026-01-08 |
| 檢查模組 | S005, V005 |
| 總記錄數 | 1,234 |
| 通過數 | 1,180 |
| 錯誤數 | 42 |
| 警告數 | 12 |
| 通過率 | 95.6% |
```

### 3.2 Top Errors 區塊

```markdown
## Top 10 Errors

| # | 錯誤類型 | 欄位 | 數量 | 範例 ref_id |
|---|----------|------|------|-------------|
| 1 | REQUIRED_MISSING | recipient_email | 15 | HRS-20260101-0001 |
| 2 | TYPE_ERROR | items_json | 8 | DPD-20260102-0002 |
| 3 | FORMAT_ERROR | ref_id | 7 | INVALID-123 |
| 4 | UNIQUE_VIOLATION | ref_id | 5 | HRS-20260103-0003 |
| 5 | REF_INTEGRITY | quote_company | 4 | HRS-20260104-0004 |
```

### 3.3 Detail 區塊（可選）

```markdown
## Error Details

### REQUIRED_MISSING: recipient_email

| ref_id | created_at | recipient_company |
|--------|------------|-------------------|
| HRS-20260101-0001 | 2026-01-01 | ABC Corp |
| HRS-20260101-0002 | 2026-01-01 | XYZ Ltd |
```

---

## 四、檢查執行方式

### 4.1 執行頻率

| 模式 | 頻率 | 觸發方式 |
|------|------|----------|
| 手動 | 隨需 | 管理員手動執行 |
| 排程 | 每日 | Time-based Trigger（建議） |
| 事件 | 即時 | 每次寫入後（v1 考量） |

### 4.2 執行流程

```
1. 讀取 S005_QUOTES 全表
2. 逐筆執行檢查清單
3. 彙整錯誤統計
4. 產出 Summary + Top Errors
5. 儲存報告（不修正資料）
```

### 4.3 報告儲存位置

```
HORUS-GOVERNANCE/
└─ DATA-QUALITY/
   └─ reports/
      └─ FACT-QUALITY-REPORT-{YYYYMMDD}.md
```

---

## 五、結論裁定

### 5.1 v0 階段裁定

| 裁定項目 | 決定 |
|----------|------|
| 是否執行檢查 | ✅ 是 |
| 是否修正資料 | ❌ 否（v0 禁止） |
| 是否阻擋流程 | ❌ 否（只記錄） |
| 是否通知管理員 | ○ 可選（報告產出時） |

### 5.2 v1 階段預留

以下功能留待 Authority 完成後的 v1 階段：

| 預留功能 | 說明 |
|----------|------|
| 自動修正 | 根據規則自動修正明顯錯誤 |
| 流程阻擋 | 嚴重錯誤時阻止寫入 |
| 跨模組同步 | 與 T005/C005/R020 同步 |
| Derived 計算 | 產出推導資料 |

### 5.3 最終聲明

> **本文件定義的品質檢查為「觀察性質」，僅用於了解資料現況。**
> **任何資料修正動作必須等待 Authority 治理完成（v1 以後）。**

---

## 六、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v0.1.0 | 2026-01-08 | 初版建立（只檢查、不修正） |

