# S005 Governance Index

**模組**: S005 (Submission Entry)
**建立日期**: 2026-01-13
**文件性質**: 索引（Index）

---

## SSOT 文件（單一權威來源）

| 主題 | 文件 | 狀態 |
|------|------|------|
| **Mail Routing** | [S005_MAIL_ROUTING_GOVERNANCE.md](./S005_MAIL_ROUTING_GOVERNANCE.md) | **SSOT / FROZEN** |

> **S005 / V005 Mail Routing**
> **Status**: FROZEN (2026-01-13)
> **SSOT**: S005_MAIL_ROUTING_GOVERNANCE.md
> **No runtime or routing change allowed without SSOT update.**

> **If conflicts, SSOT wins.**
>
> 任何其他文件與 SSOT 衝突時，以 SSOT 為準。

---

## Core Governance 文件

| 文件 | 說明 | 狀態 |
|------|------|------|
| [S005-AUTHORITY-MCD.md](./S005-AUTHORITY-MCD.md) | Authority 最小完成定義 | Active |
| [S005_EXTERNAL_FLOW_DECLARATION.md](./S005_EXTERNAL_FLOW_DECLARATION.md) | External 使用者流程聲明 | Active |
| [S005-CODEGS-MODULE-BOUNDARY-INVENTORY.md](./S005-CODEGS-MODULE-BOUNDARY-INVENTORY.md) | Code.gs 模組邊界盤點 | Active |
| [S005-GOVERNANCE-ALIGNMENT-AUDIT.md](./S005-GOVERNANCE-ALIGNMENT-AUDIT.md) | 治理對齊稽核 | Active |

---

## Supporting 文件

| 文件 | 說明 | 狀態 |
|------|------|------|
| [PIN-AUTO-VERIFICATION-MVD.md](./PIN-AUTO-VERIFICATION-MVD.md) | PIN 自動驗證最小可行定義 | Supporting |
| [PIN-AUTO-SECURITY-IMPACT.md](./PIN-AUTO-SECURITY-IMPACT.md) | PIN 自動驗證安全影響 | Supporting |
| [PIN-AUTO-ANTI-SCOPE.md](./PIN-AUTO-ANTI-SCOPE.md) | PIN 自動驗證反範圍 | Supporting |
| [CHANGELOG-PHASE4-EXTERNAL-VIEWER-HARD-GATE.md](./CHANGELOG-PHASE4-EXTERNAL-VIEWER-HARD-GATE.md) | Phase 4 變更記錄 | Supporting |

---

## OPERATIONS（操作文件）

| 文件 | 說明 | 狀態 |
|------|------|------|
| [S005_V005_MAIL_PREREQUISITES.md](./OPERATIONS/S005_V005_MAIL_PREREQUISITES.md) | Mail 前置條件 | **Deprecated** (Recipient 規則已移至 SSOT) |
| [S005_V005_COMMON_ERRORS_GUIDE.md](./OPERATIONS/S005_V005_COMMON_ERRORS_GUIDE.md) | 常見錯誤指南 | Active |
| [S005_V005_SYSADMIN_QUICK_CHECKLIST.md](./OPERATIONS/S005_V005_SYSADMIN_QUICK_CHECKLIST.md) | 系統管理者快速檢查表 | Active |
| [S005_V005_REQUIRED_SHEETS_SHARING_LIST.md](./OPERATIONS/S005_V005_REQUIRED_SHEETS_SHARING_LIST.md) | 必要工作表共享清單 | Active |

---

## 衝突解決原則

1. **SSOT 優先**：任何文件與 SSOT 衝突，以 SSOT 為準
2. **Deprecated 文件不得定義規則**：已 Deprecated 的文件僅供參考，不得作為規則來源
3. **變更需 ADR**：任何 SSOT 修改需經過 ADR 流程

---

*本文件由 Claude Code 產出*
*建立日期：2026-01-13*
