# Architect Authorization View

> **Status**: EFFECTIVE
> **Version**: v1.0
> **Effective Date**: 2026-01-06
> **Authority Level**: Governance Binding
> **Scope**: Architect Decision Interface Specification

---

## 1. Purpose

本文件定義「Architect 授權後台（Web View）」在治理上的角色、責任與限制。

### 1.1 Scope of This Document

| Defines | Does NOT Define |
|---------|-----------------|
| Architect 看得到什麼 | UI 設計 |
| Architect 能按什麼 | 按鈕位置 |
| Architect 不能按什麼 | 技術實作 |
| 治理邊界 | API 規格 |

### 1.2 Document Role

本文件是治理規格（Governance Specification），不是實作規格（Implementation Specification）。

所有實作必須符合本文件定義的治理邊界。

---

## 2. Core Assumptions

### 2.1 Mandatory Assumptions

| ID | Assumption | Binding |
|----|------------|---------|
| A-01 | 本 View 只服務 ARCHITECT | Yes |
| A-02 | 所有資料皆為 Read-Only（除授權行為本身） | Yes |
| A-03 | 本 View 不得繞過 E-1 State Machine | Yes |
| A-04 | 本 View 不等於 GAS Function | Yes |

### 2.2 Assumption Details

#### A-01: 本 View 只服務 ARCHITECT

- 員工（STAFF）不得存取此 View
- 不存在「員工版授權畫面」
- 權限驗證在 View 載入前完成

#### A-02: 所有資料皆為 Read-Only

- Architect 可查看所有報價資訊
- Architect 不可編輯任何報價內容
- 唯一例外：執行 APPROVE / REJECT 動作

#### A-03: 本 View 不得繞過 E-1 State Machine

- 所有狀態轉移必須符合 AUTHORIZATION-STATE-MODEL.md
- 不存在「特殊權限跳過」
- 不存在「緊急授權通道」

#### A-04: 本 View 不等於 GAS Function

- 本 View 是決策介面，不是程式執行環境
- Architect 不需進入 GAS Editor
- Architect 不執行任何 test function

---

## 3. Architect Visible Data (Read-Only)

### 3.1 必須完整顯示的資訊類型

Architect 必須能夠看到以下資訊，以做出授權決策：

#### 3.1.1 報價基本資訊

| Information Type | Description | Visibility |
|------------------|-------------|------------|
| Ref ID | 報價唯一識別碼 | Mandatory |
| 建立日期 | 報價建立時間 | Mandatory |
| 報價對象 | 客戶 / 公司名稱 | Mandatory |
| 報價標題 | 報價主旨或說明 | Mandatory |

#### 3.1.2 明細項目

| Information Type | Description | Visibility |
|------------------|-------------|------------|
| 品項清單 | 所有報價品項 | Mandatory |
| 數量 | 各品項數量 | Mandatory |
| 單價 | 各品項單價 | Mandatory |
| 小計 | 各品項金額 | Mandatory |
| 總金額 | 報價總額 | Mandatory |

#### 3.1.3 狀態資訊

| Information Type | Description | Visibility |
|------------------|-------------|------------|
| 目前狀態 | Current State | Mandatory |
| 狀態歷史 | State Transition History | Mandatory |
| 各狀態時間戳記 | When each state was entered | Mandatory |

#### 3.1.4 來源資訊

| Information Type | Description | Visibility |
|------------------|-------------|------------|
| 提交人 | 由哪位 STAFF 提交 | Mandatory |
| 提交時間 | SUBMITTED_BY_STAFF 時間 | Mandatory |

### 3.2 Hard Rules for Visible Data

| Rule ID | Rule | Consequence |
|---------|------|-------------|
| VD-01 | Architect 不可修改任何資料 | 所有欄位皆為 Read-Only |
| VD-02 | 不可「邊看邊改」 | 無編輯功能 |
| VD-03 | 明細不可隱藏或摺疊 | 完整顯示所有品項 |
| VD-04 | 金額不可省略 | 必須顯示完整金額資訊 |

---

## 4. Architect Executable Actions

### 4.1 Allowed Actions (Exhaustive List)

Architect 在本 View 中 **只能** 執行以下兩個動作：

| Action | Description |
|--------|-------------|
| APPROVE | 核准報價 |
| REJECT | 駁回報價 |

**沒有其他動作。**

### 4.2 APPROVE Action

| Property | Value |
|----------|-------|
| **動作名稱** | APPROVE |
| **前置狀態** | 必須是 PENDING_APPROVAL |
| **觸發結果** | 狀態轉移至 APPROVED |
| **Actor** | ARCHITECT |
| **不可逆性** | 一旦 APPROVED，不可回退至 PENDING_APPROVAL 或任何前序狀態 |

### 4.3 REJECT Action

