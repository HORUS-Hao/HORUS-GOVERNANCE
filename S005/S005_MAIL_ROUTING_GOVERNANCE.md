# S005 Mail Routing Governance

> **SSOT**: TRUE
> **Scope**: S005 + V005 Mail Routing
> **Effective from**: commit `5f4da62`
> **Prohibitions**: 禁止任何其他文件定義收件人規則（除非引用本文件）
> **Change Control**: 任何修改需 ADR（參考 HORUS-GOVERNANCE/DECISIONS/）

---

**文件版本**: v1.1
**建立日期**: 2026-01-13
**升級為 SSOT**: 2026-01-13
**文件性質**: 治理聲明（Authoritative / SSOT）
**適用模組**: S005 (Submission Entry) + V005 (Quotation Viewer)

---

## 收件規則矩陣（最終版本）

| Mail Type | Recipients | 規則 |
|-----------|------------|------|
| **APPROVAL_REQUEST**（請審核信） | `supervisor_emails` ONLY | Creator/submitter **不可**在收件人 |
| **APPROVAL_RESULT**（核准/退回結果信） | Creator + `supervisor_emails` | 兩者都要收到（去重複） |

---

## 一、Mail 類型定義

### 1.1 APPROVAL_REQUEST（請審核）

| 項目 | 定義 |
|------|------|
| 觸發時機 | 報價單建立後（External 使用者）或 submitForApproval 呼叫後 |
| 語義 | 通知審核人員「有報價單需要審核」 |
| 狀態影響 | 無（Mail 不改變狀態） |

### 1.2 APPROVAL_RESULT（核准/退回結果）

| 項目 | 定義 |
|------|------|
| 觸發時機 | 審核人員點擊「核准」或「退回」後 |
| 語義 | 通知相關人員審核結果 |
| 狀態影響 | 無（狀態在 Mail 發送前已變更） |

---

## 二、Recipient 規則（不可模糊）

### 2.1 APPROVAL_REQUEST 收件人

| 類別 | 收件人 | 規則 |
|------|--------|------|
| **一定收** | `supervisor_emails` | Company_Profile 中設定的監管人 |
| **一定不收** | Creator（送審人） | 建立者不是審核人，不應收到「請審核」信 |
| **一定不收** | submitterEmail | 即使是 Internal 使用者也不收 |

**治理禁止行為**：

| 禁止行為 | 原因 |
|----------|------|
| Creator 收到 APPROVAL_REQUEST | Creator ≠ Approver |
| External 使用者收到 APPROVAL_REQUEST | External ≠ Approver |
| 無 supervisor_emails 時寄給 Creator | 若無監管人，不發 Mail（設計行為） |

### 2.2 APPROVAL_RESULT 收件人

| 類別 | 收件人 | 規則 |
|------|--------|------|
| **一定收** | Creator（送審人） | 必須知道審核結果 |
| **一定收** | `supervisor_emails` | 監管人備查 |
| **一定收** | Internal / External 一律收到 | 無區分 |

**收件人組合公式**：

```
APPROVAL_RESULT recipients = Creator + supervisor_emails（去重複）
```

---

## 三、UI Gate vs Mail Gate 分離原則

### 3.1 核心聲明

> **V005 UI Gate ≠ Mail Recipient Gate**

| 維度 | UI Gate | Mail Recipient Gate |
|------|---------|---------------------|
| 目的 | 控制「誰能看到核准/退回按鈕」 | 控制「誰會收到 Mail」 |
| 檢查條件 | USER_EMAIL ∈ supervisor_emails | supervisor_emails + Creator（依類型） |
| 實作位置 | V005_Viewer.html | S005 Code.gs |
| 責任 | 防止未授權操作入口 | 確保通知送達正確對象 |

### 3.2 分離理由

