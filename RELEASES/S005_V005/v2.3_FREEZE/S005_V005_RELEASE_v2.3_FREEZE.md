# S005 / V005 v2.3 FREEZE 封版規格

**文件狀態**: 權威 (Authoritative)
**生效日期**: 2026-01-11
**裁定者**: Architect
**最後更新**: 2026-01-12

---

## 1. v2.3 定義

### 1.1 v2.3 是什麼

| 項目 | 說明 |
|------|------|
| **定義** | 系統狀態 / 功能 / 治理封版 |
| **性質** | HORUS Quotation System 的功能與治理基準點 |
| **用途** | 標記一組已驗證、可交付的系統行為 |

### 1.2 v2.3 不是什麼

| 項目 | 說明 |
|------|------|
| **非** Code.gs semantic version | Code.gs 可維持 `@version 1.7.9` 或 `v2.1.x` |
| **非** Deployment ID | Deployment ID 為 GAS 自動產生，不受此版本控制 |
| **非** DEPLOY_VERSION 常數 | 程式碼內的版本標示可與此不同 |

### 1.3 核心裁定

**Code base 允許為 v2.1.x 系列**，只要功能行為符合 v2.3 FREEZE 規格即可。

版本號的對應關係：

| 層級 | 版本標示 | 說明 |
|------|----------|------|
| 治理封版 | v2.3 FREEZE | 本文件定義 |
| Code.gs @version | 1.7.9 | 程式碼內部標示 |
| DEPLOY_VERSION 常數 | v2.1.2-otp-race-fix | Runtime 顯示用 |
| GAS Deployment | @xxx | GAS 自動遞增 |

---

## 2. v2.3 FREEZE 功能規格

### 2.1 核心功能

| 功能 | 狀態 | 說明 |
|------|------|------|
| PIN + OTP 登入 | ✅ 已實作 | 雙因子驗證 |
| Device Session | ✅ 已實作 | 裝置信任機制 |
| 報價單建立 | ✅ 已實作 | Internal / External 皆可 |
| 報價單審核 | ✅ 已實作 | 僅 FINAL_APPROVERS |
| External Hard Gate | ✅ 已實作 | External 永遠無法審核 |

### 2.2 權限模型

| 項目 | v2.3 FREEZE 狀態 |
|------|------------------|
| FINAL_APPROVERS | Hard Code 於 Code.gs |
| APPROVER 角色 | 唯一生效的角色 |
| VIEWER/CREATOR/ISSUER | 設計存在，未生效 |
| External 審核 | Hard Gate 阻擋 |

### 2.3 未實作項目

| 項目 | 狀態 | 說明 |
|------|------|------|
| SECURITY_AUDIT_LOG | 未啟用 | 後續安全強化 |
| logSecurityAudit() | 未實作 | 後續安全強化 |
| assertApprovalPermission_() | 未實作 | 後續安全強化 |
| APPROVER_WHITELIST | 未採用 | 以 FINAL_APPROVERS 取代 |

---

## 3. 實際使用中的 Deployment URL（僅參考）

> **聲明**：以下 URL 為 2026-01-12 查詢時的實際使用狀態，僅供參考。
> Deployment ID 可能因後續維護而變更，不影響 v2.3 FREEZE 規格本身。

### 3.1 S005 - Submission Entry

```
https://script.google.com/macros/s/AKfycbw5jcVxtgA7Uklolec0HwY-H8LCid35RR0dYdtonhip2k3GCRB0AOGWdEmfbESNBqnk/exec
```

### 3.2 V005 - Quotation Viewer

```
https://script.google.com/macros/s/AKfycbwFZ_TvI3sUx_iG8pYr2WaGjuQdFCcQgNzLXLJohehgNPIsWyCOHC3iDchcs8gNrInU/exec
```

---

## 4. 文件權威性聲明

### 4.1 衝突解決規則

**若 GOVERNANCE 文件與 Code / Deployment 衝突，以本文件為準。**

| 衝突情境 | 解決方式 |
|----------|----------|
| DEPLOYMENT-REGISTRY 版本與實際不符 | 以本文件第 3 節為參考 |
| CHANGELOG 版本與 Code.gs 不符 | v2.3 為治理版本，非 code 版本 |
| Code.gs DEPLOY_VERSION 不是 v2.3 | 允許，不構成衝突 |

### 4.2 引用規則

所有涉及 S005/V005 版本的 GOVERNANCE 文件，應引用本文件而非各自宣稱版本：

```
版本資訊請參閱：
HORUS-GOVERNANCE/RELEASES/S005_V005/v2.3_FREEZE/S005_V005_RELEASE_v2.3_FREEZE.md
```

### 4.3 本文件的更新規則

| 情境 | 動作 |
|------|------|
| Deployment URL 變更 | 更新第 3 節（僅參考） |
| 功能規格變更 | 需 Architect 裁定，升級版本號 |
| 治理規則變更 | 需 Architect 裁定 |

---

## 5. 相關文件

| 文件 | 路徑 | 關係 |
|------|------|------|
| 管理者操作手冊 | `v2.3_FREEZE/HANDOFF/S005_V005_ADMIN_HANDOFF_v2.3.md` | 交付素材 |
| External Hard Gate 決策 | `DECISIONS/DECISION-V005-EXTERNAL-VIEWER-HARD-GATE.md` | 引用本文件 |
| Phase 4 變更紀錄 | `S005/CHANGELOG-PHASE4-EXTERNAL-VIEWER-HARD-GATE.md` | 引用本文件 |
| Deployment Registry | `V005/INVENTORY/DEPLOYMENT-REGISTRY.md` | 引用本文件 |

---

*本文件為 S005/V005 v2.3 FREEZE 唯一權威來源*
*建立日期：2026-01-12*
*裁定者：Architect*
