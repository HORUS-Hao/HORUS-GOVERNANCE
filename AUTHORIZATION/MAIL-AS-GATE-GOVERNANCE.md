# Mail-as-Gate Governance

> **Status**: EFFECTIVE
> **Version**: v1.0
> **Effective Date**: 2026-01-06
> **Authority Level**: Governance Binding
> **Scope**: Mail Gate Behavior Specification

---

## 1. Purpose

本文件定義 Mail 作為 Gate 的治理角色。

### 1.1 Mail 不是什麼

| Mail Is NOT | Explanation |
|-------------|-------------|
| 通道 (Channel) | Mail 不是資料傳輸管道 |
| 狀態 (State) | Mail 不代表也不改變狀態 |
| 權限 (Permission) | Mail 不授予系統權限 |
| 同步機制 | Mail 不是系統間資料同步 |

### 1.2 Mail 的唯一角色

**延遲釋放行為能力（Deferred Capability Release）**

Mail 的功能是：在狀態已經變更後，將「行為能力」通知給相關人員，使其得以執行後續動作。

```
State Changed (APPROVED)
        │
        ▼
  Mail Sent to STAFF
        │
        ▼
  STAFF Capability Unlocked
        │
        ▼
  STAFF Can Now Trigger SENT
```

---

## 2. Core Assumptions

### 2.1 Mandatory Assumptions

| ID | Assumption | Binding |
|----|------------|---------|
| A-01 | Mail 永遠不改變 State | Yes |
| A-02 | Mail 只在 State 已變更後發送 | Yes |
| A-03 | Mail 是人類通知，不是系統同步機制 | Yes |

### 2.2 Assumption Details

#### A-01: Mail 永遠不改變 State

- 收到 Mail ≠ 狀態變更
- 點擊 Mail 連結 ≠ 狀態變更
- Mail 內容 ≠ 狀態記錄

#### A-02: Mail 只在 State 已變更後發送

- Mail 發送的前提是 State Transition 已完成
- 不存在「發 Mail 來觸發狀態變更」的情況
- 發送順序：State Change → Audit Log → Mail

#### A-03: Mail 是人類通知，不是系統同步機制

- Mail 的接收者是人，不是系統
- 系統不應依賴 Mail 來判斷狀態
- 系統應直接讀取 State，而非解析 Mail

---

## 3. Mail Gate Definition

### 3.1 Mail 發送條件

Mail 僅在以下狀態轉移 **完成後** 發送：

| State Transition | Mail Triggered | Recipient |
|------------------|----------------|-----------|
| PENDING_APPROVAL → APPROVED | Yes | STAFF, ARCHITECT |
| PENDING_APPROVAL → REJECTED | Yes | STAFF, ARCHITECT |

**不觸發 Mail 的狀態轉移：**

| State Transition | Mail Triggered | Reason |
|------------------|----------------|--------|
| DRAFT → SUBMITTED_BY_STAFF | No | 內部流程，STAFF 自己觸發 |
| SUBMITTED_BY_STAFF → PENDING_APPROVAL | No | 系統自動，無需通知 |
| APPROVED → SENT | No | 執行動作，非決策通知 |

### 3.2 Mail 接收對象

> **Cross-Reference**: Recipient 詳細路由請以 `HORUS-GOVERNANCE/S005/S005_MAIL_ROUTING_GOVERNANCE.md`（SSOT）為準。

| Recipient | Role | Purpose |
|-----------|------|---------|
| STAFF | 行為解鎖通知 | 告知「你現在可以送出了」或「報價被駁回」 |
| ARCHITECT | 結果備查 | 保留決策記錄副本 |

### 3.3 Mail 內容語義

| Content Type | Included | Purpose |
|--------------|----------|---------|
| 結果告知 | ✅ Yes | 告知 APPROVED / REJECTED |
| Ref ID | ✅ Yes | 識別報價 |
| 時間戳記 | ✅ Yes | 決策時間 |
| 下一步說明 | ✅ Yes | 告知 STAFF 應做什麼 |
| 可執行指令 | ❌ No | Mail 不包含直接執行動作的連結 |
| 修改連結 | ❌ No | Mail 不提供修改報價的入口 |

---

## 4. Gate Behavior Model

### 4.1 Core Principle

> **Mail =「鑰匙交付通知」，不是鑰匙本身**

Mail 通知 STAFF「你現在有權做某事」，但：
- 鑰匙（權限）是由 State 授予的
- Mail 只是告知「鑰匙已準備好」
- 沒收到 Mail 不代表沒有權限（State 才是權威）

### 4.2 在 Mail 收到前

| Actor | Behavior Constraint |
|-------|---------------------|
| STAFF | 不得送出報價（不知道已被核准） |
| SYSTEM | 不得自動放行（需等待 STAFF 確認意願） |

**Rationale：**
- STAFF 在未收到通知前，不應假設狀態已變更
- SYSTEM 不主動替 STAFF 執行動作

### 4.3 在 Mail 收到後

| Actor | Capability |
|-------|------------|
| STAFF | 行為能力被解鎖，可觸發 APPROVED → SENT |
| State | 不再改變（APPROVED 維持不變） |

**Rationale：**
- Mail 解鎖的是「行為能力」，不是「狀態」
- State 在 ARCHITECT 決策時已經變更完成
- Mail 只是讓 STAFF 知道「你可以動了」

