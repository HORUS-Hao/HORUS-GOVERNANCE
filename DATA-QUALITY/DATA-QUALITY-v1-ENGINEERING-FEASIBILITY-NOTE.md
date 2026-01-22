# Data Quality v1 — Engineering Feasibility Note

- 文件：DATA-QUALITY-v1-ENGINEERING-FEASIBILITY-NOTE.md
- 版本：v1.0.0
- 建立日期：2026-01-08
- 狀態：**Engineering Readiness Check**
- 結論：**工程上可直接實作**（含少量待裁定項目）

---

## 一、文件目的

從「工程角度」檢視 Data Quality v1 規格是否可直接實作。

**核心問題**：
1. 規則是否可直接轉成 runtime 檢查？
2. Scan Map 是否足以定位讀取點？

**本文件不做**：
- ❌ 不實作
- ❌ 不啟用
- ❌ 不提供實作建議

---

## 二、規則可行性總覽

### 2.1 統計摘要

| 規則類型 | 規則數量 | 技術可行 | 需補 FACT | 需 Architect 裁定 |
|----------|----------|----------|-----------|-------------------|
| Required Fields | 33 | 32 | 0 | 1 |
| Type Checks | 19 | 19 | 0 | 0 |
| Enum Checks | 4 | 4 | 0 | 0 |
| Range Checks | 3 | 2 | 0 | 1 |
| Format Checks | 5 | 4 | 0 | 1 |
| Uniqueness Checks | 5 | 5 | 0 | 0 |
| Referential Integrity | 4 | 3 | 0 | 1 |
| Consistency Checks | 5 | 5 | 0 | 0 |
| **總計** | **78** | **74** | **0** | **4** |

**結論**：94.9% 規則技術上可行，4 項需 Architect 裁定。

---

## 三、技術可行性詳細分析

### 3.1 Required Fields（必填檢查）— ✅ 可行

#### 3.1.1 S005_QUOTES Unconditional（6 條）

| rule_id | 欄位 | Scan Map 對應 | 可行性 |
|---------|------|---------------|--------|
| REQ-S005-001 | ref_id | ✅ S005_QUOTES.ref_id | ✅ 可行 |
| REQ-S005-002 | created_at | ✅ S005_QUOTES.created_at | ✅ 可行 |
| REQ-S005-003 | quote_company | ✅ S005_QUOTES.quote_company | ✅ 可行 |
| REQ-S005-004 | status | ✅ S005_QUOTES.status | ✅ 可行 |
| REQ-S005-005 | status_updated_at | ✅ S005_QUOTES.status_updated_at | ✅ 可行 |
| REQ-S005-006 | items_json | ✅ S005_QUOTES.items_json | ✅ 可行 |

**技術說明**：直接讀取欄位值，檢查非空/非 null。

#### 3.1.2 S005_QUOTES Conditional（9 條）

| rule_id | 欄位 | 條件 | 可行性 |
|---------|------|------|--------|
| REQ-S005-C01 | quotation_snapshot_json | status ≠ DRAFT | ✅ 可行 |
| REQ-S005-C02 | submitted_by | status ∈ [SUBMITTED, APPROVED, SENT] | ✅ 可行 |
| REQ-S005-C03 | submitted_at | status ∈ [SUBMITTED, APPROVED, SENT] | ✅ 可行 |
| REQ-S005-C04 | approved_by | status ∈ [APPROVED, SENT] | ✅ 可行 |
| REQ-S005-C05 | approved_at | status ∈ [APPROVED, SENT] | ✅ 可行 |
| REQ-S005-C06 | approved_stamp_file_id | status ∈ [APPROVED, SENT] | ✅ 可行 |
| REQ-S005-C07 | rejected_by | status = REJECTED | ✅ 可行 |
| REQ-S005-C08 | rejected_at | status = REJECTED | ✅ 可行 |
| REQ-S005-C09 | reject_reason | status = REJECTED | ✅ 可行 |

**技術說明**：先讀取 `status` 欄位，再依條件檢查對應欄位。

#### 3.1.3 Items_JSON / Snapshot_JSON（9 條）

| rule_id | JSON Path | 可行性 | 說明 |
|---------|-----------|--------|------|
| REQ-ITEM-001 ~ 005 | items[].* | ✅ 可行 | JSON.parse + 迭代 |
| REQ-SNAP-001 ~ 004 | snapshot.* | ✅ 可行 | JSON.parse + 存取 |

**技術說明**：JSON.parse 解析後，存取內部屬性。

#### 3.1.4 Admin_Users（2 條）

| rule_id | 欄位 | 可行性 | 說明 |
|---------|------|--------|------|
| REQ-AUTH-001 | email | ✅ 可行 | 直接讀取 |
| REQ-AUTH-002 | pin_hash | ⚠️ 需裁定 | 見待裁定 #1 |

---

### 3.2 Type Checks（型別檢查）— ✅ 可行