| 理由 | 說明 |
|------|------|
| 職責單一 | UI 管 UI，Mail 管 Mail |
| 授權分離 | 看得到按鈕 ≠ 應該收到通知 |
| 可追溯性 | 各自有獨立的治理依據 |

### 3.3 常見誤解

| 誤解 | 事實 |
|------|------|
| 能核准的人應該收到所有 Mail | 不對。Creator 應收 RESULT，不收 REQUEST |
| 收到 Mail 的人可以核准 | 不對。Mail 是通知，不是授權 |
| UI 按鈕可見 = Mail 收件人 | 不對。兩者規則不同 |

---

## 四、未來修改限制

### 4.1 修改流程（強制）

任何 Mail Routing 行為修改，必須同時完成以下三項：

| 步驟 | 項目 | 位置 |
|------|------|------|
| 1 | 修改程式碼 | S005 Code.gs |
| 2 | 更新本文件 | S005_MAIL_ROUTING_GOVERNANCE.md |
| 3 | git commit（同步） | 同一 commit 或相鄰 commit |

### 4.2 禁止行為

| 禁止行為 | 原因 |
|----------|------|
| 只改 Code 不改文件 | 導致文件與實作不同步 |
| 只改文件不改 Code | 治理聲明無實作支撐 |
| 不經審查直接改 | 需 Architect 確認 |

### 4.3 變更記錄要求

每次修改必須在本文件「變更記錄」章節新增一行：

| 日期 | 變更內容 | Commit Hash | 變更者 |
|------|----------|-------------|--------|

---

## 五、程式碼對照

### 5.1 關鍵函數位置

| 函數 | 檔案 | 行號（約） | 功能 |
|------|------|-----------|------|
| `sendApprovalRequestMail_` | Code.gs | 4027 | 發送「請審核」Mail |
| `sendApprovalResultMail_` | Code.gs | 4265 | 發送「核准/退回結果」Mail |

### 5.2 收件人邏輯摘要

**sendApprovalRequestMail_**:
```
recipients = supervisor_emails.slice();
// Creator 不加入（GOVERNANCE）
```

**sendApprovalResultMail_**:
```
recipients = [];
recipients.push(creatorEmail);       // Creator 必收
recipients.push(...supervisorEmails); // Supervisor 必收
```

---

## 六、相關文件

| 文件 | 路徑 | 說明 |
|------|------|------|
| Mail-as-Gate Governance | `HORUS-GOVERNANCE/AUTHORIZATION/MAIL-AS-GATE-GOVERNANCE.md` | Mail Gate 定義 |
| Mail Prerequisites | `HORUS-GOVERNANCE/S005/OPERATIONS/S005_V005_MAIL_PREREQUISITES.md` | Mail 前置條件 |
| External Flow Declaration | `HORUS-GOVERNANCE/S005/S005_EXTERNAL_FLOW_DECLARATION.md` | External 使用者流程 |
| External Submit Gate | `HORUS-GOVERNANCE/DECISIONS/DECISION-S005-EXTERNAL-SUBMIT-GATE.md` | External 提交規則 |

---

## 七、變更記錄

| 日期 | 變更內容 | Commit Hash | 變更者 |
|------|----------|-------------|--------|
| 2026-01-13 | 初版建立 | 5f4da62 | Claude Code |

---

## 八、聲明

> **本文件為 S005 Mail Routing 的唯一權威來源。**
>
> Mail 收件人規則以本文件為準。
> 程式碼實作必須符合本文件定義。
> 任何偏差視為治理違規，需立即修正。

---

## 🔒 Status (Finalized)

As of 2026-01-13, S005 / V005 mail routing logic has been fully implemented,
verified in production, and upgraded to HTML format.

This module is considered **FINALIZED**.

Any future change:
- MUST go through ADR
- MUST receive explicit Architect approval
- MUST NOT be modified directly in code without governance update

---

*本文件由 Claude Code 依據 Architect 裁定產出*
*建立日期：2026-01-13*
*封板日期：2026-01-13*