| Property | Value |
|----------|-------|
| **動作名稱** | REJECT |
| **前置狀態** | 必須是 PENDING_APPROVAL |
| **觸發結果** | 狀態轉移至 REJECTED (Terminal State) |
| **Actor** | ARCHITECT |
| **不可逆性** | 一旦 REJECTED，此報價流程永久終止，不可復活 |

### 4.4 Action Validation Requirements

每個 Action 執行前必須驗證：

| Check | Description |
|-------|-------------|
| State Check | 當前狀態必須是 PENDING_APPROVAL |
| Actor Check | 執行者必須是 ARCHITECT |
| Idempotency Check | 此動作未被重複執行 |

---

## 5. Explicit Prohibitions

### 5.1 Architect 不可執行的動作

| Prohibition ID | Prohibition | Reason |
|----------------|-------------|--------|
| P-01 | ❌ 不可送出報價 | SENT 由 SYSTEM 執行，非 ARCHITECT |
| P-02 | ❌ 不可代替員工編輯 | 編輯權屬於 STAFF，且僅限 DRAFT 狀態 |
| P-03 | ❌ 不可跳過 Mail Gate | 授權結果必須經 Mail 通知 |
| P-04 | ❌ 不可批次授權 | 每筆報價必須獨立審核、獨立決策 |
| P-05 | ❌ 不可建立報價 | DRAFT 建立權屬於 STAFF |
| P-06 | ❌ 不可刪除報價 | 無刪除機制，僅有 REJECTED |
| P-07 | ❌ 不可修改報價金額 | 所有資料皆為 Read-Only |
| P-08 | ❌ 不可代替 STAFF 提交 | SUBMITTED_BY_STAFF 必須由 STAFF 觸發 |

### 5.2 Prohibition Rationale

| Prohibition | Rationale |
|-------------|-----------|
| P-01 | 分離「決策」與「執行」，避免權責混淆 |
| P-02 | 維持資料所有權邊界 |
| P-03 | Mail Gate 是審計與通知的必要環節 |
| P-04 | 防止未審閱即批量核准 |
| P-05 ~ P-08 | 維持 Role Boundary 完整性 |

---

## 6. Relationship with Mail

### 6.1 Core Declarations

| Declaration | Statement |
|-------------|-----------|
| Authorization ≠ Mail | Architect 的授權行為不是 Mail |
| Mail = Notification | Mail 只負責通知「結果」 |
| Mail Failure ≠ Auth Failure | Mail 失敗 ≠ 授權失敗 |

### 6.2 Mail Role Definition

```
Architect 執行 APPROVE / REJECT
           │
           ▼
    State Transition Completed
           │
           ▼
    Audit Trail Created
           │
           ▼
    Mail Notification Triggered (Async)
           │
           ├── Success → STAFF 收到通知
           │
           └── Failure → 授權仍然有效，另行補發或查詢
```

### 6.3 Mail 不影響授權有效性

| Scenario | Authorization Status | Mail Status |
|----------|---------------------|-------------|
| APPROVE 成功，Mail 成功 | ✅ Valid | ✅ Sent |
| APPROVE 成功，Mail 失敗 | ✅ Valid | ❌ Failed (需補發) |
| APPROVE 失敗 | ❌ Invalid | N/A |

### 6.4 Mail Content Requirements

Mail 必須包含（治理層要求，非實作細節）：

| Requirement | Description |
|-------------|-------------|
| Ref ID | 報價識別碼 |
| Decision | APPROVED 或 REJECTED |
| Timestamp | 決策時間 |
| Next Step | 告知下一步（STAFF 應做什麼） |

---

## 7. Non-Scope Declaration

### 7.1 本文件明確不定義

| Out of Scope | Reason |
|--------------|--------|
| 畫面長怎樣 | 屬於 UI 設計 |
| 按鈕在哪 | 屬於 UI 設計 |
| API / GAS | 屬於技術實作 |
| 權限實作方式 | 屬於技術實作 |
| 顏色、字型、排版 | 屬於 UI 設計 |
| 載入速度、效能 | 屬於技術規格 |

### 7.2 Implementation Guidance

實作團隊需另行產出：

- UI Wireframe / Mockup
- API Specification
- GAS Function Design
- Access Control Implementation

所有實作必須符合本文件的治理邊界。

---

## 8. Changelog

| Version | Date | Description |
|---------|------|-------------|
| v1.0 | 2026-01-06 | Initial release - Architect Authorization View Governance |

---

## 9. Governance Statement

**This view is a governance boundary, not an operational tool.**

Architect Authorization View 存在的目的是：
- 提供決策所需的完整資訊
- 確保決策行為符合狀態機規則
- 維持 ARCHITECT 與 STAFF 的角色邊界

它不是：
- 報價編輯工具
- 資料管理介面
- 批量處理系統

---

**END OF ARCHITECT-AUTHORIZATION-VIEW.md**
