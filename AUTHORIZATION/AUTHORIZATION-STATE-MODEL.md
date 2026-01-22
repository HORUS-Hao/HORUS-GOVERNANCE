# Authorization State Model

> **Status**: EFFECTIVE
> **Version**: v1.0
> **Effective Date**: 2026-01-06
> **Authority Level**: Governance Binding
> **Scope**: Quotation Authorization Workflow

---

## 1. Purpose

本文件定義「報價授權流程」中唯一合法的狀態機，所有 Web、Mail、GAS、人工操作皆不得違反本模型。

### 1.1 Binding Declaration

- 本文件為治理約束文件（Governance Binding）
- 所有實作必須完全遵循本狀態模型
- 任何偏離本模型的行為視為治理違規（Governance Breach）

### 1.2 Non-Negotiable Principles

| Principle | Description |
|-----------|-------------|
| Single State Machine | 系統中僅存在唯一狀態機 |
| No Bypass | 不允許任何繞過狀態機的操作 |
| Forward Only | 狀態只能前進，不可回退 |
| Audit Required | 所有狀態轉移必須可追溯 |

---

## 2. State Definitions

### 2.1 DRAFT

| Property | Value |
|----------|-------|
| **狀態說明** | 報價草稿，員工正在編輯中，尚未提交審核 |
| **Allowed Actions** | 編輯報價內容、儲存草稿、刪除草稿 |
| **Forbidden Actions** | 送出報價、標記為已核准 |
| **From (來源狀態)** | (Initial State - 無來源) |
| **To (目標狀態)** | SUBMITTED_BY_STAFF |

### 2.2 SUBMITTED_BY_STAFF

| Property | Value |
|----------|-------|
| **狀態說明** | 員工已提交報價，等待進入審核佇列 |
| **Allowed Actions** | 系統自動將報價移入審核佇列 |
| **Forbidden Actions** | 員工編輯、員工送出、員工核准 |
| **From (來源狀態)** | DRAFT |
| **To (目標狀態)** | PENDING_APPROVAL |

### 2.3 PENDING_APPROVAL

| Property | Value |
|----------|-------|
| **狀態說明** | 報價已進入審核佇列，等待 Architect 審核決策 |
| **Allowed Actions** | Architect 審閱、Architect 核准、Architect 駁回 |
| **Forbidden Actions** | 員工編輯、員工送出、系統自動核准 |
| **From (來源狀態)** | SUBMITTED_BY_STAFF |
| **To (目標狀態)** | APPROVED, REJECTED |

### 2.4 APPROVED

| Property | Value |
|----------|-------|
| **狀態說明** | 報價已獲 Architect 核准，可進行送出作業 |
| **Allowed Actions** | 系統執行送出、員工確認送出意願 |
| **Forbidden Actions** | 修改報價內容、回退至前序狀態 |
| **From (來源狀態)** | PENDING_APPROVAL |
| **To (目標狀態)** | SENT |

### 2.5 REJECTED

| Property | Value |
|----------|-------|
| **狀態說明** | 報價已被 Architect 駁回，流程終止或需重新建立 |
| **Allowed Actions** | 查看駁回原因、建立新報價（獨立流程） |
| **Forbidden Actions** | 修改此報價、重新提交此報價、送出此報價 |
| **From (來源狀態)** | PENDING_APPROVAL |
| **To (目標狀態)** | (Terminal State - 無目標) |

### 2.6 SENT

| Property | Value |
|----------|-------|
| **狀態說明** | 報價已正式送出給客戶，流程完成 |
| **Allowed Actions** | 查看報價記錄、匯出報價副本 |
| **Forbidden Actions** | 任何修改、任何狀態變更 |
| **From (來源狀態)** | APPROVED |
| **To (目標狀態)** | (Terminal State - 無目標) |

---

## 3. State Transition Rules

### 3.1 Transition Matrix