| 類型 | 規則數 | 可行性 | 技術說明 |
|------|--------|--------|----------|
| String | 9 | ✅ 可行 | `typeof value === 'string'` |
| Number | 2 | ✅ 可行 | `typeof value === 'number'` |
| Date | 6 | ✅ 可行 | `new Date(value)` 有效性 |
| JSON | 2 | ✅ 可行 | `JSON.parse` 不拋錯 |

---

### 3.3 Enum Checks（枚舉檢查）— ✅ 可行

| rule_id | 欄位 | 允許值 | 可行性 |
|---------|------|--------|--------|
| ENUM-001 | status | 7 值 | ✅ 可行 |
| ENUM-002 | items[].mode | excl, incl | ✅ 可行 |
| ENUM-003 | USERS_ACCESS.role | 4 值 | ✅ 可行 |
| ENUM-004 | USERS_ACCESS.status | ACTIVE, INACTIVE | ✅ 可行 |

**技術說明**：`allowedValues.includes(value)`

---

### 3.4 Range Checks（範圍檢查）— ⚠️ 部分需裁定

| rule_id | 欄位 | 範圍 | 可行性 | 說明 |
|---------|------|------|--------|------|
| RANGE-001 | items[].qty | 1 ~ 99999 | ✅ 可行 | 數值比較 |
| RANGE-002 | items[].price | 0.01 ~ 999999999 | ✅ 可行 | 數值比較 |
| RANGE-003 | snapshot_version | "1.0" ~ "9.9" | ⚠️ 需裁定 | 見待裁定 #2 |

---

### 3.5 Format Checks（格式檢查）— ⚠️ 部分需裁定

| rule_id | 欄位 | 格式 | 可行性 | 說明 |
|---------|------|------|--------|------|
| FORMAT-001 | ref_id | `^[A-Z]{2,4}-[0-9]{8}-[0-9]{4}$` | ✅ 可行 | 正則匹配 |
| FORMAT-002 | recipient_email | RFC 5322 | ✅ 可行 | Email 正則 |
| FORMAT-003 | submitted_by | RFC 5322 | ✅ 可行 | Email 正則 |
| FORMAT-004 | approved_by | RFC 5322 | ✅ 可行 | Email 正則 |
| FORMAT-005 | Timestamps | ISO 8601 | ⚠️ 需裁定 | 見待裁定 #3 |

---

### 3.6 Uniqueness Checks（唯一性檢查）— ✅ 可行

| rule_id | 欄位 | 範圍 | 可行性 | 說明 |
|---------|------|------|--------|------|
| UNIQUE-001 | ref_id | S005_QUOTES | ✅ 可行 | 全表掃描計數 |
| UNIQUE-002 | approval_token | S005_QUOTES | ✅ 可行 | 排除 null 後計數 |
| UNIQUE-003 | email | Admin_Users | ✅ 可行 | 全表掃描計數 |
| UNIQUE-004 | session_token | Admin_Sessions | ✅ 可行 | 全表掃描計數 |
| UNIQUE-005 | company_code | Company_Profile | ✅ 可行 | 全表掃描計數 |

**技術說明**：讀取全表 → Map 統計 → 找出重複。

---

### 3.7 Referential Integrity（參照完整性）— ⚠️ 部分需裁定

| rule_id | 來源 | 目標 | 可行性 | 說明 |
|---------|------|------|--------|------|
| REF-001 | quote_company | Company_Profile.company_name | ✅ 可行 | 跨表查詢 |
| REF-002 | submitted_by | Admin_Users.email | ✅ 可行 | 跨表查詢 |
| REF-003 | approved_by | Admin_Users.email | ✅ 可行 | 跨表查詢 |
| REF-004 | USERS_ACCESS.email | Admin_Users.email | ⚠️ 需裁定 | 見待裁定 #4 |

---

### 3.8 Consistency Checks（一致性檢查）— ✅ 可行

| rule_id | 名稱 | 可行性 | 說明 |
|---------|------|--------|------|
| CONSIST-001 | APPROVED_COMPLETENESS | ✅ 可行 | 狀態判斷 + 欄位檢查 |
| CONSIST-002 | REJECTED_COMPLETENESS | ✅ 可行 | 狀態判斷 + 欄位檢查 |
| CONSIST-003 | SUBMITTED_COMPLETENESS | ✅ 可行 | 狀態判斷 + 欄位檢查 |
| CONSIST-004 | TIMESTAMP_ORDER | ✅ 可行 | 日期比較 |
| CONSIST-005 | APPROVAL_ORDER | ✅ 可行 | 日期比較 |

---

## 四、Scan Map 覆蓋率分析

### 4.1 讀取點對應

| Schema 表/欄位 | Scan Map 對應 | 覆蓋狀態 |
|----------------|---------------|----------|
| S005_QUOTES.* | ✅ 2.1 ~ 2.3 | ✅ 完整覆蓋 |
| Company_Profile.* | ✅ 2.4 | ✅ 完整覆蓋 |
| USERS_ACCESS.* | ✅ 2.5 | ✅ 完整覆蓋 |
| Admin_Users.* | ✅ 2.6 | ✅ 完整覆蓋 |
| Admin_Sessions.* | ✅ 2.6 | ✅ 完整覆蓋 |
| items_json 內部 | ✅ 3.1 | ✅ 完整覆蓋 |
| snapshot_json 內部 | ✅ 3.2 | ✅ 完整覆蓋 |

