# S005 / V005 Mail 發送前置條件說明

> ⚠️ **DEPRECATED**
>
> **原因**: Recipient 規則已由 SSOT 接管，本文不得再定義收件人規則
> **SSOT Link**: [S005_MAIL_ROUTING_GOVERNANCE.md](../S005_MAIL_ROUTING_GOVERNANCE.md)
> **Effective**: 2026-01-13
> **Owner**: Architect
>
> 本文件僅保留「前置條件」說明（supervisor_emails 設定方式），
> **收件人規則請參閱 SSOT**。

---

**文件版本**: v1.1 (Deprecated)
**適用版本**: S005 / V005 v2.3 FREEZE
**建立日期**: 2026-01-12
**Deprecated**: 2026-01-13
**文件性質**: 系統管理者參考（Supporting Document）

---

## 一、文件目的

本文件說明 S005 / V005 系統郵件發送的必要前置條件。
系統管理者應在啟用外部使用者前，確認所有前置條件已滿足。

---

## 二、Mail 發送的必要前置條件

### 2.1 核心規則

**系統發送郵件的唯一條件：至少存在一筆有效收件人。**

若收件人清單為空，系統將不發送任何郵件。

### 2.2 收件人來源

> ⚠️ **Recipient rules: see SSOT ([S005_MAIL_ROUTING_GOVERNANCE.md](../S005_MAIL_ROUTING_GOVERNANCE.md))**

系統主要從以下來源取得收件人：

| 來源 | 欄位位置 | 說明 |
|------|----------|------|
| 監管人 Email | `Company_Profile.supervisor_emails` | 該公司的監管人（可多人） |

### 2.3 收件人組合邏輯

> ⚠️ **此段落已 Deprecated。收件人規則請參閱 SSOT。**
>
> **SSOT 定義**：
> - APPROVAL_REQUEST: `supervisor_emails` ONLY
> - APPROVAL_RESULT: Creator + `supervisor_emails`
>
> 詳見：[S005_MAIL_ROUTING_GOVERNANCE.md](../S005_MAIL_ROUTING_GOVERNANCE.md)

---

## 三、未設定 supervisor_emails 的後果

### 3.1 明確聲明

**若未設定 `Company_Profile.supervisor_emails`，且提交者 Email 無法取得，系統將不會寄送任何審核／通知郵件。**

此為系統設計結果，非系統錯誤。

### 3.2 影響範圍

| 郵件類型 | 是否受影響 |
|----------|------------|
| 報價單建立通知 | 是 |
| 審核請求通知 | 是 |
| 核准結果通知 | 是 |
| 退回結果通知 | 是 |

### 3.3 系統行為

當收件人清單為空時：
- 系統不會發送郵件
- 系統不會顯示錯誤訊息
- 系統不會記錄失敗
- 系統不會補寄
- 系統不會提醒管理者

**這是設計行為，不是錯誤。**

---

## 四、管理者行動指引

### 4.1 啟用前必做事項

在啟用外部使用者或開放報價單功能前，請確認：

| 檢查項目 | 操作位置 | 必須狀態 |
|----------|----------|----------|
| supervisor_emails 已填寫 | Company_Profile 工作表 | 至少一個有效 Email |

### 4.2 設定建議

**建議管理者於啟用流程前完成 `supervisor_emails` 設定，以確保後續通知可正常送達。**

若未設定：
- 外部使用者提交報價單後，管理者不會收到通知
- 審核完成後，提交者可能不會收到結果通知
- 上述情況為可預期結果，非系統故障

### 4.3 設定方式

1. 開啟 S005/V005 共用資料庫
2. 切換到 `Company_Profile` 工作表
3. 在對應公司的 `supervisor_emails` 欄位填入 Email
4. 多個 Email 以逗號分隔（例：`admin@example.com,manager@example.com`）

---

## 五、資料契約聲明（v2.3 FREEZE）

**S005 Mail Gate 依 `company_code` 對應 `Company_Profile`。**

| 項目 | 說明 |
|------|------|
| 查詢鍵 | `company_code`（唯一） |
| 若使用 `company_name` | 將導致查無對應記錄 → 無收件人 → 不寄信 |
| 性質 | **設計行為，非系統錯誤** |

---

## 六、常見誤解澄清

| 誤解 | 事實 |
|------|------|
| 沒收到信是 Gmail 問題 | 不是。是收件人清單為空。 |
| 沒收到信是 OAuth 問題 | 不是。是設定問題。 |
| 沒收到信需要工程修復 | 不需要。補齊設定即可。 |
| 系統應該要提醒我設定 | 系統不提供此功能（v2.3 限制）。 |
| 用公司名稱可以查到 | **不行**。必須用 `company_code`。 |

---

## 七、相關文件

| 文件 | 路徑 |
|------|------|
| Company_Profile 管理指南 | `HORUS-GOVERNANCE/GLOBAL/COMPANY_PROFILE_ADMIN_GUIDE.md` |
| 常見問題判斷指南 | `HORUS-GOVERNANCE/S005/OPERATIONS/S005_V005_COMMON_ERRORS_GUIDE.md` |
| Mail-as-Gate 治理 | `HORUS-GOVERNANCE/AUTHORIZATION/MAIL-AS-GATE-GOVERNANCE.md` |
| **Mail Routing SSOT** | `HORUS-GOVERNANCE/S005/S005_MAIL_ROUTING_GOVERNANCE.md` |

---

> **Scope Declaration**: 本文件僅定義「前置條件」（supervisor_emails 設定方式），
> **不定義收件人規則**。收件人規則請參閱 SSOT。

---

**文件結束**

*本文件由 Claude Code 依據 v2.3 FREEZE 治理規範產出*
*建立日期：2026-01-12*