| From State | To State | Trigger | Actor | 是否可逆 |
|------------|----------|---------|-------|----------|
| (Initial) | DRAFT | 建立新報價 | STAFF | N/A |
| DRAFT | SUBMITTED_BY_STAFF | 員工提交報價 | STAFF | ❌ |
| SUBMITTED_BY_STAFF | PENDING_APPROVAL | 系統移入審核佇列 | SYSTEM | ❌ |
| PENDING_APPROVAL | APPROVED | Architect 核准 | ARCHITECT | ❌ |
| PENDING_APPROVAL | REJECTED | Architect 駁回 | ARCHITECT | ❌ |
| APPROVED | SENT | 系統執行送出 | SYSTEM | ❌ |

### 3.2 State Flow Diagram

```
                    ┌──────────────────────────────────────────┐
                    │                                          │
                    ▼                                          │
┌─────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│  DRAFT  │───▶│ SUBMITTED_BY_STAFF  │───▶│  PENDING_APPROVAL   │
└─────────┘    └─────────────────────┘    └─────────────────────┘
   STAFF              STAFF                        │
                                                   │
                         ┌─────────────────────────┼─────────────────────────┐
                         │                         │                         │
                         ▼                         │                         ▼
                  ┌────────────┐                   │                  ┌────────────┐
                  │  REJECTED  │                   │                  │  APPROVED  │
                  │ (Terminal) │                   │                  └────────────┘
                  └────────────┘                   │                         │
                    ARCHITECT                      │                    ARCHITECT
                                                   │                         │
                                                   │                         ▼
                                                   │                  ┌────────────┐
                                                   │                  │    SENT    │
                                                   │                  │ (Terminal) │
                                                   │                  └────────────┘
                                                   │                      SYSTEM
                                                   │
                                                   └── Actor Labels
```

### 3.3 Hard Rules (不可違反)

| Rule ID | Rule | Consequence |
|---------|------|-------------|
| HR-01 | ❌ 不允許任何跳階 | 所有轉移必須依序進行 |
| HR-02 | ❌ 不允許由 DRAFT 直接進 APPROVED | 必須經過 SUBMITTED → PENDING |
| HR-03 | ❌ APPROVED 之後不得回到任何前序狀態 | 狀態不可逆 |
| HR-04 | ❌ SENT 為終態（Terminal State） | 無任何後續轉移 |
| HR-05 | ❌ REJECTED 為終態（Terminal State） | 無任何後續轉移 |

---

## 4. Role Boundary

### 4.1 Role Definitions

| Role | Description | System Identity |
|------|-------------|-----------------|
| STAFF | 員工，報價建立與提交者 | 員工帳號 |
| ARCHITECT | 決策者（老闆），唯一授權核准者 | Architect 帳號 |
| SYSTEM | 系統自動化，執行機械性轉移 | GAS / Backend |

### 4.2 STAFF 權限邊界

| 允許 | 禁止 |
|------|------|
| ✅ 建立 DRAFT | ❌ 執行 APPROVED 轉移 |
| ✅ 編輯 DRAFT | ❌ 執行 REJECTED 轉移 |
| ✅ 提交 (DRAFT → SUBMITTED) | ❌ 執行 SENT 轉移 |
| ✅ 查看報價狀態 | ❌ 修改非 DRAFT 狀態的報價 |

**STAFF 不能執行的狀態轉移：**
- PENDING_APPROVAL → APPROVED
- PENDING_APPROVAL → REJECTED
- APPROVED → SENT
- 任何回退轉移

### 4.3 ARCHITECT 權限邊界

| 允許 | 禁止 |
|------|------|
| ✅ 審閱 PENDING_APPROVAL 報價 | ❌ 建立 DRAFT |
| ✅ 執行 APPROVED 轉移 | ❌ 編輯報價內容 |
| ✅ 執行 REJECTED 轉移 | ❌ 直接執行 SENT |

**ARCHITECT 唯一可執行的轉移：**
- PENDING_APPROVAL → APPROVED
- PENDING_APPROVAL → REJECTED

### 4.4 SYSTEM 權限邊界

| 允許 | 禁止 |
|------|------|
| ✅ SUBMITTED_BY_STAFF → PENDING_APPROVAL | ❌ 決策性轉移（APPROVED/REJECTED） |
| ✅ APPROVED → SENT | ❌ 跳過任何狀態 |
| ✅ 記錄審計軌跡 | ❌ 修改報價內容 |

