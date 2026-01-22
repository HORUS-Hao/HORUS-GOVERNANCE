# Phase D 決策止血門檻

**文件代號**：PHASE-D-DECISION-GATE
**建立日期**：2026-01-09
**裁定者**：Architect（待簽核）

---

## 文件目的

明確標示 Phase D 的工作範圍邊界，防止 Scope Creep。

---

## 決策分類圖例

| 符號 | 意義 |
|------|------|
| ❌ | 本階段明確不做 |
| ⏸ | 可接受但延後（需 Architect 裁定啟動時機） |
| ✅ | 若未來啟動，必須新 Phase、新 Branch、新版本 |

---

## ❌ 本階段明確不做

以下項目在 Phase D **明確禁止執行**：

| 項目 | 禁止原因 |
|------|----------|
| 修改 S005 Code.gs | AUTH-GOV-FULL-FIX 已封板 |
| 修改 V005 Code.gs | AUTH-GOV-FULL-FIX 已封板 |
| 修改任何 HTML 檔案 | 非本階段範圍 |
| 新增或修改 Sheet 結構 | 需獨立 Phase 評估 |
| 修改 `isInternalUser_()` | External Hard Gate 禁動 |
| 修改 `INTERNAL_DOMAINS` | External Hard Gate 禁動 |
| 讓 External 可審核 | 高風險，需 Architect 專案審核 |
| 實作角色權限矩陣 | 超出 Phase D 範圍 |
| 實作多層審核流程 | 超出 Phase D 範圍 |
| 實作金額門檻 | 超出 Phase D 範圍 |

---

## ⏸ 可接受但延後

以下項目具備一定價值，但本階段暫不執行：

| 項目 | 延後原因 | 啟動條件 |
|------|----------|----------|
| User_Company_Permission.role 生效 | 需評估影響範圍 | Architect 裁定 + 新 Phase |
| VIEWER / CREATOR / ISSUER 生效 | 需定義權限矩陣 | Architect 裁定 + 新 Phase |
| 公司專屬 APPROVER | 需確認業務需求 | 業務單位提出 + 新 Phase |
| External 查看範圍限制 | 需確認現有查詢邏輯 | Architect 裁定 + 新 Phase |
| 指定審核人 | 需 UI 配合 | 前端資源到位 + 新 Phase |
| 移除 seal_file_id | LEGACY 清理 | 確認無依賴後 + 新 Phase |
| 移除 User_Company_Permission.role | 若確定不實作 | Architect 裁定 + 新 Phase |

---

## ✅ 未來啟動必要條件

若決定啟動任何延後項目，**必須**滿足以下條件：

### 1. 新 Phase

| 要求 | 說明 |
|------|------|
| Phase 命名 | 例如 Phase E、Phase F |
| 獨立 DECISION 文件 | 需先產出 DECISION-PHASE-X-xxx.md |
| Architect 簽核 | 需 Architect 明確同意 |

### 2. 新 Branch

| 要求 | 說明 |
|------|------|
| Branch 命名規則 | `feature/phase-x-功能描述` |
| 從穩定點分支 | 必須從 AUTH-GOV-FULL-FIX 後的穩定點分支 |
| PR Review | 需 Architect Review |

### 3. 新版本

| 要求 | 說明 |
|------|------|
| 版本號規則 | 功能變更 = Minor 版本遞增 |
| CHANGELOG 更新 | 需記錄變更內容 |
| 測試驗證 | 需通過 TEST-USER-VALIDATION |

---

## External Hard Gate 保護聲明

**以下為系統安全邊界，任何變更需經過最高層級審核**：

| 保護項目 | 說明 |
|----------|------|
| `isInternalUser_()` | Domain Hard Code 判斷函數 |
| `INTERNAL_DOMAINS` | `['horus.tw', 'dapanda.com.tw']` |
| 403 EXTERNAL_FORBIDDEN | External 審核阻擋錯誤碼 |

**變更條件**：
1. 必須有明確業務需求文件
2. 必須經 Architect 專案審核
3. 必須有完整測試計畫
4. 必須有 Rollback 計畫

---

## 決策追蹤表

| 項目 | 決策 | 裁定者 | 日期 |
|------|------|--------|------|
| Phase D 範圍確認 | [待裁定] | Architect | [待填] |
| 是否啟動任何延後項目 | [待裁定] | Architect | [待填] |
| External Hard Gate 變更需求 | [待裁定] | Architect | [待填] |

---

## Architect 簽核欄

```
□ 我已閱讀並理解本文件內容
□ 我同意本階段禁止事項清單
□ 我確認延後項目需新 Phase 啟動

簽核：________________
日期：________________
```

---

*此文件為 Phase D 工作邊界的權威紀錄，任何逾越需經 Architect 書面同意。*