**結論**：Scan Map 足以定位所有讀取點。

### 4.2 敏感欄位處理

| 欄位 | Scan Map 標註 | 規則對應 | 處理方式 |
|------|---------------|----------|----------|
| pin_hash | ⚠️ 僅存在性檢查 | REQ-AUTH-002 | 需裁定 |
| session_token | ⚠️ 僅存在性檢查 | UNIQUE-004 | 可行（計數） |
| otp_code | ❌ 禁止掃描 | 無規則 | N/A |

---

## 五、需補 FACT 才能做的規則

### 5.1 目前狀態

| 項目 | 定義狀態 | 現有 FACT | 結論 |
|------|----------|-----------|------|
| Mail Log | FACT-OPTIONAL | ❌ 無 | 僅標註，不阻擋 v1 |
| PDF Archive | FACT-OPTIONAL | ❌ 無 | 僅標註，不阻擋 v1 |
| UNKNOWN_STAMP 檢查 | 規則定義 | ⚠️ 需 DriveApp | 見說明 |

### 5.2 UNKNOWN_STAMP 說明

規則 `UNKNOWN_STAMP` 定義為檢查 `stamp_file_id` 是否可存取。

| 技術需求 | 說明 |
|----------|------|
| DriveApp.getFileById() | 需呼叫 DriveApp |
| 權限 | 需有 Drive 讀取權限 |
| 錯誤處理 | 檔案不存在會拋錯 |

**結論**：技術上可行，但超出「純 Sheet 讀取」範圍。標註為「需確認是否納入 v1」。

---

## 六、需 Architect 額外裁定的項目

### 6.1 待裁定 #1：pin_hash 存在性檢查

| 項目 | 說明 |
|------|------|
| 規則 | REQ-AUTH-002 |
| 問題 | pin_hash 被標為敏感欄位，Scan Map 註明「僅存在性檢查」 |
| 選項 A | 檢查欄位非空即可，不讀取實際內容 |
| 選項 B | 完全跳過此規則 |
| 需裁定 | 選擇 A 或 B |

### 6.2 待裁定 #2：SnapshotVersion 範圍比較

| 項目 | 說明 |
|------|------|
| 規則 | RANGE-003 |
| 問題 | `snapshot_version` 為字串 "1.0" ~ "9.9"，非數值 |
| 選項 A | 字串比較（按字母序） |
| 選項 B | 轉換為數值後比較 |
| 選項 C | 僅檢查格式為 `X.Y` |
| 需裁定 | 選擇 A / B / C |

### 6.3 待裁定 #3：Timestamp ISO 8601 嚴格度

| 項目 | 說明 |
|------|------|
| 規則 | FORMAT-005 |
| 問題 | GAS 日期可能為多種格式（Date 物件、字串、時間戳） |
| 選項 A | 嚴格 ISO 8601 格式驗證 |
| 選項 B | 僅檢查可解析為有效日期 |
| 選項 C | 接受 GAS 原生 Date 物件 |
| 需裁定 | 選擇 A / B / C |

### 6.4 待裁定 #4：USERS_ACCESS 參照檢查

| 項目 | 說明 |
|------|------|
| 規則 | REF-004 |
| 問題 | USERS_ACCESS 為 Reference 表，非 FACT 表 |
| 選項 A | 納入 v1 檢查範圍 |
| 選項 B | 排除（僅檢查 FACT 表） |
| 需裁定 | 選擇 A 或 B |

### 6.5 待裁定 #5：UNKNOWN_STAMP 檢查範圍

| 項目 | 說明 |
|------|------|
| 規則 | UNKNOWN_STAMP |
| 問題 | 需呼叫 DriveApp，超出純 Sheet 讀取 |
| 選項 A | 納入 v1，允許 DriveApp 讀取 |
| 選項 B | 排除，留待 v2 |
| 需裁定 | 選擇 A 或 B |

---

## 七、工程可行性結論

### 7.1 總體評估

| 評估項目 | 結果 |
|----------|------|
| 規則可轉 Runtime | ✅ 94.9%（74/78） |
| Scan Map 覆蓋率 | ✅ 100% |
| 技術障礙 | ❌ 無 |
| 需補 FACT | ⚠️ 0（OPTIONAL 不阻擋） |
| 需 Architect 裁定 | ⚠️ 5 項 |

### 7.2 一句話結論

> **Data Quality v1 規格工程上可直接實作，Scan Map 足以定位所有讀取點。**
> **5 項邊界條件需 Architect 裁定後方可實作。**

### 7.3 裁定後即可實作的規則

| 類別 | 數量 | 狀態 |
|------|------|------|
| 無需裁定，直接可行 | 73 | ✅ Ready |
| 待 Architect 裁定 | 5 | ⏸️ Pending |
| **總計** | **78** | |

---

## 八、文件歷程

| 版本 | 日期 | 說明 |
|------|------|------|
| v1.0.0 | 2026-01-08 | 初版建立（Engineering Feasibility Note） |