**SYSTEM 僅可做機械性轉移：**
- SUBMITTED_BY_STAFF → PENDING_APPROVAL（自動入列）
- APPROVED → SENT（執行送出）

---

## 5. Mail 與狀態機的關係

### 5.1 Core Declarations

| Declaration | Statement |
|-------------|-----------|
| Mail ≠ State | Mail 不是狀態 |
| Mail ≠ Transition | Mail 不能直接改變狀態 |
| Mail = Intent | Mail 僅能作為「觸發請求（Intent）」來源 |

### 5.2 Mail 的正確角色

```
Mail Click
    │
    ▼
Intent Request (e.g., "I want to approve")
    │
    ▼
State Validation (Check current state, Check actor permission)
    │
    ├── Validation Failed → Reject Intent, No State Change
    │
    └── Validation Passed → Execute State Transition
                                    │
                                    ▼
                              State Changed
                                    │
                                    ▼
                              Audit Logged
```

### 5.3 Mail 行為約束

| Allowed | Forbidden |
|---------|-----------|
| ✅ 發送通知告知狀態變更 | ❌ 點擊直接改寫狀態 |
| ✅ 包含 Approve/Reject 意願連結 | ❌ 繞過 State Validation |
| ✅ 觸發 Intent Request | ❌ 成為狀態的唯一記錄 |

### 5.4 State Validation Requirements

任何來自 Mail 的 Intent 必須經過：

1. **Current State Check** - 確認當前狀態允許此轉移
2. **Actor Permission Check** - 確認操作者有權執行此轉移
3. **Idempotency Check** - 確認此 Intent 未被重複處理
4. **Audit Trail Creation** - 記錄此次轉移的完整資訊

---

## 6. Violation Clause

### 6.1 Defined Violations

| Violation ID | Description | Severity |
|--------------|-------------|----------|
| V-01 | 未 APPROVED 即 SENT | Critical |
| V-02 | STAFF 觸發 APPROVED | Critical |
| V-03 | 任何 bypass State Machine 的資料寫入 | Critical |
| V-04 | 狀態回退（Rollback） | Critical |
| V-05 | 跳階轉移（Skip State） | Critical |
| V-06 | 無 Audit Trail 的狀態變更 | High |

### 6.2 Violation Classification

> **違規 ≠ Bug**
> **違規 = Governance Breach**

| Category | Definition | Response |
|----------|------------|----------|
| Bug | 程式錯誤導致的非預期行為 | 修復程式碼 |
| Governance Breach | 違反本狀態模型的行為 | 調查 + 回溯 + 治理審查 |

### 6.3 Violation Examples

| Scenario | Why It's a Violation |
|----------|---------------------|
| 員工按下隱藏的「直接送出」按鈕 | V-01, V-02 |
| 工程師用 testApproveQuotation() 核准 | V-02, V-03 |
| 系統在 DRAFT 狀態直接執行 SENT | V-01, V-05 |
| Mail 點擊直接寫入 APPROVED 狀態 | V-03 |
| APPROVED 後修改報價內容再送出 | V-03 |

---

## 7. Non-Scope Declaration

### 7.1 本文件不定義

| Out of Scope | Reason |
|--------------|--------|
| UI 設計 | 屬於實作層，需另行規格 |
| API 設計 | 屬於實作層，需另行規格 |
| 資料庫 Schema | 屬於實作層，需另行規格 |
| 具體程式碼 | 屬於實作層，需另行規格 |
| 錯誤訊息文案 | 屬於實作層，需另行規格 |

### 7.2 Implementation Requirement

實作需另行依本文件產出工程規格，包含但不限於：

- API Endpoint 設計
- UI Component 設計
- Database State Storage
- Audit Trail Schema
- Error Handling

所有實作規格必須符合本狀態模型，不得偏離。

---

## 8. Changelog

| Version | Date | Description |
|---------|------|-------------|
| v1.0 | 2026-01-06 | Initial release - Authorization State Model |

---

## 9. Binding Statement

**Once EFFECTIVE, this state model is binding to all future implementations.**

---

**END OF AUTHORIZATION-STATE-MODEL.md**