### 4.4 Gate Timeline

```
T0: ARCHITECT 點擊 APPROVE
    │
    ▼
T1: State = APPROVED (已變更)
    Audit Log Created
    │
    ▼
T2: Mail 發送給 STAFF
    │
    ▼
T3: STAFF 收到 Mail
    │
    ▼
T4: STAFF 確認送出意願
    │
    ▼
T5: State = SENT (由 SYSTEM 執行)
```

**關鍵時間點說明：**

| Time | Event | State |
|------|-------|-------|
| T1 | State 已變更 | APPROVED |
| T2 | Mail 已發送 | APPROVED (unchanged) |
| T3 | STAFF 收到 Mail | APPROVED (unchanged) |
| T5 | STAFF 觸發送出 | SENT |

---

## 5. Failure Handling Semantics

### 5.1 Core Declarations

| Declaration | Statement |
|-------------|-----------|
| Mail 發送失敗 ≠ 授權失敗 | 狀態已經是 APPROVED，Mail 失敗不影響 |
| Mail 重送 ≠ 狀態重設 | 重送 Mail 不會讓狀態回到 PENDING |
| 人工轉述 Mail ≠ 合法 Gate | 口頭告知不構成正式 Gate 通過 |

### 5.2 Failure Scenarios

| Scenario | State Impact | Required Action |
|----------|--------------|-----------------|
| Mail 發送失敗 | None | 重新發送或提供查詢介面 |
| Mail 延遲送達 | None | STAFF 可透過系統查詢狀態 |
| Mail 被誤刪 | None | 重新發送或提供查詢介面 |
| Mail 進垃圾郵件 | None | STAFF 可透過系統查詢狀態 |

### 5.3 Failure Recovery

```
Mail Failed
    │
    ├── Option A: Retry Mail Delivery
    │
    ├── Option B: STAFF 透過系統查詢狀態
    │
    └── Option C: ARCHITECT 手動通知（記錄於 Audit）

⚠️ 以上皆不改變 State
```

### 5.4 人工轉述的限制

| Method | Validity |
|--------|----------|
| ARCHITECT 口頭告知 STAFF | ❌ 不構成合法 Gate |
| ARCHITECT 用私人訊息告知 | ❌ 不構成合法 Gate |
| 系統重新發送正式 Mail | ✅ 合法 Gate |
| STAFF 透過系統查詢狀態 | ✅ 合法（系統為權威） |

---

## 6. Explicit Prohibitions

### 6.1 Prohibition List

| ID | Prohibition | Reason |
|----|-------------|--------|
| P-01 | ❌ 不可用 UI 取代 Mail Gate | UI 是查詢工具，不是 Gate |
| P-02 | ❌ 不可用 API 查詢取代 Mail Gate | API 是技術介面，不是 Gate |
| P-03 | ❌ 不可因「方便」讓 STAFF 繞過 Gate | Gate 是治理機制，非效率工具 |
| P-04 | ❌ 不可讓 STAFF 主動輪詢狀態來繞過 | 應等待正式通知 |
| P-05 | ❌ 不可將 Mail 內容當作狀態證明 | State 才是權威，非 Mail |

### 6.2 Prohibition Rationale

| Prohibition | Rationale |
|-------------|-----------|
| P-01 | UI 顯示的是「當前狀態」，不是「Gate 通過」 |
| P-02 | API 返回的是「資料」，不是「授權通知」 |
| P-03 | Gate 存在是為了確保 STAFF 明確知悉決策結果 |
| P-04 | 輪詢行為繞過了「正式通知」的治理意義 |
| P-05 | Mail 內容可能被竄改、過期、或誤解 |

### 6.3 Exception Handling

唯一允許的例外：

| Scenario | Allowed Action | Condition |
|----------|----------------|-----------|
| Mail 持續失敗 | STAFF 透過系統查詢狀態 | 必須記錄於 Audit |
| 緊急情況 | ARCHITECT 授權替代通知方式 | 必須記錄於 Audit |

---

## 7. Non-Scope Declaration

### 7.1 本文件明確不定義

| Out of Scope | Reason |
|--------------|--------|
| Mail Template | 屬於實作層 |
| 寄送技術 (SMTP, API) | 屬於技術實作 |
| 重送機制實作 | 屬於技術實作 |
| 收件人 Email 地址 | 屬於設定層 |
| Mail 格式 (HTML, Plain Text) | 屬於實作層 |

### 7.2 Implementation Guidance

實作團隊需另行定義：

- Mail Template 設計
- 發送失敗重試機制
- 發送記錄與追蹤
- 收件人管理

所有實作必須符合本文件的治理邊界。

---

## 8. Changelog

| Version | Date | Description |
|---------|------|-------------|
| v1.0 | 2026-01-06 | Initial release - Mail-as-Gate Governance |

---

## 9. Governance Statement

**Mail-as-Gate is a governance construct, not a delivery mechanism.**

Mail Gate 存在的目的是：
- 確保 STAFF 明確知悉授權決策
- 在「決策」與「執行」之間建立通知斷點
- 提供可追溯的通知記錄

它不是：
- 資料傳輸管道
- 狀態同步機制
- 即時通訊工具

---

**END OF MAIL-AS-GATE-GOVERNANCE.md**
