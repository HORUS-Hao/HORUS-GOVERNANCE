# Decision: V005 External VIEWER Hard Gate

**Decision ID**: DECISION-V005-EXTERNAL-VIEWER-HARD-GATE
**Date**: 2026-01-09
**Status**: Approved
**Scope**: S005 / V005

---

## 1. 背景

S005/V005 報價單系統開放給 External 使用者（非 `horus.tw` / `dapanda.com.tw` 網域）建立報價單。External 使用者通過 OTP 驗證後可存取系統，但審核權限不應開放給 External。

原設計僅依賴 `USERS_ACCESS.role` 做權限控管，External 使用者不在此表中。需補上明確的 Hard Gate，確保即使繞過 UI 也無法執行審核動作。

---

## 2. 決策重點

### 2.1 External 使用者可以做什麼

- 登入系統（PIN + OTP 驗證）
- 建立報價單（需 OTP 驗證 + allowedCompanies 檢查）
- 查看自己建立的報價單
- 查看被授權公司的報價單

### 2.2 External 使用者「永遠不能做什麼」

| 禁止項目 | 說明 |
|----------|------|
| 核准報價單 | Hard Gate 阻擋 |
| 駁回報價單 | Hard Gate 阻擋 |
| 執行任何審核動作 | Hard Gate 阻擋 |
| 即使取得 APPROVER role | isInternal 為 Hard Gate，永遠拒絕 |

---

## 3. 裁定邊界

| 層級 | 角色 | 說明 |
|------|------|------|
| Server Gate | 最終裁定者 | `isInternalUser_()` 檢查，External 永遠返回 403 |
| Client UI | 輔助層 | 隱藏審核工具列，但不可作為安全邊界 |

**核心原則**：Server 為最終裁定者，Client UI 僅為輔助（不可作為安全邊界）。

---

## 3A. Runtime 實際行為（2026-01-09 Audit 補充）

本節記錄經 Code Audit 驗證的**實際 Runtime 行為**。

### 3A.1 Internal / External 判斷機制

| 項目 | 值 |
|------|-----|
| 判斷方式 | **Hard Code Domain**（不查任何資料表） |
| 判斷函數 | `isInternalUser_(email)` |
| Internal 網域 | `['horus.tw', 'dapanda.com.tw']` |
| External | 其他所有網域 |
| 程式碼位置 | S005:144-147, S005:2619-2630 |

```
判斷邏輯：
email.endsWith('@horus.tw') → Internal
email.endsWith('@dapanda.com.tw') → Internal
其他 → External
```

### 3A.2 審核操作攔截流程

```
審核操作（核准/駁回）
    │
    ├─ isInternalUser_(email) ← Hard Code Domain 判斷（不查表）
    │   └─ [External] → 403 EXTERNAL_FORBIDDEN（Hard Gate）
    │
    └─ [Internal]
        └─ USERS_ACCESS.role === 'APPROVER' → 允許
        └─ 其他角色 → 拒絕
```

### 3A.3 關鍵澄清

| 描述 | 原文件說明 | Runtime 實際 |
|------|-----------|--------------|
| External 判斷 | 暗示依賴表查詢 | **Hard Code Domain**，不查任何表 |
| 權限表依賴 | 「原設計僅依賴 USERS_ACCESS.role」 | External 判斷為 Hard Code，不進入 USERS_ACCESS 檢查 |

**結論**：External Hard Gate 為程式碼內建的 Domain 判斷，設計上即不可繞過，與 USERS_ACCESS 表無關。

---

## 4. 影響模組

| 模組 | 變更內容 |
|------|----------|
| S005 | `processSubmission()` 新增 External Creator Write Gate |
| V005 | `submitForApproval()` 新增 Server Gate |
| V005 | `V005_Viewer.html` 新增 UI Guard |

---

## 5. 相關文件

| 文件 | 路徑 |
|------|------|
| 工程變更紀錄 | `HORUS-GOVERNANCE/S005/CHANGELOG-PHASE4-EXTERNAL-VIEWER-HARD-GATE.md` |
| 驗證紀錄 | `HORUS-GOVERNANCE/TESTING/TEST-EXTERNAL-VIEWER-HARD-GATE-2026-01-09.md` |

---

## 6. v2.3 FREEZE 裁定補充（2026-01-11）

### 6.1 否定 APPROVER_WHITELIST 設計

系統最終**未採用 APPROVER_WHITELIST 設計**。
審核權限以 `FINAL_APPROVERS`（定義於 S005 Code.gs）為唯一權威來源。

| 設計階段提案 | v2.3 FREEZE 實際 |
|-------------|------------------|
| `APPROVER_WHITELIST` | 未採用 |
| 成員管理方式 | `FINAL_APPROVERS` 常數 |
| 唯一成員 | `hao.chang@horus.tw` |

如需新增 APPROVER，需直接修改 `FINAL_APPROVERS` 常數並重新部署。

---

*本決策由 Architect 裁定，2026-01-09 生效*
*v2.3 FREEZE 裁定補充，2026-01-11*